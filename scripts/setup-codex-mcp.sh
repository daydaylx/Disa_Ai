#!/usr/bin/env bash
##
# Codex MCP Setup Script für Disa AI Projekt
#
# Dieses Skript richtet die empfohlenen MCP Server in Codex CLI ein.
# Hinweis: Die Einträge werden global in ~/.codex/config.toml gespeichert.
##

set -euo pipefail

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

ensure_codex() {
  if ! command -v codex >/dev/null 2>&1; then
    log_error "Codex CLI nicht gefunden. Installiere Codex zuerst und versuche es erneut."
    exit 1
  fi
}

server_exists() {
  local name="$1"
  codex mcp get "$name" >/dev/null 2>&1
}

ensure_server() {
  local name="$1"
  shift

  if server_exists "$name"; then
    log_success "Bereits konfiguriert: $name"
    return 0
  fi

  log_info "Füge MCP Server hinzu: $name"
  codex mcp add "$name" -- "$@"
  log_success "Hinzugefügt: $name"
}

ensure_server_with_env() {
  local name="$1"
  local env_kv="$2"
  shift 2

  if server_exists "$name"; then
    log_success "Bereits konfiguriert: $name"
    return 0
  fi

  log_info "Füge MCP Server hinzu: $name"
  codex mcp add "$name" --env "$env_kv" -- "$@"
  log_success "Hinzugefügt: $name"
}

# Banner
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Codex MCP Setup für Disa AI Projekt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ensure_codex

# Projekt-Root finden
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

log_info "Projekt-Root: $PROJECT_ROOT"
log_info "Codex Konfiguration: ~/.codex/config.toml"
echo ""

log_info "Welche MCP Server möchtest du für Codex einrichten?"
echo ""
echo "  [1] Minimal (filesystem, git) - Empfohlen für Start"
echo "  [2] Standard (+ playwright, sqlite, z-ai-vision) - Empfohlen"
echo "  [3] Vollständig (+ memory, fetch, optional github/brave-search)"
echo ""
read -p "Wähle eine Option (1-3): " -r INSTALL_OPTION
echo ""

MCP_SERVERS=()
case $INSTALL_OPTION in
  1)
    MCP_SERVERS=("filesystem" "git")
    ;;
  2)
    MCP_SERVERS=("filesystem" "git" "playwright" "sqlite" "z-ai-vision")
    ;;
  3)
    MCP_SERVERS=("filesystem" "git" "playwright" "sqlite" "z-ai-vision" "memory" "fetch" "github" "brave-search")
    ;;
  *)
    log_error "Ungültige Option"
    exit 1
    ;;
esac

log_info "Konfiguriere MCP Server..."
echo ""

for server in "${MCP_SERVERS[@]}"; do
  case $server in
    filesystem)
      ensure_server "disa-filesystem" npx -y @modelcontextprotocol/server-filesystem "$PROJECT_ROOT"
      ;;
    git)
      ensure_server "disa-git" npx -y @modelcontextprotocol/server-git --repository "$PROJECT_ROOT"
      ;;
    playwright)
      ensure_server "disa-playwright" npx -y @modelcontextprotocol/server-playwright
      ;;
    sqlite)
      ensure_server "disa-sqlite" npx -y @modelcontextprotocol/server-sqlite --db-path "$PROJECT_ROOT/sqlite_mcp_server.db"
      ;;
    z-ai-vision)
      ensure_server "disa-z-ai-vision" npx tsx "$PROJECT_ROOT/tools/zai-vision-mcp.ts"
      ;;
    memory)
      ensure_server "disa-memory" npx -y @modelcontextprotocol/server-memory
      ;;
    fetch)
      ensure_server "disa-fetch" npx -y @modelcontextprotocol/server-fetch
      ;;
    github)
      log_warning "GitHub MCP speichert den Token in ~/.codex/config.toml."
      if [[ -n "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]]; then
        ensure_server_with_env "disa-github" "GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN}" npx -y @modelcontextprotocol/server-github
      else
        read -rsp "GitHub Personal Access Token (repo, workflow, read:org): " GITHUB_TOKEN
        echo ""
        if [[ -n "${GITHUB_TOKEN:-}" ]]; then
          ensure_server_with_env "disa-github" "GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_TOKEN}" npx -y @modelcontextprotocol/server-github
        else
          log_warning "Kein Token gesetzt – überspringe disa-github."
        fi
      fi
      ;;
    brave-search)
      log_warning "Brave Search MCP speichert den API Key in ~/.codex/config.toml."
      if [[ -n "${BRAVE_API_KEY:-}" ]]; then
        ensure_server_with_env "disa-brave-search" "BRAVE_API_KEY=${BRAVE_API_KEY}" npx -y @modelcontextprotocol/server-brave-search
      else
        read -rsp "Brave Search API Key: " BRAVE_KEY
        echo ""
        if [[ -n "${BRAVE_KEY:-}" ]]; then
          ensure_server_with_env "disa-brave-search" "BRAVE_API_KEY=${BRAVE_KEY}" npx -y @modelcontextprotocol/server-brave-search
        else
          log_warning "Kein API Key gesetzt – überspringe disa-brave-search."
        fi
      fi
      ;;
  esac
done

echo ""
log_success "Codex MCP Setup abgeschlossen!"
log_info "Aktive Server prüfen mit: codex mcp list"
echo ""
