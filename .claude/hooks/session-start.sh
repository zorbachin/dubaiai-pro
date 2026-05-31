#!/bin/bash
# SessionStart hook — always load the Context Nucleus into a fresh session.
# This is the "always checked for context" part: every new Claude Code session
# (startup, resume, clear, compact) gets the single source of truth injected.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

# Make `nucleus` runnable from anywhere in the session.
if ! grep -q 'nucleus' "${CLAUDE_ENV_FILE:-/dev/null}" 2>/dev/null; then
  echo "export PATH=\"$ROOT/bin:\$PATH\"" >> "${CLAUDE_ENV_FILE:-/dev/null}" 2>/dev/null || true
fi

# Ensure the nucleus exists, then emit it as SessionStart additionalContext.
python3 "$ROOT/bin/nucleus" init >/dev/null 2>&1 || true
python3 "$ROOT/bin/nucleus" load --hook
