# UMFASSENDES AUDIT: Design-System Problem in Disa AI

## EXECUTIVE SUMMARY

Das Design-System des Disa AI Projekts leidet unter **kritischen Integrationsproblemen** zwischen mehreren konkurrierenden Systemen. Es gibt drei parallele Design-Systeme, die sich überschneiden und zu Doppeldefinitionen, Performance-Problemen und Wartungsaufwand führen.

**Kritikalität: HOCH** - Das System ist funktional, aber nicht nachhaltig.

---

## 1. STRUKTURELLE PROBLEME

### 1.1 Drei parallele Design-Systeme (KRITISCH)

Das Projekt hat 3 gleichzeitig aktive Design-Systeme:

#### System 1: CSS Custom Properties (Primary)

- **Datei**: `src/styles/tokens.css` (402 Zeilen)
- **Umfang**:
  - Core Variables (spacing, radius, typography, shadows)
  - Theme tokens (light/dark colors)
  - Derived semantic tokens
- **Status**: Gut strukturiert, aber mit undefinierte Referenzen

#### System 2: TypeScript Design Tokens

- **Dateien**:
  - `src/styles/design-tokens.ts`
  - `src/styles/tokens/` (shadow.ts, spacing.ts, color.ts, etc.)
  - `src/styles/design-tokens.generated.ts` (251 Zeilen, auto-generiert)
- **Problem**: Parallel zu CSS, schwer zu synchronisieren

#### System 3: CVA (Class Variance Authority)

- **Nutzung in**: card.tsx, badge.tsx, chip.tsx, Dialog.tsx
- **Problem**: Inline Tailwind-Klassen mit direkten var() Referenzen
- **Beispiel aus card.tsx**:
  ```typescript
  "neo-subtle": "bg-[var(--surface-neumorphic-base)] border-[var(--border-neumorphic-subtle)]"
  ```

  - 72 verschiedene var() Referenzen in einer Datei
  - Mischung aus definierten und undefiniertem Variablen

#### System 4: Tailwind CSS

- **Config**: `tailwind.config.ts`
- **Integration**: Mapping von CSS-Variablen zu Tailwind utilities
- **Problem**: Unvollständige Abdeckung von Custom Properties

---

## 2. DOPPELTE DEFINITIONEN

### 2.1 Touch-Target Größen (PROBLEMATISCH)

**Vier verschiedene Definitionssysteme:**

```
System A (tokens.css - Authoritative):
--size-touch-compact: 44px
--size-touch-comfortable: 48px
--size-touch-relaxed: 56px
--size-touch-spacious: 64px

System B (components.css - Alias):
--touch-target-minimum: 48px (FALSCH! sollte 44px sein)
--touch-target-comfortable: 56px (FALSCH! sollte 48px sein)
--touch-target-relaxed: 64px (FALSCH! sollte 56px sein)
--touch-target-spacious: 72px (UNDEFINIERT!)

System C (mobile-enhancements.css - Hardcoded):
.touch-target { min-height: 44px; min-width: 44px; }
.touch-target-large { min-height: 56px; min-width: 56px; }

System D (design-tokens.generated.ts):
"--size-touch-compact": "2.75rem" (44px ✓)
"--size-touch-comfortable": "3rem" (48px ✓)
"--size-touch-relaxed": "3.25rem" (52px ✗ FALSCH!)
"--size-touch-spacious": "3.5rem" (56px ✗ FALSCH!)
```

**Auswirkung**:

- Touch targets können zwischen 44px und 72px variieren
- Konsistenz nicht gewährleistet
- WCAG 2.5.5 Anforderungen (44x44px minimum) nicht zuverlässig erfüllt

---

### 2.2 Shadow-Systeme (KRITISCH)

**Drei konkurrenze Shadow-Hierarchien:**

