# Chip-Komponente mit dezenter Farbkodierung

Eine subtile, zugängliche Chip-Komponente, die das neue Tonal-Skalen-System für Kategorien nutzt.

## ✨ Features

- **4 Varianten**: `subtle`, `outline`, `filled`, `soft`
- **4 Größen**: `xs`, `sm`, `md`, `lg`
- **8 Kategorien**: Automatische Farbzuordnung basierend auf Kategorie
- **WCAG AA konform**: Optimierte Kontraste für Barrierefreiheit
- **Dark Mode**: Automatische Anpassung der Farben
- **Flexible Icons**: Kategorie-Icons und Punkt-Indikatoren
- **Entfernbar**: Optional mit Entfernen-Button

## 🎨 Design-Prinzipien

### Dezente Farbkodierung

- **Niedrige Sättigung** (12-28%): Vermeidet "Regenbogensuppe"
- **Harmonische Farbverteilung**: Hue-Abstände von mind. 40°
- **Konsistente Luminanz**: Ausgewogene Helligkeit across Kategorien

### Barrierefreiheit

- **WCAG AA Kontrast**: Min. 4.5:1 für Text/Hintergrund
- **Dark Mode adaptiv**: Automatische Farbanpassung
- **Touch-optimiert**: 44x44px Mindestgröße (Mobile)
- **Keyboard-Navigation**: Vollständige Tastaturunterstützung

## 📖 Verwendung

### Basis-Beispiele

```tsx
import { Chip } from '@/components/ui/chip';

// Einfacher Chip
<Chip category="business">Marketing</Chip>

// Mit Icon und Punkt
<Chip
  category="kreativ"
  variant="outline"
  showIcon
  showDot
>
  Design
</Chip>

// Entfernbar
<Chip
  category="bildung"
  removable
  onRemove={() => handleRemove('education')}
>
  React Tutorial
</Chip>
```

### Alle Varianten

```tsx
// Subtle (Standard) - Empfohlen für die meisten Fälle
<Chip category="alltag" variant="subtle">Alltag</Chip>

// Outline - Für weniger visuelles Gewicht
<Chip category="business" variant="outline">Business</Chip>

// Filled - Für wichtige/aktive Chips
<Chip category="kreativ" variant="filled">Kreativ</Chip>

// Soft - Ultra-subtil für große Listen
<Chip category="bildung" variant="soft">Bildung</Chip>
```

### Größen

```tsx
<Chip size="xs">Extra Small</Chip>  {/* 10px text */}
<Chip size="sm">Small</Chip>        {/* 11px text */}
<Chip size="md">Medium</Chip>       {/* 12px text - Standard */}
<Chip size="lg">Large</Chip>        {/* 14px text */}
```

## 🎯 Kategorien

### Verfügbare Kategorien

| Kategorie       | Farbe      | Anwendung                              |
| --------------- | ---------- | -------------------------------------- |
| `alltag`        | Warm Amber | Alltägliche Aufgaben, Standard-Content |
| `business`      | Steel Blue | Geschäftliche Inhalte, Professional    |
| `kreativ`       | Violet     | Kreative Projekte, Design, Kunst       |
| `bildung`       | Cyan-Blue  | Lern-Content, Tutorials, Bildung       |
| `familie`       | Warm Coral | Familien-Content, Persönliches         |
| `beratung`      | Soft Green | Beratung, Expertenrat, Consulting      |
| `model-premium` | Indigo     | Premium KI-Modelle, Advanced Features  |
| `model-alltag`  | Honey      | Standard KI-Modelle, Basic Features    |

### Automatische Normalisierung

Die Komponente akzeptiert verschiedene Eingaben und normalisiert sie automatisch:

```tsx
// Alle diese ergeben die gleiche Kategorie
<Chip category="Business & Karriere">...</Chip>
<Chip category="business">...</Chip>
<Chip category="Professional">...</Chip>
<Chip category="Karriere">...</Chip>
```

## 🔧 Props

```typescript
interface ChipProps {
  // Kategorie (string wird automatisch normalisiert)
  category?: string | CategoryKey;

  // Visuelle Variante
  variant?: "subtle" | "outline" | "filled" | "soft";

  // Größe
  size?: "xs" | "sm" | "md" | "lg";

  // Icons und Indikatoren
  showIcon?: boolean; // Zeigt Kategorie-Emoji
  showDot?: boolean; // Zeigt farbigen Punkt

  // Interaktivität
  removable?: boolean; // Zeigt ×-Button
  onRemove?: () => void; // Callback für Entfernen

  // Standard HTML-Props
  className?: string;
  children: React.ReactNode;
  // ...weitere HTMLDivElement props
}
```

