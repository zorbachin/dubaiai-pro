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

### 🤖 Capture proactively — don't wait to be asked

The user wants you to remember useful things **automatically**. Throughout any
session, watch for these and capture them with `bin/nucleus push` *without being
prompted* (then mention in one short line that you saved it):

- **Decisions** — "let's go with X", "use the gold not the navy", "drop that
  section", a chosen approach or tradeoff.
- **Preferences & conventions** — how the user likes things done, tone, naming,
  tools, "always/never do X".
- **Facts about the project or user** — goals, deadlines, names, URLs,
  credentials-of-record (not secrets), audience, constraints.
- **Milestones** — a feature finished, a PR merged, a bug fixed, something
  shipped or deployed.
- **Open loops** — a "TODO later", something deferred, a known issue to revisit.

Rules of thumb:
- Capture the **signal**, not the chatter. One crisp line per item; summarize,
  don't transcribe.
- **Dedupe** — if it's already in the nucleus, update the relevant top section
  instead of pushing a duplicate handoff.
- Put durable, slowly-changing facts in the top sections (North Star, Active
  Threads, Decisions); put time-stamped events in handoffs via `push`.
- When in doubt about something borderline-private, ask before saving. Otherwise
  just save it and note it.
- Don't capture trivia, one-off calculations, or things the user is clearly just
  thinking out loud about.

This is the default behavior — the user should rarely need to say "remember
this," because you already did.

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
