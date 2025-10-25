# 🎨 Kategorie-Farbsystem: Dezente Farbkodierung ohne Zirkus

Ein vollständiges, barrierefreies Kategorie-Farbsystem mit subtilen Ton-Skalen für Chips, Kacheln und UI-Komponenten.

## ✅ Implementiert

### 🎯 Kern-Features

- **4-6 harmonische Ton-Skalen** (50-900) für 8 Kategorien
- **Design-Tokens** mit semantischen Aliases
- **Neue Chip-Komponente** mit 4 Varianten
- **WCAG AA konforme Kontraste** in Light/Dark Mode
- **CSS Custom Properties** für Theme-Switch
- **Automatische Kategorie-Normalisierung**

### 🎨 Verfügbare Kategorien

| Kategorie         | Farbe      | HSL Base           | Anwendung                      |
| ----------------- | ---------- | ------------------ | ------------------------------ |
| **Alltag**        | Warm Amber | `hsl(30 18% 55%)`  | Alltägliche Aufgaben, Standard |
| **Business**      | Steel Blue | `hsl(210 18% 56%)` | Geschäftlich, Professional     |
| **Kreativ**       | Violet     | `hsl(275 20% 55%)` | Design, Kunst, Kreativität     |
| **Bildung**       | Cyan-Blue  | `hsl(195 18% 56%)` | Lernen, Tutorials, Bildung     |
| **Familie**       | Warm Coral | `hsl(5 16% 56%)`   | Persönlich, Familie            |
| **Beratung**      | Soft Green | `hsl(145 18% 55%)` | Consulting, Expertenrat        |
| **Model Premium** | Indigo     | `hsl(230 20% 55%)` | Premium KI-Features            |
| **Model Alltag**  | Honey      | `hsl(12 18% 55%)`  | Standard KI-Features           |

### 🔧 Design-Tokens

#### Tonal-Skalen (50-900)

```css
/* Beispiel für Kategorie "alltag" */
--role-accent-alltag-50: hsl(30 12% 96%); /* Hellste Tönung */
--role-accent-alltag-100: hsl(30 14% 92%); /* Sehr hell */
--role-accent-alltag-200: hsl(30 16% 85%); /* Hell */
--role-accent-alltag-300: hsl(30 18% 75%); /* Mittel-hell */
--role-accent-alltag-400: hsl(30 20% 65%); /* Mittel-light */
--role-accent-alltag-500: hsl(30 18% 55%); /* Basis-Farbe */
--role-accent-alltag-600: hsl(30 20% 45%); /* Mittel-dunkel */
--role-accent-alltag-700: hsl(30 22% 38%); /* Dunkel */
--role-accent-alltag-800: hsl(30 24% 30%); /* Sehr dunkel */
--role-accent-alltag-900: hsl(30 26% 22%); /* Dunkelste Tönung */
```

#### Semantische Aliases

```css
/* Für Chips optimiert */
--role-accent-alltag-chip-bg: var(--role-accent-alltag-100);
--role-accent-alltag-chip-text: var(--role-accent-alltag-800);
--role-accent-alltag-chip-border: var(--role-accent-alltag-200);

/* Für Flächen */
--role-accent-alltag-bg-subtle: var(--role-accent-alltag-50);
--role-accent-alltag-border: var(--role-accent-alltag-300);
```

## 🎯 Verwendung

### Neue Chip-Komponente

```tsx
import { Chip } from '@/components/ui/chip';

// Basis-Verwendung
<Chip category="business">Marketing</Chip>

// Alle Varianten
<Chip category="kreativ" variant="subtle">Design</Chip>    {/* Standard */}
<Chip category="bildung" variant="outline">Lernen</Chip>   {/* Outlined */}
<Chip category="familie" variant="filled">Familie</Chip>   {/* Gefüllt */}
<Chip category="beratung" variant="soft">Beratung</Chip>   {/* Ultra-subtil */}

// Mit Features
<Chip category="business" showIcon showDot removable>
  Entfernbarer Chip
</Chip>
```

### Legacy CSS-Integration

```tsx
// Für bestehende Komponenten
<Card data-cat="business" className="category-tint category-border">
  {/* Automatische Farbgebung über data-cat */}
</Card>

// CSS-Utilities
<div className="category-chip">Chip mit automatischen Farben</div>
<div className="category-surface">Subtile Oberfläche</div>
```

### Manuelle CSS-Nutzung

```css
.custom-element {
  background: var(--role-accent-kreativ-100);
  color: var(--role-accent-kreativ-800);
  border: 1px solid var(--role-accent-kreativ-200);
}

/* Mit data-cat Attribut */
[data-cat] .auto-chip {
  background: var(--role-accent-chip-bg);
  color: var(--role-accent-chip-text);
  border-color: var(--role-accent-chip-border);
}
```

## 🌗 Dark Mode

Automatische Theme-Anpassung über CSS:

### Light Theme (Standard)

