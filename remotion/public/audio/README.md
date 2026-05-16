# Audio assets

Drop the right files here and render with `--props='{"audio":true}'`.

## For the "Five AI Things" 2:00 video
- `voiceover.mp3` — full 2:00 VO at 30fps timing (see `../SCRIPT.md`)
- `music.mp3` — 2:00 music bed; project handles the duck/silence at 1:50

## For the buildyourbot.io 1:00 promo
- `promo-voiceover.mp3` — 1:00 VO (see `../PROMO_SCRIPT.md`)
- `promo-music.mp3` — 1:00 music bed; ducks under CTA at 0:52, swells at 0:58

If audio files are missing and `audio` is `false` (default), the project
renders silently — useful for CI / preview.
