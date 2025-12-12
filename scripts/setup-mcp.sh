#!/bin/bash
##
# MCP Setup Script für Disa AI Projekt
#
# Dieses Skript hilft beim Einrichten der empfohlenen MCP Server
# für Claude Desktop.
##

set -euo pipefail

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktionen
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

# Banner
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MCP Setup für Disa AI Projekt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Projekt-Root finden
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLAUDE_DIR="$PROJECT_ROOT/.claude"
MCP_CONFIG="$CLAUDE_DIR/mcp_config_recommendation.json"

log_info "Projekt-Root: $PROJECT_ROOT"
log_info "Claude-Config-Verzeichnis: $CLAUDE_DIR"
echo ""

# Schritt 1: Betriebssystem erkennen
log_info "Betriebssystem wird erkannt..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CLAUDE_CONFIG_DIR="$HOME/.config/Claude"
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
    OS="macOS"
else
    log_error "Nicht unterstütztes Betriebssystem: $OSTYPE"
    exit 1
fi
log_success "Betriebssystem: $OS"
echo ""

# Schritt 2: Claude Desktop Config Pfad prüfen
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
log_info "Claude Desktop Config Pfad: $CLAUDE_CONFIG_FILE"

if [[ ! -d "$CLAUDE_CONFIG_DIR" ]]; then
    log_warning "Claude Desktop Config-Verzeichnis existiert nicht"
    read -p "Soll es erstellt werden? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mkdir -p "$CLAUDE_CONFIG_DIR"
        log_success "Verzeichnis erstellt: $CLAUDE_CONFIG_DIR"
    else
        log_error "Setup abgebrochen"
        exit 1
    fi
fi
echo ""

# Schritt 3: Backup der bestehenden Config
if [[ -f "$CLAUDE_CONFIG_FILE" ]]; then
    BACKUP_FILE="$CLAUDE_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    log_info "Backup der bestehenden Config wird erstellt..."
    cp "$CLAUDE_CONFIG_FILE" "$BACKUP_FILE"
    log_success "Backup erstellt: $BACKUP_FILE"
else
    log_warning "Keine bestehende Claude Desktop Config gefunden"
fi
echo ""

# Schritt 4: MCP Server Installation Options
log_info "Welche MCP Server möchtest du installieren?"
echo ""
echo "  [1] Minimal (filesystem, git, github) - Empfohlen für Start"
echo "  [2] Standard (+ brave-search, playwright, memory) - Empfohlen"
echo "  [3] Vollständig (alle empfohlenen MCPs)"
echo "  [4] Benutzerdefiniert"
echo "  [5] Nur Config-Datei kopieren (manuelle Installation)"
echo ""
read -p "Wähle eine Option (1-5): " -r INSTALL_OPTION
echo ""

# Schritt 5: Installation basierend auf Auswahl
case $INSTALL_OPTION in
    1)
        log_info "Minimale Installation wird vorbereitet..."
        MCP_SERVERS=("filesystem" "git" "github")
        ;;
    2)
        log_info "Standard-Installation wird vorbereitet..."
        MCP_SERVERS=("filesystem" "git" "github" "brave-search" "playwright" "memory")
        ;;
    3)
        log_info "Vollständige Installation wird vorbereitet..."
        MCP_SERVERS=("filesystem" "git" "github" "brave-search" "playwright" "memory" "sqlite" "fetch")
        ;;
    4)
        log_info "Benutzerdefinierte Installation..."
        log_warning "Diese Option ist noch nicht implementiert"
        log_info "Verwende Option [5] und bearbeite die Config manuell"
        exit 0
        ;;
    5)
        log_info "Nur Config-Datei wird kopiert..."
        cp "$MCP_CONFIG" "$CLAUDE_CONFIG_FILE"
        log_success "Config kopiert nach: $CLAUDE_CONFIG_FILE"
        log_warning "Bitte bearbeite die Datei manuell und trage deine API-Keys ein"
        exit 0
        ;;
    *)
        log_error "Ungültige Option"
        exit 1
        ;;
esac
echo ""

# Schritt 6: API Keys abfragen
declare -A API_KEYS

if [[ " ${MCP_SERVERS[@]} " =~ " github " ]]; then
    log_info "GitHub Personal Access Token benötigt"
    echo "  Erstelle einen Token unter: https://github.com/settings/tokens"
    echo "  Scopes: repo, workflow, read:org"
    read -sp "GitHub Token (wird nicht angezeigt): " GITHUB_TOKEN
    echo
    API_KEYS["GITHUB_PERSONAL_ACCESS_TOKEN"]="$GITHUB_TOKEN"
    echo ""
fi

if [[ " ${MCP_SERVERS[@]} " =~ " brave-search " ]]; then
    log_info "Brave Search API Key benötigt"
    echo "  Registriere dich unter: https://brave.com/search/api/"
    read -sp "Brave API Key (wird nicht angezeigt): " BRAVE_KEY
    echo
    API_KEYS["BRAVE_API_KEY"]="$BRAVE_KEY"
    echo ""
fi

# Schritt 7: Config generieren
log_info "Claude Desktop Config wird generiert..."
CONFIG_JSON='{
  "mcpServers": {'

FIRST=true
for server in "${MCP_SERVERS[@]}"; do
    if [[ "$FIRST" == false ]]; then
        CONFIG_JSON+=","
    fi
    FIRST=false

    case $server in
        filesystem)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-filesystem\", \"$PROJECT_ROOT\"]
    }"
            ;;
        git)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-git\", \"--repository\", \"$PROJECT_ROOT\"]
    }"
            ;;
        github)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-github\"],
      \"env\": {
        \"GITHUB_PERSONAL_ACCESS_TOKEN\": \"${API_KEYS[GITHUB_PERSONAL_ACCESS_TOKEN]:-YOUR_TOKEN_HERE}\"
      }
    }"
            ;;
        brave-search)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-brave-search\"],
      \"env\": {
        \"BRAVE_API_KEY\": \"${API_KEYS[BRAVE_API_KEY]:-YOUR_KEY_HERE}\"
      }
    }"
            ;;
        playwright)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-playwright\"]
    }"
            ;;
        memory)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-memory\"]
    }"
            ;;
        sqlite)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-sqlite\", \"--db-path\", \"$PROJECT_ROOT/sqlite_mcp_server.db\"]
    }"
            ;;
        fetch)
            CONFIG_JSON+="
    \"$server\": {
      \"command\": \"npx\",
      \"args\": [\"-y\", \"@modelcontextprotocol/server-fetch\"]
    }"
            ;;
    esac
done

CONFIG_JSON+='
  }
}'

echo "$CONFIG_JSON" > "$CLAUDE_CONFIG_FILE"
log_success "Config gespeichert: $CLAUDE_CONFIG_FILE"
echo ""

# Schritt 8: Zusammenfassung
log_success "MCP Setup abgeschlossen!"
echo ""
log_info "Installierte MCP Server:"
for server in "${MCP_SERVERS[@]}"; do
    echo "  • $server"
done
echo ""

log_warning "Nächste Schritte:"
echo "  1. Claude Desktop neu starten"
echo "  2. MCPs testen mit einfachen Kommandos (siehe .claude/MCP_SETUP.md)"
echo "  3. API-Keys bei Bedarf manuell in der Config aktualisieren"
echo ""

log_info "Config-Datei: $CLAUDE_CONFIG_FILE"
log_info "Dokumentation: $CLAUDE_DIR/MCP_SETUP.md"
echo ""
log_success "Fertig! 🎉"
