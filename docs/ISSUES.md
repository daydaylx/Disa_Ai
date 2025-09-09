# Issues (baseline)

- TypeScript/ESLint (fixed): ModelPicker lacked `detailsFor` state after style updates.
- Build (fixed): Tailwind `@apply tap-target` in `theme.css` referenced a custom class not in the same layer; replaced with inline min-size.
- Tests: Vitest runner aborted with `ERR_IPC_CHANNEL_CLOSED` in this environment; investigate runner/pool settings if reproducible in CI.
- A11y: Focus rings standardized to primary tint; touch targets ≥44px on interactive controls.
