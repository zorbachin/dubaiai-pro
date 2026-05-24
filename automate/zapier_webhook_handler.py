"""
Minimal Flask webhook endpoint — lets Zapier (or any HTTP trigger) fire
the daily run remotely, without exposing a cron server.

Deploy on any server or Render.com free tier.
POST /run-daily  →  runs both skills asynchronously, returns job ID.
GET  /status/<date>  →  returns today's run summary JSON.

Usage:
    ANTHROPIC_API_KEY=sk-... WEBHOOK_SECRET=your_secret python automate/zapier_webhook_handler.py
"""

import hashlib
import hmac
import json
import os
import subprocess
import sys
from pathlib import Path

from flask import Flask, abort, jsonify, request

app = Flask(__name__)

WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")
REPO_DIR = Path(__file__).resolve().parents[1]
PYTHON = sys.executable


def _verify_signature(req) -> bool:
    """HMAC-SHA256 signature check — used if WEBHOOK_SECRET is set."""
    if not WEBHOOK_SECRET:
        return True   # no secret configured → open (only use this on trusted networks)
    sig_header = req.headers.get("X-Signature", "")
    body = req.get_data()
    expected = hmac.new(
        WEBHOOK_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", sig_header)


@app.route("/run-daily", methods=["POST"])
def trigger_daily_run():
    if not _verify_signature(request):
        abort(401, "Invalid signature")

    body = request.get_json(silent=True) or {}
    flags = []
    if body.get("dry_run"):
        flags.append("--dry-run")
    if body.get("skip_script"):
        flags.append("--skip-script")
    if body.get("skip_newsletter"):
        flags.append("--skip-newsletter")

    cmd = [PYTHON, "skills/run_daily.py"] + flags

    # Fire and forget — respond immediately, let the job run in background
    proc = subprocess.Popen(
        cmd,
        cwd=str(REPO_DIR),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    return jsonify({"status": "started", "pid": proc.pid, "flags": flags}), 202


@app.route("/status/<date>", methods=["GET"])
def get_status(date: str):
    summary_path = REPO_DIR / "output" / f"{date}_run_summary.json"
    if not summary_path.exists():
        return jsonify({"error": "No summary found for this date"}), 404
    return jsonify(json.loads(summary_path.read_text()))


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
