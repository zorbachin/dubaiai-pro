# PodSupps — Build Roadmap (senior-dev read)

A plan for getting from "beautiful hand-seeded snapshot" to "self-updating
catalog at 10k MAU." Written to organize execution, not to be precious.

## Where things actually stand

| Layer | State | Owner |
|---|---|---|
| Storefront / player / marketplace / SEO / PWA | **~90% done** (Manus) | shipped |
| Database schema (podcasts, products, episodes, mentions, promo) | **done & correct** | shipped |
| Catalog data (107 shows, 873 products, 1,568 mentions) | **done but frozen** — hand-seeded, no refresh path | ⚠️ |
| **Automated ingestion ("Comb Engine")** | **built here** — needs lift into podsupps2 | this PR |
| Show-expansion agent | **built here** (ranking) — needs candidate source + admin UI | this PR |
| Affiliate link automation | hook defined, not implemented | next |
| Image/price enrichment for new products | hook defined (podsupps2 has the tools) | next |
| Growth loops (newsletter, social clips, SEO scale) | not started | later |

The single highest-leverage gap was the ingestion engine — without it the site
decays the day Manus stops re-seeding. That's what this PR delivers.

## Phase 1 — Make it live (this PR + lift)

1. Merge the Comb Engine into podsupps2 (see `INTEGRATION.md`).
2. Backfill feed URLs (YouTube `UC…` ids / RSS) for the top ~25 shows.
3. Run `poll-all` with `maxEpisodesPerPodcast: 3` to validate on real data.
4. Add the `/admin` "Run ingestion" button + daily cron.

**Done = a new episode of a tracked show appears in the catalog within 24h, with
zero human action.**

## Phase 2 — Trust & enrichment (weeks 2–4)

- Auto-assign affiliate links for new brands (Impact/Amazon program map).
- Enrich `plan.newProducts` with images (`imageGeneration.ts`) and prices.
- Add an extraction QA pass: low-confidence or first-seen brands land in an
  admin review queue before going public (protects catalog quality).
- Add the exact-guid dedup column (one migration).

## Phase 3 — Expansion & cross-show intelligence (weeks 4–8)

- Feed the discovery agent from a real charts source + the suggestions table;
  onboard shows one-click from `/admin`.
- Surface the data only this pipeline can produce: "mentioned on N shows,"
  "trending across podcasts this week," "what Huberman AND Attia both use."
  These are the most shareable, most SEO-valuable, hardest-to-copy pages.

## Phase 4 — Growth to 10k MAU (month 3+)

- Programmatic SEO at scale: `[show] × [category]` pages, kept fresh by the
  pipeline (the freshness is the ranking edge over static affiliate blogs).
- Weekly "trending in podcasts" newsletter off the cross-show stats.
- Auto-cut social clips at mention timestamps (the data is already there).

## Guardrails the engine already enforces

- One model hiccup never discards a whole episode (per-mention validation).
- Low-confidence noise is filtered before it reaches the catalog.
- Cross-show dedup keeps `crossPodcastCount` honest.
- Every external dependency is mocked in tests → CI stays green without secrets.
