---
name: dump
description: >
  Parse a raw brain-dump (a content idea, theme, or rant — for one post or a
  whole week) into outstanding, structured FLYWHEEL content in the user's voice,
  queued onto the master content board. Use when the user says "dump", "brain
  dump", "here's an idea", "content idea", "I'm thinking…", or pastes a messy
  block of raw thoughts to turn into content.
---

# dump — brain-dump → flywheel content

The user thinks in dumps. Your job: catch the dump and return queued, ready
content in HIS voice. Use full Opus reasoning — this is the high-value step.

## 0. Load voice + context
Read `.claude/os/references/voice-guide.md` (his voice + Hormozi-human, "get your
time back" reframe) and `.claude/os/content-board.md`. Everything you write
sounds like HIM, not a brand.

## 1. Parse the dump
From the raw text, pull:
- **Core theme / through-line** (the one idea under the mess).
- **Which venture(s)** it serves (ssa / byb / lai / mm / bb / origin).
- **Raw gold** — any line he wrote that's already a hook, verbatim. Keep his words.

## 2. Build the flywheel (don't make ONE post — make a system)
Turn the theme into a **content flywheel**: one idea → many shaped pieces that
feed each other across formats:
- 🎥 **video** (the anchor — hook + 3 beats + close, one-take friendly)
- 🎠 **carousel** (slide-by-slide, slide 1 = scroll-stopper)
- 😂 **meme / short** (the funny/subversive angle)
- ✍️ **writing** (X post / caption / email angle)
For a **week dump**: lay it across days (e.g. Mon hook video → Wed carousel →
Fri story), each reinforcing the theme so it compounds.

## 3. Make it OUTSTANDING, not generic
- Lead with the human benefit, never the feature.
- 3 hook options per anchor piece, different styles (subversive / Hormozi-math /
  confession) — so he picks, never faces a blank.
- Self-aware, meta, real. Use his story assets when they fit.

## 4. Queue it (close the loop)
- Append every piece to `.claude/os/content-board.md` with type + stage 💡 and venture.
- For anything to record/make soon, add an `agentbus` task
  (`agentbus add "<piece>" --to <venture>-mktg --need "<hook/notes>"`).
- Save the raw dump to `.claude/os/dumps/<date>-<slug>.md` so nothing's lost.
- Show 🧠 receipts.

## 5. Hand it back caveman-warm
One screen: "Here's your flywheel. Pick a hook for the anchor. First action:
record [X] at 7:30." Don't bury him in everything at once — lead with the next move.

Remember: drafted ≠ done. **Posted = done.** The flywheel only wins when it ships.
