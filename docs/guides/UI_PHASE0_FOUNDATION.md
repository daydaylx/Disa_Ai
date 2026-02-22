# UI Foundation Phase 0

## Status

Accepted (Phase 0 umgesetzt)

## Zielbild

- Ruhige, konsistente Surface-Sprache statt Gradient-Teppich.
- Mobile-first Lesbarkeit mit klarer Typo- und Spacing-Hierarchie.
- Effekte nur dort, wo sie Orientierung geben.

## Design Rules

### 1) Card-System

Erlaubte Kernvarianten:

- `surface`: Standard-Listenkarten und Panels
- `tinted`: gezielte Akzent-Tints (z. B. Chat-Hero/Suggestion)
- `hero`: erhöhte Prominenz für einzelne Signature-Flächen

Legacy-Varianten bleiben als Kompatibilitäts-Aliase gemappt, aber neue UI nutzt nur die 3 Kernvarianten.

### 2) Kategorie-Farben

Kategorie-Farbe ist nur erlaubt als:

- linke Accent-Bar (1-4px)
- Badge
- Icon-Badge / Icon-Surface

Nicht erlaubt:

- Kategorie-Gradient als Default-Hintergrund von List-Items

### 3) Spacing

Basisraster:

- `8px / 12px / 16px / 24px`

### 4) Radius

- Inputs/Controls: `12px`
- Cards/List Rows: `16px`
- Hero/Sheets: `20px`
- Pills/Chips: `9999px`

### 5) Shadows

- `shadow.subtle`: Standardoberflächen
- `shadow.focus`: Fokus-/Aktivzustände

### 6) Typography

Verbindliche Rollen:

- `title` (primary hierarchy)
- `body` (main content)
- `meta/caption` (secondary/supporting info)

Keine ad-hoc Schriftskalen pro Screen.

## Effektbudget

Blur:

- erlaubt für `Header`, `Drawer`, `Sheet`, `Composer`
- nicht als Default auf langen Listenseiten

Noise:

- nur als globales Hintergrund-Atmosphärenlayer
- nicht innerhalb von Listen-Items

Glow:

- nur bei `active`, `focus`, statusbezogenem Feedback
- keine dauerhafte Leuchtfläche als Standard-Zustand

## Komponentenentscheidungen

Beibehalten:

- `Card` (konsolidiert)
- `Badge`
- `SearchInput`
- `SettingsRow` / `ListGroup`
- `PageHeader`

Weiterhin erlaubt, aber begrenzt auf Spezialfälle:

- `BrandCard` (Composer-Signature)
- `PremiumCard` (einzelne Hero-Kontexte)

Migriert in Phase 0:

- Models-Liste: Gradient-Items -> `surface` + Accent-Bar/Badge/Icon-Badge
- Roles-Liste: Gradient-Items -> `surface` + Accent-Bar/Badge/Icon-Badge
- Themen-Liste: Gradient-Items -> `surface` + Accent-Bar/Badge/Icon-Badge
- Settings-Overview: Gradient-Items -> `surface` + Settings-Akzent
- Chat-History: Gradient-Items -> `surface` + Chat-Akzent

## Definition of Done (Phase 0)

- Keine Screen-Liste nutzt Gradient als Default-Hintergrund für List-Items.
- Card-System ist auf 3 Kernvarianten konsolidiert.
- Token-Leitplanken (Spacing, Radius, Shadow, Tint) sind vereinheitlicht.