```
Primary (tokens.css):
--shadow-neo-sm/md/lg/xl (Basis)
--shadow-depth-1-6 (Aliases zu neo)
--shadow-neumorphic-sm/md/lg/xl (Aliases zu neo)
--shadow-inset-subtle/medium/strong/extreme

Secondary (components.css):
.shadow-depth-1 { box-shadow: var(--shadow-depth-1); }
.shadow-depth-2 { ... }
.shadow-elevated { box-shadow: var(--shadow-elevated-glow); } ✗ UNDEFINED!

Tertiary (tokens/shadow.ts):
shadowTokens mit glow-brand, glow-success, glow-error
Mapped zu CSS variables via shadowCssVars
```

**Probleme**:

- `--shadow-elevated-glow` ist undefiniert in tokens.css
- `shadow-elevated` Klasse wird in components.css benutzt
- Glow-shadows sind in TypeScript definiert aber nicht in CSS

---

### 2.3 Viewport-Höhen (Überkompliziert)

**5 verschiedene Implementierungen:**

```css
/* base.css - duplikat 1 */
html, body, #app { min-height: 100dvh; min-height: calc(var(--vh, 1vh) * 100); }

/* base.css - duplikat 2 */
:root { --vh: 1vh; }

/* mobile-enhancements.css - duplikat 3 mit 100dvh check */
@supports (height: 100dvh) { :root { --vh: 1dvh; } }

/* components.css - mehrere Instanzen */
.min-h-screen-mobile { min-height: 100dvh; min-height: calc(var(--vh, 1vh) * 100); }

/* Tailwind config */
"screen-dynamic": "var(--vh, 100dvh)",
"screen-small": "100svh",
"screen-large": "100lvh",
```

**Problem**:

- Redundante Fallbacks
- Mehrere Recalculation der --vh Variable
- Unklare Präzedenz (welche wird verwendet?)

---

## 3. CSS-VARIABLE KONFLIKTE

### 3.1 Undefinierte Variablen in CVA Components

**In card.tsx (72 Referenzen zu var()):**

```typescript
// Diese sind definiert:
var(--surface-neumorphic-base) ✓
var(--shadow-neumorphic-md) ✓
var(--accent) ✓

// Diese sind NICHT definiert in tokens.css:
var(--border-neumorphic-subtle) ✗ (nicht in CSS definiert)
var(--border-neumorphic-light) ✗
var(--border-neumorphic-dark) ✗
var(--surface-neumorphic-overlay) ✗
var(--shadow-focus-neumorphic) ✓ (nur mit color-mix)
var(--shadow-glow-accent-subtle) ✗
```

**Auswirkung**: Browser-Fallbacks zu initial/transparent → visueller Fehler

### 3.2 Color-mix Performance (CONCERN)

**In tokens.css über 20 color-mix() Operationen:**

```css
--surface-muted: color-mix(in srgb, var(--bg1) 85%, var(--bg2));
--color-brand-primary-hover: color-mix(in srgb, var(--accent) 90%, black);
--border-hairline: color-mix(in srgb, var(--line)..., transparent);
```

**Probleme**:

- Jedes color-mix() wird bei jedem Theme-Switch neuberechnet
- Keine Pre-Berechnung (obwohl design-tokens.generated.ts existiert)
- Potenzielle Performance-Bottleneck bei CSS-in-JS

---

## 4. Z-INDEX PROBLEME

### 4.1 Hierarchie-Konflikte

**In z-index-system.css (gut strukturiert, aber...):**

```css
--z-sidebar: 90 --z-bottom-nav: 100 /* KONFLIKT: gleich wie --z-navigation */ --z-navigation: 100
  --z-composer: 110 /* Sollte >= 200 sein wenn über Modals */;
```

**Probleme**:

- `--z-composer: 110` liegt unter `--z-drawer: 200`
- Composer sollte über Drawern sein, wenn beide offen
- Bottom-nav und Navigation haben gleiches z-index

### 4.2 Modal Stack Overlap

