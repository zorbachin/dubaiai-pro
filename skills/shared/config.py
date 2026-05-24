"""
Shared configuration for DubaiAI Pro skills.
All secrets loaded from environment variables — never hardcode keys here.
"""

import os
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT_DIR       = Path(__file__).resolve().parents[2]
SKILLS_DIR     = ROOT_DIR / "skills"
OUTPUT_DIR     = ROOT_DIR / "output"
SCRIPTS_DIR    = OUTPUT_DIR / "scripts"
NEWSLETTERS_DIR = OUTPUT_DIR / "newsletters"
LOGS_DIR       = ROOT_DIR / "logs"

# ── API Keys ───────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
PERPLEXITY_API_KEY = os.environ.get("PERPLEXITY_API_KEY", "")   # optional: for live search
OPENAI_API_KEY    = os.environ.get("OPENAI_API_KEY", "")        # optional fallback

# ── Model Config ───────────────────────────────────────────────────────────────
DEFAULT_MODEL   = "claude-opus-4-7"          # most capable for long-form synthesis
FAST_MODEL      = "claude-haiku-4-5-20251001" # for lightweight tasks

# ── Sources tracked by the content agent ──────────────────────────────────────
TRACKED_SOURCES = [
    "Midjourney",
    "Runway AI",
    "ElevenLabs",
    "Kling AI",
    "Pika Labs",
    "Sora",
    "Stable Video Diffusion",
    "Luma Dream Machine",
    "Hailuo AI",
]

# ── Newsletter settings ────────────────────────────────────────────────────────
NEWSLETTER_BRAND = "DubaiAI Pro — Narrative Systems Intelligence"
NEWSLETTER_TAGLINE = "The operator's edge in AI-native filmmaking."
