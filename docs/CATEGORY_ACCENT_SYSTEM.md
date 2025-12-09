# Category Accent System

Diese Dokumentation beschreibt das erweiterte Farb-Akzentsystem für Kategorien in Disa AI.

## Übersicht

Das Disa AI Farb-System basiert auf einem zweistufigen Akzentansatz:

1. **Page-Specific Accents**: Primäre Akzentfarben für Hauptseiten (Chat, Models, Roles, Settings)
2. **Category-Specific Accents**: Sekundäre Akzentfarben für Kategorien innerhalb von Rollen und Themen

Alle Farben sind für **Dark Theme optimiert** und folgen einem konsistenten Opacity-System für verschiedene Anwendungsfälle.

---

## Farb-Palette

### Page-Specific Accents

Diese Akzente definieren die Hauptfarben für die verschiedenen Seiten:

| Accent | Farbe | Hex | Verwendung |
|--------|-------|-----|------------|
| `accent-chat` | Violet | `#8b5cf6` | Chat-Bereich, primäre Brand-Farbe |
| `accent-models` | Cyan | `#06b6d4` | Modelle-Seite, technisch & kühl |
| `accent-roles` | Pink | `#f472b6` | Rollen-Seite, kreativ & warm |
| `accent-settings` | Light Violet | `#a78bfa` | Einstellungen, ruhig & utility |

### Theme/Discussion Category Accents

Für Themen und Diskussionen (Quickstarts):

| Accent | Farbe | Hex | Kategorie |
|--------|-------|-----|-----------|
| `accent-wissenschaft` | Emerald | `#10b981` | Wissenschaftliche Themen |
| `accent-realpolitik` | Sky Blue | `#0ea5e9` | Politische Themen |
| `accent-hypothetisch` | Purple | `#a855f7` | Hypothetische Szenarien |
| `accent-kultur` | Amber | `#f59e0b` | Kulturelle Themen |
| `accent-verschwörung` | Zinc | `#71717a` | Verschwörungstheorien |

### Role Category Accents

Für Rollen-Kategorien:

| Accent | Farbe | Hex | Kategorie |
|--------|-------|-----|-----------|
| `accent-assistance` | Indigo | `#818cf8` | Assistance |
| `accent-creative` | Rose | `#fb7185` | Creative |
| `accent-technical` | Teal | `#14b8a6` | Technical |
| `accent-business` | Emerald | `#059669` | Business |
| `accent-analysis` | Cyan | `#22d3ee` | Analysis |
| `accent-research` | Emerald | `#34d399` | Research |
| `accent-education` | Amber | `#fbbf24` | Education |
| `accent-entertainment` | Pink | `#f472b6` | Entertainment |

---

## Opacity-System

Jeder Accent hat 5 Varianten mit verschiedenen Transparenzstufen:

| Variante | Opacity | Verwendung | Beispiel |
|----------|---------|------------|----------|
| `DEFAULT` | 1.0 (100%) | Text, Icons, Borders | `text-accent-wissenschaft` |
| `dim` | 0.12 (12%) | Subtile Hintergründe | `bg-accent-wissenschaft-dim` |
| `surface` | 0.06 (6%) | Sehr dezente Tönungen | `bg-accent-wissenschaft-surface` |
| `border` | 0.35 (35%) | Sichtbare Kanten | `border-accent-wissenschaft-border` |
| `glow` | 0.25 (25%) | Shadow-Effekte | `shadow-glow-wissenschaft` |

---

## Verwendung

### Kategorie-Mapping Utility

Die Datei `src/lib/utils/categoryAccents.ts` bietet Helper-Funktionen zum Mappen von Kategorien zu Accent-Namen:

```typescript
import { getRoleCategoryAccent, getThemeCategoryAccent } from '@/lib/utils/categoryAccents';

// Rollen-Kategorie
const roleAccent = getRoleCategoryAccent("Technical");
// => "technical"

// Themen-Kategorie
const themeAccent = getThemeCategoryAccent("wissenschaft");
// => "wissenschaft"

// Verwendung in Tailwind-Klassen
const classes = `bg-accent-${accent}-surface border-accent-${accent}-border`;
```

