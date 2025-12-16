# Disa AI Design System

## Overview

The Disa AI Design System is based on the **"Modern Slate Glass"** approach, specifically optimized for mobile devices. It combines clean, minimal aesthetics with functional glass effects and precise spacing to create an elegant and highly usable interface. The system follows a consistent token-based approach with a focus on **calm productivity** and **clarity**.

## Design Philosophy

1. **Mobile-First**: All components optimized for touch interactions
2. **Minimal Noise**: Use shadows and effects sparingly and purposefully
3. **Functional Glass**: Glass effects only for headers, overlays, and modals
4. **Consistent Tokens**: Always use design tokens, never raw hex values
5. **Accessibility**: WCAG 2.1 AA compliance, high contrast, proper touch targets

---

## Color Palette

All colors are defined in `tailwind.config.ts` and should never be used as raw hex values.

### Background Colors

- `bg-app`: `#131314` - Deep dark app background (OLED-friendly)
- `bg-surface`: `#1E1E20` - Main surface color
- `surface-1`: `#1E1E20` - Cards, panels
- `surface-2`: `#27272A` - Input fields, hover states
- `surface-3`: `#3F3F46` - Active states, borders
- `surface-inset`: `#09090B` - Deep inset zones (code blocks, input areas)

### Text Colors (Ink)

- `ink-primary`: `#F4F4F5` - High contrast primary text (Zinc 100)
- `ink-secondary`: `#A1A1AA` - Supporting text (Zinc 400)
- `ink-tertiary`: `#71717A` - Meta information (Zinc 500)
- `ink-muted`: `#52525B` - Disabled/very subtle text (Zinc 600)

### Accent Colors

- `accent-primary`: `#6366f1` (Indigo 500) - Primary CTAs, focus states, main actions
- `accent-primary-dim`: `rgba(99, 102, 241, 0.1)` - Accent backgrounds
- `accent-secondary`: `#8b5cf6` (Purple) - Brand identity, special features, role pills
- `accent-tertiary`: `#06b6d4` (Cyan) - Links, info states, secondary actions

**Usage Guidelines:**

- **Primary (Indigo)**: Use for main CTAs (Send button, primary actions), focus rings
- **Secondary (Purple)**: Use for brand elements (active roles, premium features)
- **Tertiary (Cyan)**: Use for links, informational elements, tertiary actions

### Border Colors

- `border-ink`: `#27272A` - Very subtle borders (legacy, use sparingly)
- `border` (DEFAULT): `rgba(255, 255, 255, 0.1)` - Standard borders (most common)
- `border-subtle`: `rgba(255, 255, 255, 0.05)` - Very subtle separation
- `border-medium`: `rgba(255, 255, 255, 0.15)` - Interactive element borders
- `border-strong`: `rgba(255, 255, 255, 0.2)` - Active/focus borders

### Status Colors

- `status-error`: `#ef4444` (Red 500) - Errors, destructive actions
- `status-success`: `#22c55e` (Green 500) - Success states, confirmations
- `status-warning`: `#eab308` (Yellow 500) - Warnings, caution states
- `status-info`: `#06b6d4` (Cyan 500) - Informational messages

---

## Spacing System (8px Grid)

All spacing follows a consistent 8px-based grid:

```
spacing-1:  4px   (0.25rem)
spacing-2:  8px   (0.5rem)
spacing-3:  12px  (0.75rem)
spacing-4:  16px  (1rem)
spacing-5:  20px  (1.25rem)
spacing-6:  24px  (1.5rem)
spacing-7:  32px  (2rem)
spacing-8:  40px  (2.5rem)
spacing-9:  48px  (3rem)
spacing-10: 64px  (4rem)
```

**Common Usage:**

- **Component padding**: `p-4 sm:p-6` (16px mobile, 24px desktop)
- **Vertical gaps**: `gap-3` or `gap-4` between elements
- **Section spacing**: `py-6` or `py-8`
- **Page margins**: `px-4 sm:px-6`

---

## Border Radius

Standardized border radius values:

