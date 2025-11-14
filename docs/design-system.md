# Disa AI Design System (Mobile-First)

Kurzreferenz für Implementierung. Alle Komponenten nutzen ausschließlich semantische Tokens und Tailwind-Utilities.

## 1. Farben

- Hintergrund-Hierarchie (darf nicht gemischt werden):
  - Layer 1 (App-BG): `--layer-bg-1` = `--surface-bg`
  - Layer 2 (Content): `--layer-bg-2` = `--surface-base`
  - Layer 3 (Cards): `--layer-bg-3` = `--surface-card`
  - Glassflächen: `--layer-glass-panel` (Primär), `--layer-glass-inline` (Sekundär)
- Akzent-System:
  - Primärer Akzent: `--accent`
  - Interaktionsflächen: `--button-primary-*` (bg, border, fg)
  - Weiche Varianten: `--accent-soft`, `--accent-surface`, `--accent-border`
  - Akzent bleibt Buttons/Links vorbehalten – niemals für große Flächen.
- Buttons:
  - Primär (`accent`): `--button-primary-bg`, `--button-primary-fg`
  - Sekundär (`glass-primary`): `--button-secondary-bg`, `--button-secondary-fg`
  - Ghost/Outline: nutzen `--button-ghost-*` bzw. `--glass-border-*`

In Tailwind nur Klassen aus `theme.extend.colors` verwenden (z.B. `bg-surface-base`, `text-text`, `border-line`). Kein Raw-Hex in Komponenten.

## 2. Radii

- Hauptwerte: 12 / 16 / 20 px
  - `sm` → 12px, `md` → 16px, `lg` → 20px
  - Pills/Chips: `rounded-full`
- Neue Komponenten nutzen nur diese Werte.

## 3. Spacing

Scale (4px-Grid):
- 4 / 8 / 12 / 16 / 24 / 32 / 48 px über `--space-3xs` bis `--space-xl` gemappt.
- In Tailwind: `space-y-2`, `px-4` etc. nur wenn mit Tokens konsistent.
- Für Layouts: `p-page-padding-x/y`, Touch-Targets via `--size-touch-*` (≥44px).

## 4. Typografie

- Basis-Font: "Plus Jakarta Sans" (Fallbacks siehe Tokens).
- Skala (immer auf diese Werte einrasten):
  - `caption` → 14px (`--font-size-caption`)
  - `body` → 16px (`--font-size-body`)
  - `title-sm` → 18px (`--font-size-title-sm`)
  - `title-lg` → 24px (`--font-size-title-lg`)
- Line-Heights: `--line-height-caption` (1.4), `--line-height-body` (1.55), `--line-height-title-sm` (1.4), `--line-height-title-lg` (1.3).
- Utilities:
  - `.text-style-heading-lg`, `.text-style-heading-sm`
  - `.text-style-body`, `.text-style-body-strong`
  - `.text-style-label`, `.text-style-caption`
  - `.chat-bubble`, `.chat-bubble-user|assistant|system` für Chat
- Keine spontanen Tailwind-Größen mehr verwenden – Typo erfolgt ausschließlich über diese Klassen oder Tokens.

## 5. Motion

- Dauer: 120ms (quick), 180ms (base), 240ms (slow)
- Easing: `cubic-bezier(.23,1,.32,1)` für alle Übergänge.
- Tokens: `--motion-duration-*`, `--motion-ease-standard` etc.

Empfehlung: Keine längeren oder "gummiartigen" Animationen.

## 6. Glass-Surfaces

- Top-App-Bar / Bottom-Nav / Karten nutzen `--surface-glass-*` + `backdrop-blur-*`.
- Blur nur 12–18px (Subtle/Medium/Strong) via Tokens.
- Globale Hilfsklassen:
  - `.glass-panel` – primäre Karten/Oberflächen (verwendet Tokens für Border, Blur, Schatten)
  - `.glass-inline` – kompakte Tiles innerhalb einer Sektion (keine zusätzlichen Glows)
  - `.glass-chip` (+ Modifier wie `--info`, `--warning`, `--compact`) – Status-Badges
  - `.glass-field` – Eingabefelder/Textareas mit konsistenter Glass-Optik
- Für Warnungen/States `data-tone="warning|danger|success|info"` setzen, damit Border und Hintergrund automatisch eingefärbt werden.

## 7. Richtlinien

- Nur semantische Tokens + Tailwind-Utilities.
- Kein direktes Hardcoding von Hex-Werten in React.
- App-Shell, Chat-Bubbles, Composer, Model-Picker, Settings, Skeletons folgen diesen Vorgaben (siehe Komponenten).
