#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
files=$(grep -RIl --include='*.ts' --include='*.tsx' 'React\.' src || true)
patched=()
for f in $files; do
  # schon importiert?
  if grep -Eq '^\s*import\s+React\s+from\s+["'\'']react["'\'']' "$f"; then
    continue
  fi
  # import einfügen als erste Code-Zeile (hinter evtl. // oder /* headern lassen wir es simpel)
  sed -i '1i import React from "react";' "$f"
  patched+=("$f")
done
printf 'Patched %d files:\n' "${#patched[@]}"
printf '%s\n' "${patched[@]}"
