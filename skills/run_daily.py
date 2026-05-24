"""
Daily Orchestrator — runs both agent skills in sequence.

The content agent runs first; its script is passed as context to the
newsletter agent for narrative coherence across both deliverables.

Usage:
    python skills/run_daily.py
    python skills/run_daily.py --dry-run
    python skills/run_daily.py --skip-script     # newsletter only
    python skills/run_daily.py --skip-newsletter # video script only
"""

import argparse
import datetime
import json
import logging
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from skills.shared.config import LOGS_DIR, OUTPUT_DIR
from skills.daily_content_agent.agent import run as run_content_agent
from skills.newsletter_agent.agent import run as run_newsletter_agent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOGS_DIR / "orchestrator.log"),
    ],
)
log = logging.getLogger("orchestrator")


def main():
    parser = argparse.ArgumentParser(description="DubaiAI Pro — Daily Skills Orchestrator")
    parser.add_argument("--dry-run",          action="store_true")
    parser.add_argument("--skip-script",      action="store_true", help="Skip content agent")
    parser.add_argument("--skip-newsletter",  action="store_true", help="Skip newsletter agent")
    args = parser.parse_args()

    today = datetime.date.today().isoformat()
    run_start = time.time()
    log.info("=== Daily Run Starting: %s ===", today)

    summary = {"date": today, "runs": {}}

    # ── Part 1: Daily Content Agent ────────────────────────────────────────────
    script_output_path = ""
    if not args.skip_script:
        log.info("--- [1/2] Daily Content Agent ---")
        try:
            result = run_content_agent(dry_run=args.dry_run)
            summary["runs"]["content_agent"] = {
                "status": "ok",
                "output_path": result.get("output_path", ""),
                "word_count": result.get("word_count", 0),
            }
            script_output_path = result.get("output_path", "")
            log.info("Content Agent complete. Output: %s", script_output_path)
        except Exception as exc:
            log.exception("Content Agent FAILED: %s", exc)
            summary["runs"]["content_agent"] = {"status": "error", "error": str(exc)}
    else:
        log.info("Skipping content agent (--skip-script)")

    # ── Part 2: Newsletter Agent ───────────────────────────────────────────────
    if not args.skip_newsletter:
        log.info("--- [2/2] Newsletter Agent ---")
        try:
            result = run_newsletter_agent(
                dry_run=args.dry_run,
                script_path=script_output_path,
            )
            summary["runs"]["newsletter_agent"] = {
                "status": "ok",
                "output_path": result.get("output_path", ""),
                "word_count": result.get("word_count", 0),
                "had_script_context": result.get("had_script_context", False),
            }
            log.info("Newsletter Agent complete. Output: %s", result.get("output_path"))
        except Exception as exc:
            log.exception("Newsletter Agent FAILED: %s", exc)
            summary["runs"]["newsletter_agent"] = {"status": "error", "error": str(exc)}
    else:
        log.info("Skipping newsletter agent (--skip-newsletter)")

    # ── Summary ────────────────────────────────────────────────────────────────
    elapsed = round(time.time() - run_start, 1)
    summary["elapsed_seconds"] = elapsed

    summary_path = OUTPUT_DIR / f"{today}_run_summary.json"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    log.info("=== Daily Run Complete: %ss ===", elapsed)
    log.info("Summary: %s", summary_path)

    # Exit non-zero if any agent failed (useful for cron alerting)
    if any(r.get("status") == "error" for r in summary["runs"].values()):
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
