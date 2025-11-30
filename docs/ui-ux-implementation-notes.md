# UI/UX Implementation Notes

## Überblick
- Navigation vereinheitlicht: Vier primäre Tabs (Chat, Modelle, Rollen, Einstellungen) mit mobiler Bottom-Navigation und Desktop-Sidebar.
- Chat-Ansicht vereinfacht: Scrollbarer Verlauf, sticky Composer mit klarer Senden/Stop-Schaltfläche und kompakten Kontextchips.
- Kontext & Quickstarts: Neue Kontext-Dialoge für Rollen/Modelle/Kreativität sowie Quickstart-Sheet direkt aus dem Chat.
- Experimente standardmäßig aus: Neko/Extras sind opt-in und in den Kontext-Einstellungen abschaltbar.
- Modelle neu strukturiert: `ModelsCatalog` ersetzt die dichte Tabelle durch Quick-Picks, Suche und Karten zum Setzen des Standardmodells.
- Settings-Home erneuert: Übersichtliche Karten führen zu Memory, Verhalten, Darstellung, Jugendschutz, Experimente und API/Daten mit einheitlichem Layout.

## Wichtige Komponenten & Pfade
- **App-Shell & Navigation:** `src/app/layouts/AppShell.tsx`, `src/components/navigation/PrimaryNavigation.tsx`, `src/config/navigation.tsx`.
- **Chat-Erlebnis:** `src/pages/Chat.tsx`, `src/components/chat/ChatInputBar.tsx`, `src/components/chat/ThemenBottomSheet.tsx`.
- **Modelle:** `src/components/models/ModelsCatalog.tsx`, eingebunden über `src/pages/ModelsPage.tsx`.
- **Settings:** `src/features/settings/SettingsLayout.tsx`, `src/features/settings/TabbedSettingsView.tsx`.
- **Settings-Default für Experimente:** `src/hooks/useSettings.ts` (Neko opt-in).
- **E2E-Anpassungen:** `tests/e2e/app-shell.spec.ts` prüft neue Navigationsstruktur.

## Offene Punkte / Erweiterungen
- Modelle-Detailseite und Rollenverwaltung sollten das neue Karten-/Sheet-Pattern übernehmen (separater Schritt).
- Quickstart-Sheet kann weitere Filter (Kategorie, Suchfeld) erhalten.
- Kontext-Dialog könnte um API-Key/Memory-Toggles ergänzt werden, sobald Settings konsolidiert sind.
- Feinkorrekturen für Settings-Unterseiten (Spacing, leere Zustände) nachziehen.

## Test-Hinweise
- `npm run verify` deckt Typen, Linting und Unit-Tests ab; E2E-Suite aktualisiert für neue Navigation.
- Empfohlen: `npm run build` für Produktions-Bundle-Sicherheit und `npm run e2e` sobald weitere Flows angepasst sind.
