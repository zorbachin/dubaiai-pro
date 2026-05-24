#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# DubaiAI Pro — Cron / Automation Setup
# Run once to install the daily cron job.
# Assumes the repo is at ~/dubaiai-pro and Python 3.11+ is available.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
VENV_DIR="$REPO_DIR/.venv"
PYTHON="$VENV_DIR/bin/python"
LOG_FILE="$REPO_DIR/logs/cron.log"

echo "[setup] Repo: $REPO_DIR"

# 1. Create virtualenv if needed
if [ ! -f "$PYTHON" ]; then
  echo "[setup] Creating virtualenv..."
  python3 -m venv "$VENV_DIR"
fi

# 2. Install dependencies
echo "[setup] Installing dependencies..."
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet -r "$REPO_DIR/requirements.txt"

# 3. Load .env (verify it exists)
if [ ! -f "$REPO_DIR/.env" ]; then
  echo "[setup] ERROR: .env file not found. Copy .env.example to .env and add your keys."
  exit 1
fi

echo "[setup] .env found."

# 4. Install cron job — runs daily at 06:00 local time
CRON_CMD="0 6 * * * cd $REPO_DIR && source $VENV_DIR/bin/activate && set -a && source .env && set +a && $PYTHON skills/run_daily.py >> $LOG_FILE 2>&1"

# Check if cron entry already exists
if crontab -l 2>/dev/null | grep -qF "skills/run_daily.py"; then
  echo "[setup] Cron job already installed. No changes made."
else
  # Append to existing crontab
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
  echo "[setup] Cron job installed:"
  echo "  $CRON_CMD"
fi

echo ""
echo "─────────────────────────────────────────────────"
echo "  Setup complete. Daily run at 06:00 local time."
echo "  Test manually: python skills/run_daily.py --dry-run"
echo "─────────────────────────────────────────────────"
