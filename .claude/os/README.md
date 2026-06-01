# 🧠⚙️ Your AI Operating System

Claude Code is the **hub**. You talk to it; it holds your context, delegates to
other agents, and tracks everything to completion. Adapted from the AIS-OS
pattern (Nate Herk) but designed around **your** style: zero-friction,
talk-don't-command, closed-loop, show-don't-tell.

## The pieces (and which "C" each is)

| C | Piece | Where | What it does |
|---|-------|-------|--------------|
| **Context** | The Nucleus | `.claude/nucleus/NUCLEUS.md` | Single source of truth. Auto-loads every session, auto-captures decisions/preferences, self-improves. |
| **Connections** | Agent roster | `.claude/os/connections.md` | Who's on the team (chatgpt, gemini, hermes…), what each is good at, how it's triggered & reports back. |
| **Capabilities** | Skills | `.claude/os/skills/` + `bin/` | What the OS can *do*: `agentbus` (delegate + track), and OS routines below. |
| **Cadence** | The closed loop | `bin/agentbus` | Delegated work has explicit states; **done always registers**. Automation comes last, only once a flow works manually. |

Plus a **decision log** (`.claude/os/decisions/log.md`) — append-only, so the
*why* behind choices is never lost.

## Daily use — just talk

- **"What's on my plate?"** → I run `agentbus board` and read it back.
- **"Get ChatGPT to draft X."** → I `agentbus add "X" --to chatgpt`, hand you the
  prompt, and when you paste the result back I mark it `done` with the output.
- **"What did the team finish?"** → I show you the DONE column with results.
- **"Catch me up."** → I read the nucleus brief.
- **"Reflect."** → the OS self-checks and gets sharper.

## The bike method (earning autonomy)
Every connection starts as **manual paste** (you move work between tabs, the bus
tracks it). It graduates to **assisted**, then **auto** (a watcher fires it
unattended) — but only after it's proven reliable by hand. Never automate a
workflow that doesn't already work manually.

## OS routines
- **`bin/os board`** — full picture: in-flight tasks + agent roster + latest context.
- **`bin/os onboard`** — capture/refresh who you are, your priorities, your agents.
- **`bin/os audit`** — a 4Cs gap report: where is the OS strong vs. thin?

## Free auto-dispatch (the cheap, efficient tier)
- **`bin/agentwatch`** — a local watcher that polls the bus for tasks assigned to
  **free local agents** (`ollama`, `hermes`) and runs them on your local Ollama,
  writing results back automatically. **Zero API cost.** Paid agents
  (chatgpt/gemini) are deliberately left on manual relay.
  - One pass:  `bin/agentwatch`
  - Daemon:    `bin/agentwatch --loop --every 15`
  - Needs Ollama running locally (`ollama serve`); if it's down, tasks are
    *blocked with a reason*, never lost.

See `.claude/skills/os-*` for the talk-driven versions of the OS commands.
