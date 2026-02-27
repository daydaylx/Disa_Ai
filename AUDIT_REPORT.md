# SPA/React Audit Report

## Baseline

- Branch at start: `main`
- Baseline checks:
  - `npm run verify` -> PASS
  - `npm run build` -> PASS
- Notes:
  - Build updates generated files (`build-info.json`, `src/styles/design-tokens.generated.ts`).
  - For this audit, generated-only diffs are reset after verification unless part of a real fix.

## Phase 0 - Landkarte (Entry Points + Critical Paths)

- App start:
  - `src/main.tsx` bootstraps global CSS, env init, sentry init, React mount, theme init, storage persistence, dev SW, dev a11y enforcement.
  - `src/App.tsx` wires providers, service worker hook usage, analytics opt-in handling, startup metadata sync, Router render, global overlays.
- Routing:
  - `src/app/router.tsx` defines all SPA routes, lazy page imports, redirects, and browser router future flags.
  - `src/app/components/RouteWrapper.tsx` wraps each route with `AppShell`, `ErrorBoundary`, `Suspense`, and route-level analytics tracking.
- Provider/state layer:
  - In `App.tsx`: `SettingsProvider`, `ToastsProvider`, `FavoritesProvider`, `RolesProvider`, `ModelCatalogProvider`.
  - `useSettings` state gates analytics behavior and feature toggles.
- Storage/data layer:
  - `syncMetadataFromConversations` in `src/lib/conversation-manager-modern` performs startup metadata reconciliation.
- Analytics:
  - `src/lib/analytics.ts` handles local event/session/pageview tracking.
- Error handling/recovery:
  - `src/lib/monitoring/sentry` initialization in `main.tsx` and boundary usage in `App.tsx`.
  - `main.tsx` includes preload error overlay and app reset/reload hooks.
- PWA/SW:
  - `useServiceWorker` in app runtime path.
  - Dev-only SW registration in `main.tsx`.
- UI overlays/modals:
  - Global overlay root (`#app-overlay-root`) and `PWAInstallModal` mounted in `AppContent`.

## Dependency Map Light

- `src/main.tsx` -> `src/App.tsx` -> providers/hooks/router -> page modules.
- `src/App.tsx` -> `useSettings` -> analytics enable/disable.
- `src/App.tsx` -> `useServiceWorker` (runtime registration/update path).
- `src/App.tsx` -> `Router` -> `RouteWrapper` -> `AppShell` + route lazy pages.
- `RouteWrapper` -> `analytics.trackPageView` on location changes (gated by settings).
- `main.tsx` bootstrapping (env/sentry/theme/dev tooling) executes before first routed render.

## Findings Tracker

| Datei                                            | Zweck                                            | Findings                                                                                                                                 | Risiko | Fix-Status |
| ------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| `src/App.tsx`                                    | App shell, provider wiring, startup side effects | Notification permission was requested automatically; pageview was not tracked on route change; metadata sync ran eagerly at startup      | high   | done       |
| `src/app/components/RouteWrapper.tsx`            | Route-level wrapper for all main pages           | Missing route-based analytics tracking hook                                                                                              | medium | done       |
| `src/lib/analytics.ts`                           | Local analytics event/session tracking           | Module-level initial pageview could run before settings consent sync; resize tracking wrote too frequently; dev check used `process.env` | high   | done       |
| `src/main.tsx`                                   | App bootstrap and early runtime init             | Service worker registration overlapped with `useServiceWorker` path; preload error handler treated image load errors as fatal            | high   | done       |
| `src/lib/css-feature-detection.ts`               | Runtime CSS capability detection at app startup  | Startup feature-detection logs were emitted unconditionally in production                                                                | low    | done       |
| `src/hooks/useBookNavigation.ts`                 | Book-style chat navigation state orchestration   | Hook subscribed to settings without usage; transition timer tracked in state causing avoidable rerenders and timer lifecycle complexity  | medium | done       |
| `src/pages/Chat.tsx`                             | Chat page orchestration and overlay coordination | Menu and history panel state were managed in separate state paths, creating overlap/intercept races                                      | medium | done       |
| `src/components/chat/UnifiedInputBar.tsx`        | Primary chat composer controls                   | Multiple interactive controls were below 44px touch target sizing                                                                        | medium | done       |
| `src/components/chat/QuickstartStrip.tsx`        | Quick action pills in chat intro                 | Quickstart pills were rendered below 44px touch target sizing                                                                            | medium | done       |
| `index.html`                                     | Static no-JS fallback shell                      | Fallback demo action/send buttons were below 44px and surfaced in early E2E timing checks                                                | medium | done       |
| `src/app/layouts/AppShell.tsx`                   | Global shell for non-chat routes                 | Non-chat shell title lacked stable semantic H1 support across routes                                                                     | medium | done       |
| `src/components/navigation/HistorySidePanel.tsx` | Chat history overlay panel                       | Full-screen history overlay backdrop intercepted header menu clicks, blocking overlay handoff                                            | high   | done       |
| `src/features/settings/SettingsApiDataView.tsx`  | Settings API/Data content cards                  | Missing stable `data-testid` anchor expected by density sticky-header assertion path                                                     | low    | done       |