```css
--z-modal-backdrop: 400 --z-modal: 500 --z-popover: 600 --z-dropdown: 700 --z-toast: 1000;
```

Logisch, aber:

- Keine Dokumentation welche Komponenten welche verwenden
- CVA-Components haben hardcoded z-50, z-[50] etc. statt semantischer Variablen

---

## 5. KOMPONENTEN-STIL KONFLIKTE

### 5.1 CVA vs Tailwind Mischung

**Problem**: Hybrid-Ansatz führt zu Chaos

```typescript
// In card.tsx: CVA mit Array-Join Tailwind
const cardVariants = cva("relative isolate overflow-hidden rounded-[var(--radius-xl)] ...", {
  variants: {
    interactive: {
      gentle: [
        "cursor-pointer",
        "hover:shadow-[var(--shadow-neumorphic-md)]",
        "hover:bg-[var(--surface-neumorphic-floating)]",
        "hover:-translate-y-0.5", // ← Hardcoded Translate
      ].join(" "),
    },
  },
});

// Vs in dialog.tsx: Tailwind Data Attributes
const dialogOverlayVariants = cva(
  "data-[state=closed]:animate-out ...", // ← State-basiert
);
```

**Inkonsistenzen**:

- Unterschiedliche Animation-Ansätze
- Mix von Tailwind utilities und CSS variables
- Verschiedene Naming-Konventionen (gentle vs explicit vs glow-brand)

### 5.2 CSS-Layer Probleme

**Keine Cascade-Kontrol über @layer:**

```css
/* tokens.css */
:root { ... }

/* base.css */
@media (min-width: 768px) { ... }  ← Modifiziert body

/* components.css */
.touch-target { ... }

/* mobile-enhancements.css */
.touch-target { ... }  ← Potential Conflict
```

**Fehlende @layer Definitionen**:

- Kein `@layer reset { ... }`
- Kein `@layer base { ... }`
- Kein `@layer components { ... }`
- Kein `@layer utilities { ... }`

---

## 6. LAYOUT-SYSTEM ÜBERLAPPUNGEN

### 6.1 Safe-Area Implementierung (Fragmentiert)

**5 verschiedene Safe-Area Systeme:**

```css
/* tokens.css - Primär */
--mobile-safe-top: env(safe-area-inset-top, 0px)
  --mobile-safe-bottom: env(safe-area-inset-bottom, 0px) --inset-t/r/b/l: env(...)
  /* base.css - Utilities */ .safe-top {padding-top: var(--inset-t) ;} .safe-area-top
  {padding-top: env(safe-area-inset-top) ;} ← Duplikat! .mobile-safe-padding {padding: env(...) ;}
  /* components.css - Zusätzliche */ .mobile-safe-padding {...} ← Duplikat zu base.css
  /* mobile-enhancements.css */ .safe-padding-top {padding-top: var(--safe-area-top) ;} ← FALSCH!
  undefined /* Tailwind config */ "safe-top": "env(safe-area-inset-top)";
```

**Probleme**:

- 3 verschiedene Klassennamenschemata
- `var(--safe-area-top)` ist nicht definiert, sollte `var(--mobile-safe-top)` sein
- Mehrfache env() Aufrufe verschlimmern Performance

---

## 7. PERFORMANCE-ANALYSE

### 7.1 CSS Bundle Größe

```
base.css:           455 Zeilen
components.css:   2,818 Zeilen ← KRITISCH GROSS
mobile-enhancements.css: 312 Zeilen
tokens.css:         402 Zeilen
ui-state-animations.css: 292 Zeilen
z-index-system.css:  145 Zeilen
────────────────────────────
TOTAL:            4,424 Zeilen (≈ 150KB ungeminifiert)
```

**Problem**: components.css ist 6x größer als nötig

