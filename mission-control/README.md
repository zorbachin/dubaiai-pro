# Mission Control

A beautiful, dopamine-inducing operating system for managing Claude and your
AI agents. Hosted locally. Built with Next.js, Tailwind, and Framer Motion.

## Quick start

```bash
cd mission-control
npm install
cp .env.example .env.local        # then fill in keys + vault id
npm run dev
```

Open <http://localhost:3000>.

## Configure Claude

1. Get a key from <https://console.anthropic.com/settings/keys>
2. In `mission-control/.env.local`:

   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ANTHROPIC_MODEL=claude-opus-4-7
   ```

Each agent can override the model (`lib/mock.ts`). The chat route is in
`app/api/chat/route.ts` — extend it with tool use, memory, or your own
agent runtime.

## Configure your Obsidian vault

Mission Control auto-saves every chat, goal, and journal entry into a folder
called **Agentic OS** inside your vault.

```env
OBSIDIAN_VAULT_ID=62b5a36e14d1ceef
# Or override the path directly:
# OBSIDIAN_VAULT_PATH=/Users/you/Obsidian Vault
# Folder name (default: "Agentic OS"):
# OBSIDIAN_AGENTIC_OS_FOLDER=Agentic OS
```

The vault id is read from Obsidian's config file:

| Platform | Path                                                                  |
| -------- | --------------------------------------------------------------------- |
| macOS    | `~/Library/Application Support/obsidian/obsidian.json`                |
| Windows  | `%APPDATA%\obsidian\obsidian.json`                                    |
| Linux    | `~/.config/obsidian/obsidian.json`                                    |

The topbar shows a **Vault synced / Vault offline** badge — click it for
status and the exact folder being written to.

### Vault layout

```
<your vault>/
  Agentic OS/
    Chats/
      Orion/2026-05-24.md         ← one daily file per agent
      Vega/2026-05-24.md
    Goals.md                      ← single checkbox task list
    Journal/
      2026-05-24.md               ← one file per day
```

- **Chats** stream live from `/api/chat`; each turn (user + assistant) is
  appended with timestamps under `## HH:MM:SS · Name` headings.
- **Goals.md** is an Obsidian-native checkbox list (`- [ ] … ^goal-id`).
  Tick boxes in the app or in Obsidian — they stay in sync.
- **Journal** appends new entries to today's file under timestamped
  headings, so a day is a single readable narrative.

## Pages

- **Mission Control** (`/`) — KPI cards, agent constellation, live activity,
  fleet roster, system vitals.
- **Agents** (`/agents`) — Grid of clickable agents. Each one has a detail
  page (`/agents/[id]`) with editable system prompt, throughput, recent
  trail, and an embedded chat panel.
- **Chat** (`/chat`) — Real chat-app feel: message grouping, day separators,
  typing dots, streaming caret, copy + regenerate, stop button, starter
  prompts. Mic button dictates straight into the composer.
- **Goals** (`/goals`) — Checkbox list backed by `Goals.md`. Voice-enabled
  title and description.
- **Journal** (`/journal`) — Today's editor with title, mood, and a
  voice-enabled body. Past days are expandable.
- **Systems** (`/systems`) — Throughput, latency, queue depth, errors;
  per-agent telemetry; spend.
- **Activity** (`/logs`) — Real-time event stream across the fleet.

## Voice input

Every composer (chat, goal title + description, journal title + body) has
a mic button that uses the browser's built-in `SpeechRecognition` /
`webkitSpeechRecognition`. No API keys.

Works in Chrome, Edge, and Safari. Firefox doesn't ship the API by default,
so the button shows disabled with a hint.

## API surface

| Method  | Route                              | Purpose                              |
| ------- | ---------------------------------- | ------------------------------------ |
| POST    | `/api/chat`                        | Stream a Claude response (SSE)        |
| GET     | `/api/status`                      | Anthropic key configured?            |
| GET     | `/api/vault/status`                | Vault resolved and reachable?        |
| POST    | `/api/vault/chat`                  | Append a chat message to today's file |
| GET     | `/api/vault/goals`                 | List goals                            |
| POST    | `/api/vault/goals`                 | Add a goal                            |
| PATCH   | `/api/vault/goals`                 | Toggle a goal by id                   |
| DELETE  | `/api/vault/goals?id=…`            | Remove a goal                         |
| GET     | `/api/vault/journal`               | List days                             |
| GET     | `/api/vault/journal?date=YYYY-MM-DD` | Read a single day                   |
| POST    | `/api/vault/journal`               | Append an entry to today's file       |

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Framer Motion
- Anthropic SDK (`@anthropic-ai/sdk`)
- Lucide icons
- Web Speech API (browser native)
- Node `fs/promises` for vault sync
