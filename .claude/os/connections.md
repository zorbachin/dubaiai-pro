# 🛰️ connections.md — your agent roster

_The registry of every agent/tool in your OS: what it's good at, how it gets
work, and how it reports back. The orchestrator (Claude) reads this to decide
who to delegate to. Adapted from the AIS-OS "Connections" C — bent around how
**you** actually work._

> How the loop works: a task is added to the bus (`agentbus add … --to <agent>`),
> the agent (or you on its behalf) checks its inbox, does the work, and runs
> `agentbus done <id> --result "…"`. **Done always registers** — that's the
> whole point.

| Agent | Best at | How it's triggered | How it reports back | Trigger type |
|-------|---------|--------------------|--------------------|--------------|
| **claude** (hub) | Orchestration, code, writing, decisions, tracking | Default — you talk to it | Updates nucleus + bus directly | live |
| **chatgpt** | Brainstorming, copy variations, quick drafts | You paste the task from `agentbus inbox chatgpt` | Paste result back → `agentbus done` | manual paste |
| **gemini** | Image/visual gen, multimodal, research | You paste the task from its inbox | Paste result back → `agentbus done` | manual paste |
| **hermes** | _(define: research? ops? scheduling?)_ | _(define)_ | _(define)_ | _(define)_ |

## Trigger types (the "bike method" — earn autonomy gradually)
- **manual paste** — training wheels. You move work between tabs; the bus just
  *tracks* it so nothing is lost and "done" registers. Start here.
- **assisted** — a script drafts the prompt and opens the agent for you; you
  approve and run.
- **auto** — a watcher daemon polls `agentbus watch <agent>` and fires the
  agent's API unattended. Only graduate a connection to this once it's proven
  reliable manually (Cadence comes last).

## To add a connection
1. Add a row above (what it's good at + how it's triggered).
2. When you delegate: `agentbus add "<task>" --to <agent> --need "<context>"`.
3. When it finishes: `agentbus done <id> --by <agent> --result "<what it produced>"`.

_Edit this freely — it's yours. The orchestrator re-reads it every session._