- 1465-1887: Touch-target Definitionen (Duplikat zu mobile-enhancements.css)
- 1887-2000: Veraltete Legacy-Klassen
- Keine CSS-Minifizierung zwischen Entwicklung/Production

### 7.2 Render-Blocking Styles

**Critical Path:**

```
index.html
├─ tailwind.css (Tailwind base+components+utilities)
├─ base.css (Media queries, resets)
└─ ui-state-animations.css (Animations)
```

**Nicht Critical (können deferred werden):**

```
├─ components.css (Komponenten-Utilities)
├─ mobile-enhancements.css (Mobile-only)
└─ z-index-system.css (z-index Utilities)
```

**Problem**: Keine asset optimization oder linking Strategie

### 7.3 Design-Token Generierung Overhead

**design-tokens.generated.ts (251 Zeilen)**:

- Wird bei jedem Build regeneriert
- Pre-kalkuliert für Light/Dark Mode
- Aber color-mix() wird trotzdem zur Runtime neuberechnet in tokens.css

**Ineffizienz**: Doppelte Arbeit - Token sind pre-berechnet aber nicht nutzbar

---

## 8. CSS-KLASSEN CHAOS

### 8.1 Naming-Konventionen (Inkonsistent)

```css
/* Mobile First Pattern */
.touch-target {
  min-height: 44px;
}

/* Semantic Pattern */
.interactive-hover {
  transition: all...;
}

/* Tailwind Pattern */
.h-dvh {
  height: 100dvh;
}

/* Legacy Pattern */
.neo-dramatic {
  @apply ...;
}

/* Vendor-Specific Pattern */
.ios-button {
  border-radius: 12px;
}
.android-button {
  text-transform: uppercase;
}
```

**Wartungsproblem**:

- 4 verschiedene Naming-Konventionen
- Keine klare Guideline
- Schwer für neue Entwickler

### 8.2 Doppelte Utility-Klassen

```css
/* base.css:264 */
*:focus-visible {
  outline: var(--size-bottomsheet-border) solid...;
}

/* components.css:366 */
.bottom-sheet-focus-visible:focus-visible {
  outline: 2px solid...;
}

/* mobile-enhancements.css:245 */
.mobile-focus-visible:focus-visible {
  outline: 2px solid...;
}
```

---

## 9. KONKRETE LÖSUNGSEMPFEHLUNGEN

### PRIORITÄT 1: Unmittelbare Fixes (< 1 Stunde)

#### 1.1: Undefined Variable Definitions

**Datei: src/styles/tokens.css**

```css
/* HINZUFÜGEN nach --shadow-neumorphic-xl: */
:root {
  /* Neumorphic Border System */
  --border-neumorphic-subtle: color-mix(in srgb, var(--line) 50%, transparent);
  --border-neumorphic-light: var(--border-subtle);
  --border-neumorphic-dark: var(--border-strong);

  /* Neumorphic Overlay Surface */
  --surface-neumorphic-overlay: var(--surface-overlay);

  /* Glow Shadow System */
  --shadow-glow-brand: 0 0 16px rgba(97, 109, 255, 0.25);
  --shadow-glow-brand-subtle: 0 0 8px rgba(97, 109, 255, 0.12);
  --shadow-glow-accent-subtle: 0 0 8px rgba(97, 109, 255, 0.15);
  --shadow-glow-success: 0 0 16px rgba(22, 163, 74, 0.25);
  --shadow-glow-success-subtle: 0 0 8px rgba(22, 163, 74, 0.12);
  --shadow-glow-warning: 0 0 16px rgba(249, 115, 22, 0.25);
  --shadow-glow-warning-subtle: 0 0 8px rgba(249, 115, 22, 0.12);
  --shadow-glow-error: 0 0 16px rgba(225, 29, 72, 0.25);
  --shadow-glow-error-subtle: 0 0 8px rgba(225, 29, 72, 0.12);
  --shadow-glow-neutral-subtle: 0 0 8px rgba(15, 23, 42, 0.08);
  --shadow-elevated-glow: 0 0 24px rgba(97, 109, 255, 0.18);
}
```

