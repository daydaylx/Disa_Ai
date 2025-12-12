# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

```bash
npm run dev                  # Start Vite dev server (localhost:5173)
npm run build               # Production build to dist/
npm run preview             # Preview production build locally
```

### Quality Assurance

```bash
npm run verify              # Run typecheck + lint + unit tests (CI gate)
npm run typecheck           # TypeScript type checking (parallel)
npm run lint                # ESLint check
npm run lint:fix            # Auto-fix ESLint issues
npm run lint:css            # Stylelint check + hex color validation
npm run test:unit           # Run Vitest unit tests
npm run test:watch          # Watch mode for unit tests
npm run test:e2e            # Run Playwright E2E tests
npm run e2e:smoke           # Quick E2E smoke tests
```

### Build Verification

```bash
npm run verify:dist         # Verify dist/ contains no .tsx files
npm run test:build          # Full build test pipeline
```

## Architecture Overview

### Core Technology Stack

- **React 18.3.1** with **TypeScript 5.9.3** and **Vite 7.2.4**
- **React Router v7.9.6** for routing (all routes lazy-loaded via `React.lazy()`)
- **Tailwind CSS** + **Radix UI** for UI components
- **Vitest** for unit tests, **Playwright** for E2E tests
- **PWA** with custom Service Worker (Workbox-based)

### Project Structure

```
src/
├── api/              # External API calls (OpenRouter integration)
├── app/              # App setup: router.tsx, layouts, RouteWrapper
├── components/       # Reusable UI components (atomic & composed)
│   ├── ui/          # Base components (Button, Card, Dialog, etc.)
│   └── chat/        # Chat-specific components (ChatMessage, UnifiedInputBar, etc.)
├── config/          # Static configuration & environment
│   ├── env.ts       # Environment variable validation (Zod schemas)
│   ├── models.ts    # Model catalog loading & filtering
│   ├── roleStore.ts # Persona/role management (loads public/persona.json)
│   ├── flags.ts     # Feature flags (runtime toggles)
│   └── settings.ts  # User settings schema & defaults
├── contexts/        # React contexts for state management
├── data/            # Data layer (not currently using Dexie for conversations)
├── features/        # Feature-specific implementations
├── hooks/           # Business logic hooks
│   ├── useChat.ts   # Core chat logic with streaming, rate limiting, error handling
│   ├── useSettings.ts
│   ├── useMemory.ts
│   └── useConversationManager.ts
├── lib/             # Framework-agnostic utilities (NO React imports)
│   ├── errors/      # Error types & mapping
│   ├── net/         # Network utilities (fetchTimeout, concurrency)
│   ├── openrouter/  # OpenRouter API key management
│   ├── pwa/         # PWA registration & updates
│   └── utils/       # General utilities
├── pages/           # Route-level page components
├── services/        # Browser API wrappers & background services
├── state/           # State reducers (e.g., chatReducer)
├── styles/          # Global CSS, design tokens
└── types/           # TypeScript type definitions
```

### Key Files

- **`src/App.tsx`**: Main app component; sets up providers, mobile gate, viewport height fix
- **`src/app/router.tsx`**: Route definitions (all lazy-loaded)
- **`src/hooks/useChat.ts`**: Core chat logic with streaming, rate limiting, exponential backoff
- **`src/api/openrouter.ts`**: OpenRouter API integration (chat streaming, model fetching)
- **`src/config/models.ts`**: Hybrid model catalog (OpenRouter API + curated metadata from `public/models_metadata.json`)
- **`src/config/roleStore.ts`**: Loads personas from `public/persona.json`
- **`vite.config.ts`**: Build configuration with PWA plugin, Sentry integration, asset optimization

## Chat Flow Architecture

The chat system follows this lifecycle:

1. **User Input** → `UnifiedInputBar` component captures message
2. **Hook Call** → `useChat.ts` `append()` function is triggered
3. **State Update** → `chatReducer` adds user message, sets `isLoading: true`
4. **API Request** → `src/api/openrouter.ts` `chatStream()` constructs request
   - Reads API key from `sessionStorage` (via `src/lib/openrouter/key.ts`)
   - Sends POST to OpenRouter with streaming enabled
5. **Stream Processing** → NDJSON stream parsed incrementally
   - Each delta updates assistant message in real-time
   - Handled by `useChat` reducer actions
6. **Completion** → Stream ends with `[DONE]`, `isLoading: false`
7. **Error Handling** → Errors mapped to typed errors in `src/lib/errors/`
   - `RateLimitError`: Triggers cooldown with exponential backoff
   - Other errors: Displayed to user via state

## Configuration System

### Environment Variables

