# Designsystem - Disa AI

**Stand:** 2025-10-31
**Version:** 2.0 (Fluent 2 Soft-Depth mit Neo-Depth Extensions)

## Primäres Designsystem: Fluent 2 Soft-Depth

Das Projekt nutzt **Microsoft Fluent 2 Soft-Depth** als primäres Designsystem mit eigenen Neo-Depth Extensions für mobile-first KI-Chat-Interfaces.

---

## Komponenten-Hierarchie

### ✅ Primär: `Card` (Single Source of Truth)

**Datei:** `src/components/ui/card.tsx`
**Status:** ✅ **Primäre Komponente** - Vollständiges Designsystem

**Features:**

- Class Variance Authority (CVA) für typsichere Varianten
- 7 Varianten-Dimensionen mit 50+ Kombinationen
- Vollständige Accessibility (WCAG 2.1 AA)
- Touch-Optimierung (44px Minimum)
- Motion-Safe Animationen
- Neo-Depth Extensions

**Varianten:**

```typescript
<Card
  tone="default" | "muted" | "contrast" | "translucent" | "solid" | "outlined"
  elevation="none" | "surface" | "raised" | "overlay" | "popover" |
            "surface-subtle" | "surface-prominent" | "surface-hover" | "surface-active"
  interactive={false} | "gentle" | "dramatic" | "subtle" | "press" | "lift" |
              "glow" | "glow-success" | "glow-warning" | "glow-error"
  padding="none" | "xs" | "sm" | "md" | "lg" | "xl"
  size="auto" | "sm" | "md" | "lg" | "xl" | "full"
  intent="default" | "primary" | "secondary" | "warning" | "error" | "success" | "info"
  state="default" | "loading" | "disabled" | "selected" | "focus"
/>
```

**Sub-Komponenten:**

- `CardHeader` - Header mit Spacing
- `CardTitle` - H3 Titel mit Typography
- `CardDescription` - Beschreibungstext
- `CardContent` - Haupt-Content-Bereich
- `CardFooter` - Footer mit Border-Top

**Verwendung:**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card tone="translucent" elevation="raised" interactive="gentle">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
  </CardHeader>
  <CardContent>Content hier</CardContent>
</Card>;
```

---

### ✅ Sekundär: `SoftDepthSurface` (Simplified Alternative)

**Datei:** `src/components/SoftDepthSurface.tsx`
**Status:** ✅ **Simplified Alternative** für einfache Use Cases

**Features:**

- Nur 3 Varianten: `subtle`, `standard`, `strong`
- Leichtgewichtig (46 Zeilen)
- `asChild` Pattern für Komposition

**Verwendung:**

```tsx
import { SoftDepthSurface } from "@/components/SoftDepthSurface";

<SoftDepthSurface variant="standard">
  <div>Content</div>
</SoftDepthSurface>;
```

**Empfehlung:** Verwende `Card` für neue Features. `SoftDepthSurface` nur für Legacy-Code oder sehr einfache Szenarien.

---

### ⚠️ Wrapper: `GlassCard` (Backwards Compatibility)

**Datei:** `src/components/ui/GlassCard.tsx`
**Status:** ⚠️ **Wrapper** - Nur für Backwards Compatibility

**Funktion:**

```typescript
// GlassCard ist nur ein Wrapper:
<GlassCard /> === <Card tone="translucent" elevation="surface" />
```

**Verwendung in 6 Dateien:**

- `src/components/models/MobileModelsInterface.tsx`
- `src/pages/MobileStudio.tsx`
- `src/features/settings/SettingsOverview.tsx`
- `src/features/settings/SettingsView.tsx`
- `src/features/design-directions/DesignDirectionShowcase.tsx`

**Empfehlung:** Ersetze schrittweise durch direkte `Card`-Verwendung:

```tsx
// Vorher:
<GlassCard>Content</GlassCard>

// Nachher:
<Card tone="translucent" elevation="surface">Content</Card>
```

---

## Design Tokens

Alle Design Tokens sind zentral definiert in:

- **CSS:** `src/styles/tokens.css` (712 Zeilen)
- **CSS (index.css):** Fluent 2 Surface Klassen

### Farb-System

```css
/* Surface Colors */
--color-surface-canvas: var(--bg0);
--color-surface-base: var(--bg1);
--color-surface-subtle: ...;
--color-surface-card: ...;
--color-surface-raised: ...;
--color-surface-popover: ...;
--color-surface-overlay: ...;

/* Text Colors */
--color-text-primary: var(--fg0);
--color-text-secondary: var(--fg1);
--color-text-tertiary: var(--fg2);
--color-text-muted: var(--fg-muted);
--color-text-inverse: var(--fg-invert);

/* Brand Colors */
--color-brand-primary: var(--acc1);
--color-brand-primary-hover: var(--acc1-strong);
```

### Elevation System (Soft-Depth)

```css
/* Shadows */
--shadow-surface: var(--elev-1);
--shadow-raised: var(--elev-2);
--shadow-overlay: var(--elev-4);
--shadow-popover: var(--elev-8);
--shadow-focus: 0 0 0 3px color-mix(...);

/* Neo-Depth Extensions */
--shadow-surface-subtle
--shadow-surface-prominent
--shadow-surface-hover
--shadow-surface-active
```

### Motion System

```css
/* Durations */
--motion-duration-micro: 120ms;
--motion-duration-small: 150ms;
--motion-duration-medium: 180ms;
--motion-duration-large: 200ms;

