# Environment Variables

This project relies on a small set of environment variables for build-time validation, runtime configuration, and optional tooling. Frontend values are exposed via the `VITE_` prefix so they can be consumed safely through Vite’s runtime environment. The `scripts/validate-env.mjs` check runs before each production build and fails if required variables are missing, so make sure your CI/CD pipelines export the values listed below. 【F:scripts/validate-env.mjs†L1-L56】

A starter `.env.example` is included for local development—copy it to `.env.local` (ignored by Git) and adjust the values for your environment. 【F:.env.example†L1-L16】

## Core runtime variables (must be provided)

- `VITE_OPENROUTER_BASE_URL` – Base URL for all OpenRouter API calls. Defaults to `https://openrouter.ai/api/v1`, but must be explicitly configured in production to pass validation. 【F:src/config/env.ts†L5-L33】【F:scripts/validate-env.mjs†L15-L38】
- `VITE_ENV` – Human-readable deployment label used by error tracking and release tagging (`production`, `staging`, etc.). Also enforced by the validation script. 【F:scripts/validate-env.mjs†L15-L38】【F:src/lib/monitoring/sentry.tsx†L20-L40】

## Automatically generated during the build

These values are produced by `scripts/build-info.js` and injected before every build; you should not set them manually.

- `VITE_BUILD_ID`, `VITE_BUILD_TIME`, `VITE_BUILD_TIMESTAMP`, `VITE_GIT_SHA`, `VITE_GIT_BRANCH`, `VITE_VERSION` – Release metadata written to `.env.build` and bundled artifacts. 【F:scripts/build-info.js†L41-L99】
- `VITE_BUILD_TIMESTAMP` is also embedded in the service-worker cache token to force updates between deploys. 【F:src/lib/pwa/registerSW.ts†L3-L11】

## Optional frontend toggles

- `VITE_ENABLE_ANALYTICS` – Enables or disables analytics collection (string boolean). 【F:src/config/env.ts†L13-L18】
- `VITE_ENABLE_DEBUG` – Turns on verbose environment logging in development builds. 【F:src/config/env.ts†L34-L39】
- `VITE_ENABLE_PWA` – Controls whether PWA features are active; defaults to `true`. 【F:src/config/env.ts†L41-L45】
- `VITE_BASE_URL` – Overrides the deployment base path used when Vite builds the SPA. 【F:src/config/env.ts†L31-L33】【F:vite.config.ts†L62-L78】
- `VITE_PORT` – Custom port for the Vite dev server when running `npm run dev`. 【F:vite.config.ts†L191-L194】
- `VITE_UI_V2_PERCENTAGE`, `VITE_FORCE_UI_VERSION` – Reserved knobs for future UI rollout logic; kept in the typed env definition for compatibility. 【F:vite-env.d.ts†L3-L25】
- Feature-flag overrides follow the pattern `VITE_FF_<FLAGNAME>` (e.g. `VITE_FF_NEW_DRAWER=true`) and map directly to keys defined in `src/config/flags.ts`. 【F:src/config/flags.ts†L41-L74】

## Observability & release management

- `VITE_SENTRY_DSN` – Client-side DSN required to bootstrap Sentry in production. 【F:src/lib/monitoring/sentry.tsx†L20-L38】
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` – Build-time credentials that allow the Sentry Vite plugin to upload source maps when `VITE_SENTRY_DSN` is set. 【F:vite.config.ts†L84-L105】【F:src/lib/monitoring/README.md†L7-L20】

## Preview & deployment helpers

- `CF_PAGES`, `CF_PAGES_URL` – Automatically set on Cloudflare Pages; used to detect the correct base URL when running `npm run preview`. 【F:scripts/run-preview.mjs†L13-L21】
- `GITHUB_ACTIONS`, `GITHUB_REPOSITORY` – Allow the preview server to infer a GitHub Pages-style base path during CI previews. 【F:scripts/run-preview.mjs†L15-L21】
- `VITE_PREVIEW_BASE`, `VITE_PREVIEW_HOST`, `VITE_PREVIEW_PORT` – Override the preview server’s base path, host, or port. 【F:scripts/run-preview.mjs†L13-L30】
- `DEBUG_PREVIEW` – When set to `1`, logs detailed preview-server output for troubleshooting. 【F:scripts/run-preview.mjs†L70-L92】
- `BUNDLE_ANALYZE`, `BUNDLE_ANALYZE_MODE` – Control the optional bundle analyzer plug-in invoked through `npm run analyze`. 【F:vite.config.ts†L8-L12】
- `DEBUG_SOURCEMAP` – Enables source-map generation for the `npm run build:debug` workflow. 【F:package.json†L6-L38】

## Testing & QA

- `PLAYWRIGHT_PORT`, `PLAYWRIGHT_BASE_URL`, `CI` – Configure the Playwright test server and adjust retries/timeouts in CI environments. 【F:playwright.config.ts†L3-L12】
- `LHCI_HOST`, `LHCI_PORT`, `LHCI_SKIP_SERVER` – Supply host/port overrides and control whether Lighthouse CI should boot the preview server. 【F:lighthouserc.cjs†L6-L28】

## Deployment defaults

The repository ships with provider configs that set safe defaults for the required runtime variables. Adjust them to reference your secret manager in production.

- Cloudflare Pages: `deploy/cloudflare/cloudflare-pages.json` seeds `VITE_OPENROUTER_BASE_URL`, `VITE_ENV`, analytics, and PWA toggles. 【F:deploy/cloudflare/cloudflare-pages.json†L3-L19】
- Netlify: `deploy/netlify/netlify.toml` exports the same runtime values for Netlify builds. 【F:deploy/netlify/netlify.toml†L1-L12】
- Cloudflare Workers/Pages environments: `deploy/workers/wrangler.toml` assigns production and preview defaults for the Vite runtime flags. 【F:deploy/workers/wrangler.toml†L8-L17】

With these values in place, the validation script will succeed and the application will receive consistent configuration in every environment. 【F:scripts/validate-env.mjs†L15-L56】
