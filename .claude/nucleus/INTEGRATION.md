# Wiring the Nucleus into a web app (e.g. http://localhost:3001/)

The nucleus is a local file. To let a running web app **read** and **write** it
from the browser, run the bridge and embed the widget. Works with any stack
(Next.js, Vite, plain HTML, Rails, etc.) — it's just a `<script>` tag + `fetch`.

## 1. Use ONE shared nucleus across all your apps

So this repo and the 3001 app share the *same* brain, point both at one path:

```bash
# add to your ~/.bashrc / ~/.zshrc
export NUCLEUS_HOME="$HOME/.claude/nucleus"
```

If `NUCLEUS_HOME` is unset, each repo uses its own `.claude/nucleus/` instead.

## 2. Start the bridge

```bash
nucleus serve            # http://localhost:4040
nucleus serve --port 5000
```

Endpoints (all CORS-enabled):

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | The **command center** (per-venture dashboard) |
| GET | `/command.json` | **Sync feed** for your command-center widget (see below) |
| GET | `/nucleus.json` | `{ markdown, brief, handoffs, state, branch, updated }` |
| GET | `/nucleus.md` | Raw markdown |
| GET | `/brief` | Catch-up digest (text) |
| GET | `/widget.js` | The embeddable widget |
| POST | `/push` | Body `{ "note": "...", "from": "localhost:3001" }` |

### The command-center sync feed — `/command.json`

This is what your existing 3001 command-center widget points at to **sync with
this workflow** (ventures, the live task board, the brain). It separates work
per project so one chat thread never blurs them:

```jsonc
{
  "north_star": "$1,000,000",
  "ventures": [                       // one entry per project, ordered by priority
    { "key": "ssa", "name": "sellsellingai", "emoji": "💰", "color": "#c8a45c",
      "open": [ { "id": "T001", "title": "...", "need": "...", "role": "ssa-ceo" } ],
      "done": 0 }
  ],
  "handoffs": [ { "when": "...", "source": "chat", "text": "..." } ],
  "totals": { "open": 18, "done": 1 },
  "branch": "main", "updated": "2026-..."
}
```

Tasks come straight from `agentbus` (`tasks.json`), grouped by venture; push
new context back with `POST /push`. So the widget renders the same board, brain,
and per-project separation you get in chat — one screen, live.

## 3. Drop it into the 3001 app — pick one

### A. One-line widget (zero code) — floating 🧠 panel
Add to the app's HTML (e.g. `app/layout.tsx`, `index.html`, `_document`):

```html
<script src="http://localhost:4040/widget.js"></script>
```

You get a corner button that shows live context and a box to push handoffs.
The `from` field is auto-set to the app's host (`localhost:3001`).

### B. Fetch it yourself (React/Next example)

```jsx
const [ctx, setCtx] = useState("");
useEffect(() => {
  fetch("http://localhost:4040/nucleus.json")
    .then(r => r.json()).then(d => setCtx(d.brief));
}, []);

function pushHandoff(note) {
  return fetch("http://localhost:4040/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note, from: "localhost:3001" }),
  });
}
```

### C. Server-side / Next API route (avoids CORS, hides the port)

```js
// app/api/nucleus/route.js
export async function GET() {
  const r = await fetch("http://localhost:4040/nucleus.json");
  return Response.json(await r.json());
}
```

## 4. Keep it running

Run `nucleus serve` alongside your dev server. To auto-start it with the app,
add it to your dev script, e.g.:

```json
{ "scripts": { "dev": "nucleus serve & next dev -p 3001" } }
```

> Note: the bridge serves your local nucleus file. Don't expose it to the
> public internet — it's meant for `localhost` / your trusted machine.
