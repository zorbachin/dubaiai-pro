# Integrating the Comb Engine into podsupps2

The engine is built to podsupps2's existing contracts, so wiring it in is mostly
copying files and adding two thin entrypoints (a cron and an admin button).
Nothing about the frontend or schema needs to change — the schema already has
the fields this writes (`episodes.isProcessed`, `mentions`, `promo_codes`,
`products.crossPodcastCount`).

## 1. Copy the engine in

```bash
# from the podsupps2 repo root
cp -r path/to/pipeline/src server/pipeline
```

Add the one dependency it needs (zod is already in podsupps2):

```jsonc
// nothing new — podsupps2 already has zod ^4 and tsx.
```

## 2. Activate the production adapter

`server/pipeline/adapters/podsupps.ts` already implements all four boundary
interfaces against podsupps2's real services. After copying, fix the relative
import paths at the top of that file so they resolve from
`server/pipeline/adapters/`:

```ts
import { invokeLLM } from "../../_core/llm";
import { transcribeAudio } from "../../_core/voiceTranscription";
import { db } from "../../db";
import { podcasts, products, episodes, mentions, promoCodes } from "../../../drizzle/schema";
```

Then remove the `// @ts-nocheck` line and run `pnpm check`. The adapter is the
**only** file that touches app internals; everything else is pure.

> Note: the adapter maps `episode guid` onto the existing `episodes.youtubeUrl`
> / `audioUrl` columns for dedup. If you want exact-guid dedup, add a
> `guid varchar(255)` column to `episodes` and a unique index on
> `(podcastId, guid)`, then store `candidate.guid` and read it back in
> `getProcessedEpisodeGuids`. One migration, no frontend impact.

## 3. Add the tRPC admin trigger

In `server/routers.ts`, add an admin-only procedure so you can run ingestion
from the existing `/admin` page:

```ts
import { buildProductionDeps } from "./pipeline/adapters/podsupps";
import { pollAll, pollPodcast } from "./pipeline/orchestrator";

export const pipelineRouter = router({
  pollAll: adminProcedure
    .input(z.object({ maxEpisodesPerPodcast: z.number().default(5) }))
    .mutation(async ({ input }) => {
      const deps = buildProductionDeps();
      const results = await pollAll(deps, input);
      return results;
    }),

  ingestPodcast: adminProcedure
    .input(z.object({ podcastId: z.string() }))
    .mutation(async ({ input }) => {
      const deps = buildProductionDeps();
      const podcast = await deps.db.getPodcast(input.podcastId);
      if (!podcast) throw new Error("unknown podcast");
      return pollPodcast(podcast, deps, { maxEpisodes: 10 });
    }),
});
```

Wire `pipelineRouter` into the app router, then add a "Run ingestion" button to
`AdminPage.tsx` calling `trpc.pipeline.pollAll.useMutation()`.

## 4. Schedule the daily poll

Any scheduler works. Two easy options:

**a) GitHub Actions cron** (no infra):

```yaml
# .github/workflows/ingest.yml
name: comb-engine
on:
  schedule: [{ cron: "0 9 * * *" }]   # 09:00 UTC daily
  workflow_dispatch:
jobs:
  poll:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm tsx server/pipeline/cli.ts poll-all
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          BUILT_IN_FORGE_API_KEY: ${{ secrets.FORGE_API_KEY }}
          BUILT_IN_FORGE_API_URL: ${{ secrets.FORGE_API_URL }}
          PIPELINE_DEPS_MODULE: ./server/pipeline/adapters/podsupps.js
```

**b) A long-running worker** — call `pollAll(buildProductionDeps())` on a
`setInterval`, or trigger via your host's scheduler (Vercel Cron, Railway, etc.).

## 5. Backfill feeds (one-time)

The engine needs a feed URL per podcast. Most podsupps2 podcasts already have
`youtubeUrl`; for channels stored as `@handle` URLs, resolve them to `UC…`
channel ids once (YouTube Data API `channels?forHandle=`) and store, or set
`rssUrl`. `channelFeedUrl()` handles the `UC…` and `/channel/UC…` forms directly.

## 6. Show expansion (optional, the second half of the brief)

Feed `rankShows()` candidates from a charts source or the existing
`podcast_suggestions` table, and surface the ranked proposals in `/admin` for
one-click onboarding (insert the podcast row, then `ingestPodcast`).

```ts
import { rankShows } from "./pipeline/discover/expand";
const proposals = rankShows(candidates, await deps.db.listActivePodcasts(), {
  existingCategories,
  limit: 20,
});
```

## Cost & rate notes

- YouTube captions are free; Whisper has a 16 MB upload limit in
  `transcribeAudio`, so audio-only episodes longer than ~30–40 min need chunking
  (split the audio, transcribe parts, concatenate segments with offset). The
  YouTube-captions path avoids this entirely and covers most top shows.
- `gemini-2.5-flash` (podsupps2's configured model) handles long transcripts
  cheaply; cap context by trimming the marked transcript if a single episode is
  enormous.
- Run `poll-all` with a small `maxEpisodesPerPodcast` on the first cron so the
  backfill is gradual and observable.

## What's deliberately left as a hook

- **Image/price enrichment** for newly-minted products (podsupps2 already has
  `imageGeneration.ts` and price-seed scripts — call them on `plan.newProducts`).
- **Affiliate link assignment** — map new brands to your Impact/Amazon programs
  in `commit` or a follow-up job (the "affiliate wings" from the brief).
- **Exact-guid dedup column** — see the note in step 2.
