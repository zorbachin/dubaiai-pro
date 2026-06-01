# 🧠 Context Nucleus

> The single source of truth for everything you're doing with Claude — across
> chats, Cowork, code, and design. Any surface hands off context **to** this
> file; every new session reads context **from** it. If a fresh Claude doesn't
> have your context, it's because it hasn't read this yet — so it always does.

---

## 📌 North Star
_What we're ultimately building and why. Edit this by hand — it changes rarely._

- **Project:** DubaiAI.pro — marketing site for a Dubai-based AI consultancy
  ("Bespoke AI Implementation & Audit").
- **What they sell:** Full-stack AI engineering across three layers —
  Layer 1 (AI Infrastructure), Layer 2 (AI Applications), Layer 3 (Agentic AI) —
  plus regulatory-grade AI auditing, for enterprises and government.
- **Goal:** A premium, high-trust landing page that converts enterprise/gov
  leads into a contact (`hello@dubaiai.pro`). Live at https://dubaiai.pro.

## 🎯 Active Threads
_What's in flight right now. The 1–5 things a new session should care about._

- [ ] Context Nucleus system is built (hooks + CLI + web bridge) — PR #10 open
      on `claude/epic-einstein-jPNIL`, not yet merged to `main`.
- [ ] Wire the nucleus widget into the local app at http://localhost:3001/.
- [ ] (add the next real landing-page task here)

## 🧩 Decisions & Conventions
_Choices already made, so no surface re-litigates them._

- **Single-file site:** everything lives in `index.html` (inline CSS/JS), no
  build step. Hosted on GitHub Pages via `CNAME` → dubaiai.pro.
- **Brand palette:** gold `#c8a45c` (accent), navy `#0a1628` (text/dark),
  cream/sand backgrounds (`#faf8f3`, `#f5f0e6`, `#e8e0d0`).
- **Type:** DM Serif Display (headings), Inter (body), JetBrains Mono (mono).
- **Sections / nav anchors:** hero, about, services, audit, process, cases,
  contact.
- **Contact:** `hello@dubaiai.pro`.

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
- **When:** 2026-06-01 17:21 UTC
- **Branch:** `claude/podcast-product-database-4ixZu`
- **Last commit:** 55de71c chore: refresh nucleus live state [skip ci] — 8 seconds ago

**Working tree:**
```
✓ clean — nothing uncommitted
```

**Recent commits:**
```
55de71c chore: refresh nucleus live state [skip ci] (8 seconds ago)
9381fbd fix: update Forge API default URL from .im to .ai (13 seconds ago)
d6bbc65 chore: refresh nucleus live state [skip ci] (4 minutes ago)
cb49c49 chore: refresh nucleus live state [skip ci] (7 minutes ago)
14c555c chore: refresh nucleus live state [skip ci] (9 minutes ago)
```
<!-- AUTOSTATE:END -->

## 🌀 Reflections
_The nucleus checking in on itself._

<!-- REFLECTIONS:START -->
### 2026-06-01 07:57 UTC
Added three new capture signals (validations/'this works', directional steering, cross-workstream patterns) and a self-improvement loop. Learned the user wants memory that promotes patterns and tunes its own rules, not just a static log.
<!-- REFLECTIONS:END -->
