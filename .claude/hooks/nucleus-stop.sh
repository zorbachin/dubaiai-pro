#!/bin/bash
# Stop hook — auto-handoff to the nucleus when Claude finishes responding.
# This keeps the "Live State" block current after every turn, so the next
# session (or surface) always inherits where things stand. Silent + idempotent.
#
# It also auto-commits ITS OWN churn: refreshing the live-state block changes
# only NUCLEUS.md's timestamp, which would otherwise leave the tree dirty and
# trip other "uncommitted changes" guards every turn. To stay non-intrusive it
# commits *only* when NUCLEUS.md is the single changed file — if you have other
# work in progress, it leaves everything alone. Opt out with NUCLEUS_NO_COMMIT=1.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
python3 "$ROOT/bin/nucleus" sync --quiet >/dev/null 2>&1 || true

if [ "${NUCLEUS_NO_COMMIT:-}" = "1" ]; then
  exit 0
fi

cd "$ROOT" || exit 0
NUCLEUS_REL=".claude/nucleus/NUCLEUS.md"

# Only act if the nucleus file is the ONLY thing changed (staged or unstaged).
changed="$(git status --porcelain 2>/dev/null || true)"
others="$(printf '%s\n' "$changed" | grep -v "$NUCLEUS_REL" | grep -v '^[[:space:]]*$' || true)"
if [ -n "$changed" ] && [ -z "$others" ]; then
  git add "$NUCLEUS_REL" >/dev/null 2>&1 || true
  git commit -q -m "chore: refresh nucleus live state [skip ci]" >/dev/null 2>&1 || true
fi
exit 0

