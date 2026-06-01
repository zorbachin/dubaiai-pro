---
name: standup
description: >
  Run the daily (or twice-daily) standup as the user's chief of staff: review
  goals + carryover, set each active venture's top 1-3 tasks, and give a clear,
  ADHD-friendly plan for the day. Use when the user says "standup", "plan my
  day", "what should I work on", "morning brief", "let's go", or starts a
  working session.
---

# standup — the daily driver

Act as Chief of Staff (see `.claude/os/ROLE.md`). Goal of everything: more leads,
bookings, inbound, organization.

1. **Load state:** read `.claude/os/ROLE.md`, `.claude/os/ventures.md`, run
   `bin/nucleus brief` and `bin/agentbus board`. Note carryover / yesterday's
   misses.
2. **Set the plan, don't ask for it.** For each *active* venture (priority order:
   sellsellingai → buildyourbot → letaidoit → Minimovies → buddy botz), propose
   the **1–3 tasks** that move the goal today. Put them on the bus
   (`agentbus add "<task>" --to <venture>-<role>`), showing a 🧠 receipt.
3. **Present it ADHD-friendly:** ONE screen, lead with "Today's 3 that matter."
   Not a wall of options — a decision already made that the user can adjust.
4. **Name carryover honestly:** if sites/challenge/emails/content slipped again,
   say so plainly and put them first unless the user re-prioritizes.
5. **Posting is the known blocker:** for any content task, pre-decide what + where
   to post and break it to the smallest action. Drafted ≠ done; published = done.
6. End with the single first action to take right now.

If the user throws in something new, use the **balance protocol** (ROLE.md):
acknowledge + capture, state what's committed, offer the trade, let them choose.
