# Audit Cleanup Backlog

Datum: 2026-03-01
Status: aktiv
Scope: Alle audit-relevanten Quellen (Gates + Reports + offene Checklisten)

## 1) Aktueller Gate-Status (faktisch)

- `npm run verify`: PASS
- `npm run e2e`: PASS (`49 passed`, `48 skipped`, `0 failed`)
- `npm run lh`: Exit 0, aber Warnungen vorhanden

## 2) Bereits im aktuellen Umsetzungsschritt erledigt

### AC-001 Lighthouse-Konfigurationsdrift bereinigt
- Problem: `categories:pwa` war als Assertion konfiguriert, obwohl Lighthouse diese Kategorie nicht mehr liefert.
- Änderung:
  - `lighthouserc.cjs`: `categories:pwa` Assertion entfernt
  - `lighthouse.config.mjs`: `categories:pwa` Assertion entfernt
- Ergebnis: Kein falscher PWA-Warn-Noise mehr durch veraltete Assertion.

### AC-002 Render-Blocking Quickwins vorbereitet
- Problem: Zusätzliche render-blocking Ressourcen im App-Shell-Head.
- Änderung:
  - `index.html`: `preconnect` für `fonts.googleapis.com` und `fonts.gstatic.com`
  - `index.html`: ungenutzte Google-Fonts (`Lora`, `Patrick Hand`) entfernt
  - `index.html`: `viewport-height.js` mit `defer` geladen
  - `index.html`: großer No-JS-CSS-Block nur noch innerhalb `noscript` (JS-Clients parsen ihn nicht mehr)
- Erwartung: geringere Blockierungszeit und bessere Start-Metriken.

### AC-003 CLS-Risiko bei initialem `--vh` Update reduziert
- Problem: `--vh` wurde via `useEffect` erst nach erstem Paint gesetzt.
- Änderung:
  - `src/App.tsx`: `useEffect` -> `useLayoutEffect` für Viewport-Height-Sync
- Erwartung: weniger Initial-Layout-Shift auf mobilen Viewports.
- Verifikation (2026-03-01):
  - `npm run lh`: keine `cumulative-layout-shift` Warnungen mehr in `assertion-results.json`
  - Recheck nach Folgediff (`index.html` No-JS Visibility): weiterhin keine CLS-Warnung
  - Status: fixed

## 3) Offene Audits (priorisiert)

## [AC-101] Lighthouse Performance-Warnungen (Hauptblock)
- Quelle: `npm run lh` (aktueller Lauf)
- Betroffene Routen: `/`, `/chat`, `/models`, `/settings`
- Ist:
  - Performance Score: `0.57 - 0.71` (Ziel: `>= 0.85`)
  - TBT: `~473 - 980ms` (Ziel: `<= 300ms`)
  - LCP: `~2.7s - 5.0s` auf Kernrouten (Ziel: `<= 2.5s`)
  - FCP: `~2.1s - 2.9s` auf `/models` und `/settings` (Ziel: `<= 2.0s`)
- Schweregrad: high
- Repro:
  1. `npm run lh`
  2. `.lighthouseci/assertion-results.json` prüfen
  3. Restwarnungen routeweise abbauen (`/models` -> `/settings` -> `/chat` -> `/`)

## [AC-102] CLS-Spikes auf mobilen Kernrouten
- Quelle: Lighthouse/Performance-Audit
- Status: fixed (durch aktuellen Fix-Block)
- Verifikation:
  1. `npm run lh`
  2. `assertion-results.json` enthält keine CLS-Warnung mehr

## [AC-103] TBT zu hoch durch Main-Thread Last
- Quelle: Lighthouse/Performance-Audit
- Ist: Bootup/Main-thread signifikant über Budget
- Schweregrad: high
- Repro:
  1. `npm run lh`
  2. LHR Audits `bootup-time`, `mainthread-work-breakdown`, `long-tasks` prüfen

## [AC-104] UI-Fix-Checklisten in Docs nicht final synchronisiert
- Quelle:
  - `docs/reports/ui-fix-plan.md`
  - `docs/reports/ui-fix-implementation.md`
- Ist: offene Checkboxen trotz späterer grüner Verifikationen
- Schweregrad: medium
- Repro:
  1. offene `- [ ]` Einträge prüfen
  2. gegen aktuelle Audit-Nachweise abgleichen

## [AC-105] Design-System Restpunkte
- Quelle: `docs/reports/design-system-improvements.md`
- Offen laut Report:
  1. Shadow-System weiter vereinfachen
  2. Color-Token konsolidieren
  3. High-Contrast CSS ergänzen
- Schweregrad: medium

## [AC-106] Test-Coverage Audit Debt
- Quelle:
  - `docs/reports/test-expansion-summary.md`
  - `docs/reports/test-coverage-improvement-summary.md`
- Ist: mehrere 0%- oder Low-Coverage-Bereiche als offen dokumentiert
- Schweregrad: medium

## [AC-107] Mobile Animations Audit Backlog
- Quelle: `tests/MOBILE_ANIMATIONS_TESTS.md`
- Offen:
  - visual regression E2E
  - Lighthouse Benchmarks
  - Battery/Network Conditions
  - cross-browser snapshots
- Schweregrad: low

## [AC-108] UI-Baseline-Audit Recheck (2026-03-01)
- Quelle: `tools/ui-baseline-audit.mjs` gegen lokalen Preview-Build
- Ist:
  - `ui-signals.json`: `total: 0`, `issues: []`
- Schweregrad: info
- Repro:
  1. Preview lokal starten
  2. `LIVE_BASE_URL=http://127.0.0.1:4174 UI_REPORT_DIR=.tmp/ui-audit-2026-03-01 node tools/ui-baseline-audit.mjs`
  3. `.tmp/ui-audit-2026-03-01/ui-signals.json` prüfen

## 4) Verbindliche Abarbeitungsreihenfolge

1. AC-101/102/103 (Performance + CLS + TBT) in kleinen Fix-Batches
2. AC-104 (Dokumentationssynchronisation mit frischen Nachweisen)
3. AC-105 (Design-System Restpunkte)
4. AC-106 (Coverage-Debt, risikobasiert)
5. AC-107 (Mobile-Animations-Zusatztests)

## 5) Ausführungsregeln je Batch

1. Repro dokumentieren (`Schritte`, `Erwartet`, `Ist`)
2. Nur minimalen Fix (1-3 zusammenhängende Probleme)
3. Verifikation:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
   - betroffene Route/Spec erneut prüfen
4. Backlog-Status sofort aktualisieren (`open` -> `fixed`/`deferred`)

## 6) Definition of Done für Audit-Cleanup

- Keine unklassifizierten offenen Audit-Punkte mehr
- Alle offenen Punkte sind entweder:
  - `fixed` mit reproduzierbarem Nachweis
  - oder `deferred` mit Begründung und klarer Folgemaßnahme
- Finale Gates dokumentiert:
  - `npm run verify`
  - `npm run e2e`
  - `npm run lh`