```
rounded-sm:   4px   (0.25rem)  - Very subtle rounding
rounded-md:   6px   (0.375rem) - Small elements
rounded-lg:   8px   (0.5rem)   - Inputs, small cards
rounded-xl:   12px  (0.75rem)  - Buttons, standard cards
rounded-2xl:  16px  (1rem)     - Large cards, panels
rounded-3xl:  24px  (1.5rem)   - Input bars, special containers
rounded-full: 9999px           - Pills, circular buttons
```

**Common Usage:**

- **Buttons**: `rounded-xl` (12px)
- **Cards**: `rounded-2xl` (16px)
- **Input bars**: `rounded-3xl` (24px)
- **Pills/badges**: `rounded-full`

---

## Shadow System

**IMPORTANT:** Use Tailwind's built-in shadow utilities ONLY. No custom shadow values.

```
shadow-none: No shadow (flat design)
shadow-sm:   Subtle elevation - default cards, buttons
shadow-md:   Medium elevation - interactive cards, dropdowns
shadow-lg:   High elevation - modals, floating elements
shadow-inset: Inset shadow for deep zones
```

**Usage Guidelines:**

- **Default cards**: `shadow-sm`
- **Interactive cards** (hover): `shadow-md`
- **Modals/overlays**: `shadow-lg`
- **Maximum 1 shadow per element** - never layer multiple shadows

---

## Glass Effects

Use glass effects **sparingly** and only for functional purposes.

### Utility Classes

```css
.glass-header  - For sticky headers (bg-surface-2/90 + backdrop-blur-md)
.glass-overlay - For overlays/drawers (bg-surface-1/80 + backdrop-blur-sm)
.glass-subtle  - For subtle transparency (bg-surface-1/60)
```

### When to Use Glass

✅ **DO use glass for:**

- Sticky headers that overlay content
- Modal backgrounds/overlays
- Drawers and side panels
- Context menus

❌ **DON'T use glass for:**

- Static cards or panels
- Message bubbles
- Regular buttons
- Input fields (unless floating over content)

---

## Opacity Standards

Standardized background opacity values:

```
100% (solid)      - Default for most UI elements
90% (glass-heavy) - Sticky headers with partial transparency
80% (glass-light) - Overlays, drawers, sheets
60% (subtle)      - Disabled states, very subtle backgrounds
```

---

## Components

### Buttons

Variants (defined in `Button.tsx`):

1. **primary**: Main actions with accent color - `bg-accent-primary text-white`
2. **secondary**: Secondary actions - `bg-surface-2 text-ink-primary`
3. **destructive**: Dangerous actions - `text-status-error border`
4. **outline**: Low-emphasis actions - `border bg-transparent`
5. **ghost**: Minimal actions - `hover:bg-surface-2`
6. **link**: Text-style links - `text-accent-primary underline`

**Sizes:**

- `sm`: 8px height, small padding (32px min)
- `default`: 10px height, standard padding (40px min)
- `lg`: 12px height, large padding (48px min)
- `icon`: Square icon button (40x40px)

### Cards

Unified card system (defined in `Card.tsx`):

1. **default**: Standard card - `border shadow-sm`
2. **flat**: No border, no shadow - `border-transparent`
3. **outline**: Wireframe style - `bg-transparent border`
4. **interactive**: Clickable card - `hover:bg-surface-2 cursor-pointer`
5. **elevated**: Raised appearance - `shadow-md`
6. **inset**: Deep inset style - `bg-surface-inset shadow-inset`

**Padding variants:**

- `none`: No padding
- `sm`: 12px mobile, 16px desktop
- `default`: 16px mobile, 20px desktop
- `lg`: 24px all sizes

### Form Elements

1. **Input**: Text input with minimal style - `bg-surface-2 border rounded-xl`
2. **Textarea**: Multi-line input - same styling as Input
3. **Select**: Dropdown select - `bg-surface-2 border rounded-xl`
4. **Switch**: Toggle switch - `bg-surface-2` (off), `bg-accent-primary` (on)
5. **Checkbox/Radio**: Standard form controls with accent color

