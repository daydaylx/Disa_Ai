# Disa AI Design System

This document describes the unified design system for the Disa AI application.

## Architecture

The design system follows a single-source-of-truth approach:

- `theme.css` - Main design tokens (colors, spacing, typography, shadows, motion)
- `z-index-system.css` - Z-index hierarchy (already consolidated)
- `index.css` - Main entry point that imports all necessary styles
- Component-specific styles use Tailwind and CSS variables from the theme

## Token Structure

### Colors

- Semantic tokens: `--accent`, `--success`, `--warning`, `--danger`, etc.
- Surface tokens: `--surface-bg`, `--surface-base`, `--surface-card`, etc.
- Text tokens: `--fg`, `--fg-muted`, `--fg-subtle`, etc.

### Spacing

- Scale: `--space-3xs` to `--space-4xl`
- Aliases: `--page-padding-x`, `--page-padding-y`

### Typography

- Font families: `--font-family-sans`, `--font-family-mono`
- Sizes: `--font-size-body`, `--font-size-h1`, etc.
- Line heights: `--line-height-body`, `--line-height-h1`, etc.
- Weights: `--font-weight-body`, `--font-weight-bold`, etc.

### Radius

- Scale: `--radius-sm` to `--radius-pill`

### Shadows

- Standard: `--shadow-card`, `--shadow-overlay`, etc.
- Neumorphism: `--shadow-neo-sm` to `--shadow-neo-xl`

## Migration Path

Gradually migrate components to use the unified design system:

1. Ensure all components use variables from `theme.css`
2. Remove references to old or duplicate tokens
3. Consolidate component styles into Tailwind classes where possible
4. Use CVA (Class Variance Authority) for component variants

## Best Practices

- Use CSS variables from `theme.css` rather than hardcoded values
- Prefer Tailwind utility classes with theme references (e.g., `bg-[var(--surface-bg)]`)
- Use CVA for complex component variants
- Follow consistent naming conventions
- Ensure all interactive elements meet accessibility requirements (min 44px touch targets)
