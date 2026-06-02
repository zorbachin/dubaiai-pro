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
### 2026-06-02 03:13 UTC · code
REAL SITE MAP (Netlify, 16 sites, owned by zorbachin/PodSupps team): letaidoit→letaidoit.netlify.app (OWNED, exists!), minimovies→minimovies.io (LIVE custom domain), byb-ambassador→byb-ambassador.netlify.app (forms enabled), foxy-close-tool→foxy-close-tool.netlify.app (the Instant Proposals closing tool), podsupps→podsupps.com, plus machberet, dad-ai-discovery, vybe-discovery, pbgai, zorbasphere, tlv-summer, polar-bear-prep, foxy-epoxy-discovery. NOTE: owned 'letaidoit' project already exists — redrop may be done or it's an empty shell; verify deploy.

### 2026-06-02 03:09 UTC · chat
SAFETY RULE (standing): Claude may CREATE drafts/designs with real tools (Gmail drafts, Canva, image-gen) but NEVER auto-send, auto-publish, or charge. User always does the final send/post/deploy. Applies to Netlify too — prep, don't flip live without explicit yes.

### 2026-06-02 03:01 UTC · code
PILLAR 1 created + atomized: 'How I got into AI business' → 10 pieces across a week (anchor video, carousel, 3 written posts, 3 quote cards, meme, newsletter), queued T008-T014 for LetAIDoIt. Through-line: 'You don't need to learn AI, you need someone who already did the 1000 hours.' Voice guide upgraded to v1 with his real word samples.

### 2026-06-01 18:38 UTC · chat
CONTENT SYSTEM (key workflow): user batches 2-4 hrs Sun/Mon on RAW content creation only (his strength, peak 7:30am). Then Claude atomizes each raw asset into many formats across the week (video→clips/carousel/quotes/memes/written/email). Create once, ship all week. Removes midweek blank-page + posting friction.

### 2026-06-01 18:27 UTC · chat
FEATURE: dopaminergic focus dashboard. User has ADHD, misses scroll/gamification/focus-meter — text-only is hard to visualize his day. Build self-contained focus.html (no server, double-click, brand colors): focus meter, progress ring, XP/streaks, scrollable task cards. Generated from the live board.

