#!/usr/bin/env python3
"""
Reps in Peace — Image generator (OpenAI).

Reads image_prompts.txt for an episode, calls OpenAI's image API
(gpt-image-1 by default), and writes the resulting PNGs into
assets/images/ep<ID>/.

Usage:
    export OPENAI_API_KEY=sk-...
    python scripts/generate_images.py --ep 01
    python scripts/generate_images.py --ep 01 --model gpt-image-1
    python scripts/generate_images.py --ep 01 --only 001,003,020
    python scripts/generate_images.py --ep 01 --dry-run

Models:
    gpt-image-1  — newest, best for stylized art + text-in-image (title card)
    dall-e-3     — fallback, lower cost
"""

from __future__ import annotations

import argparse
import base64
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def parse_prompts(prompts_path: Path) -> list[tuple[str, str]]:
    """Parse image_prompts.txt into [(beat_id, prompt_text), ...]."""
    if not prompts_path.exists():
        sys.exit(f"Prompts file not found: {prompts_path}")

    text = prompts_path.read_text()
    pattern = re.compile(r"\[BEAT (\d+)[^\]]*\]\s*\n(.+?)(?=\n\[BEAT |\Z)", re.DOTALL)
    matches = pattern.findall(text)
    return [(beat_id, prompt.strip()) for beat_id, prompt in matches]


def generate_one(client, model: str, prompt: str, out_path: Path, size: str) -> None:
    """Call OpenAI image API and save the PNG."""
    out_path.parent.mkdir(parents=True, exist_ok=True)

    kwargs: dict = {"model": model, "prompt": prompt, "size": size, "n": 1}

    if model == "gpt-image-1":
        kwargs["quality"] = "high"
    elif model == "dall-e-3":
        kwargs["quality"] = "hd"
        kwargs["style"] = "vivid"

    response = client.images.generate(**kwargs)
    data = response.data[0]

    if getattr(data, "b64_json", None):
        out_path.write_bytes(base64.b64decode(data.b64_json))
    elif getattr(data, "url", None):
        import urllib.request

        urllib.request.urlretrieve(data.url, out_path)
    else:
        raise RuntimeError("No image data in response.")

    print(f"  saved: {out_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate stills for an episode via OpenAI.")
    parser.add_argument("--ep", required=True, help="Episode id, e.g. 01")
    parser.add_argument(
        "--model",
        default="gpt-image-1",
        choices=["gpt-image-1", "dall-e-3"],
    )
    parser.add_argument(
        "--size",
        default="1536x1024",
        help="Output size. gpt-image-1: 1024x1024 | 1024x1536 | 1536x1024 | auto. "
        "dall-e-3: 1024x1024 | 1024x1792 | 1792x1024",
    )
    parser.add_argument("--only", type=str, default=None, help="Comma-separated beat IDs to render (e.g. 001,004)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    matches = list(ROOT.glob(f"episodes/{args.ep}_*"))
    if not matches:
        sys.exit(f"No episode directory found for ID {args.ep}")
    ep_dir = matches[0]

    prompts = parse_prompts(ep_dir / "image_prompts.txt")
    print(f"Found {len(prompts)} prompts for episode {args.ep}.")

    images_dir = ROOT / "assets" / "images" / f"ep{args.ep}"
    images_dir.mkdir(parents=True, exist_ok=True)

    if not args.dry_run:
        try:
            from openai import OpenAI
        except ImportError:
            sys.exit("Install the OpenAI SDK: pip install openai")

        if not os.environ.get("OPENAI_API_KEY"):
            sys.exit("Set OPENAI_API_KEY environment variable.")

        client = OpenAI()
    else:
        client = None

    only = set(args.only.split(",")) if args.only else None

    for beat_id, prompt in prompts:
        if only and beat_id not in only:
            continue

        out_path = images_dir / f"beat_{beat_id}.png"
        if out_path.exists():
            print(f"  skip (exists): {out_path.name}")
            continue

        print(f"==> Beat {beat_id} ({args.model}, {args.size})")
        print(f"     prompt: {prompt[:90]}{'...' if len(prompt) > 90 else ''}")

        if args.dry_run:
            continue

        for attempt in range(3):
            try:
                generate_one(client, args.model, prompt, out_path, args.size)
                break
            except Exception as e:
                wait = 2 ** (attempt + 1)
                print(f"  attempt {attempt + 1} failed: {e}. retrying in {wait}s")
                time.sleep(wait)
        else:
            print(f"  giving up on beat {beat_id}")


if __name__ == "__main__":
    main()