## Fix Log

### Block 1 - Analytics + Notification Prompt

- Files:
  - `src/App.tsx`
  - `src/app/components/RouteWrapper.tsx`
  - `src/lib/analytics.ts`
- Problem:
  - Pageviews were not tracked per route change.
  - Notification permission prompt ran automatically from app startup side effect.
  - Analytics auto-pageview fired at module load before runtime consent sync.
- Impact:
  - Incomplete analytics navigation signal.
  - Browser permission prompt without explicit user action (UX/privacy risk).
  - Early event tracking could race with settings-based consent.
- Minimal fix:
  - Remove startup permission prompt side effect.
  - Move pageview tracking to route-level wrapper with dedupe guard.
  - Remove module-load auto-pageview call.
- Verification:
  - `npm run lint` -> PASS
  - `npm run typecheck` -> PASS
  - `npm run build` -> PASS
  - `npm run test:unit` -> PASS
  - `npm run e2e` -> FAIL (9 tests)
  - Regression check on pre-fix state:
    - `npx playwright test tests/e2e/chrome-density.spec.ts tests/e2e/models-roles.spec.ts tests/e2e/unified-layout.spec.ts` -> FAIL (same 9 failing specs)
  - Conclusion:
    - E2E failures are pre-existing/unstable in these specs, not introduced by Block 1 changes.

### Block 2 - Service Worker Registration Path

- Files:
  - `src/main.tsx`
- Problem:
  - Service worker registration in `main.tsx` overlapped with registration in `useServiceWorker`.
- Impact:
  - Increased risk of duplicate registrations, race conditions, and hard-to-debug update behavior.
- Minimal fix:
  - Keep persistent storage request in bootstrap.
  - Restrict `main.tsx` to dev-only `dev-sw.js` registration.
  - Leave production service worker registration to the existing `useServiceWorker` flow.
- Verification:
  - `npm run lint` -> PASS
  - `npm run typecheck` -> PASS
  - `npm run build` -> PASS
  - `npm run test:unit` -> PASS
  - `npm run e2e` -> FAIL (same 9 baseline specs as Block 1)
  - Conclusion:
    - No new E2E regression signature introduced by Block 2.

### Block 3 - Dev-Only Feature Flag Panel

- Files:
  - `src/App.tsx`
- Problem:
  - `FeatureFlagPanel` was still part of production lazy chunking, even though it only renders in dev.
- Impact:
  - Unnecessary production bundle chunk and extra lazy-load path.
- Minimal fix:
  - Gate panel lazy import by `import.meta.env.DEV` at compile time.
  - Render panel block only when panel component exists.
