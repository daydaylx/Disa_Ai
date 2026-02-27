# SPA/React Audit Report

## Baseline

- Branch at start: `main`
- Baseline checks:
  - `npm run verify` -> PASS
  - `npm run build` -> PASS
- Notes:
  - Build updates generated files (`build-info.json`, `src/styles/design-tokens.generated.ts`).
  - For this audit, generated-only diffs are reset after verification unless part of a real fix.

## Findings Tracker

| Datei                                 | Zweck                                            | Findings                                                                                      | Risiko | Fix-Status |
| ------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------ | ---------- |
| `src/App.tsx`                         | App shell, provider wiring, startup side effects | Notification permission was requested automatically; pageview was not tracked on route change | high   | done       |
| `src/app/components/RouteWrapper.tsx` | Route-level wrapper for all main pages           | Missing route-based analytics tracking hook                                                   | medium | done       |
| `src/lib/analytics.ts`                | Local analytics event/session tracking           | Module-level initial pageview could run before settings consent sync                          | high   | done       |
| `src/main.tsx`                        | App bootstrap and early runtime init             | Service worker registration overlapped with `useServiceWorker` path                           | high   | done       |

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
