# AI-Agent Referenzen

Die AI-Agent-Konfigurationen befinden sich aus Kompatibilitätsgründen im Repository-Root.

## Verfügbare Agent-Dateien

| Datei | Beschreibung | Tools |
|-------|--------------|-------|
| [CLAUDE.md](../../CLAUDE.md) | Claude Code Referenz - Vollständige Projektübersicht | Claude Code (Anthropic) |
| [GEMINI.md](../../GEMINI.md) | Gemini-spezifische Infos | Google Gemini |
| [AGENTS.md](../../AGENTS.md) | Repository Guidelines für AI-Agenten | Alle AI-Agenten |

## Warum im Root?

AI-Tools suchen standardmäßig im Repository-Root nach Konfigurationsdateien:

- **Claude Code**: Sucht nach `CLAUDE.md`
- **Gemini**: Sucht nach `GEMINI.md`
- **Allgemeine Agenten**: Suchen nach `AGENTS.md` oder `.cursorrules`

Durch die Platzierung im Root wird maximale Kompatibilität gewährleistet.

## Weitere Dokumentation

- [Projektübersicht](../OVERVIEW.md)
- [Architektur](../ARCHITECTURE.md)
- [Entwickler-Guides](../guides/)
