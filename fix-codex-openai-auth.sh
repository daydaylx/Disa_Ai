#!/usr/bin/env bash
set -Eeuo pipefail

log()  { printf '\033[1;36m[INFO]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[WARN]\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31m[ERR]\033[0m %s\n'  "$*" >&2; }

# 1) Environment entgiften (aktuelle Shell)
log "Unsetting temporäre Env-Variablen für OpenAI/OpenRouter/Proxies..."
unset OPENAI_API_KEY OPENROUTER_API_KEY OPENAI_BASE_URL OPENAI_API_BASE HTTP_PROXY HTTPS_PROXY || true

# 2) Keys/BASE_URL in Shell-RCs deaktivieren (zsh + bash), mit Backup
backup_suffix=".$(date +%Y%m%d-%H%M%S).bak"
patch_rc() {
  local rc="$1"
  [ -f "$rc" ] || return 0
  cp -a "$rc" "$rc$backup_suffix"
  sed -i \
    -e 's/^\s*export\s\+OPENAI_API_KEY=.*$/# DISABLED_BY_FIX: &/' \
    -e 's/^\s*export\s\+OPENROUTER_API_KEY=.*$/# DISABLED_BY_FIX: &/' \
    -e 's/^\s*export\s\+OPENAI_BASE_URL=.*$/# DISABLED_BY_FIX: &/' \
    -e 's/^\s*export\s\+OPENAI_API_BASE=.*$/# DISABLED_BY_FIX: &/' \
    -e 's/^\s*export\s\+HTTP_PROXY=.*$/# DISABLED_BY_FIX: &/' \
    -e 's/^\s*export\s\+HTTPS_PROXY=.*$/# DISABLED_BY_FIX: &/' \
    "$rc"
  log "Gesäubert und gesichert: $rc (Backup: $rc$backup_suffix)"
}
patch_rc "$HOME/.zshrc"
patch_rc "$HOME/.bashrc"
patch_rc "$HOME/.profile"  # falls dort gesetzt

# 3) Codex: Backup & Purge
if [ -d "$HOME/.codex" ]; then
  mv "$HOME/.codex" "$HOME/.codex.bak$backup_suffix"
  log "Backup von ~/.codex -> ~/.codex.bak$backup_suffix"
fi
sudo npm uninstall -g @openai/codex >/dev/null 2>&1 || true
sudo rm -f /usr/local/bin/codex /usr/bin/codex "$HOME/.local/bin/codex" 2>/dev/null || true

# 4) Frisch installieren
log "Installiere Codex CLI frisch (npm -g)..."
sudo npm install -g @openai/codex

# 5) Minimal-konservative ~/.codex/config.toml schreiben
log "Schreibe saubere ~/.codex/config.toml ..."
mkdir -p "$HOME/.codex"
cat > "$HOME/.codex/config.toml" <<'TOML'
# Codex wird per ChatGPT-Login genutzt (keine API-Keys).
# Offizielle Config-Location: ~/.codex/config.toml

approval_policy = "on-request"     # Nachfrage vor Aktionen
sandbox_mode    = "workspace-write"
model_reasoning_effort = "high"

[shell_environment_policy]
include_only = ["PATH","HOME"]

[tools]
web_search = true                  # OpenAI Websuche-Tool aktiv

[profiles.paranoid]
approval_policy = "untrusted"
sandbox_mode    = "read-only"
TOML
chmod 600 "$HOME/.codex/config.toml"

# 6) Final: Logout-Safety, dann interaktiver ChatGPT-Login
log "Starte sicheren Login-Fluss ..."
codex logout >/dev/null 2>&1 || true
log "Öffne jetzt 'codex login' (Sign in with ChatGPT). Folge dem Browser-Flow."
codex login

# 7) Kurztest
log "Versionstest:"
codex --version
log "Sanity-Test (kein API-Key nötig, da ChatGPT-Auth):"
codex "Gib drei kurze Prüfpunkte aus, um die Umgebung zu testen."
log "Fertig. Wenn der Login erfolgreich war, läuft Codex jetzt über OpenAI-Auth."
