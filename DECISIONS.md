# Zorba OS — Architecture Decisions

## Stack
- **Frontend**: Vite + React, port 5173
- **Backend**: Express.js, port 3001
- **Communication**: REST API + WebSocket (ws library)
- **Persistence**: JSON file at data/data.json with 5 rolling backups
- **Modules**: ES modules throughout (package.json type:module)

## Key Decisions

### No TypeScript
Plain JS/JSX for speed of development and minimal toolchain.

### Inline styles only
No Tailwind, no CSS-in-JS libraries, no component libraries. All styles are inline or in the global body reset in index.html. This avoids build-time complexity and keeps the design token system explicit.

### Design tokens
- Background: #080808
- Panel background: #111111
- Border: #1a1a1a
- Accent: #f97316 (orange)
- Text primary: #e5e5e5
- Text muted: #555
- Font UI: IBM Plex Mono
- Font headlines: Playfair Display

### File persistence strategy
- Atomic writes: write to data.tmp.json, then fs.rename to data.json
- 5 rolling backups: data.backup.1.json ... data.backup.5.json
- chokidar watches data.json (ignores tmp file)
- WebSocket broadcasts data-updated event to all clients

### HTTP proxying
Node's built-in http/https modules only. No axios, no node-fetch.
Streaming proxied via pipe for Ollama and Anthropic.

### Health scores
Calculated on every render from live data — not persisted to data.json.
Formula: base 100, -20 if no task completed in 7 days, -10 per additional week, +10 if completed today.

### Timer state
Stored in data.activeTimers as { [taskId]: { startedAt, totalMs } }.
Only one timer active at a time (starting new stops previous).
On stop: appended to task.timeLogs.

### WebSocket reconnection
useData.js polls /api/load every 5s when WS disconnects.
Skips re-fetch if we just saved (lastSaveRef within 2s).

### Venture health dot
Green >= 70, Yellow 40-69, Red < 40.

### Command palette
Opens on Cmd+K, searches tasks + library + views, keyboard nav with arrow keys.

## Sprint 2 Decisions

### Google tokens stored separately from data.json
`data/tokens.json` is server-only and never sent to the frontend. Exporting/importing data.json never leaks OAuth credentials.

### OAuth popup window
Connect flow opens `/auth/google` in a popup and polls `/api/google/status` every 2s. Avoids a full-page redirect that would destroy app state.

### googleapis npm package
Official Google client handles token refresh and API versioning. Simpler than raw HTTP proxying for OAuth flows.

### Drive notes as Markdown
Notes pushed to Drive are `.md` files with title, venture, and timestamp. Drive renders Markdown previews natively.

## Sprint 3 Decisions

### Zapier: fire-and-forget
Webhook call in `markDone` uses `.catch(warn)` — failure never blocks the UI. Task is marked done regardless of webhook success.

### SendGrid cron: minute-level check
Cron runs every minute, checks `hours === briefingHours && minutes === briefingMinutes`. Simpler than computing cron expressions from user time strings.

### Substack: no write API
Substack has no public API for creating posts. Implementation formats output as Markdown and copies to clipboard. `/api/substack/format` is the extension point if an official API ships.

### WordPress: skipped
User is on Railway (not WordPress). `WORDPRESS_URL` slot reserved in .env but no routes implemented.