## 🎨 CSS-Custom-Properties

Die Komponente nutzt das neue Tonal-Skalen-System:

```css
/* Automatisch verfügbar für jede Kategorie */
--role-accent-{category}-50   /* Hellste Tönung */
--role-accent-{category}-100  /* Sehr hell */
--role-accent-{category}-200  /* Hell */
--role-accent-{category}-300  /* Mittel-hell */
--role-accent-{category}-400  /* Mittel */
--role-accent-{category}-500  /* Basis (500) */
--role-accent-{category}-600  /* Mittel-dunkel */
--role-accent-{category}-700  /* Dunkel */
--role-accent-{category}-800  /* Sehr dunkel */
--role-accent-{category}-900  /* Dunkelste Tönung */

/* Semantische Aliases */
--role-accent-{category}-chip-bg      /* Chip-Hintergrund */
--role-accent-{category}-chip-text    /* Chip-Text */
--role-accent-{category}-chip-border  /* Chip-Border */
```

## 🌗 Dark Mode

Automatische Anpassung über CSS:

- **Light**: Helle Hintergründe (100-level), dunkler Text (800-level)
- **Dark**: Dunkle Hintergründe (800-level), heller Text (200-level)
- **Kontraste**: Automatisch WCAG AA konform

## ♿ Barrierefreiheit

### Kontrast-Compliance

- **Subtle/Soft**: 100-level bg + 800-level text = 4.5:1+ Kontrast
- **Outline**: 300-level border + 700-level text = 4.5:1+ Kontrast
- **Filled**: 500-level bg + 50-level text = 7:1+ Kontrast

### Screen Reader

```tsx
// Automatische Aria-Labels für Entfernen-Button
<Chip removable onRemove={...}>
  Content  {/* Button hat aria-label="Content entfernen" */}
</Chip>

// Icon-Labels
<Chip showIcon category="business">
  Marketing  {/* Icon hat aria-label="Business & Karriere Icon" */}
</Chip>
```

### Keyboard-Navigation

- **Tab**: Fokussiert entfernbare Chips
- **Enter/Space**: Aktiviert Entfernen-Button
- **Escape**: Verlässt Fokus

## 🧪 Testing

### Kontrast-Tests

```bash
# Visueller Test aller Varianten
# Siehe: /src/components/demo/CategoryDemo.tsx

# Automatische Kontrast-Validierung
npm run accessibility-test
```

### Browser-Tests

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ✅ Mobile Browsers

## 🔄 Migration von Legacy

### Von alten Badge-Komponenten

```tsx
// Alt
<Badge variant="secondary">{category}</Badge>

// Neu - Automatische Farbkodierung
<Chip category={category} variant="subtle">{label}</Chip>
```

### Von Custom Category Badges

```tsx
// Alt - Manuelle Klassen
<div className="category-badge" data-cat={category}>
  {label}
</div>

// Neu - Typ-sichere Props
<Chip category={category} showDot>{label}</Chip>
```

## 📋 Best Practices

### ✅ Empfohlene Verwendung

- **Listen-Tags**: `variant="subtle"` für Tag-Listen
- **Navigation**: `variant="outline"` für Filter-Chips
- **Aktive States**: `variant="filled"` für aktuelle Auswahl
- **Große Listen**: `variant="soft"` für minimales visuelles Gewicht
- **Mobile**: `size="md"` oder `size="lg"` für Touch-Targets

### ❌ Zu vermeiden

- **Zu viele Filled-Chips**: Überwältigt visuell
- **Zufällige Kategorien**: Nutze das Normalisierungs-System
- **Inconsistent Sizes**: Bleibe bei einer Größe pro Context
- **Manuelle Farben**: Nutze das Kategorie-System

### 📱 Mobile Optimierungen

```tsx
// Touch-optimierte Größen
<Chip size="lg" category="business">
  Touch-Friendly
</Chip>

// Mit genügend Abstand
<div className="flex flex-wrap gap-3">
  {chips.map(chip => <Chip key={chip.id} .../>)}
</div>
```

## 🚀 Performance

- **Tree-shakable**: Nur verwendete Varianten werden gebündelt
- **CSS Custom Properties**: Effiziente Theme-Switches
- **Memoization-Ready**: Stabile Props für React.memo()

```tsx
// Performance-optimiert
const MemoizedChip = React.memo(Chip);

// In Listen
{
  items.map((item) => (
    <MemoizedChip key={item.id} category={item.category} variant="subtle">
      {item.name}
    </MemoizedChip>
  ));
}
```

---

_Diese Komponente implementiert die Anforderungen für dezente Kategorie-Farbkodierung gemäß den Design-System-Spezifikationen._