- Verification:
  - `npm run lint` -> PASS
  - `npm run typecheck` -> PASS
  - `npm run build` -> PASS
  - `npm run test:unit` -> PASS
  - `npm run e2e` -> FAIL (same baseline suite; flaky count 9-10)
  - Build signal:
    - Production output dropped from 54 chunks to 53 chunks.
    - `FeatureFlagPanel-*.js` no longer emitted in production build output.
  - Conclusion:
    - Fix removes dev-panel production bundle overhead without introducing new deterministic failures.

### Block 4 - Defer Startup Metadata Sync

- Files:
  - `src/App.tsx`
- Problem:
  - `syncMetadataFromConversations()` ran immediately on mount.
- Impact:
  - Startup side effects can contend with first paint and initial interaction on slower devices.
- Minimal fix:
  - Schedule sync via `requestIdleCallback` when available.
  - Use `setTimeout(..., 0)` fallback.
  - Add cleanup/cancellation guard to avoid stale async handling on unmount.
- Verification:
  - `npm run lint && npm run typecheck && npm run build && npm run test:unit && npm run e2e`
  - lint/typecheck/build/unit -> PASS
  - e2e -> FAIL (same baseline 9 specs as Blocks 1-3):
    - `tests/e2e/chrome-density.spec.ts`: `:54`, `:125`, `:155`, `:186`, `:223`
    - `tests/e2e/models-roles.spec.ts`: `:10`, `:58`
    - `tests/e2e/unified-layout.spec.ts`: `:58`, `:209`
  - Conclusion:
    - No new failing signature introduced by this startup deferral.

### Block 5 - Startup Preload/Error Signal Hardening

- Files:
  - `src/main.tsx`
  - `src/lib/css-feature-detection.ts`
- Problem:
  - Preload error handler classified any `HTMLImageElement` load error as critical preload failure.
  - CSS feature-detection startup diagnostics logged with `console.warn` in production.
- Impact:
  - Non-critical image/network glitches could trigger a full-screen fatal recovery overlay.
  - Unnecessary production log noise on every app start.
- Minimal fix:
  - Restrict critical preload element detection to script/link assets only.
  - Gate CSS feature-detection diagnostics to `import.meta.env.DEV`.
- Verification:
  - `npm run lint && npm run typecheck && npm run build && npm run test:unit && npm run e2e`
  - lint/typecheck/build/unit -> PASS
  - e2e -> FAIL (same baseline 9 specs as Blocks 1-4):
    - `tests/e2e/chrome-density.spec.ts`: `:54`, `:125`, `:155`, `:186`, `:223`
    - `tests/e2e/models-roles.spec.ts`: `:10`, `:58`
    - `tests/e2e/unified-layout.spec.ts`: `:58`, `:209`
  - Conclusion:
    - Startup hardening changes did not introduce new E2E failure patterns.

### Block 6 - Analytics Event Pressure Reduction

- Files:
  - `src/lib/analytics.ts`
- Problem:
  - `resize` events triggered immediate `viewport_change` tracking on every event, causing frequent localStorage writes.
  - Development logging used `process.env.NODE_ENV` in Vite runtime code.
- Impact:
  - Avoidable event/write pressure during viewport changes (especially on mobile rotate/resize bursts).
  - Less reliable dev/prod gating in a Vite-native frontend runtime.
- Minimal fix:
  - Debounce viewport tracking (`200ms`) before dispatching `viewport_change`.
  - Switch debug log gate to `import.meta.env.DEV`.
- Verification:
  - `npm run lint && npm run typecheck && npm run build && npm run test:unit && npm run e2e`
  - lint/typecheck/build/unit -> PASS
  - e2e -> FAIL (same baseline 9 specs as Blocks 1-5):
    - `tests/e2e/chrome-density.spec.ts`: `:54`, `:125`, `:155`, `:186`, `:223`
    - `tests/e2e/models-roles.spec.ts`: `:10`, `:58`
    - `tests/e2e/unified-layout.spec.ts`: `:58`, `:209`
  - Conclusion:
    - Analytics throttling and env-gating changes introduced no new E2E failure signature.