Defined and validated in `src/config/env.ts` using **Zod schemas**.
All variables prefixed with `VITE_` are replaced at build time.

Key variables:

- `VITE_OPENROUTER_BASE_URL`: API endpoint override
- `VITE_SENTRY_DSN`: Error tracking (production)
- `VITE_BUILD_ID`: Build identifier (auto-generated)
- `VITE_PWA_DISABLED`: Disable PWA features

See `docs/guides/ENVIRONMENT_VARIABLES.md` for full list.

### Feature Flags

Runtime toggles stored in `localStorage`, managed via `src/config/flags.ts`:

- `getPreferRolePolicy()` / `setPreferRolePolicy()`: Role-based model restrictions
- `getVirtualListEnabled()` / `setVirtualListEnabled()`: Model list virtualization

### Personas/Roles

Defined in `public/persona.json`, loaded by `src/config/roleStore.ts`.
Each persona has:

- `id`, `name`, `system` (prompt)
- `allow`: Array of model IDs the persona can use
- `tags`: Categorization

### Model Catalog

Hybrid approach (`src/config/models.ts`):

1. Fetches live models from OpenRouter API
2. Loads curated metadata from `public/models_metadata.json`
3. Merges data, filters strictly free models (`:free` suffix or price = 0)
4. Adds quality scores, openness ratings, safety classifications

## Design System

### Design Tokens

Two-layer system:

1. **CSS Custom Properties** (`src/styles/design-tokens.css`): Core values
   - Colors: `--color-primary`, `--color-background`, etc.
   - Spacing: `--spacing-4` (16px), etc.
   - Radii, shadows, typography
2. **Tailwind Config** (`tailwind.config.ts`): Consumes CSS variables
   - `colors.primary: 'hsl(var(--primary))'`
   - `spacing.4: 'var(--spacing-4)'`

### Component Library

Location: `src/components/ui/`

Built on:

- **Radix UI**: Headless, accessible primitives
- **class-variance-authority (cva)**: Type-safe variant API
- **cn utility** (`src/lib/cn.ts`): Combines `clsx` + `tailwind-merge`

Example component pattern:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { sm: "...", lg: "..." },
  },
});

