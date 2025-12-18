# MCP (repo-local) – Cursor-ready Templates

Dieses Verzeichnis enthält **repo-lokale** MCP Konfigurationen (ohne Secrets), die du in Clients wie **Cursor**, Claude Desktop oder Cline übernehmen kannst.

## Enthaltene Server

- **filesystem**: Zugriff auf das Projektverzeichnis
- **git**: Git-Operationen im Repo
- **browser**: Browser-Automation über Playwright MCP Server
- **github**: GitHub MCP Server (typisch via **PAT**, siehe Hinweise unten)

## Template rendern (empfohlen)

Das Template nutzt den Platzhalter `__PROJECT_ROOT__`. Du kannst daraus eine konkrete Datei erzeugen:

```bash
bash tools/mcp/render-mcp-config.sh > /tmp/disa-mcp.json
```

Oder mit explizitem Projektpfad:

```bash
bash tools/mcp/render-mcp-config.sh /home/d/Schreibtisch/Disa_Ai > /tmp/disa-mcp.json
```

## Cursor Integration (Datei-basiert)

Cursor erwartet eine **MCP Server Liste** (Format wie in `mcp.config.template.json`: JSON mit `mcpServers`).

Vorgehen:

1. Render die Datei (siehe oben) nach z. B. `/tmp/disa-mcp.json`.
2. Öffne in Cursor die MCP/Tools-Einstellungen und importiere/übernimm die Server aus dieser Datei.\n+ - Falls dein Cursor-Build keinen Import-Button hat: Inhalt aus `/tmp/disa-mcp.json` in die entsprechende Cursor MCP-Konfig kopieren.\n+
   > Hinweis: Cursor-Pfad/UX unterscheidet sich je nach Version. Die repo-lokale Datei ist bewusst **Client-agnostisch** gehalten.

## GitHub: OAuth vs PAT (wichtig)

- Viele MCP GitHub Server (z. B. `@modelcontextprotocol/server-github`) arbeiten **primär mit PAT** via `GITHUB_PERSONAL_ACCESS_TOKEN`.
- Du hattest **OAuth** gewählt: das funktioniert nur, wenn **Client oder Server** explizit einen OAuth-Flow unterstützen.

Empfehlung:

- **Sofort nutzbar (PAT)**: Setze `GITHUB_PERSONAL_ACCESS_TOKEN` lokal (nicht committen) und ersetze `__SET_LOCALLY__`.\n+ - Token URL: `https://github.com/settings/tokens`\n+ - Typische Scopes: `repo`, `workflow`, `read:org`\n+- **OAuth (später)**: Sobald klar ist, ob Cursor oder ein GitHub-MCP-Server in eurer Toolchain OAuth kann, ergänzen wir die exakte Konfiguration.
