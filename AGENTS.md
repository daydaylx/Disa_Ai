# Repository Guidelines

## Project Structure & Module Organization

Core React + TypeScript code lives in `src/`: `src/app` covers shell/routing, `src/ui` houses Radix-based UI primitives, `src/components` contains feature-specific components, `src/features` groups flows, and `src/hooks` keeps orchestration isolated. Config sits in `src/config` (env.ts, flags.ts, models.ts, settings.ts), while design tokens in `src/styles/` (design-tokens-consolidated.css, design-tokens.generated.ts) feed Tailwind. State management lives in `src/state/`, contexts in `src/contexts/`, API layer in `src/api/`, pages in `src/pages/`, and data/fixtures in `src/data/`. Automation runs from `scripts/` and `tools/`, assets stay in `public/`, docs (see `docs/ENVIRONMENT_VARIABLES.md`) in `docs/`, deployment manifests in `deploy/`, and tests in `tests/` with artifacts in `test-results/`.

## Build, Test, and Development Commands

- `npm run dev` – start Vite with HMR for daily UI work.
- `npm run build && npm run preview` – generate tokens/build-info, emit `dist/`, then preview it locally.
- `npm run verify` – runs `typecheck`, `lint`, `test:unit`; execute before pushes and PRs.
- `npm run lint`, `npm run lint:css`, `npm run format:fix` – fix TS/JS, CSS, and Prettier drift.
- `npm run test:unit`, `npm run e2e`, `npm run verify:dist` – Vitest suites, Playwright Pixel flows, and hashed bundle validation; run `npm run clean` if artifacts linger.

## Coding Style & Naming Conventions

Prettier plus `.editorconfig` enforce 2-space indentation, LF endings, and trailing newlines—run `npm run format:fix` before commits. Components and pages stay in PascalCase files, hooks are camelCase with a `use` prefix, and config constants remain SCREAMING_SNAKE_CASE inside `src/config/` files (env.ts, flags.ts, models.ts, settings.ts). Styling relies on Tailwind utilities fed by tokens in `src/styles/` (design-tokens-consolidated.css, design-tokens.generated.ts); avoid raw hex or `100vh`, and keep primitives aligned with `class-variance-authority` variants. Keep `src/lib` helpers pure.

## Testing Guidelines

Place unit specs in `src/__tests__` or module-adjacent `*.test.tsx`, mocking network calls through `src/services`. Playwright suites live in `tests/e2e`, inherit the Pixel device profile, and run `@axe-core/playwright`, so accessibility failures block merges. Smoke/setup helpers sit in `tests/smoke` and `tests/setup`. CI runs `npm run verify`; include `npm run e2e` whenever routing, storage, or persona logic shifts.

## Commit & Pull Request Guidelines

Use Conventional Commits (`feat(chat): stream delta batching`) and keep branches short-lived off `main`. Run `npm run changeset:add` for user-facing changes. Pull requests must summarize impact, link issues, attach UI screenshots when relevant, and list executed commands (minimum `npm run verify`, often `npm run e2e`). Follow the `.github` templates and request review only after automation passes.

## Security & Configuration Tips

Keep secrets out of the repo: store local keys in `.env.local` and expose only `VITE_`-prefixed values from `docs/ENVIRONMENT_VARIABLES.md`. Let `scripts/build-info.js` maintain `build-info.json`. Use Node 20.19+ up to (but not including) Node 24 (see `package.json` engines field; `.nvmrc` specifies 22.19.0) before installing or building. Deployment credentials live in the Cloudflare Pages/Workers dashboards under `deploy/`, and nothing sensitive should land in `public/`.
