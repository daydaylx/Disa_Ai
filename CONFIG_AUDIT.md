# Konfigurations-Audit (Phase A)

## TypeScript (tsconfig.json)

- strict: true, exactOptionalPropertyTypes: true (gut)
- paths: `@/*` → `src/*` (Vite-alias deckungsgleich)
- sourceMap/inlineSources: nicht gesetzt (Debug-Builds in Phase B optional)
- exclude: `features/`, `entities/`, `widgets/`, `shared/` (Hinweis: Legacy/Parallelbestand)

## Vite (vite.config.ts)

- Alias: `@` → `./src`
- PWA: injectManifest, SW unter `/sw.js`
- build: `sourcemap: false`, `manualChunks` (vendor/react + models)

## Vitest (vitest.config.ts)

- jsdom, setup `tests/setupTests.ts`, Coverage V8
- include/exclude passend; keine alias-Overrides nötig

## Husky / lint-staged

- pre-commit aktiv; lint-staged: `eslint --fix` für Quellcode, `prettier` für sonstige
- `npm run lint` Script selbst ist deaktiviert → globaler Lint-Befehl ohne Wirkung; pre-commit deckt den Bedarf

## Empfehlung (Phase B)

- Debug-Sourcemaps: `tsconfig` (sourceMap+inlineSources) und `vite.build.sourcemap` für Debug-Builds aktivierbar (nicht für Prod)
- Prüfen, ob `features/*` bewusst ausgeschlossen bleibt; ggf. in `.graveyard/` verschieben
