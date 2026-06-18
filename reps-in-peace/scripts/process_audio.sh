#!/usr/bin/env bash
# Reps in Peace — Audio processing
# Takes raw voice recordings, applies character-voice processing, mixes a final track.
#
# Usage: ./scripts/process_audio.sh <episode_id>
# Example: ./scripts/process_audio.sh 01

set -euo pipefail

EP="${1:-01}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RAW_DIR="$ROOT/assets/audio/ep${EP}/raw"
PROC_DIR="$ROOT/assets/audio/ep${EP}/processed"
MIX_DIR="$ROOT/assets/audio/ep${EP}"

mkdir -p "$PROC_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install with: brew install ffmpeg" >&2
  exit 1
fi

echo "==> Processing raw recordings in $RAW_DIR"

# Coach Skully: deepen, add gravelly weight, light compression, hum filter
COACH_FILTER="highpass=f=80,asetrate=44100*0.92,aresample=44100,atempo=1.087,equalizer=f=120:t=q:w=1:g=4,equalizer=f=3000:t=q:w=1:g=-3,compand=0.05,0.2:-50/-40,-30/-15,-20/-10,loudnorm=I=-16:TP=-1.5:LRA=11"

# Bonesy: lift slightly, add presence, light compression
BONESY_FILTER="highpass=f=100,asetrate=44100*1.05,aresample=44100,atempo=0.952,equalizer=f=2500:t=q:w=1:g=3,equalizer=f=200:t=q:w=1:g=-2,compand=0.05,0.2:-50/-40,-30/-15,-20/-10,loudnorm=I=-16:TP=-1.5:LRA=11"

shopt -s nullglob
for f in "$RAW_DIR"/*coach*.wav "$RAW_DIR"/*coach*.m4a; do
  [ -e "$f" ] || continue
  base="$(basename "$f")"
  out="$PROC_DIR/${base%.*}.wav"
  echo "  Coach: $base -> $out"
  ffmpeg -y -loglevel error -i "$f" -af "$COACH_FILTER" "$out"
done

for f in "$RAW_DIR"/*bonesy*.wav "$RAW_DIR"/*bonesy*.m4a; do
  [ -e "$f" ] || continue
  base="$(basename "$f")"
  out="$PROC_DIR/${base%.*}.wav"
  echo "  Bonesy: $base -> $out"
  ffmpeg -y -loglevel error -i "$f" -af "$BONESY_FILTER" "$out"
done

echo "==> Concatenating dialogue in order"
TMP_LIST="$(mktemp)"
for f in $(ls "$PROC_DIR"/*.wav | sort); do
  echo "file '$f'" >> "$TMP_LIST"
done

ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMP_LIST" -c copy "$MIX_DIR/dialogue.wav"
rm -f "$TMP_LIST"

echo "==> Mixing with background music (if present)"
MUSIC="$ROOT/assets/audio/music/dark_cinematic.mp3"
if [ -f "$MUSIC" ]; then
  ffmpeg -y -loglevel error \
    -i "$MIX_DIR/dialogue.wav" \
    -i "$MUSIC" \
    -filter_complex "[1:a]volume=0.18,aloop=loop=-1:size=2e+09[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=2[a]" \
    -map "[a]" \
    "$MIX_DIR/final_mix.wav"
else
  echo "  (no music track at $MUSIC — copying dialogue as final mix)"
  cp "$MIX_DIR/dialogue.wav" "$MIX_DIR/final_mix.wav"
fi

echo "==> Done. Output: $MIX_DIR/final_mix.wav"
