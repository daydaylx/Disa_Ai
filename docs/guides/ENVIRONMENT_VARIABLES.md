# Environment Variables

Diese Referenz listet alle Umgebungsvariablen auf, die das Projekt aktuell auswertet. Alle Variablen, die im Browser zur Verfügung stehen müssen, tragen bereits ein `VITE_`-Präfix (Vite-spezifisch) und können gefahrlos exponiert werden. Build- und Tooling-Variablen ohne `VITE_`-Präfix bleiben ausschließlich im Node-Kontext.

> 💡 **Hinweis:** Die Variablen `VITE_BUILD_*`, `VITE_GIT_*` und `VITE_VERSION` werden während `npm run build` automatisch über `scripts/build-info.js` generiert und müssen nicht manuell gepflegt werden.

## Runtime (Client, `import.meta.env`)

| Variable | Pflicht? | Default / Verhalten | Zweck | Referenz |
| --- | --- | --- | --- | --- |
| `VITE_OPENROUTER_BASE_URL` | nein | `https://openrouter.ai/api/v1` | Basis-URL für alle OpenRouter-Anfragen. | [`src/services/openrouter.ts`](../src/services/openrouter.ts) |
| `VITE_ENABLE_ANALYTICS` | nein | `false` | Aktiviert optionales Analytics-Tracking. | [`src/config/env.ts`](../src/config/env.ts) |
| `VITE_ENABLE_DEBUG` | nein | `false` | Schaltet zusätzliche Diagnose-Logs frei. | [`src/config/env.ts`](../src/config/env.ts) |
| `VITE_ENABLE_PWA` | nein | `true` | Kann PWA-Features deaktivieren (Fallback-Modus). | [`src/config/env.ts`](../src/config/env.ts) |
| `VITE_BASE_URL` | nein | `/` | Basis-Pfad der Anwendung, wird im Build validiert. | [`vite.config.ts`](../vite.config.ts) |
| `VITE_SENTRY_DSN` | optional | – | Aktiviert den Sentry-Client im Browser. | [`src/lib/monitoring/sentry.tsx`](../src/lib/monitoring/sentry.tsx) |
| `VITE_ENV` | optional | `production` | Environment-Label für Monitoring & Logging. | [`src/lib/monitoring/sentry.tsx`](../src/lib/monitoring/sentry.tsx) |
| `VITE_BUILD_ID` | automatisch | generiert | Build-Kennung für Release-Tracking. | [`scripts/build-info.js`](../scripts/build-info.js) |
| `VITE_BUILD_TIME` | automatisch | generiert | ISO-Zeitstempel des Builds. | [`scripts/build-info.js`](../scripts/build-info.js) |
| `VITE_BUILD_TIMESTAMP` | automatisch | generiert | Numerischer Zeitstempel (Cache-Busting). | [`src/lib/pwa/registerSW.ts`](../src/lib/pwa/registerSW.ts) |
| `VITE_GIT_SHA` | automatisch | generiert | Git SHA für Debugging. | [`src/components/BuildInfo.tsx`](../src/components/BuildInfo.tsx) |
| `VITE_GIT_BRANCH` | automatisch | generiert | Git Branch für Debugging. | [`src/components/BuildInfo.tsx`](../src/components/BuildInfo.tsx) |
| `VITE_VERSION` | automatisch | generiert | Semantische Versionsnummer. | [`src/components/BuildInfo.tsx`](../src/components/BuildInfo.tsx) |
| `VITE_PORT` | nein | `5173` | Dev-Server-Port (Vite). | [`vite.config.ts`](../vite.config.ts) |
| `VITE_PREVIEW_BASE` | optional | `/` | Überschreibt die Basis-URL für `npm run preview`. | [`scripts/run-preview.mjs`](../scripts/run-preview.mjs) |
| `VITE_PREVIEW_HOST` | optional | `0.0.0.0` | Hostname für `npm run preview`. | [`scripts/run-preview.mjs`](../scripts/run-preview.mjs) |
| `VITE_PREVIEW_PORT` | optional | `4173` | Port für `npm run preview`. | [`scripts/run-preview.mjs`](../scripts/run-preview.mjs) |
| `VITE_FF_*` | optional | – | Laufzeit-Feature-Flags (per Präfix `VITE_FF_`). | [`src/config/flags.ts`](../src/config/flags.ts) |

## MCP Server Variablen (Node-Kontext)

