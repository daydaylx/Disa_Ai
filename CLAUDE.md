# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Disa AI is a React-based AI chat PWA with offline-first architecture, built with Vite and TypeScript. The app focuses on security, performance, and mobile-responsive design.

## Key Commands

**Development:**

- `npm run dev` - Start development server (localhost:5173)
- `npm run build` - Production build to dist/
- `npm run preview` - Preview production build (localhost:4173)

**Quality Assurance:**

- `npm run typecheck` - TypeScript checks across all tsconfig files
- `npm run lint` - ESLint with max 0 warnings
- `npm run test` - Unit tests with Vitest (watch mode)
- `npm run test:unit` - Unit tests single run
- `npm run test:ci` - Tests with coverage
- `npm run verify` - Run typecheck + lint + test:unit (CI gate equivalent)

**Testing:**

- `npm run test:e2e` - Playwright E2E tests (offline-first with request interception)

## Architecture

**Core Structure:**

- `src/api/` - API client layer (OpenRouter integration)
- `src/lib/` - Shared utilities, error handling, storage, validation
- `src/features/` - Feature-specific code (prompt management)
- `src/components/` - Reusable UI components
- `src/views/` - Page-level components
- `src/state/` - Global state management
- `src/styles/` - Design tokens and utility classes

**Key Patterns:**

- **Offline-first testing** - All tests use mocked network calls, no real API requests
- **Error contract system** - Structured error handling with TimeoutError, RateLimitError, etc.
- **SessionStorage security** - API keys stored in sessionStorage only (auto-migrates from localStorage)
- **Token-first styling** - CSS custom properties in `src/styles/tokens.css` mapped to Tailwind

**Style Import Order (Critical):**
The styles in `src/main.tsx` must be imported in this exact order:

1. `./ui/base.css` - Reset & base styles
2. `./styles/globals.css` - Global variables & layouts
3. `./styles/brand.css` - Brand colors & aurora effects
4. `./styles/theme.css` - Design tokens & utility classes
5. `./styles/chat.css` - Component-specific styles

## Development Guidelines

**Branch Strategy:**

- Trunk-based development on `main` branch
- Short-lived feature branches (1-2 days max)
- Small, atomic PRs (<400 lines)

**Commit Format:**

```
feat(scope): imperative description

Longer description if needed.
- Bullet points for details
```

**CI Pipeline:**

1. Secret scanning (TruffleHog)
2. Lint
3. Typecheck
4. Unit tests
5. E2E tests
6. Build
7. Deploy gate (Cloudflare Pages)

**Security Requirements:**

- Never read `.env`, `secrets/**`, `*.pem`, `**/build`, `**/dist`
- No network tools (`curl`, `wget`) without explicit approval
- No edits to `package-lock.json` without explicit request
- API keys only in sessionStorage, never localStorage

**Code Conventions:**

- TypeScript strict mode with `noUncheckedIndexedAccess: true`
- ESLint flat config with type-aware rules
- Import sorting via `simple-import-sort`
- Unused imports automatically removed
- React functional components only
- Error boundaries for robust error handling

## Testing Strategy

**Unit Tests (Vitest):**

- Files: `src/**/*.{test,spec}.{ts,tsx}`
- Setup: `tests/setup.ts`
- Mocked dependencies, no network calls

**E2E Tests (Playwright):**

- Request interception with JSON fixtures
- Offline scenarios: success, rate-limit, timeout, server-error
- No real API calls in tests

**Coverage Thresholds:**

- Statements: 15%
- Branches: 45%
- Functions: 30%
- Lines: 15%

## Error Handling

**Structured Error Types:**

- `TimeoutError` - Request timeouts
- `AbortError` - User cancellation
- `RateLimitError` - API rate limits (429)
- `NetworkError` - Connectivity issues
- `AuthenticationError` - Invalid API key (401)
- `ServerError` - Upstream problems (5xx)

**Implementation:**

- `src/lib/errors/types.ts` - Error class definitions
- `src/lib/errors/mapper.ts` - `mapError()` for unified conversion
- `src/lib/errors/humanError.ts` - User-friendly messages

## Deployment

**Platform:** Cloudflare Pages (Git integration)

- Production branch: `main`
- Build command: `npm run build && npm run postbuild`
- Build output: `dist/`
- Environment variables set in Cloudflare dashboard

**Cache Strategy:**

- HTML: `no-store` for `index.html`
- Assets: `max-age=31536000` with hashing
- Service Worker deliberately disabled to prevent stale content

## Key Files

- `tailwind.config.ts` - Tailwind setup with design token mapping
- `vite.config.ts` - Build configuration with @ alias
- `eslint.config.mjs` - Flat ESLint config with TypeScript rules
- `vitest.config.ts` - Test configuration and coverage thresholds
- `public/_headers` - Cloudflare security headers and CSP
