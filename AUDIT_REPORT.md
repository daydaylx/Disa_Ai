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
| `src/main.tsx`                        | App bootstrap and early runtime init             | Service worker registration overlaps with `useServiceWorker` path                             | high   | todo       |

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
