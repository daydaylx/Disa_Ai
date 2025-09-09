# Refactor/Debug Plan

1. Tooling hardening
   - Ensure tsconfig strictness; align with exact optionals. Keep existing strict flags.
   - ESLint/Prettier consistent; no functional changes.
   - AC: `typecheck` and `lint` clean.
2. Tailwind layers normalization
   - Keep tokens in `theme.css`; avoid cross-layer @apply of custom utilities.
   - AC: `build` clean; no Tailwind layer warnings.
3. Type fixes
   - Guard optional props; add missing state (e.g., ModelPicker details toggle).
   - AC: `typecheck` clean.
4. UI refactors (stable)
   - Glass styling; unify buttons/inputs/pills; preserve behavior.
   - AC: E2E selectors unchanged; manual sanity on mobile/desktop viewports.
5. Services guards (no API changes)
   - Verify abort handling, error paths; keep semantics.
   - AC: no runtime errors in dev smoke tests.
6. Final verification
   - `typecheck`, `lint`, `build`, `test`; collect logs.
