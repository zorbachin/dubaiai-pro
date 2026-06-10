# MAMADIO — Game Design

**Companion game to Iron Dome.** In Iron Dome you defend the sky; in Mamadio
you're on the ground in Tel Aviv, hustling for shekels between the sirens.

Single-file game (`mamadio/index.html`, inline CSS/JS, no build step) — same
convention as the rest of the repo. Playable at `dubaiai.pro/mamadio/` once on
`main`. Works with keyboard (WASD/arrows + E/Space) and mobile touch
(virtual joystick + action button).

## Core loop

1. The day starts: **500₪ of unemployment money** (Bituach Leumi) lands.
2. Roam the neighborhood doing silly quests, grabbing food deals (speed
   boosts) and renting Lime scooters to move faster.
3. At a random moment (every ~45–85s), **Home Front Command sounds the
   siren** — red banner, rising WebAudio wail, phone vibration — and the
   world flips into the **MAMAD DASH**: a Temple-Run-style side-scroller.
   You auto-run toward the shelter and have **16 seconds** to reach the
   mamad door. **Jump** (↑/Space/tap top) over street obstacles — old
   ladies, shopping carts, dogs, sunbeds — and **duck** (↓/S/hold bottom)
   under flying debris — pigeons, kites, matkot balls, the occasional
   airborne savta. Each hit stumbles you, kills your speed and knocks you
   back; the obstacle sets are themed per neighborhood.
   - Reach the door → 💥 boom outside, Iron Dome intercepts,
     **calm-under-fire bonus** (grows with your streak).
   - Timer runs out mid-dash → caught outside, the shockwave knocks
     **40% of your shekels** out of your pocket.
4. The day lasts 4 minutes (clock pauses during sirens). Final shekel count is
   your score; best scores persist in localStorage and unlock the next hood.

## Characters (pick one)

| | Perk |
|---|---|
| 🧔‍♂️ **Mendy the Chabadnik** | Can stop ANY pedestrian for a tefillin mini-game (mash to wrap the straps) → donations, doubled. Calm under fire: +4s siren grace. |
| 🧔🏽 **Kobi the Shop Owner** | 30% off all food & scooters, big edge in haggling rounds. |
| 💁‍♀️ **Noa the Influencer** | Selfie spots pay double, faster scooters, +10% on every payout (sponsored). |

## Levels

| Level | Unlock | Flavor & quests |
|---|---|---|
| 🏖️ **Gordon Beach** | free | Volleyball rally (timing bar), matkot shark, haggle the sunbed mafioso, sunset selfie spot. Miklats along the promenade. |
| 🎨 **Florentin** | 800₪ best day | Haggle a "vintage" (IKEA) lamp, graffiti commission (mash), vinyl crate-digging, street-cat rescue. Grid streets, shuk stalls. |
| 🌳 **The Old North** | 1600₪ best day | Walk 4 golden retrievers, landlord rent "negotiation", pop-up yoga demo, Bauhaus photo-op. Boulevard map, 28₪ lattes. |

## Quest mechanics (3 reusable mini-games)

- **Timing bar** — cursor sweeps, hit Space/tap in the green zone; zone shrinks
  and speeds up each hit; 2 misses = fail. (Volleyball, matkot, dogs, selfies,
  vinyl.)
- **Mash** — fill the meter before the timer with decay. (Tefillin, graffiti,
  cat rescue, yoga.)
- **Haggle** — best-of-3 social reads: the owner's mood gives a hint, pick the
  counter-line. **You stake ~25–35% of your shekels; win and it's doubled,
  lose and it's gone** (haggles can be retried, other failed quests are gone
  for the day).

## Economy knobs (tuning lives at the top of the JS)

`UNEMPLOYMENT=500` · `DAY_SECONDS=240` · `SIREN_WINDOW=[45,85]` ·
`SIREN_TIME=16` · `IMPACT_PENALTY=0.4` · scooter `20₪ / 1.8x / 25s` ·
food deals `15–32₪ / +25% speed / ~20–25s`.

## Future ideas (not built)

- Cross-promo: shared high-score wall with Iron Dome; surviving a day in
  Mamadio gives an Iron Dome battery skin.
- More hoods: Shuk HaCarmel (pickpocket dodging), Rothschild (e-scooter cop
  chases), Jaffa flea market (haggle boss-rush).
- Daily-run mode with a fixed seed and shareable score card (built-in
  virality: "I made 2,340₪ between sirens").
- Hebrew/English toggle; sound-off mode (miluim-friendly).