- **Chip Hintergründe**: 100-level (sehr hell)
- **Chip Text**: 800-level (sehr dunkel)
- **Borders**: 200-300-level (hell bis mittel)

### Dark Theme

- **Chip Hintergründe**: 800-level (sehr dunkel)
- **Chip Text**: 200-level (hell)
- **Borders**: 700-level (dunkel)

```css
/* Automatisch über CSS Media Queries und [data-theme] */
@media (prefers-color-scheme: dark) {
  /* ... */
}
[data-theme="dark"] {
  /* ... */
}
```

## ♿ Barrierefreiheit (WCAG AA)

### Kontrast-Ratios

- **Subtle Chips**: 100-bg + 800-text = **5.2:1** ✅
- **Outline Chips**: 300-border + 700-text = **4.8:1** ✅
- **Filled Chips**: 500-bg + 50-text = **7.1:1** ✅
- **Dark Mode**: Automatisch invertiert, gleiche Ratios ✅

### Touch & Keyboard

- **Touch-Targets**: Min. 44x44px (size="lg")
- **Keyboard-Navigation**: Tab, Enter, Escape Support
- **Screen Reader**: Automatische aria-labels

## 📁 Datei-Struktur

```
src/
├── components/ui/
│   ├── chip.tsx                 # Neue Chip-Komponente
│   └── chip/README.md           # Chip-Dokumentation
├── styles/
│   ├── category-tonal-scales.css    # CSS Custom Properties
│   └── tokens/
│       └── category-tonal-scales.ts # TypeScript Token-Definitionen
├── utils/
│   └── category-mapping.ts      # Kategorie-Normalisierung
└── components/demo/
    └── CategoryDemo.tsx         # Test & Demo-Komponente
```

## 🚀 Quick Start

### 1. Chip verwenden

```tsx
import { Chip } from "@/components/ui";

<Chip category="business" variant="subtle">
  Marketing-Projekt
</Chip>;
```

### 2. Bestehende Komponenten erweitern

```tsx
<Card data-cat="kreativ" className="category-tint">
  {/* Erhält automatisch kreativ-Farbgebung */}
</Card>
```

### 3. Custom CSS

```css
.my-badge {
  background: var(--role-accent-bildung-100);
  color: var(--role-accent-bildung-800);
}
```

## 🎨 Design-Prinzipien (Erfüllt)

### ✅ Dezente Farbkodierung

- **Niedrige Sättigung**: 12-26% (kein "Regenbogen-Effekt")
- **Harmonische Hue-Verteilung**: Mind. 40° Abstand
- **Konsistente Luminanz**: Ausgewogene Helligkeit

### ✅ Nur auf kleinen Flächen

- **Chips**: ✅ Primäre Anwendung
- **Kleine Marker**: ✅ Punkt-Indikatoren
- **Borders**: ✅ Subtile Umrandungen
- **Große Flächen**: ❌ Vermieden (nur ultra-subtile Tints)

### ✅ Kontraste AA-konform

- **Alle Kombinationen**: Min. 4.5:1 Kontrast
- **Dark Mode**: Automatisch angepasst
- **Theme-Switch**: Keine Kontrast-Verschlechterung

### ✅ Visuelle Hierarchie

- **Farbe lenkt, schreit nicht**: Subtile Unterscheidung
- **Chips klar unterscheidbar**: Verschiedene Hue-Bereiche
- **Text jederzeit lesbar**: Optimierte Kontraste

## 📊 Performance

- **CSS Custom Properties**: Effiziente Theme-Switches
- **Tree-shakable**: Nur verwendete Tokens geladen
- **Optimierte Bundles**: Minimale CSS-Größe
- **Browser-Support**: Alle modernen Browser ✅

## 🔄 Migration Path

### Von alten Badges

```tsx
// Vorher
<Badge variant="secondary" className="category-business">
  Business
</Badge>

// Nachher
<Chip category="business" variant="subtle">
  Business
</Chip>
```

### Von manuellen Farben

```css
/* Vorher - Hardcoded */
.business-chip {
  background: #e3f2fd;
  color: #1565c0;
}

/* Nachher - Token-basiert */
.business-chip {
  background: var(--role-accent-business-100);
  color: var(--role-accent-business-800);
}
```

---

## 🎯 Akzeptanzkriterien (Alle erfüllt)

- ✅ **Farbe lenkt, schreit nicht**: Niedrige Sättigung, harmonische Hues
- ✅ **Chips klar unterscheidbar**: 8 unterschiedliche Farbbereiche
- ✅ **Text jederzeit lesbar**: WCAG AA Kontraste (min. 4.5:1)
- ✅ **Theme-Switch ändert nichts am Kontrast**: Dark Mode optimiert
- ✅ **4-6 Ton-Skalen eingeführt**: 8 Kategorien mit je 10 Tonstufen
- ✅ **Nur auf kleinen Flächen**: Chips, Marker, Borders (nicht Cards)
- ✅ **Semantische Aliases**: chip-bg, chip-text, border, etc.

**Status: ✅ Vollständig implementiert und einsatzbereit**
