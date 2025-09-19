# Repository Guidelines

## Projektstruktur & Modulorganisation

Die App nutzt Vite mit React und TypeScript. Hauptlogik, Hooks und UI-Komponenten liegen in `src/` nach thematischen Feature-Ordnern. Statische Assets verbleiben in `public/`, das gebaute Bundle im git-ignorierten `dist/`. Tests wohnen in `tests/`: `tests/unit` für Vitest-Suites, `tests/e2e` für Playwright-Flows, `tests/smoke` für kurze Regressionen. Begleitende Dokumente befinden sich unter `docs/`, Automations- und Prompt-Skripte unter `scripts/` bzw. `ops/`.

## Build-, Test- und Dev-Kommandos

`pnpm install --frozen-lockfile` synchronisiert Abhängigkeiten reproduzierbar. `pnpm dev` startet den Vite-Server (Port 5173). `pnpm typecheck` prüft das TS-Oberflächenmodell ohne Output, `pnpm -s build` erzeugt das Production-Bundle inklusive Postbuild-Schritten für Cloudflare Pages. `pnpm lint` und `pnpm format` stellen Stilkonformität sicher; `pnpm verify` bündelt Typecheck, Lint und Unit-Tests. Für Tests: `pnpm test:unit` (Vitest Run), `pnpm test:ci` (Coverage) und `pnpm e2e` (Playwright).

## Code-Stil & Benennung

Verwendet funktionale React-Komponenten in PascalCase (`ChatToolbar.tsx`), Hooks/Utilities in camelCase (`useChatContext`). Geteilte Typdefinitionen über `zod`-Schemas halten IO stabil. Prettier (`pnpm format:fix`) und ESLint (Konfiguration in `eslint.config.mjs`) laufen ohne Warnungen. Tailwind-Klassen sollen semantische Tokens nutzen statt ad-hoc-Farbcodes; wiederkehrende Patterns in dedizierten Utilities bündeln.

## Test-Richtlinien

Schnelle Komponenten-Tests können neben dem Modul leben, umfassendere Szenarien gehören nach `tests/unit`. Dateien folgen `*.test.ts(x)`. Halte Snapshots deterministisch und äquivalente Accessibility-Cases über Playwright (`tests/e2e`) aktuell; Setup-Hooks in `tests/setup`. Coverage-Berichte entstehen via `pnpm test:ci` und sollten Review-Kommentare begleiten, falls Schwellen fallen.

## Commit- & Pull-Request-Richtlinien

Nutze Conventional Commits (`feat(ui): …`, `fix(e2e): …`). Squashe kleine Fixups lokal. PRs verlinken Issues/Notion-Tasks, listen Risiken und enthalten UI-Vergleiche (Playwright-Screenshots, Design-Diffs) bei visuellen Änderungen. Vor dem Request auf Review `pnpm verify` sowie relevante E2E-Suiten ausführen und ein kurzes Rollback-Szenario beschreiben.

## Sicherheit & Konfiguration

Keine `.env`- oder Cloudflare-Secrets einchecken. Neue Dependencies mit `pnpm audit` oder Snyk-Pipeline abklären. GitHub-Workflows im Verzeichnis `.github/workflows` schlank halten und mit `pnpm dlx actionlint` validieren, bevor Deployments auf Cloudflare ausgelöst werden.
