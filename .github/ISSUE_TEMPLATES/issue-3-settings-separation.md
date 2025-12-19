# Settings aufräumen: „KI-Verhalten" getrennt von „Darstellung"

**Labels:** `ui`, `ux`, `refactor`
**Bereich:** `/settings`

## Problem

In den Einstellungen liegen „KI-Verhalten" und „Darstellung" zusammen. Das ist UX-mäßig unsauber: inhaltlich unterschiedliche Dinge, die Nutzer separat erwarten.

## Ziel

Einstellungen logisch trennen, z. B. in eigene Sections/Tabs/Routes:

- **KI-Verhalten** (Model/Prompt/Memory/Regeln)
- **Darstellung** (Theme, Layout, UI-Optionen)

## Akzeptanzkriterien

- [ ] Klare Trennung in der UI (eigene Sektion oder eigener Screen)
- [ ] Bestehende Settings bleiben erhalten (keine Reset-Überraschungen)
- [ ] Mobile UX bleibt sauber (keine überfüllten Seiten, klare Navigation)
- [ ] Persistenz bleibt identisch (Keys/Storage unverändert oder sauber migriert)

## ToDos

- [ ] Settings-UI restrukturieren
- [ ] Falls nötig: Settings-Datenmodell/Komponenten splitten
- [ ] Mini-Migration falls Key-Namen geändert werden (idealerweise vermeiden)
