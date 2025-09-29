#!/usr/bin/env bash
set -euo pipefail

echo "[i] Prüfe 'codex' Binaries/Links:"
command -v codex && type -a codex || echo "  - Kein 'codex' im PATH gefunden."

# 1) Paketmanager-Deinstallationen (best effort, leise wenn nicht vorhanden)
echo "[i] NPM/PNPM/Yarn (global) deinstallieren, falls vorhanden..."
if command -v npm >/dev/null 2>&1; then
  npm -g rm codex openai-codex codex-cli openai-codex-cli codex-agent 2>/dev/null || true
fi
if command -v pnpm >/dev/null 2>&1; then
  pnpm -g remove codex openai-codex codex-cli openai-codex-cli codex-agent 2>/dev/null || true
fi
if command -v yarn >/dev/null 2>&1; then
  yarn global remove codex openai-codex codex-cli openai-codex-cli codex-agent 2>/dev/null || true
fi

echo "[i] pipx/pip deinstallieren, falls vorhanden..."
if command -v pipx >/dev/null 2>&1; then
  pipx uninstall codex 2>/dev/null || true
  pipx uninstall openai-codex 2>/dev/null || true
  pipx uninstall codex-cli 2>/dev/null || true
fi
if command -v python3 >/dev/null 2>&1; then
  python3 -m pip uninstall -y codex openai-codex codex-cli 2>/dev/null || true
fi

echo "[i] Homebrew (falls genutzt)..."
if command -v brew >/dev/null 2>&1; then
  brew list --formula | grep -i '^codex$' >/dev/null 2>&1 && brew uninstall --force codex || true
fi

echo "[i] apt/dpkg (selten, aber zur Sicherheit)..."
if command -v dpkg >/dev/null 2>&1; then
  if dpkg -l | grep -i '^ii\s\+codex\s' >/dev/null 2>&1; then
    sudo apt purge -y codex || true
  fi
fi

# 2) Global installierte Node-Module-Verzeichnisse ausfegen (nur *codex*)
echo "[i] Node-Module-Pfade reinigen..."
for p in /usr/local/lib/node_modules ~/.node_modules ~/.config/yarn/global/node_modules ~/.local/share/pnpm/global/5; do
  [ -d "$p" ] && sudo find "$p" -maxdepth 1 -type d -iname "*codex*" -print -exec rm -rf {} + 2>/dev/null || true
done

# 3) Binärdatei(en) entfernen, wenn sie in typischen Verzeichnissen liegen
echo "[i] Binärdateien entfernen..."
if command -v codex >/dev/null 2>&1; then
  BIN="$(command -v codex || true)"
  case "$BIN" in
    /usr/local/bin/*|/usr/bin/*|~/.local/bin/*|/snap/bin/*)
      echo "  - Entferne $BIN"
      sudo rm -f "$BIN" 2>/dev/null || rm -f "$BIN" || true
      ;;
    *)
      echo "  - Überspringe ungewöhnlichen Pfad: $BIN (bitte manuell prüfen)."
      ;;
  esac
fi

# 4) User-Config/Cache/State (nur Ordner mit 'codex' im Namen)
echo "[i] User-Konfig/Cache säubern..."
for d in \
  "$HOME/.config/codex" \
  "$HOME/.cache/codex" \
  "$HOME/.local/share/codex" \
  "$HOME/.codex" \
  "$HOME/.config/openai-codex" \
  "$HOME/.cache/openai-codex" \
  "$HOME/.local/share/openai-codex"
do
  [ -e "$d" ] && { echo "  - rm -rf $d"; rm -rf "$d"; }
done

# 5) Projektnahe auth/config-Dateien, aber nur in Pfaden mit 'codex' im Namen
echo "[i] Suche und entferne auth/config in 'codex' Pfaden im HOME (max Tiefe 3)..."
find "$HOME" -maxdepth 3 -type f \( -iname "auth.json" -o -iname "config.json" -o -iname "settings.json" \) \
  -path "*codex*" -print -delete 2>/dev/null || true

# 6) Reste in PATH-Verzeichnissen mit Namensmuster
echo "[i] PATH-Verzeichnisse nach 'codex*' durchsuchen..."
IFS=':' read -r -a PP <<<"${PATH}"
for dir in "${PP[@]}"; do
  [ -d "$dir" ] || continue
  find "$dir" -maxdepth 1 -type f -iname "codex*" -print -exec bash -c 'f="$1"; case "$f" in */codex* ) sudo rm -f "$f" 2>/dev/null || rm -f "$f";; esac' _ {} \; 2>/dev/null || true
done

echo "[i] Fertig. Prüfe nochmals:"
if command -v codex >/dev/null 2>&1; then
  echo "[-] WARN: 'codex' ist noch im PATH: $(command -v codex)"
  echo "    Pfad bitte manuell prüfen und löschen."
else
  echo "[+] 'codex' ist nicht mehr im PATH."
fi
