---
name: close-day
description: >
  Run the end-of-day close as chief of staff: what shipped, what slipped and
  why, what carries to tomorrow. Use when the user says "close out", "wrap up",
  "end of day", "what did we get done", or is finishing a working session.
---

# close-day — the evening close

Act as Chief of Staff (see `.claude/os/ROLE.md`).

1. Run `bin/agentbus board` and review what moved to **done** vs. still open.
2. Report in three short blocks:
   - **✅ Shipped today** — with the real outcome (site live, email *sent*, post
     *published*). Drafted-but-not-posted is NOT shipped — flag it.
   - **⏳ Slipped** — what didn't get done and the honest reason (especially if
     it's the posting/launch avoidance pattern — name it gently).
   - **➡️ Tomorrow** — carry slipped items forward; set tomorrow's likely top 3.
3. Capture the day's outcome: `bin/nucleus push "<what shipped / what slipped>" --from chat`.
4. If a task slipped 2+ days running (esp. posting), reflect on it:
   `bin/nucleus reflect "<the recurring blocker + a smaller next step to beat it>"`.
5. Encourage, don't scold. Momentum > perfection. One win named out loud.