**Focus States:**

- All inputs: `focus:ring-2 focus:ring-accent-primary/50 focus:outline-none`
- Borders: `focus:border-accent-primary`

### Navigation

- **Mobile-first**: Bottom navigation on mobile, sidebar on desktop
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Active states**: Clear visual feedback with `bg-surface-3` or accent colors
- **Focus indicators**: Visible focus rings for keyboard navigation

---

## Typography

Font families:

- **Sans-serif**: Inter (primary), system fallbacks
- **Monospace**: JetBrains Mono, Fira Code

### Hierarchy

```
h1: text-2xl font-semibold (24px)
h2: text-xl font-semibold (20px)
h3: text-lg font-semibold (18px)
h4: text-base font-semibold (16px)
h5: text-sm font-semibold (14px)
h6: text-xs font-semibold (12px)

Body: text-base (16px)
Small: text-sm (14px)
Caption: text-xs (12px)
Tiny: text-[11px] (use sparingly, accessibility concern)
```

### Text Colors

- **Headings**: `text-ink-primary`
- **Body text**: `text-ink-primary` or `text-ink-secondary`
- **Supporting text**: `text-ink-secondary`
- **Meta/timestamps**: `text-ink-tertiary`
- **Disabled**: `text-ink-muted`

---

## Best Practices

### ✅ DO

- Use design tokens exclusively (no raw hex values)
- Keep shadow usage minimal (max 1 per element)
- Test on real mobile devices (especially iOS Safari)
- Ensure 44x44px minimum touch targets
- Use semantic HTML (headings, sections, nav, etc.)
- Provide focus indicators for keyboard navigation
- Respect `prefers-reduced-motion` in animations

### ❌ DON'T

- Use raw `100vh` (use `100dvh` or `--vh` custom property)
- Add multiple shadows to one element
- Use glass effects on static content
- Use arbitrary z-index values (use named utilities)
- Skip accessibility testing
- Use font sizes smaller than 12px for body text
- Combine too many visual effects (border + shadow + blur + gradient)

---

## Integration with Tailwind

The design system is fully integrated with Tailwind CSS:

- **Colors**: All defined in `tailwind.config.ts` `theme.extend.colors`
- **Spacing**: Uses Tailwind's default 4px/8px scale
- **Shadows**: Uses Tailwind's built-in shadow utilities
- **Borders**: Custom border utilities in config
- **Glass effects**: Custom utility classes via plugin

---

## Mobile-Specific Considerations

### Viewport Height

Use dynamic viewport height to account for mobile browser chrome:

```css
height: calc(var(--vh, 1vh) * 100)
/* OR */
height: 100dvh
```

### Safe Areas

Handle notches and rounded corners:

```css
padding-bottom: env(safe-area-inset-bottom)
padding-top: env(safe-area-inset-top)
```

### Touch Behavior

- **Touch targets**: Minimum 44x44px (Apple HIG guideline)
- **Prevent zoom**: `font-size: max(16px, ...)` on inputs
- **Touch action**: `touch-action: manipulation` on buttons
- **Tap highlight**: `-webkit-tap-highlight-color: transparent`

### Performance

- Limit backdrop-blur usage (expensive on GPU)
- Avoid excessive shadows (creates multiple GPU layers)
- Use `will-change` sparingly and remove after animation
- Optimize images and use WebP format

### Brand Card Variants

- `BrandCard` centralizes the card + tint system. Variants:
  - `plain`: neutral dark card (no tint) for settings, lists, or input chrome.
  - `tinted`: subtle left-to-right tint using `--tint-alpha-soft` for home hero/suggestions and branded containers.
  - `roleStrong`: stronger tint based on `--tint-alpha-strong` for Role/Theme showcases.
- Adjust tint hue by passing `tintRgb` (e.g. `"45, 212, 191"` for teal) instead of hardcoding gradients.

---

## Version & Updates

**Current Version**: Modern Slate Glass v1.0
**Last Updated**: 2025-12-06
**Status**: Active & Stable

For questions or suggestions, see the project README or contribute via GitHub issues.
