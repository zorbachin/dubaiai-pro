# 🧠 Context Nucleus

One brain for everything you do with Claude. No more re-explaining yourself
when you jump between a **chat**, **Cowork**, **Claude Code**, and **design**.

There is exactly **one** source of truth: [`NUCLEUS.md`](./NUCLEUS.md).
Every surface hands off context **to** it; every new session reads context
**from** it.

---

## How it runs itself

Wired in [`.claude/settings.json`](../settings.json):

| When | Hook | What happens |
|------|------|--------------|
| A Claude Code session **starts / resumes / clears / compacts** | `SessionStart` → `nucleus load --hook` | The whole nucleus is injected into the model's context automatically. This is the *"always checked for context"* guarantee. |
| Claude **finishes a turn** | `Stop` → `nucleus sync --quiet` | A fresh handoff (branch, commits, working tree) is written back to the nucleus. The *"autohandoff"* part. |

You don't have to do anything for code sessions — it's automatic.

## Feeding context in from the *other* surfaces

The non-code surfaces (a Claude.ai chat, Cowork, a design session) can't run
your hooks, so they hand off through the tiny `nucleus` CLI. From a terminal in
this repo:

```bash
# Capture something you just decided anywhere:
nucleus push "Hero CTA is 'Get Early Access'; brand gold #C8A45C" --from chat
nucleus push "New mobile hero layout done in Figma, needs 2-line headline" --from design

# Pull the whole brain to paste into a fresh chat / Cowork / design prompt:
nucleus pull            # full nucleus
nucleus brief           # just the catch-me-up digest (latest handoff + state)
```

> Tip: at the top of any new chat, paste the output of `nucleus brief` and the
> new session instantly has your context. When that chat decides something,
> `nucleus push` it back so code sessions inherit it too.

## Plug it into a web app (e.g. localhost:3001)

Run the bridge and embed one line:

```bash
nucleus serve                                   # http://localhost:4040
```
```html
<script src="http://localhost:4040/widget.js"></script>
```

That gives the app a floating 🧠 panel with live context + a push box. Full
guide (Next.js/React/API examples, shared nucleus across apps) →
[`INTEGRATION.md`](./INTEGRATION.md).

## All commands

```
nucleus                 short status (default)
nucleus brief           "catch me up" digest for a fresh session
nucleus pull            print the entire nucleus (copy/paste anywhere)
nucleus push "<note>"   add a handoff   (--from chat|cowork|code|design|...)
nucleus sync            refresh the live git-state block
nucleus status          one-screen summary
nucleus init            create the nucleus if missing
nucleus edit            print the nucleus file path
```

## Editing by hand

The top sections — **North Star**, **Active Threads**, **Decisions &
Conventions** — are yours to curate. Everything between the
`<!-- ... -->` markers (Handoffs, Live State) is managed by the tooling, so
don't edit inside those.

## Make `nucleus` available everywhere

The SessionStart hook adds `bin/` to your PATH for Claude Code sessions. For
your own shell, add this once:

```bash
echo 'export PATH="'"$PWD"'/bin:$PATH"' >> ~/.bashrc   # or ~/.zshrc
```
