# Episode 01 — Shorts Cut (60 sec vertical)

## TITLE: The 1 Squat Cue Coaches Won't Tell You

## TARGET PLATFORMS
- YouTube Shorts
- TikTok
- Instagram Reels

## DURATION: 55–60 seconds

---

## SCRIPT

```
[0:00 — COACH, dead-to-camera, vertical close-up, crimson rim]
Ninety percent of you squat with your ego. Here's the cue that fixes it.

[0:05 — Bonesy mid-squat, knees caving, red X graphic]
Knees caving in. ACL prayer. They do not answer.

[0:10 — Coach demonstrates knees-out cue]
Drive your knees OUT. Spread the floor apart with the outside of your feet.

[0:16 — Anatomical X-ray knee tracking]
Knee over toe. Hip crease below kneecap. Three seconds down.

[0:23 — Coach at chalk wall, taps rep schemes]
Strength: 4 to 6 sets, 3 to 5 reps.
Size: 3 to 4 sets, 8 to 12 reps.
Frequency beats volume for most of you.

[0:35 — Coach goblet-to-swing flow]
Goblet squat into kettlebell swing. EMOM. Ten plus ten. Five rounds. That's athletic strength.

[0:46 — Bonesy strained]
I think something popped.

[0:48 — Coach deadpan]
That was the ego. Keep going.

[0:52 — End card: hero shot]
Go get it. Sub-maximal. Stop one rep before you want to. Don't end up like us.

[0:58 — Logo: REPS IN PEACE, single drop, barbell thud]
```

---

## VERTICAL REFRAME SPEC

When cutting from the long-form 16:9 → 9:16 (1080×1920):

### Crop rules
- Center-frame characters (Coach Skully always center)
- Crop to 9:16 aspect from the original 16:9
- For two-shots: cut between solo close-ups; do not try to fit both in vertical

### Caption placement
- Position 18% from bottom edge (above platform UI overlays)
- Font: Anton or Bebas Neue, 80pt
- Max 4 words per line, 2 lines visible at any time
- Pop-in animation: 0.1s fade-in + 5% scale-up on each new caption
- Highlight key words ("OUT", "DEPTH", "FREQUENCY") in crimson #B0152F

### Hook freeze-frame strategy
- First 0.8 seconds: hold on Coach's face (no motion) to bait the scroll-stop
- First sound is barbell thud — loud, percussive, attention-grabbing

### Loop seamlessly
- Final frame (logo) matches the energy of the first frame (Coach close-up)
- Algorithm rewards rewatches; loop-friendly = more views

---

## DISTRIBUTION VARIANTS

| Platform | File | Caption | Hashtags |
|----------|------|---------|----------|
| YouTube Shorts | `ep01_short.mp4` | "The 1 Squat Cue Coaches Won't Tell You" | #squat #gym #strengthtraining #kettlebell #StrongFirst |
| TikTok | Same file | "POV: you've been squatting wrong for 2 years 💀" | #gymtok #squat #fitness #strength |
| Instagram Reels | Same file | "Goblet → KB swing flow. Full breakdown on YouTube (link in bio)." | #squat #kettlebell #functionalstrength |

---

## FFMPEG REFRAME COMMAND

```bash
# 16:9 → 9:16 center-crop with caption-safe area
ffmpeg -i ep01_final.mp4 \
  -vf "crop=ih*9/16:ih,scale=1080:1920,setsar=1" \
  -t 60 \
  -c:v libx264 -preset slow -crf 18 \
  -c:a aac -b:a 192k \
  ep01_short.mp4
```
