# Design Tokens - Disa AI

## Overview

This document describes the design token system for Disa AI, providing a single source of truth for all design decisions.

## Token Categories

### Colors

#### Neutral Scale (Dark Theme)
- `neutral.900` (#05070d) - Deepest background
- `neutral.800` (#0b1118) - Main background
- `neutral.700` (#111a26) - Surface level 1
- `neutral.600` (#172231) - Surface level 2
- `neutral.500` (#1d2b3c) - Surface level 3
- `neutral.400` (#2d3b50) - Strong borders
- `neutral.300` (#1b2735) - Subtle borders
- `neutral.200` (#95a4bb) - Muted text
- `neutral.100` (#c6cfde) - Secondary text
- `neutral.50` (#f4f7fb) - Primary text

#### Accent Colors (Cyan)
- `accent.700` (#0a8aae) - Active state
- `accent.600` (#0fb5d0) - Hover state
- `accent.500` (#22d3ee) - Primary accent
- `accent.400` (#38bdf8) - Light variant
- `accent.300` (#7dd3fc) - Lighter variant
- `accent.100` (rgba(34, 211, 238, 0.16)) - Low opacity background
- `accent.50` (rgba(34, 211, 238, 0.08)) - Subtle background

#### Semantic Colors
- `semantic.danger` (#ef4444) - Error states
- `semantic.success` (#22c55e) - Success states
- `semantic.warning` (#f59e0b) - Warning states
- `semantic.info` (#3b82f6) - Info states

### Spacing

4px base unit following 4/8/12/16/24/32/48/64/80 scale:
- `spacing.1` (4px) - Minimal spacing
- `spacing.2` (8px) - Small spacing
- `spacing.3` (12px) - Compact spacing
- `spacing.4` (16px) - Default spacing
- `spacing.6` (24px) - Large spacing
- `spacing.8` (32px) - Extra large spacing
- `spacing.12` (48px) - Section spacing
- `spacing.16` (64px) - Layout spacing
- `spacing.20` (80px) - Large layout spacing

### Typography

#### Scales
- **h1**: 24px/32px, weight 600, tracking -0.01em
- **h2**: 20px/24px, weight 600, tracking -0.01em
- **subtitle**: 18px/24px, weight 500
- **body**: 16px/24px, weight 400
- **label**: 13px/18px, weight 500
- **mono**: 14px/20px, weight 400, monospace family

### Border Radius
- `borderRadius.sm` (6px) - Small elements
- `borderRadius.md` (10px) - Default elements
- `borderRadius.lg` (14px) - Large elements
- `borderRadius.xl` (18px) - Extra large elements

### Shadows
- `shadows.1` - Subtle elevation
- `shadows.2` - Medium elevation
- `shadows.3` - High elevation

### Touch Targets
- `touchTargets.minimum` (44px) - WCAG AA minimum
- `touchTargets.comfortable` (48px) - Android recommendation
- `touchTargets.roomy` (56px) - Extra comfort

### Transitions
- `transitions.fast` (150ms) - Micro-interactions
- `transitions.normal` (200ms) - Standard interactions
- `transitions.slow` (300ms) - Sheets, modals

## Usage

### In TypeScript/React
```tsx
import { colors, spacing, typography } from '../design-tokens';

const buttonStyle = {
  backgroundColor: colors.accent[500],
  padding: spacing[4],
  fontSize: typography.body.fontSize,
};
```

### In CSS (via Tailwind)
```css
.button {
  @apply bg-accent text-accent-foreground;
  @apply px-4 py-2 rounded-md;
  @apply min-h-touch min-w-touch;
}
```

### CSS Custom Properties
All tokens are available as CSS custom properties:
```css
.element {
  background-color: var(--accent-500);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

## Implementation Status

### ✅ Completed
- [x] Design tokens file created (`src/design-tokens.ts`)
- [x] Tailwind config updated to use tokens
- [x] CSS custom properties defined
- [x] ESLint rule to prevent inline hex colors
- [x] Touch target utilities added

### 🔄 In Progress
- [ ] Remove inline hex colors from all components
- [ ] Update all rgba() calls to use tokens
- [ ] Add purple semantic color for settings

### 📋 TODO
- [ ] Add light theme variants
- [ ] Document component-specific token usage
- [ ] Create token usage examples for common patterns

## ESLint Integration

The codebase includes ESLint rules to prevent inline color usage:

```javascript
// ❌ Not allowed
const badStyle = { color: '#ff0000' };
const alsobad = { background: 'rgb(255, 0, 0)' };

// ✅ Allowed
const goodStyle = { color: colors.semantic.danger };
const alsoGood = 'text-danger'; // Tailwind class
```

## Migration Strategy

1. **Phase 1**: Replace hex colors with design tokens
2. **Phase 2**: Replace rgba() calls with token-based alternatives
3. **Phase 3**: Audit and standardize spacing usage
4. **Phase 4**: Implement typography scale consistently

## Files to Update

Based on current analysis, the following files contain inline colors:

### High Priority
- `src/lib/android/system.ts` - Theme color updates
- `src/lib/toast/mobileToast.ts` - Toast styling
- `src/components/Badge.tsx` - Badge background colors
- `src/components/ModelPicker.tsx` - Chip colors
- `src/components/feedback/ErrorState.tsx` - Error styling

### Medium Priority
- `src/components/ui/HeroOrb.tsx` - Gradient colors
- `src/components/ui/CommandPalette.tsx` - Selection states
- `src/components/ui/BottomSheet.tsx` - Handle and button colors
- `src/components/chat/Avatar.tsx` - Avatar styling
- `src/components/chat/Composer.tsx` - Error state styling

### Low Priority
- `src/App.tsx` - Header background
- `src/ui/base.css` - Scrollbar styling
- Various inline style remnants