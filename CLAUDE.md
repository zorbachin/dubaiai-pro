# DubaiAI.pro

Premium landing page for a Dubai-based AI consultancy. Single-file site
(`index.html`, inline CSS/JS, no build step), hosted on GitHub Pages via
`CNAME` → dubaiai.pro.

---

## 🧠 Context Nucleus — talk to it, don't run it

This repo has a **Context Nucleus**: one file, `.claude/nucleus/NUCLEUS.md`,
that is the single source of truth for everything the user is doing across
Claude chats, Cowork, code, and design. It loads automatically at the start of
every session.

**The user prefers to manage it by conversation — not commands.** So:

- When the user says **"remember this"**, **"save this"**, **"note that…"**,
  **"add to context"**, or states a decision worth keeping → run
  `bin/nucleus push "<concise summary>" --from <chat|cowork|code|design>`.
  Confirm in one line what you saved.

- When the user says **"what's my context?"**, **"catch me up"**, **"where were
  we?"**, or **"what do I have going on?"** → run `bin/nucleus brief` (quick) or
  `bin/nucleus pull` (full) and summarize it back to them.

- When the user makes a lasting decision or finishes a meaningful chunk of work,
  proactively offer to capture it to the nucleus (or just capture it and say so).

- The top sections of `NUCLEUS.md` (North Star, Active Threads, Decisions) can
  be edited directly for durable facts. **Never** edit inside the
  `<!-- HANDOFFS -->` or `<!-- AUTOSTATE -->` markers — those are managed by the
  tooling.

The goal: the user should be able to jump between any Claude surface and just
*talk*, and their context follows them. They never have to run a command
themselves — you do it for them.

### Quick reference (`bin/nucleus`)
- `push "<note>" --from <surface>` — save a handoff
- `brief` — catch-up digest  ·  `pull` — full nucleus  ·  `status` — one-liner
- `serve` — optional web bridge + widget for non-Claude apps (e.g. localhost:3001)

Full docs: `.claude/nucleus/README.md` and `.claude/nucleus/INTEGRATION.md`.
