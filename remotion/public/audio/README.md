# Audio assets

Drop two files here, then render with `--props='{"audio":true}'`:

- `voiceover.mp3` — full 2:00 VO at 30fps timing (see SCRIPT.md)
- `music.mp3` — 2:00 music bed; project handles the duck/silence at 1:50

If these files are missing and `audio` is `false` (default), the project
renders silently — useful for CI / preview.
