# Z.AI Vision MCP Server Migration Guide

## Übersicht

Diese Dokumentation beschreibt die Migration vom Playwright-basierten Visual MCP Server zum Z.AI Vision MCP Server im Disa AI Projekt.

## Migrationsschritte

### ✅ Abgeschlossene Schritte

1. **Environment Variablen konfiguriert**
   - `Z_AI_API_KEY` in `.env.local` hinzugefügt
   - `Z_AI_MODE=ZAI` konfiguriert

2. **Abhängigkeiten aktualisiert**
   - `@z_ai/mcp-server@^0.0.14` zu `package.json` hinzugefügt
   - Alle notwendigen Pakete installiert

3. **Neues MCP Server Skript erstellt**
   - `tools/zai-vision-mcp.ts` als Wrapper für Z.AI MCP Server
   - Environment Validierung und Fehlerbehandlung implementiert

4. **Package.json Skripte angepasst**
   - `mcp:visual` zeigt auf neues Z.AI Skript
   - `mcp:visual:legacy` als Backup für altes Skript

5. **Legacy System gesichert**
   - `tools/visual-mcp.ts.backup` erstellt
   - Altes Playwright-basiertes System erhalten

6. **Dokumentation aktualisiert**
   - `docs/ENVIRONMENT_VARIABLES.md` um Z.AI Variablen erweitert

## Funktionsweise

### Z.AI Vision MCP Server Features

- **`image_analysis`** - Analyse von Bildern mit GLM-4.5V
- **`video_analysis`** - Analyse von Videos mit GLM-4.5V
- **Unterstützte Formate** - PNG, JPG, JPEG, GIF, WebP, MP4, AVI, MOV

### Environment Konfiguration

```bash
# .env.local
Z_AI_API_KEY=your_actual_api_key_here
Z_AI_MODE=ZAI
```

## Nutzung

### Lokaler Test

```bash
# Z.AI MCP Server starten
npm run mcp:visual

# Legacy Server (Backup)
npm run mcp:visual:legacy
```

### MCP Client Konfiguration

Für Claude Desktop, Cline und andere MCP-kompatible Clients:

```json
{
  "mcpServers": {
    "zai-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@z_ai/mcp-server"],
      "env": {
        "Z_AI_API_KEY": "your_api_key",
        "Z_AI_MODE": "ZAI"
      }
    }
  }
}
```

## Vergleich: Alt vs. Neu

| Feature | Playwright MCP Server | Z.AI Vision MCP Server |
|---------|---------------------|-------------------------|
| **Bildanalyse** | Screenshot + OCR | Native Vision AI |
| **Videoanalyse** | Nicht unterstützt | ✅ Unterstützt |
| **Performance** | Browser-Overhead | Direkte API |
| **Kosten** | Infrastruktur | Z.AI API Quoten |
| **Browser-Automatisierung** | ✅ Voll unterstützt | Nicht verfügbar |
| **Zugänglichkeitstests** | ✅ Axe-core integriert | Nicht verfügbar |

## Rollback-Strategie

Falls Probleme mit dem Z.AI MCP Server auftreten:

1. **Legacy Server aktivieren**:
   ```bash
   npm run mcp:visual:legacy
   ```

2. **Package.json zurücksetzen**:
   ```json
   "mcp:visual": "npx tsx tools/visual-mcp.ts.backup"
   ```

3. **Abhängigkeiten entfernen**:
   ```bash
   npm uninstall @z_ai/mcp-server
   ```

## API Quoten und Limits

Gemäß Z.AI Dokumentation:

- **Lite Plan**: 100 Web-Suchen + 5h Vision Pool
- **Pro Plan**: 1.000 Web-Suchen + 5h Vision Pool  
- **Max Plan**: 4.000 Web-Suchen + 5h Vision Pool

## Fehlerbehebung

### Häufige Probleme

1. **"Z_AI_API_KEY environment variable is required"**
   - API Key in `.env.local` setzen
   - Datei speichern und Server neu starten

2. **Connection Timeout**
   - Netzwerkverbindung prüfen
   - API Key Validität überprüfen

3. **Invalid API Key**
   - API Key von [Z.AI Open Platform](https://z.ai/manage-apikey/apikey-list) kopieren
   - Sicherstellen, dass der Key aktiviert ist

## Nächste Schritte

1. **API Key eintragen** in `.env.local`
2. **Funktionalität testen** mit Beispielbildern
3. **In MCP Client integrieren** (Claude Desktop, Cline, etc.)
4. **Produktivbetrieb** nach erfolgreichen Tests

## Support

- **Z.AI Dokumentation**: https://docs.z.ai/
- **MCP Protokoll**: https://modelcontextprotocol.io/
- **Issues**: Im Projekt Repository melden

---

**Migration Status**: ✅ Abgeschlossen  
**Letzte Aktualisierung**: 2025-12-03  
**Version**: Z.AI MCP Server v0.0.14