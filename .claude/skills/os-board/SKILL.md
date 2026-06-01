---
name: os-board
description: >
  Show the AI Operating System command center — context catch-up, in-flight and
  completed delegated tasks, and the agent roster, in one screen. Use when the
  user asks "what's on my plate?", "what's the status?", "show my OS",
  "what did the team finish?", "command center", or similar.
---

# os-board

Run the unified OS view and read it back conversationally.

1. Run: `bin/os board`
2. Summarize for the user in this order, leading with what needs action:
   - **Needs you** — blocked tasks, or open tasks owned by `you`.
   - **In flight** — claimed tasks and who owns them.
   - **Just done** — completed tasks with their results (this is the part their
     old command center couldn't show — call it out).
   - **Context** — one line on where things stand from the nucleus brief.
3. End with the single most useful next action.

Keep it tight. Lead with action, not status.