#### 1.2: Safe-Area Variable Fix

**Datei: src/styles/tokens.css - Korrigiere Alias**

```css
/* ÄNDERN in :root */
:root {
  /* ... bestehende safe-area definitions ... */

  /* Füge semantische Aliases hinzu */
  --safe-area-top: var(--mobile-safe-top);
  --safe-area-right: var(--mobile-safe-right);
  --safe-area-bottom: var(--mobile-safe-bottom);
  --safe-area-left: var(--mobile-safe-left);
}
```

#### 1.3: Touch-Target Standardisierung

**Datei: src/styles/components.css - Zeilen 1504-1507**

```css
/* ERSETZEN diese Definitionen: */
@media screen {
  :root {
    --touch-target-minimum: var(--size-touch-compact); /* 44px */
    --touch-target-comfortable: var(--size-touch-comfortable); /* 48px */
    --touch-target-relaxed: var(--size-touch-relaxed); /* 56px */
    --touch-target-spacious: var(--size-touch-spacious); /* 64px */
  }
}
```

---

### PRIORITÄT 2: Mittelfristig (1-2 Tage)

#### 2.1: CSS-Layer Reorganisation

**Strategie**: Verwende @layer für klare Cascade-Kontrolle

```css
/* src/styles/base.css - TOP */
@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

/* src/styles/tokens.css */
@layer base {
  :root { /* CSS Variables */ }
}

/* src/styles/components.css */
@layer components {
  .touch-target { ... }
  .button-hover { ... }
}

/* src/styles/mobile-enhancements.css */
@layer components {
  /* Mobile-specific utilities */
}

/* Tailwind CSS (implicit @layer base, @layer components, @layer utilities) */
```

#### 2.2: Shadow-System Konsolidierung

**Ziel**: Single Source of Truth

```typescript
// src/styles/tokens/shadow.ts - AUTHORITATIVE
// Diese sind DIE einzigen Shadow-Token

export const shadowTokens = {
  // Semantic Shadows
  surface: "--shadow-neumorphic-sm",
  raised: "--shadow-neumorphic-md",
  overlay: "--shadow-neumorphic-lg",
  popover: "--shadow-neumorphic-xl",

  // Glow Effects
  glowBrand: "--shadow-glow-brand",
  glowSuccess: "--shadow-glow-success",
  glowWarning: "--shadow-glow-warning",
  glowError: "--shadow-glow-error",

  // Depth (Aliases)
  depth1: "--shadow-depth-1",
  depth2: "--shadow-depth-2",
  // ... depth-6
};
```

#### 2.3: Viewport-Height Deduplication

**Datei: src/styles/base.css - KONSOLIDIERT**

```css
:root {
  --vh: 1vh; /* Default */
}

/* Dynamic viewport height support - Override when available */
@supports (height: 100dvh) {
  :root {
    --vh: 1dvh;
  }
}

html,
body,
#app {
  height: 100%;
  min-height: 100dvh;
  min-height: calc(var(--vh) * 100);
}

/* Single set of viewport utilities */
.h-screen {
  height: 100dvh;
  height: calc(var(--vh) * 100);
}
.min-h-screen {
  min-height: 100dvh;
  min-height: calc(var(--vh) * 100);
}
```

---

### PRIORITÄT 3: Langfristig (1+ Woche)

#### 3.1: CVA Component Migration

**Ziel**: Konsistente Styling-Strategie

**Optionen**:

**Option A: Tailwind-First (Empfohlen)**

