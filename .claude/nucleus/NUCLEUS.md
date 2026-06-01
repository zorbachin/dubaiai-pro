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
- **When:** 2026-06-01 18:12 UTC
- **Branch:** `main`
- **Last commit:** 686819c Comms style + anti-splinter home rule (stay in Claude) (#21) — 25 seconds ago

**Working tree:**
```
✓ clean — nothing uncommitted
```

**Recent commits:**
```
686819c Comms style + anti-splinter home rule (stay in Claude) (#21) (25 seconds ago)
6ddafef Concretize Claude's role: Chief of Staff + venture org model (#20) (4 minutes ago)
ee64550 chore: refresh nucleus live state [skip ci] (8 minutes ago)
35ecff0 agentwatch — free local auto-dispatch via Ollama (#19) (8 minutes ago)
46e95f1 chore: refresh nucleus live state [skip ci] (11 minutes ago)
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