/* Easings */
--motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--motion-easing-emphasized: cubic-bezier(0.34, 1.56, 0.64, 1);
--motion-easing-exit: cubic-bezier(0.4, 0, 1, 1);
```

### Typography Scale

```css
/* Sizes */
--type-12: 0.75rem; /* Caption */
--type-14: 0.875rem; /* Body Small */
--type-16: 1rem; /* Body */
--type-18: 1.125rem; /* Subtitle */
--type-20: 1.25rem; /* Title */
--type-24: 1.5rem; /* Headline */
--type-28: 1.75rem; /* Large Headline */
--type-32: 2rem; /* Display */
```

### Spacing Scale

```css
--space-3xs: 0.125rem; /* 2px */
--space-2xs: 0.25rem; /* 4px */
--space-xs: 0.5rem; /* 8px */
--space-sm: 0.75rem; /* 12px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
```

### Border Radius

```css
--radius-sm: 4px; /* Small controls */
--radius-md: 8px; /* Standard */
--radius-lg: 12px; /* Cards */
--radius-xl: 16px; /* Large surfaces */
--radius-pill: 16px;
--radius-full: 50%;
```

---

## CSS Utility Classes

### Fluent 2 Soft-Depth Surfaces (in index.css)

```css
/* Base Surfaces */
.soft-surface          /* Standard Soft-Depth Surface */
.soft-surface--subtle  /* Subtle variant */
.soft-surface--standard /* Standard variant */
.soft-surface--strong  /* Strong variant */

/* Specialized Surfaces */
.soft-surface-card     /* Card-style surface */
.soft-surface-panel    /* Panel with elevated shadow */
.soft-surface-chrome   /* Chrome/toolbar surface */

/* Legacy (deprecated) */
.surface-card          /* Use Card component instead */
.card-depth            /* Use Card component instead */
```

**Empfehlung:** Verwende die `Card` Komponente statt CSS-Klassen für bessere Type-Safety und Variants.

---

## Accessibility Features

Alle Komponenten implementieren:

- **WCAG 2.1 AA** Kontrast-Anforderungen
- **Touch Targets:** Minimum 44px (iOS), 48px (Android)
- **Keyboard Navigation:** Tab, Enter, Space
- **Screen Reader:** ARIA-Labels, Roles, States
- **Focus Management:** Visible Focus Rings
- **Motion Preferences:** `prefers-reduced-motion` Support

---

## Migration Guide

### Von `SoftDepthSurface` zu `Card`

```tsx
// Vorher:
<SoftDepthSurface variant="subtle">
  <div>Content</div>
</SoftDepthSurface>

// Nachher:
<Card tone="muted" elevation="surface-subtle" padding="md">
  <CardContent>Content</CardContent>
</Card>
```

### Von `GlassCard` zu `Card`

```tsx
// Vorher:
<GlassCard>
  <div>Content</div>
</GlassCard>

// Nachher:
<Card tone="translucent" elevation="surface">
  <CardContent>Content</CardContent>
</Card>
```

### Von CSS-Klassen zu Komponenten

```tsx
// Vorher:
<div className="soft-surface soft-tile">
  Content
</div>

// Nachher:
<Card tone="default" elevation="surface" interactive="gentle">
  <CardContent>Content</CardContent>
</Card>
```

---

## Naming Conventions

### ✅ Empfohlene Namen

- `Card` - Primäre Komponente
- `Surface` - Generischer Begriff für Flächen
- `Panel` - Größere Container
- `Tile` - Kleinere, interaktive Kacheln

### ❌ Veraltete/Verwirrende Namen

- `Glass` - Mehrdeutig (war vorher für Acrylic-Effekte)
- `DepthSurface` - Zu spezifisch
- `GlassCard` - Redundanter Wrapper

---

## Best Practices

### 1. Verwende `Card` für neue Features

```tsx
✅ <Card tone="translucent" interactive="gentle">
❌ <div className="soft-surface">
```

### 2. Nutze semantische Varianten

```tsx
✅ <Card intent="error" interactive="glow-error">
❌ <Card className="border-red-500 hover:shadow-red">
```

### 3. Bevorzuge Komponenten über Utility-Klassen

```tsx
✅ <Card elevation="raised">
❌ <div className="shadow-raised">
```

### 4. Accessibility First

```tsx
✅ <Card clickable onCardClick={...} aria-label="Open settings">
❌ <div onClick={...}>
```

### 5. Motion-Safe Animationen

```tsx
✅ <Card interactive="gentle">  // Respects prefers-reduced-motion
❌ <div className="animate-bounce">  // Always animates
```

---

## Roadmap

### Phase 2 (aktuell)

- ✅ Designsystem dokumentiert
- ⏳ `GlassCard` Verwendungen migrieren
- ⏳ CSS Utility Classes audit

### Phase 3

- Vollständige Migration zu `Card` Komponente
- Deprecation von `SoftDepthSurface` (optional behalten als Alias)
- Entfernung ungenutzter CSS-Klassen

---

## Support & Fragen

**Dokumentation:**

- [Fluent 2 Design Language](https://fluent2.microsoft.design/)
- [Class Variance Authority Docs](https://cva.style/)

**Code-Referenzen:**

- `src/components/ui/card.tsx` - Card Komponente
- `src/styles/tokens.css` - Design Tokens
- `src/index.css` - Utility Classes
