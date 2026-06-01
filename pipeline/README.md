# PodSupps Comb Engine

The autonomous ingestion pipeline that turns PodSupps from a hand-seeded
snapshot into a **living catalog that updates itself**.

> _Original brief:_ "the goal for the agents running the back end of the site is
> to constantly keep it up-to-date based on new episodes as well as expand the
> database to new popular shows."

The podsupps2 frontend (storefront, player, marketplace, SEO, PWA) is ~90% done,
but every product in it was added by a one-off seed script reading from research
files that no longer exist. There is no repeatable way to add a new episode or
show. **This engine is that missing core** — and it's the moat the venture
blueprint itself names ("the proprietary AI pipeline that extracts anecdotal
mentions at scale").

## The loop

```
                         ┌──────────────────────────────────────────┐
  daily cron / admin ──▶ │  poll feed (RSS or YouTube Atom)           │
                         │     │                                      │
                         │     ▼  diff against episodes.isProcessed   │
                         │  new episodes                              │
                         │     │                                      │
                         │     ▼  transcribe (YT captions → Whisper)  │
                         │  transcript + [mm:ss] markers              │
                         │     │                                      │
                         │     ▼  extract (LLM, JSON schema)          │
                         │  ExtractedMention[]  (sponsor/personal/    │
                         │     │                 guest, quote, code,  │
                         │     │                 timestamp, confidence)│
                         │     ▼  resolve (dedup vs catalog + aliases)│
                         │  matched | new product                     │
                         │     │                                      │
                         │     ▼  plan → commit (txn)                 │
                         │  products · mentions · promo_codes ·       │
                         │  crossPodcastCount · episode.isProcessed=1 │
                         └──────────────────────────────────────────┘
```

Every stage is a pure function behind an injectable interface, so the whole
thing is unit-tested offline with zero secrets. Run `npm run demo` to watch one
episode go end-to-end against in-memory fakes.

## Why this design

- **Captures anecdotal mentions, not just ads.** The extraction prompt explicitly
  separates `sponsor` / `personal` / `guest` — the organic "I use this nightly"
  mentions are the differentiator generic affiliate blogs miss.
- **One product, many shows.** Entity resolution (alias map + Dice-coefficient
  fuzzy match) collapses "AG1" / "Athletic Greens" into a single record so
  `crossPodcastCount` ("mentioned on 8 podcasts") is real. This powers the
  cross-show intelligence and the most shareable, SEO-friendly pages.
- **Timestamps survive.** `[mm:ss]` markers in the transcript let the LLM cite a
  second offset per mention → feeds podsupps2's existing player deep-links
  (`?watch=…&t=…`).
- **Cheapest transcript first.** YouTube captions are free; Whisper is the
  fallback for audio-only shows.
- **Resilient.** A single malformed mention from the model is dropped, not the
  whole episode. Low-confidence noise is filtered before it touches the catalog.
- **Self-expanding.** The discovery agent (`src/discover`) ranks new shows to
  onboard by audience size, feed availability, and category diversity — the
  "expand to new popular shows" half of the brief.

## Layout

```
src/
  types.ts            domain types — mirror podsupps2's Drizzle schema
  contracts.ts        injectable boundaries (Http, Llm, Transcriber, CatalogDb)
  sources/            rss.ts, youtube.ts — feed discovery (pure parsers)
  transcribe/         captions → Whisper fallback, [mm:ss] marker rendering
  extract/            prompt.ts (the schema + system prompt) + extract.ts (zod-validated)
  resolve/            normalize.ts (aliases, similarity) + resolve.ts (dedup)
  write/plan.ts       pure WritePlan builder (new products, mentions, codes, stats)
  discover/expand.ts  show-expansion ranking agent
  orchestrator.ts     the loop: pollAll / pollPodcast / ingestEpisode
  demo.ts             offline end-to-end run with fakes
  cli.ts              demo | poll-all | ingest <id> | discover
  adapters/podsupps.ts  PRODUCTION wiring (lives in podsupps2; excluded here)
test/                 33 tests, all stages
```

## Commands

```bash
npm install
npm run check        # tsc --noEmit
npm test             # 33 tests
npm run demo         # full loop, offline, no secrets

# production (inside podsupps2 — see INTEGRATION.md):
npm run poll         # poll-all active podcasts
npm run ingest -- huberman
npm run discover
```

See **[INTEGRATION.md](./INTEGRATION.md)** to wire it into podsupps2.
