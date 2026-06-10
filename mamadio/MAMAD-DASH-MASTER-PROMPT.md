# MAMAD DASH — Master Build Prompt

Copy everything below the line into any capable AI coding tool (Claude Code,
claude.ai, etc.) to generate the complete standalone game in one shot.
It spins the siren-runner sequence out of Mamadio into its own
infinitely-replayable arcade game.

---

You are building **MAMAD DASH**, a complete, standalone, mobile-first arcade
game. Deliver it as **ONE self-contained `index.html`** — inline CSS and JS,
zero external assets, zero dependencies, zero build step. All graphics are
emoji + canvas-drawn shapes; all audio is synthesized with WebAudio. The file
must run perfectly when opened directly in a browser and when hosted on any
static host.

## THE GAME IN ONE SENTENCE

The siren sounds over Tel Aviv and you sprint through the city — jumping over
old ladies and street clutter, ducking under pigeons and flying debris —
collecting shekels and racing from shelter to shelter, in an endless runner
that gets faster the longer you survive.

## TONE

Affectionate, absurd Tel Aviv satire. The danger is real-life-adjacent but the
treatment is cartoonish and warm — a love letter to a city that keeps its sense
of humor. Hebrew flavor everywhere ("Yalla!", "Tza'ad!", savta, matkot, sabich)
but the UI is English. Never gory, never grim.

## CORE LOOP (one run)

1. **RED ALERT** — flashing banner, rising synthesized siren wail, phone
   vibration. The run starts instantly.
2. The player **auto-runs right** through a side-scrolling Tel Aviv. Two
   inputs only:
   - **JUMP** — tap upper screen half / swipe up / ↑ / W / Space. Holding
     jump slightly extends air time (variable jump height).
   - **DUCK** — hold lower screen half / swipe down / ↓ / S. Sliding under
     things while holding duck.
3. **Obstacles** scroll in (full list below): ground obstacles need a jump,
   airborne obstacles need a duck. One hit = run over (with one-time saves,
   see power-ups), shown as a comic tumble, never anything dark.
4. **Shekels (₪)** float in arcs and lines — collect them. They are both score
   currency and the meta-currency for unlocks.
5. Every ~450m a **MAMAD checkpoint door** appears at street level. Passing it:
   screen-shake 💥 BOOM in the sky behind you (Iron Dome interception flash),
   +1 wave, speed tier increases, backdrop changes neighborhood, brief 1s
   breather, new siren wail. Checkpoints are the difficulty stairs.
6. Death screen: distance run, shekels banked, waves survived, best-distance
   comparison, one-tap **RUN AGAIN** (must be instant — under 1 second back
   into gameplay), and **SHARE** (Web Share API with a generated emoji
   scorecard, clipboard fallback).

## CONTROLS DETAIL

- Input must feel tight: jump buffering (~120ms) and coyote time (~80ms).
- Touch zones: top 55% jump, bottom 45% duck-hold. Also support swipe up/down
  anywhere. Keyboard: ↑/W/Space jump, ↓/S duck. No other controls.
- First run shows a 2-second non-blocking hint overlay, never again after.

## OBSTACLES (escalate by wave)

Ground (JUMP): 👵 savta with shopping cart (signature obstacle — most common),
🐕 off-leash dog, 🛒 runaway cart, ⛱️ fallen sunbed, 🛴 abandoned Lime,
🏖️ matkot player mid-swing, 📦 furniture from a Florentin sidewalk.
Air (DUCK): 🕊️ pigeon squadrons, 🪁 kite, 🏐 volleyball, 🛸 delivery drone,
☂️ flying umbrella, and rarely — the legendary **flying savta** 👵 (worth a
near-miss bonus if ducked cleanly).
Wave 4+: **combos** (ground-then-air requiring jump→land→duck), double
pigeons at two heights, savta convoys. Spawning must always be *fair*:
guarantee minimum reaction gaps scaled to current speed; never spawn an
impossible sequence. Use a seeded RNG so a "Daily Dash" mode (same seed for
everyone per calendar day, separate leaderboard line) is possible.

