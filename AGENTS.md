# Repository Guidelines

## Projektstruktur & Modulorganisation

Der Anwendungscode liegt in `src` und ist funktionsorientiert aufgeteilt: Feature-spezifische Logik befindet sich in `features`, `services`, `state` und `components`, wiederverwendbare Helfer landen in `lib` und `utils`. Die Einstiegspunkte (`main.tsx`, `App.tsx`) binden Routing, Provider und Bootstrap-Code aus dem Ordner `app` ein. Statische Assets und globale Styles liegen unter `public` bzw. `src/styles`; Design Tokens werden zentral in `src/styles/design-tokens.css` gepflegt. Build- und Deploy-Werkzeuge finden sich in `functions`, `scripts`, `tools` sowie den Hosting-Konfigurationen (`netlify.toml`, `cloudflare-pages.json`, `wrangler.toml`). Tests sind verteilt auf `src/__tests__`, `src/test` und den Top-Level-Ordner `tests` für Playwright-Suiten und Fixtures.

## Build-, Test- und Entwicklungs-Commands

`npm run dev` startet den lokalen Vite-Server, `npm run build` erzeugt ein optimiertes Produktions-Bundle und `npm run preview` dient zur Kontrolle des Build-Outputs. Führe vor Commits `npm run typecheck` aus, um TypeScript-Regressionen ohne Emission zu erkennen. `npm run lint` und `npm run lint:css` erzwingen ESLint-Regeln sowie die Tailwind-Farbprüfung. `npm run test:unit` führt Vitest im CI-Modus aus, während `npm run e2e` Playwright-Szenarien startet. Für einen vollständigen Qualitäts-Gate verwende `npm run verify`, das Typecheck, Linting, Unit- und E2E-Tests hintereinander ausführt.

## Code-Stil & Namenskonventionen

Das Repository zielt auf Node >= 20 und strikten TypeScript-Modus. Komponenten gehören in `.tsx`, gemeinsamer Code in `.ts`. Prettier (über `npm run format` bzw. `npm run format:fix`) kontrolliert das Layout; manuelle Formatierung ist überflüssig, da 2-Leerzeichen-Einrückung und einfache Anführungszeichen automatisch durchgesetzt werden. Halte die ESLint-Importreihenfolge ein und nutze Tailwind-Utilities mit den bereitgestellten Design-Tokens statt RGB- oder Hexwerten. React-Komponenten werden in PascalCase benannt, Hooks in camelCase mit `use`-Präfix, Feature-Ordner in kebab-case.

## Test-Richtlinien

Schreibe Unit-Tests direkt bei den Quelldateien mit Suffix `*.test.ts` oder `*.test.tsx`; Vitest nutzt dabei `happy-dom`. Externe Abhängigkeiten werden über MSW-Handler in `tests` oder `src/test` simuliert. Integrationstests, die mehrere Module abdecken, gehören nach `src/__tests__`. Browsernahe Szenarien liegen in Playwright-Spezifikationen unter `tests/e2e` und sollten Accessibility-Prüfungen via `@axe-core/playwright` enthalten. Halte Snapshots schlank und aktualisiere sie bewusst mit `npm run test -- --update`, wenn UI-Anpassungen beabsichtigt sind.

## Commit- & Pull-Request-Richtlinien

Die Git-Historie folgt konventionellen Nachrichten (`type(optional-scope): kurze Beschreibung`), z. B. `fix(cloudflare): trim wrangler config`. Fasse verwandte Änderungen in einem Commit zusammen und stelle sicher, dass `npm run verify` lokal erfolgreich ist, bevor du pushst. Pull Requests benötigen eine knappe Zusammenfassung, verlinkte Issues oder Ticket-IDs sowie Screenshots oder Screencasts bei UI-Änderungen. Weise auf Konfigurations- oder Deployment-Auswirkungen im PR-Text hin und hole Feedback der verantwortlichen Maintainer ein, wenn geteilte Utilities oder Hosting-Dateien betroffen sind.
