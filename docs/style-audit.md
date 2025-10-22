# Style Audit – Disa AI
Stand: 2025-10-22

## Snapshot
- Fragmentierte Style-Quellen (globale CSS-Dateien, TS-Token-Mappings, Inline-Styles) liefern widersprüchliche Werte und erschweren die Einführung eines konsistenten Fluent-2-Soft-Depth-Looks.
- Navigation besteht aktuell aus mehreren losen Komponenten (`Header`, `Menu`, `SettingsFAB`) mit Legacy-Variablen (`--glass-*`, `--fg`) und Inline-Safe-Area-Berechnungen.
- Mehrere globale Dateien überschneiden sich funktional (Resets, Safe-Area, Fokus-Styles) und nutzen teilweise `!important`-Hacks.

## Fundstellen & Entsorgungsplan

### Globale Layer & Resets
- `src/index.css:1-144`  
  - **Befund:** Körper-Hintergrund als radiale Gradients, veraltete Alias-Variablen (`--fg`, `--bg0`), globale Safe-Area-Helfer (`.safe-*`) und Fokus-Ringe, die vom Token-Set abweichen. Konflikt mit `:root`-Farbschemata.  
  - **Entsorgungsplan:** Datei durch neues `src/styles/global.css` ersetzen, das nur Reset, Basis-Typo und Scrollbar-Styles via Token-Utilities enthält. Safe-Area-Utilities werden als Tailwind-Plugin oder Utility-Klassen auf Token-Basis reimplementiert, Legacy-Aliasse gelöscht.

- `src/styles/mobile-fixes.css:1-156`  
  - **Befund:** Dupliziert Reset/Safe-Area-Logik, enthält `!important`-Fixes für iOS (`font-size: 16px !important`) und deaktiviert Textauswahl global.  
  - **Entsorgungsplan:** Notwendige Viewport-Korrekturen in neue Global-Datei (per CSS-Moderneinheiten) überführen, restliche Datei entfernen.

- `src/ui/base.css:1-116`  
  - **Befund:** Zweiter Reset mit eigenen Safe-Area-Variablen (`--inset-*`) und Touch-Target-Regeln. Überschneidung mit `mobile-fixes.css` und Tailwind Utility-Ansatz.  
  - **Entsorgungsplan:** Inhalt in vereinheitlichtes Global-Styling integrieren oder vollständig streichen, Touch-Targets künftig über Tokens/Tailwind-Komponenten gewährleisten.

- `src/styles/a11y-improvements.css:1-118`  
  - **Befund:** Setzt alternative Fokusfarben (`rgb(147, 51, 234)`) und nutzt `!important`, überschreibt Tailwind-Fokusklassen (`.focus:ring`). Enthält eigene `sr-only`-Implementierung.  
  - **Entsorgungsplan:** Fokus- und Kontrastwerte über Tokens definieren, `!important`-Overrides entfernen, `sr-only` über Tailwind-Baseline nutzen.

- `src/styles/bottomsheet.css:1-88`  
  - **Befund:** Proprietäre Klassen (`.bottom-sheet-*`) mit Legacy-Variablen (`--fg-dim`, `rgb(var(--brand-rgb))`).  
  - **Entsorgungsplan:** Bottom-Sheet-Komponenten auf Tailwind + Token-Utilities umbauen, Datei löschen.

### Typografie & Token-Duplikate
- `src/styles/typography.css:1-138`  
  - **Befund:** Klassische `.typo-*` Klassen mit fixen Pixelwerten, widerspricht Tailwind-Typografie-Erweiterungen und TS-Typo-Tokens.  
  - **Entsorgungsplan:** Typografie über neue Token-Skala und Tailwind `fontSize`/`fontWeight` Utilities abbilden, Datei entfernen.

- `src/styles/design-tokens.css:1-520`  
  - **Befund:** Enthält komplette Variable-Matrix inkl. Legacy-Aliassen (`--fg`, `--surface-0`, `--brand-rgb`), setzt `:root` auf `color-scheme: light`, während `body` in `index.css` auf `dark` steht.  
  - **Entsorgungsplan:** Datei durch neues `src/styles/tokens.css` (Single Source of Truth) ersetzen, Aliasse ausphasen, Farbwerte auf Fluent-2 Soft-Depth abstimmen.

- `src/styles/design-tokens.ts:1-78` & `src/styles/tokens/**/*.ts`  
  - **Befund:** TypeScript-Mapping der gleichen Token-Werte → doppelte Pflege, teilweise andere Hex-Werte als CSS.  
  - **Entsorgungsplan:** Tokens zentral in CSS definieren, Tailwind-Konfiguration liest ausschließlich CSS-Variablen; TS-Mappings nur falls zwingend für JS-Laufzeit, ansonsten entfernen.

- `tailwind.config.ts:1-204`  
  - **Befund:** Importiert TS-Tokens, mappt sie auf Theme-Erweiterungen; `safelist` lässt alle `grid|flex|gap|items|justify-*` zu → erschwert Purge.  
  - **Entsorgungsplan:** Config refaktorieren, um Variablen aus `tokens.css` zu verwenden, Safelist reduzieren (gezielte Klassen), neue Soft-Depth-Shadow-Utility ergänzen.

