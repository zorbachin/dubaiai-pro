# 🛰️ connections.md — your agent roster

_The registry of every agent/tool in your OS: what it's good at, how it gets
work, and how it reports back. The orchestrator (Claude) reads this to decide
who to delegate to. Adapted from the AIS-OS "Connections" C — bent around how
**you** actually work: most efficient, low cost (free local agents do the
unattended work; paid APIs stay manual until proven worth it)._

> How the loop works: a task is added to the bus (`agentbus add … --to <agent>`),
> the agent (or the watcher, for auto agents) picks it up, does the work, and
> runs `agentbus done <id> --result "…"`. **Done always registers.**

| Agent | Best at | How it's triggered | How it reports back | Trigger tier |
|-------|---------|--------------------|--------------------|--------------|
| **claude** (hub) | Orchestration, code, writing, decisions, tracking | Default — you talk to it | Updates nucleus + bus directly | live |
| **cowork** | Longer multi-step Claude work, docs, research | You hand it off in Cowork | Paste/sync result → `agentbus done` | manual |
| **ollama** | Local, FREE inference — drafts, summaries, classification, bulk text | **auto** — watcher polls the bus & runs it unattended | Watcher writes result → `agentbus done` | **auto (free)** |
| **hermes** | Reasoning/chat (OpenHermes/Nous-Hermes **on Ollama** — confirm) | **auto** via Ollama (same watcher, model=hermes) | Watcher writes result → `agentbus done` | **auto (free)** |
| **chatgpt** | Brainstorming, copy variations, premium reasoning | manual paste (paid API — relay by hand for now) | Paste result back → `agentbus done` | manual paste |
| **gemini** | Image/visual gen, multimodal, research | manual paste (paid API — relay by hand for now) | Paste result back → `agentbus done` | manual paste |

## Trigger tiers (the "bike method" — earn autonomy gradually)
- **manual paste** — you move work between tabs; the bus *tracks* it so nothing
  is lost. Where paid agents (ChatGPT/Gemini) live, to avoid API spend.
- **auto (free)** — the local watcher (`bin/agentwatch`) polls the bus and runs
  the task on **Ollama** with zero API cost. Ollama + Hermes live here.
- **auto (paid)** — graduate a paid agent here only once it's proven reliable
  manually AND you've decided the spend is worth it. Cadence comes last.

## How auto-dispatch works (free tier)
1. You delegate: `agentbus add "<task>" --to ollama --need "<context>"`.
2. `bin/agentwatch` (running locally) sees the open task, claims it, sends the
   prompt to your local Ollama, and on success runs `agentbus done` with the
   model's output. No cloud, no cost.
3. `os board` shows it move open → claimed → done with the result attached.

## To wire a paid agent for auto later
Add an API dispatcher (keys in env, never committed), flip its tier to
`auto (paid)`, and point the watcher at it. Until then: manual relay.

_Edit this freely — it's yours. The orchestrator re-reads it every session._
