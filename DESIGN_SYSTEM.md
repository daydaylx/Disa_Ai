# Dramatic Neumorphism Design System

> **Version:** 2.0.0-alpha
> **Status:** In Konsolidierung
> **Letztes Update:** November 2025

## Übersicht

Disa AI verwendet ein **Dramatic Neumorphism Design-System**, das sich durch tiefe, mehrschichtige Schatten und erhabene Oberflächen für eine taktile, dreidimensionale Benutzererfahrung auszeichnet. Das System ist vollständig mobile-optimiert und Performance-orientiert.

---

## 🎨 Design-Philosophie

### Core Principles

1. **Dramatic Depth**: Verwendung tiefer Schatten für starken 3D-Effekt
2. **Tactile Interaction**: Fühlbare UI-Elemente durch Neumorphic Effects
3. **Mobile-First Performance**: Optimierte Shadows für Mobile-Geräte
4. **Accessibility-Aware**: Kontrast und Fokus-Indikatoren berücksichtigt

### Visual Hierarchy

```
Surface Layer System:
├── Base Surface (--surface-neumorphic-base)
├── Floating Elements (--surface-neumorphic-floating)
├── Raised Interactive (--surface-neumorphic-raised)
├── Pressed State (--surface-neumorphic-pressed)
└── Overlay/Modal (--surface-neumorphic-overlay)
```

---

## 🔧 Token-System

### Color Palette

#### Base Colors (Light Theme)

```css
/* Core colors */
--fg0: #0f1724; /* Primary text */
--fg1: #4a5163; /* Secondary text */
--fg2: #676d82; /* Muted text */
--fg-invert: #f6f7ff; /* Inverted text */
--fg-muted: color-mix(in srgb, var(--fg1) 65%, var(--bg1));

--bg0: #e9ecf4; /* Canvas background */
--bg1: #fdfdff; /* Primary surface */
--bg2: #dfe3f0; /* Secondary surface */

--acc1: #4b63ff; /* Primary accent */
--acc1-strong: #3748df; /* Strong primary */
--acc2: #f45d69; /* Secondary accent */
--acc2-strong: #d63b4b; /* Strong secondary */
--color-accent-surface: color-mix(in srgb, var(--acc2) 14%, white 86%);
--color-accent-surface-strong: color-mix(in srgb, var(--acc2) 24%, white 76%);
--color-accent-border: color-mix(in srgb, var(--acc2) 48%, transparent);
```

#### Semantic Colors

```css
--ok: #0d8f62; /* Success state */
--warn: #b26a00; /* Warning state */
--err: #c13a32; /* Error state */
--info: #0d73d6; /* Information state */
```

#### Surface System (Neumorphic)

```css
--color-surface-canvas: var(--bg0);
--color-surface-base: var(--bg1);
--color-surface-subtle: color-mix(in srgb, var(--bg1) 80%, var(--bg2));
--color-surface-muted: var(--bg2);
--color-surface-raised: color-mix(in srgb, var(--bg1) 95%, rgba(255, 255, 255, 0.85));
--color-surface-card: var(--bg1);
--color-surface-popover: color-mix(in srgb, var(--bg1) 98%, rgba(255, 255, 255, 0.9));
--color-surface-overlay: color-mix(in srgb, var(--bg1) 92%, rgba(15, 18, 32, 0.65));
```

### Accent Usage Guidelines

| Zweck                   | Farbe/Baustein                                   |
| ----------------------- | ------------------------------------------------ |
| Brand-Aktionen          | `Button variant="brand"` / `--acc1`              |
| Sekundäre Highlights    | `Button variant="accent"` / `--color-accent-*`   |
| Filter-/Toggle-Zustände | Ghost → Accent wechseln (z.B. Favoriten, Filter) |
| Karten-Auswahl          | `Card intent="accent"` oder `state="selected"`   |
| Kategorie-Badges        | `Badge variant="accent"` oder `category=*`       |

**Regel:** Brand (`--acc1`) signalisiert Kerninteraktionen, Accent (`--acc2`) bringt Wärme/Fokus. Niemals beide gleichzeitig innerhalb eines Elements kombinieren – pro Komponente entscheidet man sich für Brand _oder_ Accent.

### Shadow System (Dramatic Neumorphic)

#### Light Theme Shadows

```css
/* Progressive shadow depth scale (Light Theme 2.1) */
--shadow-neumorphic-sm:
  6px 6px 14px rgba(9, 12, 20, 0.12), -6px -6px 14px rgba(255, 255, 255, 0.08);

--shadow-neumorphic-md:
  12px 12px 26px rgba(9, 12, 20, 0.15), -12px -12px 26px rgba(255, 255, 255, 0.1);

--shadow-neumorphic-lg:
  20px 20px 40px rgba(9, 12, 20, 0.18), -20px -20px 40px rgba(255, 255, 255, 0.12);

--shadow-neumorphic-xl:
  28px 28px 56px rgba(9, 12, 20, 0.21), -28px -28px 56px rgba(255, 255, 255, 0.14);

--shadow-neumorphic-dramatic:
  36px 36px 72px rgba(9, 12, 20, 0.23), -36px -36px 72px rgba(255, 255, 255, 0.16);

--shadow-neumorphic-extreme:
  48px 48px 96px rgba(9, 12, 20, 0.25), -48px -48px 96px rgba(255, 255, 255, 0.18);
```

