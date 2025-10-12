# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Disa AI is a React-based AI chat PWA with offline-first architecture, built with Vite and TypeScript. The app focuses on security, performance, and mobile-first design with comprehensive Android optimization. Features include conversation management, glassmorphism UI, and advanced mobile UX patterns.

## Language & Communication

**Primary Language:** German (Deutsch)
- All responses, explanations, and communication should be in German
- Code comments and technical documentation may remain in English when appropriate
- Error messages and user-facing text should be in German

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
- `src/lib/` - Shared utilities (error handling, storage, validation, performance, PWA, mobile, conversation management)
- `src/config/` - Configuration and persona management
- `src/components/` - Reusable UI components (40+ components with glassmorphism design)
- `src/pages/` - Main page components (`ChatV2.tsx`, `Settings.tsx`, `Studio.tsx`)
- `src/ui/` - UI primitives and complex components (AppShell, ModelSheet, VirtualMessageList)
- `src/hooks/` - React hooks (18+ hooks for theme, conversations, PWA, viewport, etc.)
- `src/state/` - Global state management (templates, UI state machines)
- `src/styles/` - Design tokens system, glassmorphism CSS, and mobile optimizations

**Key Patterns:**

- **Mobile-first design** - Android-optimized with OLED display support, enhanced glass effects, and touch interactions
- **Conversation management** - Persistent chat history with search, filtering, and grouping by date
- **Offline-first testing** - All tests use mocked network calls, no real API requests
- **Error contract system** - Structured error handling with TimeoutError, RateLimitError, etc.
- **SessionStorage security** - API keys stored in sessionStorage only (auto-migrates from localStorage)
- **Token-first styling** - Design tokens are defined as TypeScript objects in `src/styles/design-tokens.ts` (the single source of truth) and then mapped to CSS custom properties in `src/styles/design-tokens.css` for browser consumption.

**Style Import Order (Critical):**
The styles in `src/App.tsx` must be imported in this exact order to ensure correct cascade behavior:

1. `./styles/tailwind.css` - Tailwind's base, component, and utility styles.
2. `./ui/base.css` - Custom base styles and resets.
3. `./styles/globals.css` - Global variables and layout styles.
4. `./styles/legacy-buttons.css` - Styles for older button components.
5. `./styles/glass-components.css` - Core glassmorphism effect styles.
6. `./styles/brand.css` - Brand-specific colors and aurora effects.
7. `./styles/chat.css` - Component-specific styles for the chat interface.

**Design System Architecture:**

- **Design Tokens:** Centralized in `src/styles/design-tokens.ts` with TypeScript exports
- **Glassmorphism:** Enhanced glass effects with backdrop-blur, optimized alpha values for OLED displays
- **Color System:** Dark-first with neutral (11 stops), accent (teal-based), and semantic colors
- **Component System:** All UI components use design tokens, no hardcoded values allowed (ESLint enforced)
- **Mobile-First:** Android-optimized with 100dvh support, safe-area handling, enhanced touch targets
- **Mobile Optimizations:** `src/styles/mobile-fixes.css` with Android-specific glass effects, viewport fixes, and touch interactions

**Conversation Management:**

- **Persistent Storage:** Conversations stored in localStorage with automatic cleanup
- **Chat History Sidebar:** Mobile-optimized sidebar with search, filtering, and date grouping
- **Features:** Search by title/content, filter by favorites/recent, delete conversations
- **Navigation:** Seamless conversation switching with state preservation
- **Utilities:** `src/lib/conversation-manager.ts` and `src/lib/conversation-utils.ts`

**PWA & Offline Architecture:**

- **Manifest:** Full PWA capabilities (shortcuts, share-target, file-handlers, protocol-handlers)
- **Service Worker:** Smart caching with version-based invalidation (`public/sw.js`)
- **Offline Support:** Complete offline functionality with fallback pages
- **Installation:** Native app-like experience on mobile and desktop

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

- Mobile-first testing (390x844 viewport)
- Request interception with JSON fixtures in `tests/e2e/`
- Offline scenarios: success, rate-limit, timeout, server-error
- Visual regression testing with snapshots
- Accessibility testing with @axe-core/playwright
- No real API calls in tests

**Test Selector Strategy:**

- Use `data-testid` attributes for stable E2E selectors
- Pattern: `data-testid="component.action"` (e.g., `message.copy`, `settings.theme`)
- Avoid CSS class-based selectors that break with styling changes

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
- Service Worker: Network-first for HTML, stale-while-revalidate for assets

## Key Files

**Configuration:**
- `tailwind.config.ts` - Tailwind setup with design token mapping
- `vite.config.ts` - Build configuration with @ alias and bundle optimization
- `eslint.config.mjs` - Flat ESLint config with TypeScript rules and hex color enforcement
- `vitest.config.ts` - Test configuration and coverage thresholds
- `playwright.config.ts` - E2E test configuration with mobile viewport

**Core Features:**
- `src/lib/conversation-manager.ts` - Conversation persistence and management
- `src/lib/conversation-utils.ts` - Utility functions for conversation grouping and filtering
- `src/components/chat/ChatHistorySidebar.tsx` - Mobile-optimized chat history interface
- `src/pages/ChatV2.tsx` - Main chat interface with conversation management
- `src/styles/mobile-fixes.css` - Android-specific mobile optimizations

**PWA & Deployment:**
- `public/_headers` - Cloudflare security headers and CSP
- `public/manifest.webmanifest` - PWA manifest with comprehensive app capabilities
- `public/sw.js` - Service worker with smart caching strategy
