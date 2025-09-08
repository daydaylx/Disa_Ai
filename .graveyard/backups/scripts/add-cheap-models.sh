#!/usr/bin/env bash
set -euo pipefail

JSON="public/persona.json"
[[ -f "$JSON" ]] || { echo "Fehlt: $JSON"; exit 1; }

# Modelle: sehr günstig/locker. Bei Bedarf ":free" suffix ergänzen.
MODELS='["qwen/qwen-2.5-7b-instruct","google/gemma-2-9b-it","openchat/openchat-3.5-1210"]'

command -v jq >/dev/null || { echo "jq fehlt (apt/brew install jq)"; exit 1; }

BACKUP="${JSON}.bak.$(date +%s)"
cp -f "$JSON" "$BACKUP"

TMP="$(mktemp)"
jq --argjson add "$MODELS" '
  .styles |= ( . // [] | map(
    .allow = ((.allow // []) + $add | unique)
  ))
' "$JSON" > "$TMP"

mv "$TMP" "$JSON"
echo "OK: aktualisiert. Backup -> $BACKUP"
# Kurzprüfung
jq -r '.styles[] | "\(.id): \(.allow|join(", "))"' "$JSON"