## COLLECTIBLES & POWER-UPS (float in the world, emoji-rendered)

- 🪙 Shekel — 1₪. Lines, arcs over obstacles (risk/reward placement).
- 💰 Money bag — 10₪, rare, placed in risky spots.
- 🛡️ **Iron Dome Bubble** — absorbs one hit (visible shield ring). The
  signature power-up; cross-promo with the Iron Dome game.
- 🛴 **Lime Boost** — 4s: faster, invincible, magnet pulls coins; cinematic
  lean-forward pose.
- 🧆 **Hummus Slow-Mo** — 3s of 0.6× world speed ("hummus coma"), everything
  easier; comedic chewing.
- 📿 **Second Wind** — single-use revive on death: a Chabadnik runs in, wraps
  tefillin, you get up. Once per run, very rare.

## CHARACTERS (cosmetic + one light perk; unlock with banked shekels)

- 💁‍♀️ **Noa the Influencer** (free starter) — +10% shekels ("sponsored").
- 🧔🏽 **Kobi the Shop Owner** (500₪) — power-ups last +1s.
- 🧔‍♂️ **Mendy the Chabadnik** (1,500₪) — starts every run with Second Wind.
- 🦸 **Iron Dome Operator** (5,000₪) — starts with a Shield Bubble.
Banked shekels and unlocks persist in localStorage.

## WORLD & ART DIRECTION

Side-view, three parallax layers: (1) gradient sky with drifting interception
trails and distant booms during alert, (2) building silhouettes per
neighborhood, (3) street with scrolling lane marks. Neighborhood rotation per
checkpoint: **Beach promenade → Florentin (graffiti tones) → Old North
boulevards (trees) → Shuk HaCarmel (awnings) → repeat at night versions.**
Red alert wash pulses subtly during waves; cool teal calm flashes at
checkpoints. Player has a 2-frame run bob, squash on duck, rotation on tumble.
Target 60fps on a mid-range phone: pool all entities, cap devicePixelRatio
at 2, no allocations in the game loop, single rAF loop with delta-time
clamping.

## AUDIO (all WebAudio-synthesized, mute toggle persisted)

Rising/falling siren (sine + slow LFO), interception boom (filtered noise
burst), coin blips (pentatonic ascending while combo holds), jump/duck
whooshes, power-up jingles, a tense minimal bassline that speeds up with the
wave tier. Audio context unlocks on first interaction (iOS-safe).

## SCORING & RETENTION

- Score = meters + shekels×5 + near-miss bonuses (+25 for clearing an
  obstacle within a tight margin, with a "CHUTZPAH!" popup).
- Combo meter: consecutive obstacles cleared without damage scales coin value
  ×1→×5; visible streak flame.
- Persist (localStorage): best distance, best score, total shekels banked,
  characters owned, mute, daily-dash best + date.
- Death messages rotate through deadpan one-liners ("The savta shows no
  mercy.", "Ducked too late. The pigeon union sends regards.").

## SCREENS

Title (logo, PLAY, DAILY DASH, character select strip, best score), Game,
Pause (auto on visibility change), Death/Results, all styled: dark
ink-blue base `#10141f`, alert red `#e63946`, gold `#ffd166`, teal `#2a9d8f`.
Mobile-first layout: `viewport-fit=cover`, safe-area-inset padding on all HUD,
no text smaller than 13px, everything thumb-reachable, works portrait AND
landscape, no scrolling, no zoom.

## ACCEPTANCE CHECKLIST (verify every item before declaring done)

1. Opens from a double-clicked local file with no console errors.
2. Playable start-to-death-to-restart entirely with one thumb on a phone.
3. Variable jump, coyote time, and buffering all functional.
4. No unfair spawn possible at any speed tier (prove the gap math in a code
   comment — the only comment style allowed: constraints, not narration).
5. 60fps with 50+ pooled entities on screen.
6. Daily Dash produces identical obstacle sequences for the same date.
7. Share button produces a paste-ready emoji scorecard.
8. All persistence survives reload. Mute persists.
9. File under 95KB.

Build the complete game now. Output the single `index.html` only.