### Helper-Funktion für Card-Klassen

```typescript
import { getCategoryCardClasses } from '@/lib/utils/categoryAccents';

const classes = getCategoryCardClasses("Technical", "role");
// Liefert:
// {
//   surface: "bg-accent-technical-surface",
//   border: "border-accent-technical-border",
//   glow: "shadow-glow-technical",
//   text: "text-accent-technical",
//   dim: "bg-accent-technical-dim"
// }
```

---

## Card-Patterns

### Standard Card mit Kategorie-Akzent

```tsx
const categoryAccent = getRoleCategoryAccent(role.category);

<Card
  className={cn(
    "relative transition-all",
    "bg-surface-1/60 border-white/10",
    `hover:border-accent-${categoryAccent}-border/50`,
    // Linker Border-Akzent
    "before:absolute before:left-0 before:top-3 before:bottom-3",
    "before:w-1 before:rounded-r-full before:transition-opacity",
    `before:bg-accent-${categoryAccent}`,
    "before:opacity-40 hover:before:opacity-80"
  )}
>
  {/* Card Content */}
</Card>
```

### Icon mit Kategorie-Farbe

```tsx
<div
  className={cn(
    "h-12 w-12 rounded-xl flex items-center justify-center border transition-colors",
    `bg-accent-${categoryAccent}-surface`,
    `border-accent-${categoryAccent}-border/30`,
    `text-accent-${categoryAccent}`
  )}
>
  <Icon className="h-6 w-6" />
</div>
```

### Badge mit Kategorie-Farbe

```tsx
<span
  className={cn(
    "px-2 py-0.5 rounded-full text-xs font-medium border",
    `bg-accent-${categoryAccent}-dim`,
    `text-accent-${categoryAccent}`,
    `border-accent-${categoryAccent}-border`
  )}
>
  {categoryLabel}
</span>
```

---

## Implementierte Komponenten

### ✅ Rollen Cards (`EnhancedRolesInterface.tsx`)

- Kategorie-basierter linker Border-Akzent
- Icon-Farbe nach Kategorie
- Expanded-Details mit Kategorie-Surface
- Hover-States mit Kategorie-Glow

### ✅ Modelle Cards (`EnhancedModelsInterface.tsx`)

- Linker Border-Akzent in `accent-models`
- Performance-Bars mit Accent-Farben
- Hover-States mit `shadow-glow-models`

### ✅ Themen Cards (`ThemenBottomSheet.tsx`)

- Kategorie-basierte Akzente (wissenschaft, realpolitik, kultur, etc.)
- Icon-Bereiche mit Kategorie-Surface
- Linker Border-Akzent
- Category-Badges mit Accent-Farben

### ✅ Startscreen Vorschläge (`Chat.tsx`)

- Subtiler linker Border in `accent-chat`
- Icon-Bereiche mit `accent-chat-dim` auf Hover
- Verbesserte Hover-States mit Glow

---

## Design-Prinzipien

### 1. Konsistenz

- Alle Kategorien innerhalb eines Typs (Rollen/Themen) nutzen das gleiche Opacity-System
- Hover-States folgen demselben Muster: `opacity-40` → `opacity-80` → `opacity-100` (aktiv)

### 2. Subtilität

- Basis-Cards sind neutral (`bg-surface-1/60`)
- Akzentfarben kommen durch dezente Varianten (`-surface`, `-dim`)
- Volle Farben (`DEFAULT`) nur für Icons, Text und kleine Akzente

### 3. Lesbarkeit & Accessibility

- Alle Text-Farben erfüllen WCAG AA Kontrast-Anforderungen auf Dark Background
- `dim` und `surface` Varianten sind nur für Hintergründe, nie für Text
- `border` Varianten sorgen für klare Abgrenzungen

### 4. Kategorie-Gruppierung

- Karten mit derselben Kategorie teilen sich die Akzentfarbe
- Ermöglicht visuelle Gruppierung ohne explizite Sections
- User erkennen auf einen Blick verwandte Inhalte

---

## Hinzufügen neuer Kategorien

