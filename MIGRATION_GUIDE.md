# DESIGNSYSTEM MIGRATION GUIDE

## Übersicht der Änderungen

Das Designsystem wurde gemäß den verbindlichen Vorgaben komplett überarbeitet:

### ✅ Umgesetzte Vorgaben

- **Radii:** 6 / 10 / 14 / 18 / 24 px (keine Zwischenwerte)
- **Shadows:** nur 2 Ebenen (Light + Heavy), konsistente Tokens
- **Glass-Opacity:** Mobile neu kalibriert (0.18–0.28 bei dunklen Themes)
- **Konsistenz:** Karten, Buttons, Input-Felder und Panels verwenden dieselben Radii

## Neue Token-Struktur

### Radius-Tokens

```css
--radius-xs: 6px; /* Kleinste Elemente, Icons */
--radius-sm: 10px; /* Standard Buttons, Inputs */
--radius-md: 14px; /* Karten, Panels, größere Elemente */
--radius-lg: 18px; /* Hauptcontainer, Dialoge */
--radius-xl: 24px; /* Maximaler Radius für spezielle Fälle */
```

### Shadow-Tokens

```css
--shadow-light: 0 2px 8px rgba(0, 0, 0, 0.16);
--shadow-heavy: 0 8px 24px rgba(0, 0, 0, 0.32);
```

### Glass-Tokens (kalibrierte Opazität)

```css
--glass-border-soft: rgba(255, 255, 255, 0.18);
--layer-glass-panel: color-mix(in srgb, var(--surface-card) 78%, transparent);
--layer-glass-inline: color-mix(in srgb, var(--surface-base) 82%, transparent);
```

## Migration-Pflichten

### 🔴 Sofort migrieren (kritisch)

**Alle neuen Komponenten müssen das zentrale Designsystem verwenden:**

```css
/* NEU: Zentrales Designsystem */
@import "./styles/design-tokens.css";

.glass-panel {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-light);
  background: var(--layer-glass-panel);
}

/* ALT: Veraltet - nicht mehr verwenden */
@import "./styles/unified-tokens.css";
border-radius: var(--radius-card-inner);
box-shadow: var(--shadow-glass-subtle);
```

### 🟡 Bestehende Komponenten migrieren

#### 1. Glass-Elemente

```css
/* Vorher */
.glass-chip {
  border-radius: 999px;
  box-shadow: var(--shadow-glass-subtle);
}

/* Nachher */
.glass-chip {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
}
```

#### 2. Buttons & Inputs

```css
/* Vorher */
.glass-field {
  border-radius: var(--radius-lg);
}

/* Nachher */
.glass-field {
  border-radius: var(--radius-sm);
}
```

#### 3. Tap-Targets

```css
/* Vorher */
.tap-target {
  border-radius: var(--radius-lg);
}

/* Nachher */
.tap-target {
  border-radius: var(--radius-sm);
}
```

### 🟢 Tailwind-Klassen aktualisieren

#### Neue Tailwind-Klassen

```html
<!-- Neu -->
<div class="rounded-xs shadow-light">
  <div class="rounded-sm shadow-heavy">
    <div class="rounded-md">
      <div class="rounded-lg">
        <div class="rounded-xl">
          <!-- Alt - nicht mehr verwenden -->
          <div class="rounded-full"><!-- 999px --></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Komponenten-Mapping

### ✅ Bereits migriert

- `glass-panel`: `--radius-xl` + `--shadow-light`
- `glass-inline`: `--radius-lg` + `--shadow-light`
- `glass-chip`: `--radius-lg` (früher 999px)
- `glass-field`: `--radius-sm`
- `tap-target`: `--radius-sm`
- `sticky-composer`: `--shadow-light` (reduziert von Heavy zu Light)

### 🔄 Migrations-Queue

1. **Components.css**: Update shadow declarations
2. **UI-State-Animations.css**: Standardisiere shadow usage
3. **Aurora-Optimized.css**: Optimiere shadow performance
4. **Mobile-Enhancements.css**: Kalibriere Glas-Opacity

## Deprecation-Plan

### Phase 1: Legacy-Mode (jetzt)

- `unified-tokens.css` bleibt als Deprecated-File erhalten
- Alle Tokens verweisen auf das zentrale System
- Neue Komponenten müssen `design-tokens.css` verwenden

### Phase 2: Migration (innerhalb 2 Wochen)

- Alle bestehenden Komponenten migrieren
- Entferne harte Radius-Werte (4px, 999px, etc.)
- Standardisiere Shadow-Usage auf Light/Heavy

### Phase 3: Cleanup (innerhalb 4 Wochen)

- Entferne `unified-tokens.css`
- Entferne Legacy-Tokens aus Tailwind-Config
- Finaler Designsystem-Refactor

## Quality Gates

### ✅ Erfolgskriterien

- [ ] Keine harten Radius-Werte im Codebase
- [ ] Nur `--shadow-light` und `--shadow-heavy` werden verwendet
- [ ] Glass-Opacity im Mobile-Bereich: 0.18–0.28
- [ ] Alle UI-Elemente verwenden die 6/10/14/18/24px Radii
- [ ] Tailwind-Klassen korrekt gemappt

### 🚨 Blocker

- [ ] Verwendung von `999px` oder `9999px` border-radius
- [ ] Verwendung von `--shadow-glass-*` oder `--shadow-*` (außer light/heavy)
- [ ] Harte shadow-Werte wie `0 6px 16px`
- [ ] Glass-Opacity außerhalb des 0.18-0.28 Bereichs

## Support

Bei Fragen zur Migration:

1. Prüfe zuerst das `design-tokens.css` File
2. Nutze die Legacy-Mapping-Tabelle in `unified-tokens.css`
3. Konsultiere diese Migration Guide
4. Bei Unklarheiten: Dev-Team kontaktieren

**Deadline für vollständige Migration: 2024-01-15**