```typescript
// card.tsx - nutze nur Tailwind + CSS-Variablen
export function Card({ variant, size, ...props }) {
  return (
    <div className={cn(
      "relative isolate overflow-hidden rounded-[var(--radius-xl)]",
      "border text-[var(--fg)]",
      variant === 'raised' && "bg-[var(--surface-raised)] shadow-[var(--shadow-neo-md)]",
      variant === 'floating' && "bg-[var(--surface-card)] shadow-[var(--shadow-neo-lg)]",
      size === 'md' && "max-w-md",
    )} />
  )
}
```

- Vorteile: Einfacher, bessere Tailwind-Integration
- Nachteile: Mehr Wiederholung in Komponenten

**Option B: CVA + Design-Token Mapping**

```typescript
// Erstelle CVA-Export für Tailwind
const cardVariants = cva(
  "bg-surface-raised shadow-neo-md",
  {
    variants: {
      variant: {
        raised: "bg-surface-raised shadow-neo-md",
        floating: "bg-surface-card shadow-neo-lg",
      }
    }
  }
);

// tailwind.config.ts - Mapping perfektionieren
theme: {
  extend: {
    colors: {
      'surface-raised': 'var(--surface-raised)',
      'surface-card': 'var(--surface-card)',
    },
    boxShadow: {
      'neo-md': 'var(--shadow-neo-md)',
      'neo-lg': 'var(--shadow-neo-lg)',
    },
  }
}
```

- Vorteile: Nutzt Tailwind-Klassen, cleaner CVA
- Nachteile: Tailwind config muss vollständig sein

**Empfehlung: Option B + Tailwind Completion**

#### 3.2: Design-Token TypeScript Überarbeitung

```typescript
// src/styles/design-tokens.ts - Übertragen in single file
export const designTokens = {
  colors: {
    surface: {
      base: "var(--surface-base)",
      raised: "var(--surface-raised)",
      card: "var(--surface-card)",
      overlay: "var(--surface-overlay)",
      // ... alle Farben
    },
    shadows: {
      sm: "var(--shadow-neo-sm)",
      md: "var(--shadow-neo-md)",
      glowBrand: "var(--shadow-glow-brand)",
      // ... alle Shadows
    },
    spacing: {
      /* ... */
    },
    typography: {
      /* ... */
    },
  },
} as const;

// Nutze autocomplete in Komponenten:
// <Card className={`bg-[${designTokens.colors.surface.raised}]`} />
```

#### 3.3: Dokumentation & Guidelines

**Erstelle: src/styles/README.md**

```markdown
# Design-System Architecture

## Hierarchy (Single Source of Truth)

1. CSS Custom Properties (src/styles/tokens.css) - PRIMARY
2. TypeScript Design-Tokens (src/styles/design-tokens.ts) - EXPORT/REFERENCE
3. Tailwind Config (tailwind.config.ts) - CONSUMPTION
4. React Components (src/components/ui/) - IMPLEMENTATION

## Rules

- NEVER hardcode colors, spacing, shadows, radius, typography
- ALWAYS use CSS variables first: `var(--accent)`
- Then Tailwind classes: `text-accent`, `bg-surface-raised`
- Then designTokens export: `designTokens.colors.accent`

## Adding New Design Tokens

1. Define in src/styles/tokens.css (:root)
2. Export in tailwind.config.ts if Tailwind-accessible
3. Reference in TypeScript as designTokens.X.Y
4. Use in components via CSS classes or inline

## CSS Layer Order

base → components → utilities
(Tailwind manages internally, custom CSS uses @layer)
```

---

### PRIORITÄT 4: Quality Gates

#### 4.1: ESLint Rule für Hardcoded Values

```javascript
// eslint.config.mjs
{
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="className"] > Literal[value=/\\d+(px|rem|em|%)/]',
        message: 'Use design tokens instead of hardcoded dimensions'
      }
    ]
  }
}
```

#### 4.2: CSS Variable Validation

```javascript
// .stylelintrc.json
{
  "rules": {
    "declaration-property-value-no-unknown": [true, {
      "ignoreProperties": ["composes"]
    }],
    "custom-property-no-missing-var-function": true
  }
}
```