#### Dark Theme Shadows (High Contrast)

```css
--shadow-neumorphic-sm: 3px 3px 8px rgba(0, 0, 0, 0.38), -3px -3px 8px rgba(255, 255, 255, 0.04);

--shadow-neumorphic-md: 5px 5px 12px rgba(0, 0, 0, 0.46), -5px -5px 12px rgba(255, 255, 255, 0.05);

--shadow-neumorphic-lg: 9px 9px 20px rgba(0, 0, 0, 0.52), -9px -9px 20px rgba(255, 255, 255, 0.07);

--shadow-neumorphic-xl:
  14px 14px 30px rgba(0, 0, 0, 0.58), -14px -14px 30px rgba(255, 255, 255, 0.08);

--shadow-neumorphic-dramatic:
  30px 30px 64px rgba(0, 0, 0, 0.74), -30px -30px 64px rgba(255, 255, 255, 0.14);

--shadow-neumorphic-extreme:
  42px 42px 88px rgba(0, 0, 0, 0.78), -42px -42px 88px rgba(255, 255, 255, 0.15);
```

#### Mobile-Optimized Shadows

```css
@media (max-width: 768px) {
  /* Reduzierte Shadow-Complexity für bessere Performance */
  --shadow-neumorphic-dramatic:
    30px 30px 60px rgba(9, 12, 20, 0.25), -30px -30px 60px rgba(255, 255, 255, 0.18);

  --shadow-neumorphic-extreme:
    35px 35px 70px rgba(9, 12, 20, 0.28), -35px -35px 70px rgba(255, 255, 255, 0.2);

  /* Depth-7 und höher sind auf Mobile deaktiviert */
  --shadow-depth-7: var(--shadow-neumorphic-extreme);
  --shadow-depth-8: var(--shadow-neumorphic-extreme);
}
```

### Typography Scale

```css
/* Font sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */

/* Font weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
/* Spacing tokens */
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-5: 1.25rem; /* 20px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-10: 2.5rem; /* 40px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
```

### Border Radius Scale

```css
/* Radius tokens */
--radius-sm: 0.375rem; /* 6px */
--radius-md: 0.5rem; /* 8px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px */
--radius-2xl: 1.5rem; /* 24px */
--radius-full: 9999px; /* Fully rounded */
```

---

## 🧩 Component System

### Button Variants

```typescript
// Button Tone Variants
"neo-subtle": {
  background: "neumorphic-base + subtle elevation",
  shadow: "shadow-neumorphic-sm",
  hover: "shadow-neumorphic-md + subtle lift"
}

"neo-medium": {
  background: "neumorphic-floating",
  shadow: "shadow-neumorphic-md",
  hover: "shadow-neumorphic-lg + medium lift"
}

"neo-dramatic": {
  background: "neumorphic-raised + gradient",
  shadow: "shadow-neumorphic-lg",
  hover: "shadow-neumorphic-dramatic + dramatic lift"
}

"neo-extreme": {
  background: "complex gradient + overlay",
  shadow: "shadow-neumorphic-dramatic",
  hover: "shadow-neumorphic-extreme + extreme lift + scale(1.08)"
}
```

### Card Variants (v2.0.0)

```typescript
// Simplified Card System (Post-Refactor)
tone: {
  "neo-subtle": "base neumorphic card",
  "neo-raised": "elevated card with medium shadow",
  "neo-floating": "floating card with large shadow",
  "neo-dramatic": "dramatic depth card"
}

elevation: {
  "subtle": "shadow-neumorphic-sm",
  "medium": "shadow-neumorphic-md",
  "raised": "shadow-neumorphic-lg",
  "dramatic": "shadow-neumorphic-dramatic"
}

interactive: {
  "none": "static card",
  "gentle": "subtle hover effects",
  "dramatic": "strong hover + lift",
  "extreme": "maximum interactivity + haptic feedback"
}
```

---

## 📱 Mobile Performance Guidelines

### Shadow Optimization Rules

1. **Maximum Mobile Blur**: 35px (statt 120px Desktop)
2. **Hover Effects**: Reduziert auf 60px max blur
3. **Animation Duration**: 75% der Desktop-Werte
4. **GPU Layers**: Transform-based animations bevorzugt

### Performance Budget

```css
/* Desktop: Unlimited shadow complexity */
.desktop {
  box-shadow: 60px 60px 120px rgba(9, 12, 20, 0.32);
}

/* Mobile: Optimized for 60fps */
@media (max-width: 768px) {
  .mobile-optimized {
    box-shadow: 25px 25px 50px rgba(9, 12, 20, 0.28);
  }
}
```

### Touch Target Compliance