### 1. Tailwind Config erweitern

In `tailwind.config.ts`:

```typescript
"accent-newcategory": {
  DEFAULT: "#hexcolor",
  dim: "rgba(r, g, b, 0.12)",
  glow: "rgba(r, g, b, 0.25)",
  border: "rgba(r, g, b, 0.35)",
  surface: "rgba(r, g, b, 0.06)",
},
```

Glow-Effekt hinzufügen:

```typescript
"glow-newcategory": "0 0 12px rgba(r, g, b, 0.25)",
```

### 2. Mapping-Utility aktualisieren

In `src/lib/utils/categoryAccents.ts`:

```typescript
// Für Rollen-Kategorien
const ROLE_CATEGORY_ACCENT_MAP: Record<RoleCategory, AccentName> = {
  // ...
  NewCategory: "newcategory",
};

// Für Themen-Kategorien
const THEME_CATEGORY_ACCENT_MAP: Record<QuickstartCategory, AccentName> = {
  // ...
  newcategory: "newcategory",
};
```

### 3. TypeScript-Types aktualisieren

```typescript
export type AccentName =
  | "chat"
  | "models"
  // ...
  | "newcategory";

export type RoleCategory =
  | "Assistance"
  // ...
  | "NewCategory";
```

---

## Troubleshooting

### Problem: Farben werden nicht angezeigt

**Lösung**: Tailwind generiert nur Klassen, die im Code verwendet werden. Bei dynamischen Klassen wie ``bg-accent-${categoryAccent}-surface`` muss die vollständige Klasse im Code vorkommen, oder die Klassen müssen in der `safelist` in `tailwind.config.ts` gelistet sein.

**Alternative**: Verwende `getCategoryCardClasses()` für statisch generierte Klassen.

### Problem: Kontrast zu niedrig

**Lösung**: Nutze `DEFAULT` statt `dim` für Text. `dim` ist nur für Hintergründe geeignet.

### Problem: Kategorie-Akzent erscheint nicht

**Lösung**: Prüfe, ob die Kategorie im Mapping existiert. Fallback ist immer `"chat"` oder `"roles"`.

---

## Änderungslog

### v1.0 (2025-12-09)

- ✅ Initiales Category Accent System
- ✅ 5 Theme-Kategorien (wissenschaft, realpolitik, hypothetisch, kultur, verschwörung)
- ✅ 8 Rollen-Kategorien (assistance, creative, technical, business, analysis, research, education, entertainment)
- ✅ Mapping-Utility (`categoryAccents.ts`)
- ✅ Update aller Card-Komponenten (Rollen, Modelle, Themen, Startscreen)
- ✅ CATEGORY_LABELS Update für Themen mit neuen Accent-Farben

---

## Beispiele

### Wissenschaft-Thema Card

```tsx
const accent = getThemeCategoryAccent("wissenschaft");

<button className={cn(
  "relative p-3 rounded-xl transition-all",
  "bg-surface-1/60 border border-white/10",
  "hover:bg-surface-1/80 hover:border-accent-wissenschaft-border/50",
  "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1",
  "before:bg-accent-wissenschaft before:opacity-60 hover:before:opacity-100"
)}>
  <div className="bg-accent-wissenschaft-surface border-accent-wissenschaft-border/30 text-accent-wissenschaft">
    <Brain className="h-5 w-5" />
  </div>
  <span>Gibt es Außerirdische?</span>
</button>
```

### Technical-Rolle Card

```tsx
const accent = getRoleCategoryAccent("Technical");

<Card className={cn(
  "relative",
  "bg-surface-1/60 border-white/10",
  "hover:border-accent-technical-border/50 hover:shadow-glow-technical",
  "before:bg-accent-technical before:opacity-40 hover:before:opacity-80"
)}>
  <div className="bg-accent-technical-dim text-accent-technical border-accent-technical-border/50">
    <Code className="h-6 w-6" />
  </div>
  <h3>Code-Experte</h3>
</Card>
```

---

**Autor**: Claude (WebDev Arena)
**Datum**: 2025-12-09
**Version**: 1.0
