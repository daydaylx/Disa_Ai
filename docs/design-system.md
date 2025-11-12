# Disa AI Design System (Mobile-First)

Kurzreferenz für Implementierung. Alle Komponenten nutzen ausschließlich semantische Tokens und Tailwind-Utilities.

## 1. Farben

- Hintergrund
  - `--bg0` / `--surface-bg`: `#0B0F14`
  - `--bg1` / `--surface-base`: `#0F1420`
  - `--surface`: `rgba(255,255,255,.04)` via `--surface-card` / glass-Varianten
  - `--glass`: `rgba(255,255,255,.06)` über `--surface-glass-*`
  - `--stroke`: `rgba(255,255,255,.16)` über `--border-hairline`/`--line`
- Accent (ein Brand)
  - `--accent`: `#8B5CF6`
  - `--accent-weak`, `--accent-contrast` nur als abgeleitete States

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

- Font: "Plus Jakarta Sans" (Fallbacks in `theme.css`).
- Gewichte: 400, 600, 700.
- Größen: 12, 14, 16, 18, 20, 24, 28, 32 px mit LH 1.4–1.6.
- Tailwind nutzt `fontSize`-Mapping aus `tailwind.config.ts`.

## 5. Motion

- Dauer: 120ms (quick), 180ms (base), 240ms (slow)
- Easing: `cubic-bezier(.23,1,.32,1)` für alle Übergänge.
- Tokens: `--motion-duration-*`, `--motion-ease-standard` etc.

Empfehlung: Keine längeren oder "gummiartigen" Animationen.

## 6. Glass-Surfaces

- Top-App-Bar / Bottom-Nav / Karten nutzen `--surface-glass-*` + `backdrop-blur-*`.
- Blur nur 12–18px (Subtle/Medium/Strong) via Tokens.

## 7. Richtlinien

- Nur semantische Tokens + Tailwind-Utilities.
- Kein direktes Hardcoding von Hex-Werten in React.
- App-Shell, Chat-Bubbles, Composer, Model-Picker, Settings, Skeletons folgen diesen Vorgaben (siehe Komponenten).