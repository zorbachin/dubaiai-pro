---
name: repurpose
description: >
  Atomize ONE raw content pillar (a video transcript, voice-note, or brain-dump)
  into a full week of content across formats — clips, carousel, written posts,
  quote cards, meme, email — queued onto the content board in the user's voice.
  Use when the user says "repurpose this", "atomize", "turn this into content",
  "make posts from this", or hands over a raw pillar.
---

# repurpose — one pillar → a week of formats

This is the multiplier. One raw asset becomes 8–12 shippable pieces. Use full
Opus reasoning; quality + voice matter more than quantity.

## 0. Load voice
Read `.claude/os/references/voice-guide.md` and `content/BATCH-SYSTEM.md`.
Everything sounds like HIM (self-aware, Hormozi-human, "get your time back").

## 1. Mine the pillar
From the raw asset, extract:
- The **core claim / through-line**.
- The **3–5 strongest moments / lines** (verbatim hooks — keep his words).
- The **story / proof** beats.
- Which **venture(s)** it serves.

## 2. Atomize into formats (the output)
Produce, ready-to-ship, in his voice:
- 🎥 **1–3 short clips** — timestamp/quote the best 30–60s moments, hook-first.
- 🎠 **1 carousel** — slide-by-slide, slide 1 = scroll-stopper.
- ✍️ **2–3 written posts** — same idea, different hooks (subversive / math / confession).
- 💬 **3–5 quote cards** — one-liners that stand alone.
- 😂 **1 meme** — the funny/subversive angle.
- ✉️ **1 email/newsletter** angle.

## 3. Lay it across the week
Assign pieces to days (anchor Mon → repurposed Tue–Sun) so the theme compounds.
Don't dump it all on one day.

## 4. Queue + persist (close the loop)
- Append every piece to `.claude/os/content/` (a dated file) AND the rows of
  `content-board.md` with type + 💡 stage + venture.
- For each, add an `agentbus` task with an action tag so the cockpit can act, e.g.
  `agentbus add "Post: <piece>" --to <venture>-mktg --need "<caption> [copy:<caption text>]"`.
- Save the raw pillar in `.claude/os/content/` so it's never lost.
- Show 🧠 receipts.

## 5. Hand back caveman-warm
"Took 1 video → 11 pieces, scheduled across the week. Here's Monday's. First
action: post [X]." Lead with the next move, not the whole pile.

Remember: drafted ≠ done. **Posted = done.** The week only wins when it ships.
