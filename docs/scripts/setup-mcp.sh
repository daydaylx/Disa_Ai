#!/usr/bin/env bash
set -euo pipefail
REPO="$HOME/Schreibtisch/Disa Ai"

# 0) Ins Repo wechseln – wichtig, sonst zeigt 'list' ins falsche Scope
cd "$REPO"

# 1) Alte project-scope Einträge defensiv entfernen
claude mcp remove --scope project fs  || true
claude mcp remove --scope project git || true

# 2) Neu registrieren (projektweit, strikt auf Repo begrenzt)
claude mcp add --scope project fs  -- npx -y @modelcontextprotocol/server-filesystem "$REPO"
claude mcp add --scope project git -- npx -y @cyanheads/git-mcp-server

# 3) Status anzeigen (IM Projekt-Scope)
echo
echo "== MCP (project scope) =="
claude mcp list --scope project

# 4) Hinweis
echo
echo "Öffne Claude Code und tippe '/mcp', dann fs+git erlauben."
echo "Beim git-Server einmal 'git_set_working_dir' auf '.' setzen."
