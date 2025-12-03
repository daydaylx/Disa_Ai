# Motion Specification

This document outlines the motion guidelines for the application, ensuring a consistent and fluid user experience. All animations and transitions adhere to a defined set of durations and easing curves, preventing jarring or inconsistent visual feedback.

## Principles

*   **Purposeful Motion**: Animations should serve a clear purpose, guiding the user's attention, providing feedback, or enhancing the perceived performance.
*   **Subtle & Fast**: Prioritize quick and subtle transitions to maintain a responsive feel. Avoid overly long or distracting animations.
*   **Consistency**: Use the defined motion tokens across the entire application for a unified experience.
*   **Accessibility**: Respect user preferences for reduced motion.

## Motion Tokens

All motion properties are defined using CSS variables and mapped in `tailwind.config.ts` for easy consumption via Tailwind CSS utility classes.

### Durations

The following durations are available:

| Token                 | Value   | Usage                               |
| :-------------------- | :------ | :---------------------------------- |
| `--motion-duration-1` | `120ms` | Quick interactions (e.g., Chips, Hover states) |
| `--motion-duration-2` | `180ms` | Base interactions (e.g., Modals, Tooltips) |
| `--motion-duration-3` | `240ms` | Page transitions, complex elements  |

**Tailwind Mapping:**
*   `duration-1` (120ms)
*   `duration-2` (180ms)
*   `duration-3` (240ms)

### Easing

A single, consistent easing curve is used for all animations to ensure a cohesive feel.

| Token             | Value                     | Usage                               |
| :---------------- | :------------------------ | :---------------------------------- |
| `--motion-ease-1` | `cubic-bezier(.23,1,.32,1)` | Standard easing for all animations  |

**Tailwind Mapping:**
*   `ease-1` (cubic-bezier(.23,1,.32,1))

## Usage Examples

*   **Chips**: `transition-all duration-1 ease-1`
*   **Modals**: `transition-all duration-2 ease-1`
*   **Page Transitions**: `transition-all duration-3 ease-1`
*   **Hover/Press States**: `transition-all duration-1 ease-1`

## Implementation Notes

*   Ensure that `prefers-reduced-motion` media query is respected to disable or reduce animations for users who prefer less motion.
*   Avoid using raw `ms` values or `cubic-bezier` functions directly in components. Always refer to the defined motion tokens.
*   For complex animations, consider using animation libraries that integrate well with CSS variables and Tailwind, if necessary, but always adhere to the defined tokens.