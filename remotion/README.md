# Remotion video projects

Two end-to-end programmatic videos in a single project:

1. **"5 AI Things You're Too Scared To Try"** — 2:00 cinematic short (9:16 + 16:9)
2. **buildyourbot.io promo** — 0:60 YouTube ad (16:9 + 9:16). See `PROMO_SCRIPT.md`.

## What's in the box

- **10 scenes** (hook → setup → 5 items with re-hooks → CTA), animated with `spring` / `interpolate`.
- **Procedural cinematic backgrounds** (animated gradients, light-leak overlays, SVG film grain, vignette) — no external footage required to render.
- **Phone mockup, chat bubbles, typewriter, before/after head, fridge top-down, calendar stamp** — all drawn in code, so renders are reproducible and editable.
- **Whip-pan flash transitions** at every scene boundary.
- **Caption/subtitle overlays** with highlighted words for retention.
- **Audio is opt-in** — drop `voiceover.mp3` and `music.mp3` into `public/audio/`, then render with `--props='{"audio":true}'`. Music duck/silence at 1:50 is wired in code.

## Run it

```bash
cd remotion
npm install
npm run dev          # opens Remotion Studio at http://localhost:3000
```

## Render

```bash
# vertical 1080×1920, silent (default)
npx remotion render Video out/video.mp4

# with audio (drop files in public/audio first)
npx remotion render Video out/video.mp4 --props='{"audio":true}'

# 16:9 landscape variant
npx remotion render VideoLandscape out/video-landscape.mp4 --props='{"audio":true}'

# poster frame
npx remotion still Video out/thumb.png --frame=15

# buildyourbot.io 60s YouTube promo (16:9)
npx remotion render Promo out/buildyourbot-promo.mp4
npx remotion render Promo out/buildyourbot-promo.mp4 --props='{"audio":true}'

# 9:16 short version for Shorts / Reels / TikTok
npx remotion render PromoShort out/buildyourbot-promo-short.mp4
```

## Files

```
remotion/
├── src/
│   ├── Root.tsx              compositions (9:16 + 16:9)
│   ├── Video.tsx             timeline, transitions, audio wiring
│   ├── theme.ts              colors, fonts, FPS
│   ├── components/           Caption, Numeral, ChatBubble, PhoneFrame,
│   │                         Typewriter, CinematicBg, Grain, Vignette
│   └── scenes/               10 scenes (hook → CTA)
├── public/audio/             drop voiceover.mp3 + music.mp3 here
├── SCRIPT.md                 VO script with frame-accurate timecodes
└── remotion.config.ts        render settings (h264, yuv420p)
```

## Scene timing (30fps · 3600 frames total)

| # | Scene        | In   | Out  | Frames     |
|---|--------------|------|------|------------|
| 1 | Hook         | 0:00 | 0:05 | 0 → 150    |
| 2 | Setup        | 0:05 | 0:12 | 150 → 360  |
| 3 | #1 Awkward   | 0:12 | 0:32 | 360 → 960  |
| 4 | Re-hook 1    | 0:32 | 0:38 | 960 → 1140 |
| 5 | #2 Therapist | 0:38 | 0:55 | 1140 → 1650|
| 6 | #3 Photos    | 0:55 | 1:12 | 1650 → 2160|
| 7 | Re-hook 2    | 1:12 | 1:18 | 2160 → 2340|
| 8 | #4 Fridge    | 1:18 | 1:35 | 2340 → 2850|
| 9 | #5 Dumb Q    | 1:35 | 1:50 | 2850 → 3300|
|10 | CTA          | 1:50 | 2:00 | 3300 → 3600|

## Swap procedural visuals for real footage

Each scene wraps `<CinematicBg />` as the backdrop. Replace it with
`<Video src={staticFile('broll/scene1.mp4')} />` (or `<Img>` for stills) to
drop in real footage. Drop assets in `public/broll/` and `public/images/`.