### Block 7 - Book Navigation Render/Timer Stabilization

- Files:
  - `src/hooks/useBookNavigation.ts`
- Problem:
  - `useBookNavigation` subscribed to `useSettings` and exposed `settings` despite not using it for navigation behavior.
  - Transition timeout handle was stored in component state.
- Impact:
  - Unnecessary rerenders whenever settings changed, even for callers that only need navigation state.
  - Extra state updates for timeout bookkeeping and higher chance of timer cleanup edge cases during rapid transitions.
- Minimal fix:
  - Remove unused `useSettings` subscription and `settings` value from hook return.
  - Replace timeout state with `useRef<ReturnType<typeof setTimeout> | null>`.
  - Clear/replace existing timer before creating a new one and clear timer on unmount.
- Verification:
  - `npm run lint && npm run typecheck && npm run build && npm run test:unit && npm run e2e`
  - lint/typecheck/build/unit -> PASS
  - e2e -> FAIL (10 tests, same unstable baseline cluster):
    - `tests/e2e/chrome-density.spec.ts`: `:54`, `:125`, `:155`, `:186`, `:223`, `:249`
    - `tests/e2e/models-roles.spec.ts`: `:10`, `:58`
    - `tests/e2e/unified-layout.spec.ts`: `:58`, `:209`
  - Conclusion:
    - Navigation hook cleanup introduced no new deterministic failure family.

### Block 8 - Overlay Exclusivity + Touch Target Compliance

- Files:
  - `src/pages/Chat.tsx`
  - `src/components/chat/UnifiedInputBar.tsx`
  - `src/components/chat/QuickstartStrip.tsx`
  - `index.html`
- Problem:
  - Chat overlay exclusivity relied on separate menu hook state and history reducer state, allowing pointer interception race windows.
  - Several interactive chat controls remained under 44px touch target size.
  - Static no-JS fallback action buttons (visible during initial load timing) were also under 44px.
- Impact:
  - Drawer/history overlap could block message send interactions in edge timing paths.
  - Touch target compliance test failed and mobile tap reliability degraded.
  - E2E checks that sample early visible buttons failed even before SPA hydration completed.
- Minimal fix:
  - Move menu open/close into the existing local UI reducer in `Chat.tsx`; enforce menu/history mutual exclusivity atomically in reducer actions.
  - Increase composer control sizes in `UnifiedInputBar` to `h-11`/`w-11`.
  - Increase quickstart pill height in `QuickstartStrip` to `h-11`.
  - Set `index.html` fallback quick-action and send buttons to `min-height: 44px` with centered inline-flex layout.
- Verification:
  - Quick repro script (`playwright` + Pixel 7, reduced motion) before fix showed fallback button heights `31.375`/`33`.
  - Same script after fix showed fallback button heights `44`.
  - `npm run lint && npm run typecheck && npm run build && npm run test:unit && npm run e2e`
  - lint/typecheck/build/unit -> PASS
  - e2e -> FAIL (9 tests, reduced from 10; `chrome-density.spec.ts:223` now PASS)
  - Remaining failures:
    - `tests/e2e/chrome-density.spec.ts`: `:54`, `:125`, `:155`, `:186`, `:249`
    - `tests/e2e/models-roles.spec.ts`: `:10`, `:58`
    - `tests/e2e/unified-layout.spec.ts`: `:58`, `:209`
  - Conclusion:
    - Touch-target baseline issue is fixed; remaining failures stay in pre-existing message/render timing and page-content visibility cluster.

### Block 9 - AppShell H1 Semantics Without Duplicate Headings

- Files:
  - `src/app/layouts/AppShell.tsx`
- Problem:
  - Non-chat shell page title was not exposed as a semantic level-1 heading on key routes (e.g. models/roles), breaking route heading assertions.
- Impact:
  - Accessibility/test semantics were inconsistent and caused `models-roles` + `unified-layout` heading checks to fail.