- `postcss.config.cjs:1-6`  
  - **Befund:** Standard-Setup ohne zusätzliche Purge/PostCSS-Schritte, keine Referenz auf neues Theme-Layering.  
  - **Entsorgungsplan:** Prüfen/ergänzen, falls Theme-Layer zusätzliche Plugins (z. B. nesting) benötigen; sicherstellen, dass Tailwind JIT-Pfade komplett sind.

### Navigation & Komponenten-Legacy
- `src/components/layout/Menu.tsx:1-112`  
  - **Befund:** Legacy-Bottom-Nav kombiniert mit BrandWordmark, nutzt `var(--glass-overlay-*)` und Inline-Safe-Area (`style={{ paddingBottom: "calc(...)" }}`). Nicht mehr kompatibel mit neuem Router-Setup.  
  - **Entsorgungsplan:** Durch neue Header-/Bottom-Navigation ersetzen; Routen-Definition zentralisieren, Inline-Styles eliminieren.

- `src/components/nav/SettingsFAB.tsx:9-23`  
  - **Befund:** Separater Floating-Button mit Inline-Positionierung (`style={{ bottom: ... }}`) und alten Border/Surface-Variablen (`--surface-1`, `--text-0`).  
  - **Entsorgungsplan:** Funktion in neue Navigation integrieren, Datei löschen.

- `src/components/Header.tsx:15-84`  
  - **Befund:** Aktueller Header liefert nur Branding + Status, keine Navigation; nutzt `shadow-surface` (abhängig von Legacy-Shadow-Tokens).  
  - **Entsorgungsplan:** Header zum Haupt-Navigationscontainer ausbauen, Shadow-Klassen auf neue Soft-Depth-Utility migrieren.

- `src/components/layout/Menu.tsx`, `src/components/BottomSheet.tsx`, `src/components/nav/*`  
  - **Befund:** Mehrere Navigationseinstiegspunkte konkurrieren (Bottom Sheet Toggle, FAB, Fixed Nav).  
  - **Entsorgungsplan:** Navigation neu strukturieren (`src/routes.ts`, `HeaderNav`, `BottomNav`), alte Komponenten dekommissionieren.

### Inline Styles & Hardcodierte Farben
- `src/lib/pwa/installPrompt.ts:62-101`  
  - **Befund:** Inline-HTML mit hart codierten Farben (`rgba(79, 70, 229, 0.95)`, `#4f46e5`), Schatten und Fonts.  
  - **Entsorgungsplan:** Prompt in komponentenbasierte Lösung überführen, Tokens für Farbe/Radius/Schatten nutzen.

- `src/config/terminology.ts:112-138`  
  - **Befund:** Toast-Configs fallbacken auf Hex-Werte (`#10b981`, `#ef4444`, ...).  
  - **Entsorgungsplan:** Ersetzen durch Token-Referenzen (`var(--color-status-*)`), optionale JS-Fallbacks streichen.

- Inline Safe-Area / Height Styles (`src/components/shell/AppShell.tsx:15`, `src/components/Composer.tsx:29`, `src/pages/ChatV2.tsx:765`, `src/components/layout/Menu.tsx:45`, `src/components/nav/SettingsFAB.tsx:14`)  
  - **Befund:** `style={{ minHeight: "var(--vh, 100dvh)" }}` etc. blockieren Purge und erschweren Dark/Light-Adaption.  
  - **Entsorgungsplan:** Tailwind-CSS-Custom-Utilities auf Basis der neuen Tokens (z. B. `min-h-screen-dynamic`, `pb-safe`) schaffen.

- `src/components/ui/Skeleton.tsx:145-166`, `src/components/ui/CommandPalette.tsx:167`, `src/components/chat/*`  
  - **Befund:** Mehrere Komponenten setzen Inline-Shadows/Blur/Safe-Area-Werte.  
  - **Entsorgungsplan:** Schatten und Blurs durch Token-Utilities (Soft-Depth) ersetzen, Safe-Area via Utility.

### Dead/Legacy Assets
- `src/styles/design-tokens.css` & Aliasse (`--fg`, `--bg0`, `--surface-0`), `src/styles/mobile-fixes.css` Touch-Disables, `src/styles/a11y-improvements.css` `text-white/60` Overrides.  
  - **Entsorgungsplan:** Sobald neue Token-Dateien aktiv sind, Aliasse/Utilities entfernen, Komponenten auf Tokens migrieren, Dateien löschen.

- `src/styles/layers.css:1-1`  
  - **Befund:** Deklariert nur Layer, aber keine weiteren Styles; dient aktuell als Import-Anker für Legacy-CSS.  
  - **Entsorgungsplan:** Durch geordnete Layer in `global.css` ersetzen, Datei optional löschen.

### Navigation Datenlage
- Fehlende zentrale Route-Definition – Routen-Namen/Icon-Labels verteilt (z. B. `src/components/layout/Menu.tsx`, `src/app/routes/**/*`).  
  - **Entsorgungsplan:** Neue Datei `src/routes.ts` mit Labels, Icon-Refs, `isPrimary`/`isBottomNav`-Flags; Header/BottomNav konsumieren einheitlich.

---

**Nächste Schritte:** Tokens konsolidieren (`tokens.css`, `theme.css`), Tailwind neu anbinden, Navigation neu implementieren und anschließend Altlasten iterativ entfernen.
