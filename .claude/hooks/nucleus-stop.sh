#!/bin/bash
# Stop hook — auto-handoff to the nucleus when Claude finishes responding.
# This keeps the "Live State" block current after every turn, so the next
# session (or surface) always inherits where things stand. Silent + idempotent.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
python3 "$ROOT/bin/nucleus" sync --quiet >/dev/null 2>&1 || true
exit 0
