"""
Premium Newsletter Agent — "Narrative Architecture Report" Skill
Generates the daily DubaiAI Pro premium newsletter.

Usage:
    python -m skills.newsletter_agent.agent
    python -m skills.newsletter_agent.agent --dry-run
    python -m skills.newsletter_agent.agent --with-script path/to/script.md
"""

import argparse
import datetime
import json
import logging
import sys
from pathlib import Path

import anthropic

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from skills.shared.config import (
    ANTHROPIC_API_KEY,
    DEFAULT_MODEL,
    NEWSLETTERS_DIR,
    SCRIPTS_DIR,
    LOGS_DIR,
    NEWSLETTER_BRAND,
    NEWSLETTER_TAGLINE,
)
from skills.shared.ingestion import get_top_news
from skills.newsletter_agent.prompts import SYSTEM_PROMPT, build_user_prompt

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOGS_DIR / "newsletter_agent.log"),
    ],
)
log = logging.getLogger("newsletter_agent")


def _load_script_context(today: str) -> str:
    """Try to load today's video script as narrative context."""
    script_path = SCRIPTS_DIR / f"{today}_video_script.md"
    if script_path.exists():
        log.info("Loading today's video script as context: %s", script_path)
        content = script_path.read_text(encoding="utf-8")
        # Extract just the Generated Script section
        if "## Generated Script" in content:
            return content.split("## Generated Script")[-1].strip()
        return content[:2000]
    log.info("No video script found for today — proceeding without script context.")
    return ""


def run(dry_run: bool = False, script_path: str = "") -> dict:
    """
    Full pipeline: ingest → load script context → generate → save.
    Returns a dict with keys: date, newsletter, output_path.
    """
    today = datetime.date.today().isoformat()
    log.info("Starting Newsletter Agent — %s", today)

    # ── 1. Ingest ──────────────────────────────────────────────────────────────
    log.info("Fetching top news items for newsletter synthesis...")
    news_items = get_top_news(n=5)   # newsletter needs more breadth than the script
    log.info("Ingested %d items.", len(news_items))

    # ── 2. Load script context ─────────────────────────────────────────────────
    if script_path:
        script_context = Path(script_path).read_text(encoding="utf-8")
    else:
        script_context = _load_script_context(today)

    # ── 3. Build prompt ────────────────────────────────────────────────────────
    user_prompt = build_user_prompt(news_items, script_context)

    if dry_run:
        log.info("[DRY RUN] Skipping LLM call.")
        log.info("System prompt:\n%s", SYSTEM_PROMPT[:500])
        log.info("User prompt:\n%s", user_prompt[:500])
        return {"date": today, "newsletter": "[dry run]", "news_items": news_items}

    # ── 4. Generate ────────────────────────────────────────────────────────────
    if not ANTHROPIC_API_KEY:
        raise EnvironmentError("ANTHROPIC_API_KEY is not set.")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    log.info("Calling %s for newsletter generation (extended thinking enabled)...", DEFAULT_MODEL)

    # Extended thinking is critical here — the newsletter requires synthesis
    # across multiple sources, capital reasoning, and workflow precision.
    response = client.messages.create(
        model=DEFAULT_MODEL,
        max_tokens=4000,
        temperature=1,      # required for extended thinking
        thinking={
            "type": "enabled",
            "budget_tokens": 8000,
        },
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    newsletter = next(
        (block.text for block in response.content if block.type == "text"),
        "",
    )
    log.info("Newsletter generated. ~%d words.", len(newsletter.split()))

    # ── 5. Save ────────────────────────────────────────────────────────────────
    NEWSLETTERS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = NEWSLETTERS_DIR / f"{today}_narrative_architecture_report.md"

    # Prepend branded header
    branded_header = (
        f"# {NEWSLETTER_BRAND}\n"
        f"### {NEWSLETTER_TAGLINE}\n"
        f"**{today}** — Daily Edition\n\n"
        "---\n\n"
    )

    output_path.write_text(branded_header + newsletter, encoding="utf-8")
    log.info("Newsletter saved: %s", output_path)

    # ── 6. Emit structured result ──────────────────────────────────────────────
    result = {
        "date": today,
        "newsletter": newsletter,
        "output_path": str(output_path),
        "news_items": [
            {"title": n.title, "source": n.source, "url": n.url}
            for n in news_items
        ],
        "model": DEFAULT_MODEL,
        "word_count": len(newsletter.split()),
        "had_script_context": bool(script_context),
    }

    meta_path = NEWSLETTERS_DIR / f"{today}_narrative_architecture_report_meta.json"
    meta_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    return result


def main():
    parser = argparse.ArgumentParser(description="Newsletter Agent — Narrative Architecture Report")
    parser.add_argument("--dry-run", action="store_true", help="Skip LLM call, print prompts only")
    parser.add_argument(
        "--with-script",
        metavar="PATH",
        default="",
        help="Path to a video script file to use as narrative context",
    )
    args = parser.parse_args()

    try:
        result = run(dry_run=args.dry_run, script_path=args.with_script)
        print("\n" + "=" * 70)
        print("NARRATIVE ARCHITECTURE REPORT")
        print("=" * 70)
        print(result["newsletter"])
        print("=" * 70)
        if not args.dry_run:
            print(f"\nSaved to: {result['output_path']}")
        sys.exit(0)
    except Exception as exc:
        log.exception("Newsletter Agent failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
