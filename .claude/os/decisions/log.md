# 🧭 Decision Log

_Append-only record of decisions and their rationale. Newest at the bottom.
Never rewrite history here — if a decision is reversed, add a new entry that
says so and why. Durable preferences also get promoted into the nucleus._

---

### 2026-06-01 — Build an AI Operating System around the nucleus
**Decision:** Adopt the functionality of Nate Herk's AIS-OS (Claude Code as hub,
4Cs: Context→Connections→Capabilities→Cadence) but adapted to the user's own
style and needs — not a generic template.
**Why:** The nucleus was built so all content + workflows are designed around
what the user needs to succeed. AIS-OS gives proven structure; the nucleus +
agentbus give the closed loop the reference kit lacks.

### 2026-06-01 — agentbus is the closed-loop layer
**Decision:** Use `bin/agentbus` (explicit open→claimed→done→blocked states) as
the task/completion tracker for all delegated work.
**Why:** The user's prior command center never registered when something was
done. "Done" must be an explicit, tracked state — the core requirement.

### 2026-06-01 — Claude's role concretized as Chief of Staff + Coach
**Decision:** Claude is the chief of staff/orchestrator + ADHD coach across a
venture portfolio (sellsellingai=money maker, buildyourbot, letaidoit,
Minimovies, buddy botz). Each venture = a CEO agent with marketing/research/
product sub-agents. Claude sets daily (opt. 2x) task lists; all work ladders to:
more leads, bookings, inbound, organization.
**Why:** The system only succeeds if Claude drives toward goals instead of being
driven. User has ADHD: needs coaching, clear single-next-action plans, and a
balance protocol so new ideas don't bury committed work. Posting (not creating)
is the recurring blocker — insecurity-driven; design around it. "Done" = a goal
outcome shipped (published/sent/live), not drafted.

### 2026-06-01 — Home is Claude; no fragile comms channels
**Decision:** The command center lives IN Claude (works 100% today). A functional
localhost widget is PARKED as a future upgrade, built only once it clearly earns
its keep. No WhatsApp/iMessage/Telegram bridge — fragile channels splinter focus.
Comms style = "caveman-warm": one line, action-first, light encouragement.
**Why:** User's #1 anti-goal is a 70%-working system that annoys and splinters
him. He likes working in Claude. Fewer things that fully work > more things that
sort of work.