```css
/* Minimum touch targets (44px) */
.interactive-element {
  min-height: 44px;
  min-width: 44px;
  /* Automatisch durch compound variants gesetzt */
}
```

---

## ♿ Accessibility Features

### Focus Management

```css
/* High-visibility focus indicators */
.focus-visible {
  outline: none;
  box-shadow:
    var(--shadow-neumorphic-current),
    0 0 0 3px var(--acc1),
    0 0 0 6px rgba(75, 99, 255, 0.2);
}
```

### Contrast Requirements

- **AA Compliance**: Minimum 4.5:1 contrast ratio
- **AAA Target**: 7:1 contrast für kritische Texte
- **Neumorphic Adaptation**: Schatten verstärkt bei niedrigem Kontrast

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  .neumorphic-interactive {
    transition: none;
    transform: none;
  }

  .neumorphic-hover:hover {
    transform: none; /* Kein Scale/Lift */
    transition-duration: 0.1s; /* Minimal feedback */
  }
}
```

---

## 🔄 Migration von Legacy-Tokens

### Deprecated Tokens (zu entfernen)

```css
/* DEPRECATED - Nicht mehr verwenden */
--surface-0  →  --surface-neumorphic-base
--surface-1  →  --surface-neumorphic-floating
--surface-2  →  --surface-neumorphic-raised
--surface-3  →  --surface-neumorphic-overlay

--neon       →  focus-visible Utility-Klassen
--neon-strong →  Akkord-basierte Fokus-Schatten
```

### Migration-Script (Automatisiert)

```bash
# Suche und ersetze Legacy-Tokens
grep -r "--surface-0" src/ | wc -l  # → 15 Vorkommen
grep -r "--neon" src/ | wc -l       # → 8 Vorkommen

# Automatische Migration verfügbar in:
# scripts/migrate-design-tokens.mjs
```

---

## 🚀 Phase 4 Features (In Entwicklung)

### useUIState Hook Integration

```typescript
// Neue Data-Attribute basierte State-Management
<Card
  data-state="loading|success|error|idle"
  data-interactive="true|false"
  data-elevation="subtle|medium|dramatic|extreme"
/>
```

### Animation Framework

```css
/* Neue Keyframes für Phase 4 */
@keyframes focusExpand {
  0% {
    transform: scale(1);
    box-shadow: var(--shadow-neumorphic-sm);
  }
  100% {
    transform: scale(1.02);
    box-shadow: var(--shadow-neumorphic-lg);
  }
}

@keyframes neo-press {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(2px);
    filter: brightness(0.95);
  }
}
```

### Gesture Feedback System

```typescript
// useGestureFeedback Hook (geplant)
const { triggerHaptic, triggerVisual } = useGestureFeedback({
  intensity: "light" | "medium" | "heavy",
  pattern: "impact" | "selection" | "success",
});
```

---

## 📊 Performance Metriken

### Target Values

| Metrik             | Desktop | Mobile |
| ------------------ | ------- | ------ |
| Shadow Render Time | <8ms    | <16ms  |
| Layout Shift (CLS) | <0.1    | <0.1   |
| First Paint        | <1.2s   | <1.8s  |
| Interactive Time   | <2.5s   | <3.5s  |

### Monitoring

```javascript
// Performance-Test verfügbar in:
// tmp/shadow-performance-test.html

console.log("Current Extreme:", "120px blur"); // ⚠️ Performance-kritisch
console.log("Mobile Optimized:", "50px blur"); // ✅ Mobile-freundlich
```

---

## 🛠️ Development Tools

### Storybook Integration (geplant)

```bash
# Setup für Design-System Dokumentation
npm install @storybook/react @storybook/addon-docs
.storybook/
├── main.ts (Vite config)
├── preview.tsx (Neumorphic decorators)
└── theme.ts (Design-System theme)
```

### Token-Playground

```bash
# Interaktiver Token-Browser geplant
src/tools/token-playground/
├── TokenBrowser.tsx
├── ShadowVisualizer.tsx
└── ColorPalette.tsx
```

---

## 📝 Changelog

### v2.0.0-alpha (Aktuell)

- ✅ README.md: Fluent-2 → Dramatic Neumorphism
- ✅ Performance-Test für Mobile Shadows
- ✅ Token-System Analyse abgeschlossen
- 🔄 Legacy Token Migration (in progress)
- 🔄 Card.tsx Refactor (breaking change)

### v1.x (Legacy)

- Gemischtes Design-System (Glassmorphism + Neumorphism)
- 34 @deprecated Card-Varianten
- Performance-Probleme auf Mobile (120px shadows)

---

## 🔗 Weitere Dokumentation

- **[PHASE_4_ACTION_ITEMS.md](PHASE_4_ACTION_ITEMS.md)**: Detaillierte Roadmap
- **[Mobile Performance Test](tmp/shadow-performance-test.html)**: Live Performance Comparison
- **[Component Migration Guide](docs/component-migration.md)**: Breaking Changes Documentation

---

> **Nächste Schritte**: Legacy Surface-Token entfernen → Card.tsx v2.0.0 Refactor → Storybook Setup
