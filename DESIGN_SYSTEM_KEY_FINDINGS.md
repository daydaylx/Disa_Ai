# Design-System Audit: Key Findings & Quick Fix Guide

## Kritische Befunde (Fix sofort!)

### 1. Undefinierte CSS-Variablen

**Datei**: `src/styles/tokens.css` - Zeile ~76 (nach --shadow-neumorphic-xl)

Füge hinzu:

```css
--border-neumorphic-subtle: color-mix(in srgb, var(--line) 50%, transparent);
--border-neumorphic-light: var(--border-subtle);
--border-neumorphic-dark: var(--border-strong);
--surface-neumorphic-overlay: var(--surface-overlay);
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
```

**Ursache**: Components (card.tsx, badge.tsx) referenzieren diese Variablen, aber sie sind nicht definiert
**Impact**: Browser-Fallbacks führen zu visuellem Fehler
**Fix-Zeit**: 5 Minuten

---

### 2. Safe-Area Variable Mismatch

**Problem**: `mobile-enhancements.css` nutzt `var(--safe-area-top)` aber das ist nicht definiert

**Datei**: `src/styles/tokens.css` - Zeile ~189 (in :root)

Füge hinzu:

```css
--safe-area-top: var(--mobile-safe-top);
--safe-area-right: var(--mobile-safe-right);
--safe-area-bottom: var(--mobile-safe-bottom);
--safe-area-left: var(--mobile-safe-left);
```

**Fix-Zeit**: 2 Minuten

---

### 3. Touch-Target Fehler

**Datei**: `src/styles/components.css` - Zeilen 1504-1507

**Falsch**:

```css
--touch-target-minimum: 48px;
--touch-target-comfortable: 56px;
--touch-target-relaxed: 64px;
--touch-target-spacious: 72px;
```

**Richtig** (sollten Aliases zu tokens.css sein):

```css
--touch-target-minimum: var(--size-touch-compact);
--touch-target-comfortable: var(--size-touch-comfortable);
--touch-target-relaxed: var(--size-touch-relaxed);
--touch-target-spacious: var(--size-touch-spacious);
```

**Ursache**: Hardcoded Werte statt Token-Referenzen
**Impact**: WCAG 2.5.5 Compliance Unsicherheit
**Fix-Zeit**: 2 Minuten

---

## Strukturelle Probleme (Refaktor nötig)

### Design-System Fragmentierung

Das Projekt hat 3 parallele Systeme, die konkurrieren:

| System                | Datei(en)                                                       | Status        | Problem                     |
| --------------------- | --------------------------------------------------------------- | ------------- | --------------------------- |
| CSS Custom Properties | `tokens.css`                                                    | ✓ Gut         | Aber undefined vars         |
| TypeScript Tokens     | `design-tokens.ts`, `tokens/*.ts`, `design-tokens.generated.ts` | ⚠ Unused     | Pre-calc unused             |
| CVA Components        | `card.tsx`, `badge.tsx`, `chip.tsx`                             | ⚠ Fragile    | 72 var()-Refs, Misch-Ansatz |
| Tailwind CSS          | `tailwind.config.ts`                                            | ⚠ Incomplete | Nicht alle Tokens gemappt   |

**Empfehlung**: CSS-Variablen als Primary, Rest als Secondary

- Tailwind sollte 100% der CSS-Variablen mappen
- CVA sollte nur Tailwind-Klassen benutzen (nicht inline var())
- TypeScript Tokens sollte nur als Export dienen

---

### Doppel-Definitionen

#### Touch Targets

- **tokens.css**: `--size-touch-*` (44, 48, 56, 64px) ← AUTHORITATIVE
- **components.css**: `--touch-target-*` (48, 56, 64, 72px) ← WRONG VALUES
- **mobile-enhancements.css**: `.touch-target { 44px }` ← Hardcoded
- **design-tokens.generated.ts**: Pre-calc Werte ← Unused

#### Shadows

- **tokens.css**: `--shadow-neo-*`, `--shadow-depth-*`, `--shadow-neumorphic-*` (Aliases)
- **components.css**: `.shadow-depth-*` Klassen + `.shadow-elevated` (undefined!)
- **tokens/shadow.ts**: `glow-brand`, `glow-success` etc. (in TS, nicht in CSS!)

#### Viewport Height

- **base.css**: `--vh: 1vh` + `100dvh` + `calc(var(--vh) * 100)` × 3
- **mobile-enhancements.css**: `@supports` Override
- **components.css**: 3 weitere Utility-Klassen
- **tailwind.config.ts**: `screen-dynamic`, `screen-small`, `screen-large`

