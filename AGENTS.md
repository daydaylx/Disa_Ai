# Repository Guidelines

## Project Structure & Module Organization

- `src/`: application code
  - `components/` React components (PascalCase `.tsx`)
  - `hooks/` custom hooks (`useX` naming)
  - `lib/`, `services/`, `utils/`: platform/domain helpers
  - `views/`, `entities/`, `shared/`, `widgets/`: feature/layout primitives
  - `styles/`: CSS and Tailwind layers
  - `__tests__/`, `test/`: test helpers and co-located tests
- `tests/`: top-level tests (`unit/`, `e2e/`)
- `public/`: static assets (`icons/`, `manifest`, `persona.json`, `sw.js`)
- `dist/`: build output (do not edit)

## Build, Test, and Development Commands

- `npm run dev`: start Vite dev server.
- `npm run build`: production build to `dist/`.
- `npm run preview`: serve build at `http://localhost:4173` (used by e2e).
- `npm run typecheck`: strict TypeScript checks (app + tests).
- `npm run test` / `test:unit`: run Vitest once; `test:watch` for watch UI.
- `npm run test:e2e`: Playwright tests in `tests/e2e` (mobile viewport).
- `npm run verify`: `typecheck` + unit tests (use before PR).

## Coding Style & Naming Conventions

- Language: TypeScript + React 18 + Vite.
- Formatting: Prettier (100 cols, trailing commas). Run `npm run format:fix`.
- Linting: ESLint with import sorting and unused-import removal; staged files are auto‑fixed via Husky/lint‑staged.
- Indentation: 2 spaces. Components PascalCase (`HeaderBadges.tsx`); hooks `useThing.ts`; utilities camelCase.
- Tailwind: class order enforced by `prettier-plugin-tailwindcss`.

## Testing Guidelines

- Unit tests: Vitest + Testing Library in `tests/unit` and `src/__tests__` (`*.test.ts(x)`).
- E2E: Playwright in `tests/e2e`; runs against `npm run preview`.
- Coverage: V8 reporters (`text`, `html` → `coverage/`). Aim to cover key branches and error paths.

## Commit & Pull Request Guidelines

- Commits: prefer Conventional Commits (e.g., `feat(ui): …`, `fix(net): …`, `chore:`). Keep messages imperative and scoped.
- PRs: clear description, linked issues, screenshots for UI changes, and notes on test impact. Ensure `npm run verify` (and `npm run test:e2e` when flows change) pass locally.

## Security & Configuration Tips

- Never commit secrets. OpenRouter API key is read from `localStorage` (`disa_api_key`)—do not hardcode.
- Avoid editing generated artifacts (`dist/`, `playwright-report/`). Keep `public/` assets versioned and lightweight.
