# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the React app: feature slices in `features/`, shared UI in `ui/`, bootstrap code in `app/` and `main.tsx`.
- `public/` exposes static assets, PWA manifest, and the 404 fallback copied to `dist/` after builds.
- `tests/` hosts Playwright suites (`e2e/`, `visual/`, `smoke/`) plus Vitest helpers under `unit/` and global setup files.
- `tools/` holds repo automation, including `check-css-hex.mjs` that guards design tokens.

## Build, Test, and Development Commands

- `npm run dev` starts Vite with hot reload; add `--host` when testing on devices.
- `npm run build` compiles the production bundle; follow with `npm run preview` for a local smoke test.
- `npm run verify` chains type-check, lint, and unit tests before any PR.
- Fast loops: `npm run typecheck`, `npm run lint`, `npm run test:unit`; UI flows use `npm run e2e`, visual baselines `npm run test:visual:update`.

## Coding Style & Naming Conventions

- `.editorconfig` enforces 2-space indentation and LF endings; Prettier (width 100, double quotes) runs through `npm run format` and lint-staged hooks.
- Components stay PascalCase, hooks/utilities camelCase, and environment constants SCREAMING_CASE.
- Imports are auto-ordered by `simple-import-sort`; let the fixer win to avoid churn in reviews.
- Hex colors are blocked—reference tokens from `src/styles/design-tokens.ts` or Tailwind config instead.

## Testing Guidelines

- Place Vitest specs beside code (`something.test.tsx`) or in `src/__tests__/`; mimic feature names for traceability.
- Coverage checks rely on `npm run test:ci`; keep deltas neutral or justify gaps in the PR.
- Playwright scenarios live under `tests/e2e/`; pair critical flows with `@axe-core/playwright` assertions.
- Update visual snapshots only after confirming intentional UI changes.

## Commit & Pull Request Guidelines

- Use Conventional Commits (`feat(ui):`, `fix(repo):`, `test(visual):`); scopes should map to top-level folders or domains.
- Keep feature branches short-lived off `main` and rebase before pushing to avoid merge noise.
- PRs must mention context or linked issues, attach screenshots for UI work, and state which npm scripts were executed (`verify`, `e2e`, etc.).
- Confirm docs reflect API changes, secrets are absent, and CI gates (Lint, Typecheck, Unit, E2E, Build, Deploy) are green.

## Security & Configuration Tips

- Copy `.env.example` to `.env.local` for local keys; push secrets only through Cloudflare project variables.
- Session data stays in `sessionStorage`; avoid persisting credentials elsewhere.
- When diagnosing stale bundles, run `npm run clean` before rebuilding to reset caches.