---

## 10. RECOMMENDATIONS BY SYSTEM

### Welches System sollte Primary sein?

**EMPFEHLUNG: CSS Custom Properties (tokens.css) + Tailwind**

**Gründe**:

1. ✓ Browser-native, kein Build-Overhead
2. ✓ Runtime-Änderbar (Theme-Switching bereits optimiert)
3. ✓ Tailwind kann direkt mapped werden
4. ✓ CVA Components können weiterhin benutzt werden
5. ✓ Design-Tokens TypeScript ist nur Export/Reference

**Zu Deprecieren**:

- `design-tokens.generated.ts` - Pre-calculation ist nicht genutzt
- Separate Token-Definition in TypeScript - nur Maintenance-Last

---

## 11. IMPLEMENTIERUNGS-ROADMAP

### Phase 1: Stabilisierung (1 Tag)

- [ ] Define missing CSS variables (Priorität 2.1)
- [ ] Fix safe-area aliases
- [ ] Standardize touch-targets
- [ ] Tests dass alle var() resolven

### Phase 2: Reorganization (2-3 Tage)

- [ ] Implementiere @layer Struktur
- [ ] Konsolidiere shadow-systeme
- [ ] Deduplicate viewport-height
- [ ] Cleanup legacy Klassen

### Phase 3: Komponenten-Harmonisierung (3-5 Tage)

- [ ] Standardisiere CVA-Komponenten auf Option B
- [ ] Update tailwind.config.ts für full coverage
- [ ] Migrate Components zu Tailwind-first
- [ ] Remove redundante CSS

### Phase 4: Quality & Dokumentation (1-2 Tage)

- [ ] Schreibe CSS Architecture Docs
- [ ] Implementiere Linting Rules
- [ ] Team Training auf neue Guidelines
- [ ] Create Design-Token Storybook

---

## 12. PERFORMANCE-OPTIMIERUNGEN

### Recommended Implementation

```
Total CSS Bundle: ~150KB → ~80KB (-47%)

Nach Optimierung:
- tokens.css: 400 Zeilen → 450 (mit Fixes)
- base.css: 455 → 300 (Consolidate)
- components.css: 2818 → 1200 (Remove duplicates)
- mobile-enhancements.css: 312 → 150 (Deduplicate)
- Tailwind: Kann 40% der Klassen ersparен
```

### CSS Loading Strategy

```html
<!-- Critical - Inline oder Head -->
<style>
  :root {
    /* CSS variables */
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  body {
    /* baseline styles */
  }
</style>

<!-- Non-critical - preload, defer, or async -->
<link rel="stylesheet" href="/styles/components.css" media="print" onload="this.media='all'" />
<link
  rel="stylesheet"
  href="/styles/mobile-enhancements.css"
  media="print"
  onload="this.media='all'"
/>
```

---

## ZUSAMMENFASSUNG DER PROBLEME

| Problem                                 | Kritikalität | Fix-Zeit | Impact            |
| --------------------------------------- | ------------ | -------- | ----------------- |
| Undefined CSS Variablen (glow, borders) | HOCH         | 30 min   | Browser-Fallbacks |
| Touch-target Duplikate/Mismatches       | HOCH         | 30 min   | WCAG Violation    |
| Shadow System Komplexität               | MITTEL       | 2 Std    | Wartung           |
| Viewport-Height Redundanz               | MITTEL       | 1 Std    | Performance       |
| Z-Index Overlaps                        | MITTEL       | 1 Std    | UI Bugs           |
| components.css Size                     | HOCH         | 1 Tag    | Bundle            |
| CVA inconsistency                       | MITTEL       | 3 Tage   | Dev Experience    |
| Keine @layer Kontrolle                  | MITTEL       | 1 Std    | CSS Specificity   |
| TypeScript Tokens unused                | NIEDRIG      | 1 Std    | Code Debt         |

---
