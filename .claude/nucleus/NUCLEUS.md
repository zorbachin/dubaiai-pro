# 🧠 Context Nucleus

> The single source of truth for everything you're doing with Claude — across
> chats, Cowork, code, and design. Any surface hands off context **to** this
> file; every new session reads context **from** it. If a fresh Claude doesn't
> have your context, it's because it hasn't read this yet — so it always does.

---

## 📌 North Star
_What we're ultimately building and why. Edit this by hand — it changes rarely._

### DubaiAI.pro
- Marketing site for a Dubai-based AI consultancy ("Bespoke AI Implementation & Audit").
- Sells full-stack AI engineering (Layer 1/2/3) + regulatory-grade auditing for enterprises and government.
- Goal: premium landing page → leads to `hello@dubaiai.pro`. Live at https://dubaiai.pro.

### PodSupps — podcast product database (podsupps.com)
- "One-stop shop" — listeners search for any product, restaurant, supplement, or life hack mentioned/sponsored by top podcasts.
- Revenue model: affiliate links. Target: 10,000 MAU.
- Manus built the storefront (`podsupps2` repo: React 19, tRPC, Drizzle, MySQL, 107 shows, 873 products). The missing moat: automated ingestion — no episode has ever been auto-processed.
- We built the **Comb Engine** in `dubaiai-pro/pipeline/` — fully tested, ready to lift into `podsupps2`.

## 🎯 Active Threads
_What's in flight right now. The 1–5 things a new session should care about._

**PodSupps pipeline — deployment blocked on user action:**
- [ ] User needs to paste `ingest.yml` + `qa.yml` into `podsupps2/.github/workflows/` via GitHub web editor.
- [ ] Copy `pipeline/` folder from `dubaiai-pro` into `podsupps2` — start a new Claude Code session scoped to `podsupps2` to do this in one shot.
- [ ] Connect `podsupps2` to Vercel (custom domain: podsupps.com) so git pushes trigger rebuilds.
- [ ] Secrets already added to `podsupps2`: `FORGE_API_KEY` (OpenAI key), `FORGE_API_URL` = `https://api.openai.com/v1`. Variable needed: `SITE_URL` = `https://www.podsupps.com`.

**DubaiAI.pro:**
- [ ] Context Nucleus PR #10 on `claude/epic-einstein-jPNIL` — not yet merged to `main`.
- [ ] Next landing-page task TBD.

## 🧩 Decisions & Conventions
_Choices already made, so no surface re-litigates them._

### DubaiAI.pro
- **Single-file site:** everything lives in `index.html` (inline CSS/JS), no build step. GitHub Pages via `CNAME` → dubaiai.pro.
- **Brand palette:** gold `#c8a45c`, navy `#0a1628`, cream `#faf8f3`/`#f5f0e6`/`#e8e0d0`.
- **Type:** DM Serif Display (headings), Inter (body), JetBrains Mono (mono).
- **Sections:** hero, about, services, audit, process, cases, contact.
- **Contact:** `hello@dubaiai.pro`.

### PodSupps — Comb Engine
- **LLM provider:** OpenAI API (`gpt-4o-mini` default). User's key is in `podsupps2` secrets as `FORGE_API_KEY`; base URL `https://api.openai.com/v1` as `FORGE_API_URL`.
- **Deployment model:** GitHub-native. Pipeline commits JSON files → git push → Vercel rebuild. No DB server needed for the pipeline itself.
- **Pipeline package lives in `dubaiai-pro/pipeline/`** and must be copied to `podsupps2/pipeline/` for workflows to find it.
- **PIPELINE_DEPS_MODULE:** `./src/adapters/json-deps.js` for GitHub Actions (JSON files); `./src/adapters/podsupps.js` for MySQL native mode.
- **33 tests, zero TS errors** — all passing on branch `claude/podcast-product-database-4ixZu`.
- **Do NOT rebuild the frontend** — Manus storefront is ~90% done. Focus is the ingestion engine only.

## 📥 Handoffs
_Newest first. Written automatically by hooks and by `nucleus push` from any
surface. This is the message-in-a-bottle between sessions._

<!-- HANDOFFS:START -->
### 2026-06-01 11:45 UTC · code
GitHub-native deployment added: JSON file adapter (pipeline/data/ committed to repo), ingest.yml (daily cron -> extracts mentions -> commits JSON -> Vercel rebuilds), qa.yml (post-deploy checks every page/image/link, opens GitHub Issue on failure). 10 anchor shows seeded with RSS+YouTube URLs. Setup: add FORGE_API_KEY + FORGE_API_URL as GitHub secrets, SITE_URL as a repo variable. Then connect the podsupps2 repo to Vercel and the whole loop is live.

### 2026-06-01 10:10 UTC · code
PIVOT on podsupps2: Manus already built a ~90% complete storefront (107 podcasts, 873 products, 1568 mentions, full React19+tRPC+Drizzle+MySQL, audio/video player, SEO, PWA). The MISSING core — and the actual moat from their own blueprint — is the automated ingestion pipeline ('Comb Engine'): RSS/YouTube poll -> transcribe -> LLM extract -> dedup/resolve -> DB write -> mark processed. Schema (episodes.isProcessed/transcriptUrl, mentions) + infra (invokeLLM, transcribeAudio) are present but never wired. Decision: build the autonomous engine, not rebuild the frontend. Building it in dubaiai-pro repo (session is scoped to it) as a liftable, tested package matching podsupps2 contracts + INTEGRATION.md.

### 2026-06-01 07:57 UTC · chat
Steering signals to always note: (1) when user says something 'works'/validates an approach, (2) when user steers thinking in a direction, (3) patterns recurring across workstreams. Plus: the nucleus should self-check and get smarter over time.

### 2026-06-01 07:52 UTC · chat
User preference: capture useful things (decisions, preferences, milestones, open loops) PROACTIVELY without being asked — they should rarely need to say 'remember this'.
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-02 17:05 UTC
- **Branch:** `claude/podcast-product-database-4ixZu`
- **Last commit:** a47e65c chore: refresh nucleus live state [skip ci] — 6 hours ago

**Working tree:**
```
M .claude/nucleus/NUCLEUS.md
```

**Uncommitted changes:**
```
.claude/nucleus/NUCLEUS.md | 14 +++++++-------
 1 file changed, 7 insertions(+), 7 deletions(-)
```

**Recent commits:**
```
a47e65c chore: refresh nucleus live state [skip ci] (6 hours ago)
340ad27 docs: refresh nucleus — add PodSupps project, update active threads and decisions (6 hours ago)
ba22c7d chore: refresh nucleus live state [skip ci] (22 hours ago)
7df3a84 chore: refresh nucleus live state [skip ci] (22 hours ago)
f8e1aee chore: refresh nucleus live state [skip ci] (23 hours ago)
```
<!-- AUTOSTATE:END -->

## 🌀 Reflections
_The nucleus checking in on itself._

<!-- REFLECTIONS:START -->
### 2026-06-01 07:57 UTC
Added three new capture signals (validations/'this works', directional steering, cross-workstream patterns) and a self-improvement loop. Learned the user wants memory that promotes patterns and tunes its own rules, not just a static log.
<!-- REFLECTIONS:END -->