**Ergebnis**: Verwirrung, Performance-Issue, größere Bundle

---

### CSS-Klassen Chaos

**4 verschiedene Naming-Konventionen:**

```css
/* Pattern 1: Utility-First (Tailwind) */
.h-dvh, .min-h-screen, .p-[var(--space-lg)]

/* Pattern 2: Semantic */
.touch-target, .interactive-hover, .button-hover

/* Pattern 3: Legacy */
.neo-dramatic, .neo-extreme, .neo-mobile

/* Pattern 4: Vendor-Specific */
.ios-button, .android-button, .ios-bounce-scroll
```

**Problem**: Schwer zu dokumentieren, maintain, und für neue Devs zu verstehen

---

## Performance-Metriken

### CSS Bundle Größe

```
Aktuell:  4,424 Zeilen ≈ 150KB
Ziel:     ~2,200 Zeilen ≈ 80KB (47% Reduktion)

Hauptprobleme:
- components.css: 2,818 Zeilen (63% des Budgets!)
  - 400+ Zeilen Touch-Target Duplikate
  - 200+ Zeilen veraltete/Legacy-Klassen
  - 150+ Zeilen Viewport-Height Duplikate

- Keine @layer Kontrolle
- Keine CSS-Minifizierung zwischen Dev/Prod
```

### Color-mix Performance

Über 20 `color-mix()` Operationen bei Theme-Switch:

```css
--surface-muted: color-mix(in srgb, var(--bg1) 85%, var(--bg2));
--color-brand-primary-hover: color-mix(in srgb, var(--accent) 90%, black);
```

**Problem**: Werden bei Runtime neuberechnet, obwohl `design-tokens.generated.ts` pre-calculated

---

## Z-Index Konflikte

```css
--z-sidebar: 90 --z-navigation: 100 --z-bottom-nav: 100 /* ← Konflikt mit navigation */
  --z-composer: 110 /* ← Sollte über drawers sein */ --z-drawer: 200 --z-modal: 500;
```

**Probleme**:

- Composer (110) liegt unter Drawer (200) - kann verdeckt werden
- Navigation und Bottom-Nav haben gleiches z-index
- Components nutzen hardcoded z-50, z-[50] statt semantische Variablen

---

## Action Items (Priorität)

### SOFORT (< 1 Stunde)

- [ ] Add missing shadow/border variables to tokens.css
- [ ] Fix safe-area variable aliases
- [ ] Correct touch-target values in components.css
- [ ] Verify all var() references resolve

### DIESE WOCHE (1-2 Tage)

- [ ] Implement @layer Struktur
- [ ] Consolidate viewport-height definitions
- [ ] Create CSS Architecture Documentation
- [ ] Audit all CVA components for undefined variables

### NÄCHSTE WOCHE (3-5 Tage)

- [ ] Migrate CVA components to Tailwind+token mapping
- [ ] Complete tailwind.config.ts token coverage
- [ ] Remove redundant CSS (~1200 Zeilen)
- [ ] Implement @layer organization

### LANGFRISTIG (+ 1 Woche)

- [ ] Deprecate design-tokens.generated.ts
- [ ] Standardize component styling approach
- [ ] ESLint rules for design-token compliance
- [ ] Design-System Storybook

---

## Recommendations

### Primary Design System

✅ **CSS Custom Properties** (`tokens.css`)

- Browser-native, kein Build-Overhead
- Runtime-änderbar (Theme-Switching)
- Tailwind kann direkt mappen
- Perfekt für current architecture

### Secondary Systems

- **Tailwind CSS**: 100% Coverage auf CSS-Variablen
- **CVA Components**: Nur Tailwind-Klassen verwenden
- **TypeScript Tokens**: Export/Reference only

### Deprecate

- `design-tokens.generated.ts` (Pre-calc unused)
- Separate TS token files in `tokens/` (maintenance load)
- Legacy CSS-Klassen (neo-_, ios-_, android-\*)

---

## References

Vollständiger Audit: `DESIGN_SYSTEM_AUDIT.md` (805 Zeilen)

---

## Notes für Team

### Guideline

1. **New tokens?** → Definiere in `tokens.css` (:root)
2. **Use in components?** → Via Tailwind-Klasse oder `var(--token)`
3. **Never?** → Hardcode Werte, duplicieren, parallel-Systeme

### Für Code Review

- Alle `var()` Refs müssen in `tokens.css` sein
- Keine `color-mix()` außer in tokens.css
- CVA sollte nur Tailwind-utilities enthalten
- Z-Index nur via `--z-*` Variablen
- Viewport-Height nur via `var(--vh)`
