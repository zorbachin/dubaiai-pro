# Reps in Peace

A faceless, animated workout tutorial channel. Two skeleton characters — **Coach Skully** (sarcastic drill sergeant) and **Trainee Bonesy** (anxious everyman) — teach real, science-backed strength programming. The conceit: they're already dead. They have nothing to lose. You, however, do.

## Style DNA

| Layer | Source |
|---|---|
| Character / voice | Pavel Tsatsouline (StrongFirst) + dark sarcasm |
| Programming / movement | Eric Leija (Primal Swoledier) — KB flow methodology |
| Hook structure | Athlean-X (you're doing it wrong) |
| Science citations | Andrew Huberman protocol language |
| Accessibility on-ramps | Hybrid Calisthenics |

Full bibles: [`style/character_bible.md`](style/character_bible.md), [`style/programming_bible.md`](style/programming_bible.md), [`style/visual_profile.md`](style/visual_profile.md).

---

## Repository layout

```
reps-in-peace/
├── style/
│   ├── character_bible.md     # Coach Skully + Bonesy voice + persona spec
│   ├── programming_bible.md   # Pavel+Leija methodology, rep schemes, week slate
│   └── visual_profile.md      # Color palette, lighting, character positioning
├── episodes/
│   └── 01_squat/
│       ├── script.md                # Full long-form script with re-hooks
│       ├── voice_recording_sheet.md # Read-aloud script for self-recording
│       ├── image_prompts.txt        # 20 image prompts, one per beat
│       ├── animation_prompts.txt    # 20 animation prompts, one per beat
│       ├── thumbnail.md             # Thumbnail prompt + text overlay spec
│       ├── shorts_cut.md            # 60-sec vertical cut script + reframe specs
│       └── distribution.md          # Per-platform posting playbook
├── scripts/
│   ├── build_episode.sh             # One-command full episode builder
│   ├── generate_clips.py            # Animation generation (Replicate/fal/LTX)
│   └── process_audio.sh             # Voice processing + final mix
├── assets/
│   ├── images/ep01/                 # Generated stills (you create here)
│   ├── clips/ep01/                  # Generated video clips
│   ├── audio/
│   │   ├── music/                   # Royalty-free background tracks
│   │   └── ep01/raw/                # Raw self-recorded voice takes
│   └── output/ep01/                 # Final episode + Shorts MP4
└── config/
```

---

## Production stack (Mac M4 Pro, free-first)

| Step | Tool | Cost | Notes |
|---|---|---|---|
| Image gen | **Draw Things** (Flux.1-schnell or SDXL-Lightning) | Free | Runs native on M4 Pro |
| Video gen | **LTX-Video** local (MLX) OR **Replicate** (CogVideoX-5b) | Free local / ~$0.04–0.20 per clip cloud | Replicate ~$1–3 per full episode |
| Voices | Self-recorded in GarageBand | Free | Processed via `scripts/process_audio.sh` |
| Captions | **Whisper** (`brew install whisper-cpp` or pip install) | Free | Runs fast on M4 Pro MPS |
| Editing | **DaVinci Resolve** for polish, terminal `ffmpeg` for batch | Free | Pipeline outputs auto-edited MP4 |
| Vertical reframe | `ffmpeg crop=ih*9/16:ih,scale=1080:1920` | Free | Or your existing Reframe tool |

Total per-episode cost: **$0–$3**.

---

## Day 1 — End-to-end workflow

```bash
# 0. One-time setup
brew install ffmpeg whisper-cpp python3
pip install replicate fal-client    # whichever video backend you use

# 1. Generate images (manual, in Draw Things)
#    Open episodes/01_squat/image_prompts.txt
#    Generate each beat → save as assets/images/ep01/beat_001.png ... beat_020.png

# 2. Record voices (manual, in GarageBand)
#    Open episodes/01_squat/voice_recording_sheet.md
#    Record each numbered line → export to assets/audio/ep01/raw/
#    Naming: ep01_001_coach.wav, ep01_002_bonesy.wav, etc.

# 3. Run the pipeline
export REPLICATE_API_TOKEN=...    # or FAL_KEY, or use LTX local
./scripts/build_episode.sh 01

# Output:
#   assets/output/ep01/episode_01_final.mp4    (long-form, captioned)
#   assets/output/ep01/episode_01_short.mp4    (vertical, 60s)
```

If you've already generated some assets:

```bash
./scripts/build_episode.sh 01 --skip-clips    # use existing clips
./scripts/build_episode.sh 01 --skip-audio    # use existing audio
```

---

## Week 1 publishing slate

| Day | Title | Movement |
|-----|-------|----------|
| MON | Squat Like You Mean It (Or Die Twice) | Goblet → Back Squat + Swing flow |
| TUE | The Press Will Humble You | KB Strict Press + Bench |
| WED | Swing Heavy or Don't Swing At All | Russian KB Swing + Snatch flow |
| THU | The Get-Up: One Rep, Five Lifetimes | Turkish Get-Up progression |
| FRI | Pull-Ups Are Free. Excuses Aren't. | Pull-Up + Renegade Row flow |
| SAT | Hinge or Be Hinged | RDL + KB Deadlift + Single-leg RDL |
| SUN | The Plank Is A Lift — Treat It Like One | Long-Lever Plank + Loaded Carries |

Day 1 ships first. Days 2–7 use the same templates — copy `episodes/01_squat/` to `episodes/02_press/`, update the script, prompts, and metadata.

---

## Signature CTA

Every episode ends with:

> **Coach:** "Now go get it. Sub-maximal. Stop one rep before you want to. Come back tomorrow — unless you'd rather end up like us."
>
> **Bonesy:** "I really don't recommend it."
