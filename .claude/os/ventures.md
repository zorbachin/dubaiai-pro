# 🏢 Ventures — your portfolio & their org charts

_Each venture is run by a **CEO agent** that delegates to sub-agents
(marketing, research, product). The orchestrator (Claude) sets each CEO's task
list daily — or twice daily — all laddering up to: more leads, more bookings,
more inbound, more organization._

> Agent naming on the bus: `<venture>-ceo`, `<venture>-mktg`, `<venture>-research`,
> `<venture>-product`. e.g. `agentbus add "draft launch email" --to ssa-mktg`.

## Priority order (where focus goes first)
1. **sellsellingai (SSA)** — 💰 the money maker. Top priority.
2. **Miklat Games (MG)** — 🎮 live product, active monetization push.
3. **buildyourbot.io (BYB)** — strong branding + great site already; leverage it.
4. **letaidoit (LAI)**
5. **Minimovies (MM)**
6. **buddy botz (BB)** — coming soon.

---

## Miklat Games — `mg` 🎮
- **Status:** LIVE at miklatgames.fun — arcade shelf with Iron Dome + Mamad
  Dash (both shippable), Balagan + Fabatollah coming-soon doors, offline PWA,
  share/challenge loops built in. Own repo: `zorbachin/miklatgames`.
- **Org (restructured 2026-06-11, Zorba):** Claude is **COO/CMO** — owns ops
  and orchestrates the org below.
  - **`mg-ceo` — dedicated Commercialization CEO.** One job: drive
    distribution, marketing, and growth to the **10,000-user goal**. Owns
    portal submissions, content/clip cadence, partnerships, share loops, and
    revenue activation. Does NOT do product work.
  - **One full-time PM per game**, each managing that game's **10M advisor
    panel** (the expert panels used on Mamad Dash for virality, retention,
    stability, monetization):
    - `mg-pm-irondome` — Iron Dome
    - `mg-pm-mamaddash` — Mamad Dash
    - `mg-pm-shukshopper` — Shuk Shopper
  - Shared bench: `mg-mktg`, `mg-research` report to `mg-ceo`; PMs pull them
    as needed.
- **Goal right now:** first revenue in 7 days; $500–1,000/mo by day 90;
  **10K users** is the commercialization north star —
  plan of record: `miklatgames:.claude/os/MONETIZATION.md`.
- **Open:** tip jar + per-game analytics events, portal submissions
  (itch.io / CrazyGames / Poki), weekly clip cadence via batch system.

## sellsellingai — `ssa` 💰
- **Status:** money maker — primary focus.
- **Goal right now:** _(define: more demos? bookings? a challenge launch?)_
- **CEO:** `ssa-ceo` → `ssa-mktg`, `ssa-research`, `ssa-product`
- **Open:** sites launch, the challenge, email drafts, content posting.

## buildyourbot.io — `byb`
- **Status:** strong branding + great site live.
- **Goal right now:** _(define: drive traffic? capture leads off the existing site?)_
- **CEO:** `byb-ceo` → `byb-mktg`, `byb-research`, `byb-product`

## letaidoit — `lai`
- **Status:** _(define)_
- **CEO:** `lai-ceo` → sub-agents

## Minimovies — `mm`
- **Status:** _(define)_
- **CEO:** `mm-ceo` → sub-agents

## buddy botz — `bb`
- **Status:** coming soon.
- **CEO:** `bb-ceo` → sub-agents

---

## Daily cadence (how the task lists get set)
- **AM:** orchestrator reviews goals + carryover, sets each active CEO's top
  1–3 tasks on the bus.
- **PM (optional):** quick re-check — what shipped, what to push.
- Sub-agents that are free/local (ollama, hermes) can auto-run via `agentwatch`;
  paid + human-in-loop work stays manual relay.

_Fill in the per-venture "Goal right now" lines as we define them — that's the
next onboarding step._
