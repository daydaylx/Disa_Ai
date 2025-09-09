# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Essential Commands:**

- `npm run dev` - Start development server with Vite
- `npm run build` - Production build
- `npm run preview` - Preview production build on localhost:5173
- `npm run typecheck` - Run TypeScript checks for both main and test configs
- `npm run lint` - ESLint with current config
- `npm run lint:full` - Full ESLint check (used in CI)
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Interactive test runner
- `npm run verify` - Complete check: typecheck + lint + test

**Testing:**

- `npm run test:unit` - Unit tests only
- `npm run test:e2e` - E2E tests with Playwright
- `npm run test:e2e:ui` - Interactive Playwright UI
- Unit tests: `src/**/__tests__/**/*.{test,spec}.{ts,tsx}` and `tests/unit/`
- E2E tests: `tests/e2e/` (configured for mobile/Android viewports)

## Architecture Overview

**Core Structure:**

- React 18 + TypeScript with Vite build system
- Mobile-first PWA with dark theme and Aurora design system
- State management via Zustand stores in `src/state/`
- API layer in `src/api/` with service abstractions in `src/services/`
- Component library in `src/components/` and `src/ui/`

**Key Directories:**

- `src/views/` - Main application screens/pages
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility libraries and helpers
- `src/types/` - TypeScript type definitions
- `src/config/` - App configuration and settings

**Routing & Navigation:**

- Uses React Router DOM v7 for client-side routing
- Main application structure defined in `src/App.tsx`

## Styling System

**Theme Architecture:**
The app uses a custom Aurora Dark theme with CSS custom properties and Tailwind utilities.

**Core Styling Files:**

- `src/styles/tokens.css` - HSL-based design tokens for light/dark themes
- `src/styles/theme.css` - Aurora theme implementation with utilities
- `tailwind.config.ts` - Tailwind configuration mapping CSS variables to utilities

**Key CSS Utilities (prefer these over custom styles):**

- **Surfaces:** `glass`, `card-solid`, `card-gradient`, `glass-solid`
- **Buttons:** `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-outline`
- **Inputs:** `input`, `input-glass`
- **Navigation:** `nav-pill`, `nav-pill--active` (note: double dash)
- **Text:** Use semantic tokens like `text-foreground`, `text-text`, `text-muted-foreground`

**Avoid:** Hard-coded neutral colors (`neutral-*`, `bg-white`). Use semantic color tokens instead.

**Theme Initialization:** Dark mode is set as baseline in `src/main.tsx` via `initTheme()`

## TypeScript Configuration

**Strict Settings Enabled:**

- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- Path aliases: `@/*` maps to `src/*`

**Excluded from type checking:**

- Legacy features in `src/features/**`, `src/entities/**`, `src/widgets/**`, `src/shared/**`
- Legacy OpenRouter client: `src/lib/openrouter.ts`

## Build & Deployment

**Deployment:** Cloudflare Pages with Git integration (branch: main, output: `dist/`)
**CI:** GitHub Actions runs typecheck + lint:full + test (E2E optional)
**Chunk Strategy:** Vendor splitting (React separate), models feature splitting
**PWA:** Service worker with `injectManifest` strategy

## Testing Framework

**Unit Tests:** Vitest with jsdom environment
**E2E Tests:** Playwright configured for mobile viewports (Galaxy S8+)
**Setup:** `tests/setupTests.ts` for Vitest globals and mocks

## Development Notes

**Import Sorting:** Auto-sorted via `simple-import-sort` ESLint plugin
**Unused Imports:** Automatically removed via `unused-imports` ESLint plugin  
**Code Style:** Prettier with Tailwind plugin for class sorting
**Git Hooks:** Husky + lint-staged for pre-commit validation
