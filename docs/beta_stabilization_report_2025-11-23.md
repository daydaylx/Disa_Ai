# Beta Stabilisierungs-Report 2025-11-23

## Ist-Analyse (Vorher)
Das Projekt war funktional, aber hatte Schwächen in der Mobile-Robustheit und Testabdeckung.
- **Tests:** Kritische Pfade (Settings, Chat-State) waren nur teilweise abgedeckt. E2E Tests fehlten für Mobile-Viewports.
- **Mobile:** Touch-Targets waren teilweise zu klein (<44px). `100vh` Probleme auf iOS.
- **PWA:** Updates passierten im Hintergrund ohne User-Kontrolle.
- **Accessibility:** Fehlende ARIA-Attribute bei Custom Controls (Toggle).

## Durchgeführte Änderungen (A–G)

### Block A: Unit Tests
- `useSettings` Tests erweitert (Persistence, Model-Wahl, Creativity Clamping).
- `chatReducer` Tests erstellt (ADD, UPDATE, RESET Message).
- `roleStore` Tests verifiziert.

### Block B: E2E Tests (Playwright)
- Neue Mobile-Viewports (360x800, 390x844, 414x896) konfiguriert.
- `beta-critical.spec.ts` erstellt: Deckt Happy-Path ab (Load, Nav, Roles, Chat, Settings).
- API Mocking für OpenRouter integriert (spart Kosten und stabilisiert Tests).

### Block C: CI
- Pipeline verifiziert (Smoke Tests, Build Checks, Mobile E2E).

### Block D: Monitoring
- Sentry Integration (Production-only) mit PII-Scrubbing und Performance-Tracing verifiziert.

### Block E: PWA Stabilität
- Update-Strategie auf `prompt` umgestellt (User entscheidet).
- "Update verfügbar" Banner via Toast-Action implementiert.
- Offline-Banner geprüft.

### Block F: Mobile Reality Fixes
- `touch-target-compact` (44px) global durchgesetzt.
- `100vh` durch `100dvh` und `--vh` Helper ersetzt/verifiziert.
- `AppHeader` verwendet nun `h1` für bessere Semantik.
- Toggle-Switch (Jugendschutz) zugänglich gemacht (`role="switch"`).

### Block G: Beta-Hygiene
- "Reset Settings" Button in API/Daten-Einstellungen hinzugefügt.
- `known-issues.md` dokumentiert offene Punkte.

## Hinweise für Tester
Bitte besonders prüfen:
1.  **Mobile Navigation:** Öffnen/Schließen des Menüs auf kleinen Screens (iPhone SE/12 mini).
2.  **Offline-Modus:** App laden, Flugmodus an, Chat öffnen -> sollte "Offline" Banner zeigen.
3.  **Update-Prompt:** Wenn eine neue Version deployed wird (simulierbar durch SW-Update), soll der Toast erscheinen.
4.  **Export/Import:** JSON-Export und Re-Import testen.
