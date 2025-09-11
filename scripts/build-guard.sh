#!/usr/bin/env bash
set -euo pipefail

TARGET="dist"
PATTERNS=(
  "Authorization"
  "OPENROUTER"
  "api_key"
  "OPENAI_API_KEY"
)

if [ ! -d "$TARGET" ]; then
  echo "Guard: $TARGET not found. Run build first." >&2
  exit 1
fi

FOUND=0
for p in "${PATTERNS[@]}"; do
  if grep -RIl --binary-files=without-match -e "$p" "$TARGET" >/dev/null 2>&1; then
    echo "Guard: pattern found -> $p"
    FOUND=1
  fi
done

if [ $FOUND -ne 0 ]; then
  echo "Guard: Suspicious strings found in build output."
  exit 2
fi

echo "Guard: OK. No suspicious strings in $TARGET."