### 2026-06-01 18:26 UTC · code
Built dump parser: bin/dump (reliable capture to .claude/os/dumps/) + dump skill (Opus parses raw dump → flywheel content across video/carousel/meme/writing, in user's voice, queued to content board, with 3 hook options). Idea input valve is live.

### 2026-06-01 18:25 UTC · chat
FEATURE: brain-dump parser. User dumps a raw idea/theme (one post or a week), Claude (Opus 4.8) parses it into outstanding FLYWHEEL content — structured, in his voice, queued to the content board. Input valve for his ADHD idea flow.

### 2026-06-01 18:23 UTC · code
Built master content-board.md (color-coded by type, idea→POSTED pipeline), scripts-tomorrow.md (2 ready-to-read scripts for 7:30 SSA-C + Origin-Drafts), voice-guide v0. Tomorrow's shoot is on the bus.

### 2026-06-01 18:19 UTC · chat
VOICE-LEARNING METHOD: Claude researches user online + builds a voice guide from chat notes, user corrects it (lowest friction). REUSE INSIGHT: user has a great buildyourbot.io video he wants to repurpose for letaidoit + others.

### 2026-06-01 18:19 UTC · chat
BIG INITIATIVE: full content map sprint — audit ALL content across ventures, then schedule + queue everything. Nothing floating. Treat as a structured sprint.

### 2026-06-01 18:14 UTC · chat
STORY ASSETS to learn & use in content: the house, the war, and the previous drafts we wrote but never published. These are raw material for authentic launches.

### 2026-06-01 18:14 UTC · chat
VOICE: user's own voice + Hormozi-style direct marketer, but human/good. Self-aware, meta, slightly subversive. Reframes in human terms: 'get your time back' (benefit) vs 'AI is the solution' (feature). This is a SKILL to implement for all content agents.

### 2026-06-01 18:14 UTC · chat
LAUNCH RESET: nothing is truly launched yet except kinda Minimovies. Treat EVERY venture as Day 1 / square one. Marketing + research sub-agents start from scratch, no assumed traction.

### 2026-06-01 18:14 UTC · chat
PEAK CONTENT TIME: user records content best EARLY AM, ~7:30am. Schedule content creation/recording into that window; protect it.

### 2026-06-01 18:11 UTC · chat
DECISION: Home = Claude (100% reliable today). Command-center widget = PARKED as future upgrade, only if it earns it — not built now (anti-splinter). Comms style = caveman-warm (1.5): one line, action-first, light encouragement. No fragile channels.

### 2026-06-01 18:08 UTC · chat
COMMS preference: wants concise 'caveman style' text pings when action needed (link / approval / yes-no). Telegram annoying. WhatsApp or iMessage preferred. But this is secondary to: don't splinter him — only add a channel if it works 100%.

### 2026-06-01 18:08 UTC · chat
CRITICAL STEERING: user does NOT want a 70%-working system — half-working tools annoy him and splinter his focus (the opposite of the goal). He LIKES working in Claude. Preference: stay inside Claude, or a command-center widget that ACTUALLY functions — not a fragile notification mesh. Build fewer things that fully work.

### 2026-06-01 18:05 UTC · chat
TODAY'S MISSES (open loops): did not launch the sites, the challenge, the email drafts, or user's content. These are carried-over priorities.

### 2026-06-01 18:05 UTC · chat
USER WORKING STYLE: ADHD — needs coaching, guidance, clear workstreams, not a wall of options. LIKES creating content when he knows what he's doing. GETS STUCK on POSTING — insecurity is the blocker, not the creation. Posting friction is a recurring pattern to design around.

### 2026-06-01 18:05 UTC · chat
MY ROLE (Claude): chief of staff / orchestrator + ADHD coach. Set daily (or 2x/day) task lists per venture & agent. When user brings new ideas mid-stream, find balance: 'yes we can do that AND here's what still must ship today' — don't let new shiny derail committed goals.

### 2026-06-01 18:05 UTC · chat
GOALS (the north star for all ventures): more leads, more bookings, more inbound business, more organization so the user doesn't have to guess.

### 2026-06-01 18:05 UTC · chat
VENTURES: Minimovies, letaidoit, sellsellingai (= the money maker), buildyourbot.io (strong branding+site), buddy botz (coming). Each needs its own CEO agent delegating to marketing/research/product sub-agents.

### 2026-06-01 18:03 UTC · code
Built bin/agentwatch: free local auto-dispatch — polls agentbus for ollama/hermes tasks, runs them on local Ollama, closes the loop at ZERO cost. Paid agents (chatgpt/gemini) stay manual relay to avoid spend. Roster updated: ollama+hermes=auto(free), chatgpt+gemini=manual, claude+cowork. Hermes assumed = Ollama model (confirm).

### 2026-06-01 18:00 UTC · code
Built the AI OS scaffold adapted from AIS-OS: .claude/os/ (connections.md roster, decisions/log.md, README), bin/os (board+audit+onboard tying nucleus+agentbus+roster), and 3 talk-driven skills (os-board, os-onboard, os-audit). 4Cs audit all green. agentbus = the closed-loop layer the reference kit lacks.

### 2026-06-01 17:47 UTC · code
Building multi-agent OS: agentbus task ledger (bin/agentbus) gives explicit open→claimed→done→blocked states so delegated work CLOSES THE LOOP. Demo proved full delegate→work→report-back cycle. Core pain being solved: command center never registers 'done'.

### 2026-06-01 10:07 UTC · chat
User needs to SEE the system work with concrete proof, not be told it works. Show, don't tell — demo live output, point at the actual file.

### 2026-06-01 07:57 UTC · chat
Steering signals to always note: (1) when user says something 'works'/validates an approach, (2) when user steers thinking in a direction, (3) patterns recurring across workstreams. Plus: the nucleus should self-check and get smarter over time.

### 2026-06-01 07:52 UTC · chat
User preference: capture useful things (decisions, preferences, milestones, open loops) PROACTIVELY without being asked — they should rarely need to say 'remember this'.
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-02 03:14 UTC
- **Branch:** `main`
- **Last commit:** 1037ce2 chore: refresh nucleus live state [skip ci] — 24 seconds ago

**Working tree:**
```
✓ clean — nothing uncommitted
```

**Recent commits:**
```
1037ce2 chore: refresh nucleus live state [skip ci] (24 seconds ago)
da511b7 Pillar 1: "How I got into AI" → a week of content + voice v1 (#27) (12 minutes ago)
9d5f76e chore: refresh nucleus live state [skip ci] (9 hours ago)
bc7d6a5 Batch & repurpose content system (create once, ship all week) (#26) (9 hours ago)
63c2b2b chore: refresh nucleus live state [skip ci] (9 hours ago)
```
<!-- AUTOSTATE:END -->

## 🌀 Reflections
_The nucleus checking in on itself._

<!-- REFLECTIONS:START -->
### 2026-06-01 10:07 UTC
GAP: proactive capture is invisible to the user — they couldn't tell it was working. Fix: whenever you capture, show a one-line '🧠 saved: ...' receipt in chat so it's verifiable in real time. Visibility is as important as the capture itself.

### 2026-06-01 07:57 UTC
Added three new capture signals (validations/'this works', directional steering, cross-workstream patterns) and a self-improvement loop. Learned the user wants memory that promotes patterns and tunes its own rules, not just a static log.
<!-- REFLECTIONS:END -->
