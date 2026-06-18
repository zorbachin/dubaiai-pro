#!/usr/bin/env python3
"""
Reps in Peace — Clip generator.

Reads animation_prompts.txt for an episode, calls a video-generation backend
(Replicate by default, fal.ai or local LTX as alternatives), and writes the
resulting clips into assets/clips/ep<ID>/.

Usage:
    python scripts/generate_clips.py --ep 01
    python scripts/generate_clips.py --ep 01 --backend replicate
    python scripts/generate_clips.py --ep 01 --dry-run

Backends:
    replicate  — cloud, ~$0.04–0.20/clip, needs REPLICATE_API_TOKEN
    fal        — cloud, similar pricing, needs FAL_KEY
    ltx-local  — local Mac M4 Pro via MLX (requires separate install)
    dry-run    — print the calls without executing
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def parse_prompts(prompts_path: Path) -> list[tuple[str, str]]:
    """Parse animation_prompts.txt into [(beat_id, prompt_text), ...]."""
    if not prompts_path.exists():
        sys.exit(f"Prompts file not found: {prompts_path}")

    text = prompts_path.read_text()
    pattern = re.compile(r"\[ANIM (\d+)[^\]]*\]\s*\n(.+?)(?=\n\[ANIM |\Z)", re.DOTALL)
    matches = pattern.findall(text)
    return [(beat_id, prompt.strip()) for beat_id, prompt in matches]


def run_replicate(prompt: str, image_path: Path | None, out_path: Path) -> None:
    try:
        import replicate
    except ImportError:
        sys.exit("Install the replicate client: pip install replicate")

    if not os.environ.get("REPLICATE_API_TOKEN"):
        sys.exit("Set REPLICATE_API_TOKEN environment variable.")

    model = "lucataco/cogvideox-5b:8d6b3ce3a3f5d1bb7e9c7e3f6e1e3a8a"
    inputs: dict = {"prompt": prompt, "num_frames": 96, "fps": 24}
    if image_path and image_path.exists():
        inputs["image"] = open(image_path, "rb")

    output = replicate.run(model, input=inputs)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    import urllib.request

    urllib.request.urlretrieve(output, out_path)
    print(f"  saved: {out_path}")


def run_fal(prompt: str, image_path: Path | None, out_path: Path) -> None:
    try:
        import fal_client
    except ImportError:
        sys.exit("Install the fal client: pip install fal-client")

    if not os.environ.get("FAL_KEY"):
        sys.exit("Set FAL_KEY environment variable.")

    handler = fal_client.submit(
        "fal-ai/ltx-video",
        arguments={
            "prompt": prompt,
            "num_inference_steps": 40,
            "guidance_scale": 3.0,
        },
    )
    result = handler.get()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    import urllib.request

    urllib.request.urlretrieve(result["video"]["url"], out_path)
    print(f"  saved: {out_path}")


def run_ltx_local(prompt: str, image_path: Path | None, out_path: Path) -> None:
    print(f"  [ltx-local stub] would generate {out_path.name} from prompt + image")
    print(f"     Image: {image_path}")
    print("     Install LTX-Video MLX build and wire this function to your local pipeline.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate animation clips for an episode.")
    parser.add_argument("--ep", required=True, help="Episode id, e.g. 01")
    parser.add_argument(
        "--backend",
        default="replicate",
        choices=["replicate", "fal", "ltx-local", "dry-run"],
    )
    parser.add_argument("--only", type=str, default=None, help="Comma-separated beat IDs to render (e.g. 001,004)")
    args = parser.parse_args()

    ep_dir = ROOT / "episodes" / f"{args.ep}_squat"  # naming convention: <id>_<slug>
    matches = list(ROOT.glob(f"episodes/{args.ep}_*"))
    if matches:
        ep_dir = matches[0]

    prompts = parse_prompts(ep_dir / "animation_prompts.txt")
    print(f"Found {len(prompts)} animation prompts for episode {args.ep}.")

    clips_dir = ROOT / "assets" / "clips" / f"ep{args.ep}"
    clips_dir.mkdir(parents=True, exist_ok=True)
    images_dir = ROOT / "assets" / "images" / f"ep{args.ep}"

    only = set(args.only.split(",")) if args.only else None

    for beat_id, prompt in prompts:
        if only and beat_id not in only:
            continue

        image_path = images_dir / f"beat_{beat_id}.png"
        out_path = clips_dir / f"clip_{beat_id}.mp4"

        if out_path.exists():
            print(f"  skip (exists): {out_path.name}")
            continue

        print(f"==> Beat {beat_id} ({args.backend})")
        print(f"     prompt: {prompt[:80]}{'...' if len(prompt) > 80 else ''}")

        if args.backend == "dry-run":
            continue
        if args.backend == "replicate":
            run_replicate(prompt, image_path, out_path)
        elif args.backend == "fal":
            run_fal(prompt, image_path, out_path)
        elif args.backend == "ltx-local":
            run_ltx_local(prompt, image_path, out_path)


if __name__ == "__main__":
    main()