| Variable | Pflicht? | Default / Verhalten | Zweck | Referenz |
| --- | --- | --- | --- | --- |
| `Z_AI_API_KEY` | ja (für MCP) | – | Z.AI API Key für Vision MCP Server. | [`tools/zai-vision-mcp.ts`](../tools/zai-vision-mcp.ts) |
| `Z_AI_MODE` | ja (für MCP) | – | Service-Plattform Auswahl für Z.AI. | [`tools/zai-vision-mcp.ts`](../tools/zai-vision-mcp.ts) |

## Build-, Monitoring- & Tooling-Variablen (Node-Kontext)

| Variable | Pflicht? | Zweck | Referenz |
| --- | --- | --- | --- |
| `NODE_ENV` | ja (Build) | Steuert Build-/Runtime-Modus. | Diverse, z.B. [`scripts/run-preview.mjs`](../scripts/run-preview.mjs) |
| `BUNDLE_ANALYZE` | optional | Aktiviert Bundle-Analyser. | [`vite.config.ts`](../vite.config.ts) |
| `BUNDLE_ANALYZE_MODE` | optional | Modus für Bundle-Analyser (`static`, `server`, …). | [`vite.config.ts`](../vite.config.ts) |
| `DEBUG_SOURCEMAP` | optional | Aktiviert Sourcemaps im Debug-Build. | [`package.json`](../package.json) |
| `SENTRY_AUTH_TOKEN` | optional | Authentifizierung für Sentry Source Maps. | [`vite.config.ts`](../vite.config.ts) |
| `SENTRY_ORG` | optional | Sentry-Organisation (Build-Zeit). | [`vite.config.ts`](../vite.config.ts) |
| `SENTRY_PROJECT` | optional | Sentry-Projektname (Build-Zeit). | [`vite.config.ts`](../vite.config.ts) |
| `CF_PAGES` / `CF_PAGES_URL` | automatisch | Erkennung für Cloudflare Pages Deployments. | [`vite.config.ts`](../vite.config.ts) |
| `GITHUB_ACTIONS`, `GITHUB_REPOSITORY` | automatisch | Metadaten für Preview-Base-Berechnung. | [`scripts/run-preview.mjs`](../scripts/run-preview.mjs) |
| `DEBUG_PREVIEW` | optional | Zusätzliche Logs im Preview-Skript. | [`scripts/run-preview.mjs`](../scripts/run-preview.mjs) |
| `LHCI_HOST`, `LHCI_PORT`, `LHCI_SKIP_SERVER` | optional | Steuerung für Lighthouse CI. | [`lighthouserc.cjs`](../lighthouserc.cjs) |
| `PLAYWRIGHT_BASE_URL`, `PLAYWRIGHT_PORT`, `PLAYWRIGHT_WEB_SERVER`, `PLAYWRIGHT_WEB_PORT` | optional | Playwright Test-Setup (lokaler Server). | [`playwright.config.ts`](../playwright.config.ts), [`scripts/setup_disaai.sh`](../scripts/setup_disaai.sh) |
| `PLAYWRIGHT_LIVE` | optional | Schaltet Playwright in Live-Modus (kein Dev-Server, nutzt `LIVE_BASE_URL`). | [`playwright.config.ts`](../playwright.config.ts), [`tests/e2e/live`](../tests/e2e/live) |
| `LIVE_BASE_URL` | optional | Basis-URL für Live-E2E-Checks (`https://disaai.de` als Default). | [`playwright.config.ts`](../playwright.config.ts), [`tests/e2e/live`](../tests/e2e/live) |
| `LIVE_PATHS` | optional | Komma-separierte Pfade für die Live-Analyse (Default `/`). | [`tests/e2e/live/live-visual.spec.ts`](../tests/e2e/live/live-visual.spec.ts) |
| `CI` | automatisch | Anpassung von Timeouts/Worker-Anzahl in CI. | [`playwright.config.ts`](../playwright.config.ts) |

## Deployment Default Values

Die Deployments setzen sichere Standardwerte, die bei Bedarf über Plattform-Secrets überschrieben werden können:

- **Netlify**: siehe [`deploy/netlify/netlify.toml`](../deploy/netlify/netlify.toml)
- **Cloudflare Pages**: siehe [`deploy/cloudflare/cloudflare-pages.json`](../deploy/cloudflare/cloudflare-pages.json)
- **Cloudflare Workers Preview**: siehe [`deploy/workers/wrangler.toml`](../deploy/workers/wrangler.toml)

Sensitive Werte wie `VITE_SENTRY_DSN` oder `SENTRY_AUTH_TOKEN` sind absichtlich leer vorbelegt und müssen in den jeweiligen Deployment-Dashboards als Secret hinterlegt werden.
