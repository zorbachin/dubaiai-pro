"""
Daily Content Agent — "The Cinematic Character" Skill
Generates a 60-second short-form video script from today's top AI cinematography news.

Usage:
    python -m skills.daily_content_agent.agent
    python -m skills.daily_content_agent.agent --dry-run
"""

import argparse
import datetime
import json
import logging
import sys
from pathlib import Path

import anthropic

# Allow running from repo root
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from skills.shared.config import (
    ANTHROPIC_API_KEY,
    DEFAULT_MODEL,
    SCRIPTS_DIR,
    LOGS_DIR,
)
from skills.shared.ingestion import get_top_news
from skills.daily_content_agent.prompts import SYSTEM_PROMPT, build_user_prompt

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOGS_DIR / "daily_content_agent.log"),
    ],
)
log = logging.getLogger("daily_content_agent")


def run(dry_run: bool = False) -> dict:
    """
    Full pipeline: ingest → generate → save.
    Returns a dict with keys: date, script, output_path, news_items.
    """
    today = datetime.date.today().isoformat()
    log.info("Starting Daily Content Agent — %s", today)

    # ── 1. Ingest ──────────────────────────────────────────────────────────────
    log.info("Fetching top 3 news items...")
    news_items = get_top_news(n=3)
    log.info("Ingested %d items.", len(news_items))

    for i, item in enumerate(news_items, 1):
        log.info("  [%d] %s (%s)", i, item.title[:80], item.source)

    # ── 2. Build prompt ────────────────────────────────────────────────────────
    user_prompt = build_user_prompt(news_items)

    if dry_run:
        log.info("[DRY RUN] Skipping LLM call. Prompt:\n%s", user_prompt)
        return {"date": today, "script": "[dry run]", "news_items": news_items}

    # ── 3. Generate ────────────────────────────────────────────────────────────
    if not ANTHROPIC_API_KEY:
        raise EnvironmentError("ANTHROPIC_API_KEY is not set.")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    log.info("Calling %s for script generation...", DEFAULT_MODEL)

    # Use extended thinking for richer synthesis on the Opus model
    response = client.messages.create(
        model=DEFAULT_MODEL,
        max_tokens=1500,
        temperature=1,          # required when using extended thinking
        thinking={
            "type": "enabled",
            "budget_tokens": 5000,
        },
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    # Extract only the text block (ignore thinking blocks)
    script = next(
        (block.text for block in response.content if block.type == "text"),
        "",
    )
    log.info("Script generated. ~%d words.", len(script.split()))

    # ── 4. Save ────────────────────────────────────────────────────────────────
    SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = SCRIPTS_DIR / f"{today}_video_script.md"

    header = (
        f"# Daily Video Script — {today}\n\n"
        f"**Model:** {DEFAULT_MODEL}  \n"
        f"**Sources ingested:** {len(news_items)}\n\n"
        "---\n\n"
        "## Source News Items\n\n"
        + "\n".join(
            f"- **{item.title}** ({item.source})  \n  {item.summary[:200]}"
            for item in news_items
        )
        + "\n\n---\n\n"
        "## Generated Script\n\n"
    )

    output_path.write_text(header + script, encoding="utf-8")
    log.info("Script saved: %s", output_path)

    # ── 5. Emit structured result for downstream orchestration ─────────────────
    result = {
        "date": today,
        "script": script,
        "output_path": str(output_path),
        "news_items": [
            {"title": n.title, "source": n.source, "url": n.url}
            for n in news_items
        ],
        "model": DEFAULT_MODEL,
        "word_count": len(script.split()),
    }

    result_path = SCRIPTS_DIR / f"{today}_video_script_meta.json"
    result_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    return result


def main():
    parser = argparse.ArgumentParser(description="Daily Content Agent — Cinematic Character Skill")
    parser.add_argument("--dry-run", action="store_true", help="Skip LLM call, print prompt only")
    args = parser.parse_args()

    try:
        result = run(dry_run=args.dry_run)
        print("\n" + "=" * 60)
        print("DAILY VIDEO SCRIPT")
        print("=" * 60)
        print(result["script"])
        print("=" * 60)
        if not args.dry_run:
            print(f"\nSaved to: {result['output_path']}")
        sys.exit(0)
    except Exception as exc:
        log.exception("Daily Content Agent failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
