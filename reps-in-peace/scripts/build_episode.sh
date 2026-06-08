#!/usr/bin/env bash
# Reps in Peace — Episode builder
# One command, full episode: stitches clips + audio + captions into a finished MP4.
#
# Usage: ./scripts/build_episode.sh <episode_id> [--skip-images] [--skip-clips] [--skip-audio]
# Example: ./scripts/build_episode.sh 01

set -euo pipefail

EP="${1:-01}"
shift || true
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

SKIP_IMAGES=0
SKIP_CLIPS=0
SKIP_AUDIO=0
for arg in "$@"; do
  case "$arg" in
    --skip-images) SKIP_IMAGES=1 ;;
    --skip-clips) SKIP_CLIPS=1 ;;
    --skip-audio) SKIP_AUDIO=1 ;;
  esac
done

EP_DIR=$(ls -d "$ROOT/episodes/${EP}_"* 2>/dev/null | head -1)
if [ -z "$EP_DIR" ]; then
  echo "No episode directory found for ID $EP" >&2
  exit 1
fi

CLIPS_DIR="$ROOT/assets/clips/ep${EP}"
AUDIO_DIR="$ROOT/assets/audio/ep${EP}"
OUT_DIR="$ROOT/assets/output/ep${EP}"
mkdir -p "$OUT_DIR"

# --- 0. Images --------------------------------------------------------------
if [ "$SKIP_IMAGES" -eq 0 ]; then
  echo "==> [0/5] Generating beat images (OpenAI)"
  python3 "$ROOT/scripts/generate_images.py" --ep "$EP" --model "${RIP_IMG_MODEL:-gpt-image-1}" || {
    echo "Image generation failed. Use --skip-images if images already exist." >&2
    exit 1
  }
fi

# --- 1. Clips ---------------------------------------------------------------
if [ "$SKIP_CLIPS" -eq 0 ]; then
  echo "==> [1/5] Generating video clips"
  python3 "$ROOT/scripts/generate_clips.py" --ep "$EP" --backend "${RIP_BACKEND:-replicate}" || {
    echo "Clip generation failed. Use --skip-clips if clips already exist." >&2
    exit 1
  }
fi

# --- 2. Audio ---------------------------------------------------------------
if [ "$SKIP_AUDIO" -eq 0 ]; then
  echo "==> [2/5] Processing audio"
  bash "$ROOT/scripts/process_audio.sh" "$EP"
fi

# --- 3. Assemble video timeline --------------------------------------------
echo "==> [3/5] Assembling video timeline"
CLIP_LIST="$OUT_DIR/clip_list.txt"
: > "$CLIP_LIST"
for clip in $(ls "$CLIPS_DIR"/clip_*.mp4 2>/dev/null | sort); do
  echo "file '$clip'" >> "$CLIP_LIST"
done

if [ ! -s "$CLIP_LIST" ]; then
  echo "No clips found in $CLIPS_DIR" >&2
  exit 1
fi

ffmpeg -y -loglevel warning -f concat -safe 0 -i "$CLIP_LIST" -c copy "$OUT_DIR/video_silent.mp4"

# --- 4. Mux audio over video -----------------------------------------------
echo "==> [4/5] Mixing audio onto video"
ffmpeg -y -loglevel warning \
  -i "$OUT_DIR/video_silent.mp4" \
  -i "$AUDIO_DIR/final_mix.wav" \
  -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  "$OUT_DIR/episode_${EP}_pre_caption.mp4"

# --- 5. Captions (Whisper) --------------------------------------------------
echo "==> [5/5] Generating captions"
if command -v whisper >/dev/null 2>&1; then
  whisper "$AUDIO_DIR/final_mix.wav" \
    --model medium \
    --output_format srt \
    --output_dir "$OUT_DIR" \
    --task transcribe \
    --language en \
    >/dev/null 2>&1

  SRT="$OUT_DIR/final_mix.srt"
  ffmpeg -y -loglevel warning \
    -i "$OUT_DIR/episode_${EP}_pre_caption.mp4" \
    -vf "subtitles=$SRT:force_style='Fontname=Anton,Fontsize=42,PrimaryColour=&HE8F1F5&,OutlineColour=&H000000&,Outline=3,Shadow=2,Alignment=2,MarginV=80'" \
    -c:a copy \
    "$OUT_DIR/episode_${EP}_final.mp4"
else
  echo "  whisper not installed — skipping captions. Install with: brew install whisper-cpp"
  cp "$OUT_DIR/episode_${EP}_pre_caption.mp4" "$OUT_DIR/episode_${EP}_final.mp4"
fi

# --- 6. Vertical shorts cut -------------------------------------------------
echo "==> Generating Shorts cut (vertical, 60s)"
ffmpeg -y -loglevel warning \
  -i "$OUT_DIR/episode_${EP}_final.mp4" \
  -t 60 \
  -vf "crop=ih*9/16:ih,scale=1080:1920,setsar=1" \
  -c:v libx264 -preset slow -crf 20 \
  -c:a aac -b:a 192k \
  "$OUT_DIR/episode_${EP}_short.mp4"

echo ""
echo "✅ Episode $EP built."
echo "   Long-form: $OUT_DIR/episode_${EP}_final.mp4"
echo "   Shorts:    $OUT_DIR/episode_${EP}_short.mp4"
