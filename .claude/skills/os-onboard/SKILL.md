---
name: os-onboard
description: >
  Onboard or refresh the AI Operating System — capture who the user is, their
  workstreams, their agents (chatgpt/gemini/hermes/…), how each is triggered,
  and their current priorities. Use when the user says "onboard me", "set up my
  OS", "let's configure this", or is first defining their multi-agent setup.
---

# os-onboard

Talk-driven setup. Do NOT make the user run commands — you capture as they talk.

1. Run `bin/os onboard` to get the intake prompts, then ask them conversationally
   (one or two at a time, not a wall of questions).
2. As each answer comes in, capture it immediately and show a receipt:
   - Durable facts (who they are, priorities, always/never rules) →
     `bin/nucleus push "<fact>" --from chat`, and promote the biggest ones into
     the nucleus top sections (North Star / Decisions).
   - Each agent they name → add a row to `.claude/os/connections.md`
     (what it's good at, how it's triggered, how it reports back). Start every
     new connection at **manual paste** (the bike method — earn autonomy later).
3. Log the setup decision in `.claude/os/decisions/log.md`.
4. Finish by running `bin/os board` so they SEE their OS populated.

Show a `🧠 saved: …` receipt for everything you capture — visibility matters.
