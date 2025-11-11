# Disa AI Design System RFC: Konsolidierung und Aufräumen

Ziel: Eine einheitliche, robuste UI-Basis ohne konkurrierende Mini-Designsysteme.

## 1. Single Source of Truth

- Primäre Quelle: `src/styles/tokens/*.ts`
  - Enthält Farb-, Radius-, Typografie-, Spacing-, Motion-, Shadow-Tokens.
- Abgeleitete Ebene (CSS Vars):
  - `src/styles/tokens.css`: Basistokens + globale Variablen (inkl. Safe-Area, Z-Index-Basis).
  - `src/styles/theme.css`: Semantische Theme-Variablen (Surfaces, Text, Border, Glow/Shadow).
  - `src/styles/z-index-system.css`: Z-Index-Tokens + Hilfsklassen.
- Konsumenten:
  - React/CVA-Komponenten und Utility-Klassen greifen ausschließlich auf diese Variablen/Tokens zu.

## 2. Erlaubte Design-System-Bausteine

1. TypeScript Tokens
   - Dateien unter `src/styles/tokens/*.ts` sind autoritativ.
   - Änderungen hier werden bewusst und versioniert vorgenommen.

2. CSS Variables
   - `tokens.css` und `theme.css` spiegeln die TS-Tokens als CSS custom properties.
   - Safe-Areas: `--safe-top/right/bottom/left` + Aliase `--safe-area-*`.
   - Shadow-Glows: Vollständiger Satz `--shadow-glow-*` gemäß `shadow.ts`.

3. Utility-/Layout-Layer
   - `base.css`: Reset, HTML/BODY-Basics, Typografie-Grundlagen.
   - `components.css`: strukturierte Komponenten-Styles (nur auf Vars basierend).
   - `mobile-enhancements.css`: Touch, Safe-Area, Gesten-spezifische Utilities.
   - `z-index-system.css`: ausschließlich für Layering.

## 3. Zu entfernende / zu migrierende Altlasten

- Veraltete Button-Varianten
  - `default`, `secondary`, `neumorphic` gelten als Legacy Aliases.
  - Intern bereits auf `neo-*` Style gemappt.
  - Plan:
    - Kurzfristig: Aliases beibehalten (keine Breaking Changes).
    - Mittelfristig: Konsumenten migrieren auf `neo-medium`, `neo-subtle`, `brand`, `accent` etc.
    - Später: Legacy-Keys nur noch in Migrations-Guide dokumentieren.

- Direkte Farbwerte/Inline-Designsysteme
  - Alle neuen Komponenten dürfen keine rohen Hex/RGB-Werte mehr einführen, sondern nur CSS Vars / Tokens nutzen.
  - Vorkommen von `#`, `rgb(`, `box-shadow:` etc. in Komponenten sollen schrittweise auf Tokens umgestellt werden.

- Z-Index-Magie
  - `z-[9999]`, `z-[1000]`, `z-50` usw. sind verboten für neue UI.
  - Bestehende Vorkommen wurden auf semantische Klassen (`.z-modal`, `.z-toast`, `.z-notification`, `.z-skip-link` usw.) migriert.

- 100vh-Hacks
  - Reines `height: 100vh` in interaktiven Views ist untersagt.
  - Verwendung von `100dvh` + `--vh`-Fallback (siehe `mobile-enhancements.css`) ist Standard.

## 4. Bewertung bestehender Dateien (vereinfachte Policy)

- `src/styles/base.css`
  - Bleibt, aber: Nur Reset/Basics, keine Komponentenspezifika.

- `src/styles/components.css`
  - Darf nur semantische, tokenbasierte Styles enthalten.
  - Harte Farben/Z-Indices sind technisch-Schulden und müssen bei Gelegenheit entfernt werden.

- `src/styles/ui-state-animations.css`
  - Erlaubt für Transitions/Keyframes, sofern nur Tokens genutzt werden.

- `src/styles/mobile-enhancements.css`
  - Autoritative Sammlung für mobile-spezifische Utilities (Safe-Area, Touch, dvh).

- `src/styles/theme.css` / `src/styles/tokens.css`
  - Müssen konsistent mit `src/styles/tokens/*.ts` gehalten werden.

## 5. Konkrete Aufräum-Regeln

1. Neue Komponenten
   - Verwenden ausschließlich:
     - `buttonVariants` + o.g. Tokens
     - `badge`, `card`, `chip`, `tabs`, `tooltip`, `drawer-sheet` etc. folgen gleichem Muster.

2. Entfernen/Markieren alter Systeme
   - Keine neuen "Mini-Themes" in einzelnen Komponenten.
   - Kein weiteres `theme-*.css` o.ä. außerhalb der bestehenden zentralen Dateien.
   - Inline-`style` nur für technisch notwendige Fälle (keine Farben/Tokens dort redefinieren).

3. Migrationsempfehlung für bestehende Stellen
   - Schrittweise Suche nach:
     - Hardcodierten Farben: `#`, `rgb(`, `hsl(`.
     - Hardcodierten `box-shadow`/`border-radius` ohne Tokens.
   - Für jedes Vorkommen:
     - Mapping auf existierenden Token oder ggf. neue definieren, nicht ad-hoc.

## 6. QA-Checks (Empfehlung)

- Automatisierte Lint-Regeln (Follow-Up):
  - Verhindern von `z-[9999]` und `height: 100vh` in `src/`.
  - Warnung bei neuen rohen Farbwerten in `src/components/`.
- Vitest + visuelle Regressionstests bleiben maßgeblich.

## 7. Nächste Schritte

- Kurzfristig
  - Dieses RFC als Referenz für künftige PRs nutzen.
  - Keine neuen Abweichungen (Inline-Farben, neue 100vh, unsemantische z-Indices).

- Mittelfristig
  - Schrittweise Migration der verbleibenden Legacy-Styles in `components.css` auf Tokens.
  - Dokumentation der empfohlenen Button-/Card-/Input-Varianten im DESIGN_SYSTEM_README aktualisieren.

- Langfristig
  - Optionaler Generator: TS-Tokens → CSS Vars automatisch bauen.
  - Ergänzende ESLint/Stylelint-Regeln für Design-System-Konformität.
