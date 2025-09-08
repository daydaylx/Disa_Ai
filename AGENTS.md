# Repository Guidelines

## Projektstruktur & Modul‑Organisation

- `src/`: Anwendungscode
  - `components/`: React‑Komponenten in PascalCase (`Button.tsx`)
  - `hooks/`: Custom Hooks (`useSomething.ts`)
  - `lib/`, `services/`, `utils/`: gemeinsame Helper
  - `views/`, `entities/`, `shared/`, `widgets/`: Feature-/Layout‑Primitives
  - `styles/`: CSS/Tailwind‑Layer
  - `__tests__/`, `test/`: co‑lokalisierte Tests und Helfer
- `tests/`: Top‑Level‑Tests (`unit/`, `e2e/`)
- `public/`: statische Assets (`icons/`, `manifest`, `persona.json`, `sw.js`)
- `dist/`: Build‑Artefakte (nicht bearbeiten)

## Build, Test und Entwicklung

- `npm run dev`: startet Vite‑Dev‑Server.
- `npm run build`: Produktionsbuild nach `dist/`.
- `npm run preview`: dient Build unter `http://localhost:4173` (für e2e).
- `npm run typecheck`: strikte TypeScript‑Prüfung (App + Tests).
- `npm run test`, `npm run test:unit`: Vitest einmalig; `test:watch` mit Watch‑UI.
- `npm run test:e2e`: Playwright‑Tests in `tests/e2e` (mobiles Viewport).
- `npm run verify`: führt `typecheck` + Unit‑Tests aus; vor PRs nutzen.

## Code‑Stil & Benennung

- Sprache: TypeScript + React 18 + Vite.
- Formatierung: Prettier (100 Spalten, trailing commas). `npm run format:fix`.
- Linting: ESLint mit Importsortierung und Entfernen ungenutzter Importe (Husky/lint‑staged Auto‑Fix).
- Einrückung: 2 Leerzeichen.
- Benennung: Komponenten PascalCase (`HeaderBadges.tsx`); Hooks `useX.ts`; Utilities camelCase.
- Tailwind: Klassenreihenfolge via `prettier-plugin-tailwindcss`.

## Test‑Richtlinien

- Frameworks: Vitest + Testing Library (Unit), Playwright (E2E).
- Orte: `tests/unit`, `src/__tests__`, `tests/e2e`.
- Namensschema: `*.test.ts` / `*.test.tsx`.
- Coverage: V8‑Reporter (`text`, `html` → `coverage/`). Fokus auf zentrale Zweige und Fehlerpfade.
- Lokal ausführen: `npm run verify` und `npm run test:e2e` gegen `npm run preview`.

## Commits & Pull Requests

- Commits: Conventional Commits (z. B. `feat(ui): …`, `fix(net): …`, `chore:`). Imperativ, klarer Scope.
- PRs: klare Beschreibung, verlinkte Issues, Screenshots bei UI‑Änderungen; Testauswirkungen nennen.
- Sicherstellen, dass `npm run verify` besteht; bei Flow‑Änderungen `npm run test:e2e` ausführen.

## Sicherheit & Konfiguration

- Keine Secrets committen. OpenRouter‑API‑Key kommt aus `localStorage` (`disa_api_key`) — nicht hardcoden.
- Keine generierten Artefakte bearbeiten (`dist/`, `playwright-report/`). `public/`‑Assets leichtgewichtig und versioniert halten.

## Architekturüberblick

- Komponenten: Präsentations‑ und Containerkomponenten unter `src/components` sowie feature‑nah in `views/` und `widgets/`.
- Feature‑Slices: `views/`, `entities/`, `widgets/`, `shared/` bündeln UI und Logik je Domäne.
- Wiederverwendung: `hooks/` für Zustands-/Effektlogik; `lib/`/`services/` für API/Plattform; `utils/` für pure Helfer.
- Datenfluss: Props → Hooks → Services; nur pure Funktionen in `utils/`.
- Tests: Unit nah am Code (`src/__tests__`, `tests/unit`), E2E gegen `npm run preview`.
