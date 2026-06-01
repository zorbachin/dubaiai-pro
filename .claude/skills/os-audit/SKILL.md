---
name: os-audit
description: >
  Run a 4Cs gap report on the AI Operating System (Context, Connections,
  Capabilities, Cadence) and tell the user where it's strong vs. thin and what
  to build next. Use when the user says "audit my OS", "how's my setup",
  "what's missing", "review the system", or on a weekly cadence.
---

# os-audit

1. Run: `bin/os audit`
2. Read it back honestly. For each of the 4Cs, say strong ✅ or thin ⬜ in one line.
3. Name the **single thinnest pillar** as the next move — but respect ordering:
   Context is non-skippable; Cadence/automation comes LAST. Never recommend
   automating a workflow that doesn't already work manually (the bike method).
4. If the same manual task has come up 3+ times in handoffs, surface it as a
   candidate to automate next.
5. Optionally append the finding to `.claude/os/decisions/log.md` and reflect on
   anything learned with `bin/nucleus reflect "…"`.