export const Button = ({ variant, size, className, ...props }) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
```

### Mobile-First Layout

- **Safe Area**: Uses `env(safe-area-inset-*)` for iOS/Android notches
- **Dynamic Viewport Height**: `App.tsx` sets `--vh` CSS variable based on `window.visualViewport.height`
- **Mobile Gate**: `MobileOnlyGate` restricts desktop usage (optional)

### Design Principles

- **Dramatic Neumorphism**: Multi-layered shadows, raised surfaces
- **No raw hex colors**: Use design tokens only
- **No raw `100vh`**: Use `100dvh` or `--vh` custom property
- **Semantic z-index**: Use named utilities (`z-toast`, `z-dialog`), never arbitrary values
- **Respect `prefers-reduced-motion`**: Disable animations when requested

## Module Boundaries (IMPORTANT)

**Strict separation of concerns:**

1. **`src/lib/**`\*\*: Pure utilities, NO React imports
   - Logging, highlighting, storage helpers, error mapping
   - Framework-agnostic code only

2. **`src/hooks/**`\*\*: Business logic & orchestration
   - Uses React hooks, manages state
   - NO direct rendering/JSX

3. **`src/components/**`\*\*: UI & interaction
   - Render logic only
   - NO direct network calls or storage access (use hooks)

4. **`src/config/**`\*\*: Configuration & validation
   - Environment variables, feature flags, static data
   - Minimal side effects

5. **`src/app/**`\*\*: Application shell
   - Router, layouts, global providers
   - Top-level composition

## Testing Strategy

### Unit Tests (`src/__tests__/`, `*.test.ts`)

- **Framework**: Vitest with Happy DOM
- **Focus**: Business logic in hooks, utility functions
- **Mock Strategy**: Mock network calls, avoid real API dependencies
- Run: `npm run test:unit`

### E2E Tests (`tests/e2e/`)

- **Framework**: Playwright (Chromium, Firefox, WebKit)
- **Device**: Emulated "Pixel 7" viewport
- **Mocking**: All network requests mocked for determinism
- **Accessibility**: `@axe-core/playwright` integrated
- Run: `npm run test:e2e`

### Smoke Tests

Quick validation of critical paths:

- Vitest: `npm run test:smoke` → `tests/smoke/`
- Playwright: `npm run e2e:smoke` → `tests/e2e/chat.smoke.spec.ts`

## Build & Deployment

### Build Process

```bash
npm run build  # Runs prebuild scripts, then Vite build
```

**Prebuild steps** (automatic):

1. `node scripts/build-info.js`: Generates build metadata
2. `npm run generate-tokens`: Processes design tokens
3. `vite build`: Bundles to `dist/`
4. **Postbuild**: Copies `_headers`, generates routes, verifies output

### Build Verification

**CRITICAL**: Before deploying, verify `dist/`:

```bash
npm run verify:dist  # Checks for .tsx files in dist/index.html
npx serve dist       # Manual inspection
```

### Asset Structure

Vite generates hashed assets in organized folders:

- `dist/assets/js/`: JavaScript bundles
- `dist/assets/css/`: Stylesheets
- `dist/assets/fonts/`: Web fonts
- `dist/assets/images/`: Images

### Deployment Targets

- **GitHub Pages**: `.github/workflows/pages.yml` (auto-deploy on `main`)
- **Cloudflare Pages**: Configuration in `deploy/cloudflare/`
- **Manual**: Static hosting compatible (Netlify, Vercel, etc.)

### PWA Service Worker

- **Location**: `public/sw.js` (Workbox-based)
- **Strategies**:
  - Network-First for HTML
  - Stale-While-Revalidate for assets
  - CacheFirst for fonts, CDN resources
- **Manifest**: `public/manifest.webmanifest`
- **Registration**: Manual in app code (not auto-injected)

## Quality Gates

### Pre-Commit Hooks

Managed by **Husky** + **lint-staged**:

- ESLint + Prettier on staged `.ts/.tsx/.js/.jsx`
- Prettier on `.json/.md`
- Stylelint on `.css/.scss`

### CI Pipeline (`.github/workflows/ci.yml`)

1. **Verify**: `npm run verify` (typecheck + lint + unit tests)
2. **Smoke**: Vitest smoke + Playwright smoke
3. **Matrix Test**: Node 20 & 22 compatibility

### Local Verification

Before pushing:

```bash
npm run verify  # Must pass
npm run build && npm run verify:dist  # Production readiness
```

## Common Patterns

### Error Handling

All errors mapped via `src/lib/errors/mapError()`:

```ts
import { mapError } from "@/lib/errors";

try {
  await apiCall();
} catch (error) {
  const mappedError = mapError(error);
  // Handle RateLimitError, NetworkError, etc.
}
```

### Storage Access

Use safe wrappers from `src/lib/safeStorage.ts`:

```ts
import { safeStorage } from "@/lib/safeStorage";

const value = safeStorage.getItem("key");
safeStorage.setItem("key", "value");
```

### API Key Management

Never hardcode keys. Use `src/lib/openrouter/key.ts`:

```ts
import { hasApiKey, readApiKey } from "@/lib/openrouter/key";

if (!hasApiKey()) {
  // Redirect to settings
}
const key = readApiKey(); // From sessionStorage
```

### Public Assets

Use resolver for base path safety:

```ts
import { resolvePublicAssetUrl } from "@/lib/publicAssets";

const url = resolvePublicAssetUrl("/persona.json");
fetch(url, { cache: "no-store" });
```

## Debugging

### Build Issues

```bash
# Enable debug sourcemaps
npm run build:debug

# Analyze bundle size
BUNDLE_ANALYZE=true npm run build
npm run analyze  # Opens bundle visualizer
```

### Dev Server

```bash
# Custom port
VITE_PORT=3000 npm run dev

# Custom HMR configuration
VITE_HMR_HOST=192.168.1.100 VITE_HMR_PORT=3001 npm run dev
```

## Important Notes

### Security

- **API Keys**: Only stored in `sessionStorage`, never committed
- **No CORS Proxy**: Direct OpenRouter API calls (CORS handled by OpenRouter)
- **Sentry**: Source maps uploaded only in production builds with `SENTRY_AUTH_TOKEN`

### Performance

- **Code Splitting**: All routes lazy-loaded
- **Asset Optimization**: Inlines assets < 4KB
- **Virtualization**: Available for long model/message lists (feature flag)
- **PWA Caching**: Aggressive caching for static assets, network-first for dynamic content

### Known Constraints

- **Mobile-First**: Desktop experience may be limited (MobileOnlyGate)
- **Free Models Only**: Strict filtering for `:free` suffix or $0 pricing
- **Rate Limiting**: Handled with exponential backoff (max 30s delay)
- **No Server Backend**: Pure static SPA, no server-side rendering

## Repository Context

- **Main Branch**: `main`
- **Node Version**: 20.19.0+ (see `.nvmrc`)
- **Package Manager**: npm (lockfile committed)
- **License**: Private/proprietary (see README)
- **CI/CD**: GitHub Actions for verification, Pages for deployment
