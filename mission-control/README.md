# Mission Control

A beautiful, dopamine-inducing operating system for managing Claude and your
AI agents. Hosted locally. Built with Next.js, Tailwind, and Framer Motion.

## Quick start

```bash
cd mission-control
npm install
cp .env.example .env.local        # then add your ANTHROPIC_API_KEY
npm run dev
```

Open <http://localhost:3000>.

## Wiring it up to your Claude

1. Grab a key from <https://console.anthropic.com/settings/keys>
2. Put it in `mission-control/.env.local`:

   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ANTHROPIC_MODEL=claude-opus-4-7
   ```

3. Restart the dev server. The Chat page streams from the Anthropic API
   via `/api/chat`. Each agent can use a different model and system prompt.

## What's inside

- **Mission Control** (`/`) — KPI cards, agent constellation, live activity,
  fleet roster, system vitals.
- **Agents** (`/agents`) — Manage your fleet. Each agent has its own role,
  persona, system prompt, model, and stats.
- **Chat** (`/chat`) — Talk directly to any agent. Streams from Claude.
- **Systems** (`/systems`) — Live throughput, latency, queue depth,
  per-agent telemetry, and spend.
- **Activity** (`/logs`) — Real-time stream of every action across the fleet.

## Make it yours

- Agents are defined in `lib/mock.ts`. Edit the array to add your own —
  give them new emoji, hues, models, and system prompts.
- Colors live in `app/globals.css` under `@theme`.
- The chat route is in `app/api/chat/route.ts` — extend it with tool use,
  memory, or your own agent runtime.

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Framer Motion
- Anthropic SDK (`@anthropic-ai/sdk`)
- Lucide icons