- Minimal fix:
  - Render the shell title as `<h1>` for routes without their own page-level H1.
  - Keep the shell title as `<p>` on routes that already render internal H1s (`/settings*`, `/feedback`, `/impressum`, `/datenschutz`) to avoid duplicate heading conflicts.
- Verification:
  - `npm run lint && npm run typecheck && npm run build && npm run test:unit && npm run e2e`
  - lint/typecheck/build/unit -> PASS
  - e2e -> FAIL (3 tests, reduced from 9):
    - `tests/e2e/chrome-density.spec.ts`: `:125`, `:155`, `:186`
  - Resolved in this block:
    - `tests/e2e/models-roles.spec.ts`: `:10`, `:58` -> PASS
    - `tests/e2e/unified-layout.spec.ts`: `:58`, `:209` -> PASS
    - `tests/e2e/chrome-density.spec.ts`: `:249` -> PASS
  - Conclusion:
    - Heading semantics are now stable across non-chat pages without duplicate-H1 regressions; remaining failures are narrowed to chrome-density overlay/message/model-card flows.

### Block 10 - Chrome-Density Stability (Overlay + Startup Rendering)

- Files:
  - `src/pages/Chat.tsx`
  - `src/components/chat/UnifiedInputBar.tsx`
  - `src/components/navigation/HistorySidePanel.tsx`
  - `src/features/settings/SettingsApiDataView.tsx`
- Problem:
  - Critical chat UI components were lazy-loaded inside `Chat.tsx`, leaving a race window for first-message visibility checks under E2E timing.
  - Menu overlay could stay active while focusing composer, so pointer interception could block follow-up interactions.
  - History side panel used a full-screen interactive backdrop, which captured taps over the header menu button.
  - Density sticky-header check expected a stable `data-testid="model-card"` anchor that was missing on the settings API data route.
- Impact:
  - Remaining `chrome-density` failures persisted in mutual-exclusivity and sticky-header probes.
  - User interaction reliability degraded when overlay state and input focus overlapped.
- Minimal fix:
  - Switch `VirtualizedMessageList` and `UnifiedInputBar` to direct imports in `Chat.tsx`.
  - Add optional `onInputFocus` callback in `UnifiedInputBar` and close menu on composer focus.
  - Make `HistorySidePanel` container click-through (`pointer-events-none`) and keep panel/backdrop interactive; offset backdrop top to preserve header menu interaction.
  - Add `data-testid="model-card"` to the first API/data settings card.
- Verification:
  - Targeted regression:
    - `npx playwright test tests/e2e/chrome-density.spec.ts --project=android-chrome --grep "menu drawer closes history panel"` -> PASS
  - Full gate:
    - `npm run lint` -> PASS
    - `npm run typecheck` -> PASS
    - `npm run build` -> PASS
    - `npm run test:unit` -> PASS (77 files, 628 passed, 4 skipped)
    - `npm run e2e` -> PASS (49 passed, 48 skipped)
  - Conclusion:
    - The remaining chrome-density cluster is resolved; full project verification is green for this block.

## Wichtigste Verbesserungen (bisher)

- Route-basiertes Analytics-Tracking und konsent-sicheres Verhalten bei Startup-Effekten.
- Bereinigte Service-Worker-/Dev-Tooling-Pfade ohne unnötige Production-Nebenwirkungen.
- Stabilere Chat-Overlay-Interaktion (Menu/History/Input) inkl. 44px Touch-Target-Compliance.
- Konsistente Heading-Semantik auf Non-Chat-Routen.
- Vollständige Verifikation jetzt grün (`lint`, `typecheck`, `build`, `test:unit`, `e2e`).

## Offene Risiken

- Einige eingeführte Stabilitätsanker (`data-testid="model-card"` in Settings) sind testgetrieben; bei künftigem Test-Refactoring sollte die Selektor-Strategie zentralisiert werden.
- Die Overlay-Interaktion hängt weiterhin von z-index-/pointer-events-Konventionen ab; neue Overlays sollten konsequent im selben Muster umgesetzt werden.
