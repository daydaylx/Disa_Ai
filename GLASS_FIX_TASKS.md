# Glas-UI Sanierungsplan

Dieser Leitfaden fasst die nötigen Arbeiten zusammen, um die im `GLASS_DESIGN_SYSTEM.md` beschriebenen Prinzipien wieder durchgängig in der UI anzuwenden.

## 1. Design Tokens korrigieren

- `src/styles/design-tokens.css`: Primär-Glas auf 6 % Opazität hochziehen, Sekundär/Tertiär nach Vorgabe (4 %/3 %).
- Primäre Kartenrundung von `var(--radius-md)` auf `var(--radius-lg)` erhöhen; `GlassCard` wieder auf `rounded-2xl` wirken lassen.
- Prüfen, ob `GlassCard`-Mesh-Variante weiterhin konsistente Schatten/Blur-Werte nutzt.

## 2. Fehlende Utility-Klassen ergänzen

- In `src/index.css` bzw. `design-tokens.css` folgende Utilities hinzufügen:
  - `glass-tooltip`, `glass-sheet`, `glass-toast`, `glass-backdrop--{soft,medium}`, `glass-select`.
  - Button-Basis (`.btn`, `.btn-ghost`, `.btn-primary`, `.btn-outline`, `.btn-danger`, `.btn-sm`, `.tap-target`).
  - U-Klassen (`.u-card`, `.u-glass`, `.u-ring`) für den AppShell-Composer.
- Tailwind-Safelist anpassen, falls neue Klassen dynamisch verwendet werden.

## 3. Komponenten auf Tokens umrüsten

- `src/components/ui/card.tsx`, `ChatComposer`, `NavBar`, `ModelPicker`, `Accordion`, etc.: harte `bg-white/…`- und `border-white/…`-Werte entfernen und passende `glass-card-*` oder neue Utilities einsetzen.
- `src/components/ui/button.tsx`, `src/ui/primitives/Button.tsx`, `CopyButton`, `ToastsProvider`: sicherstellen, dass Varianten auf die neue `.btn-*`-Infrastruktur oder das GlassCard-System aufbauen (inkl. `rounded-full` bei Primary-Buttons).
- `Tooltip`, `Toast`, `Sheet`, `VirtualMessageList` auf die neuen `glass-*` Utilities umstellen.

## 4. Tailwind-Erweiterungen

- In `tailwind.config.ts` Farbnamen wie `glass-surface`, `glass-border` hinterlegen, damit Skeletons & Hover-States funktionieren.
- Ggf. `theme.extend.colors` um `glass`-Palette ergänzen, damit `from-glass-surface/20` usw. aufgelöst werden.

## 5. Visual & Regression Tests

- Storybook/Chromatic (falls vorhanden) oder manuelle Vite-Preview, Screenshots der wichtigsten Screens (Chat, Settings, Studio, Models).
- Mobile View prüfen (Blur/Backdrops, Performance, `prefers-reduced-motion`).
- UI-Regressionen mit vorhandenen Playwright- oder Vitest-Snapshots kontrollieren, ggf. neue Tests hinzufügen.

## 6. Aufräumen & Migration

- Deprecations (`StaticGlassCard`, Legacy `.glass-*` Klassen) final ablösen oder mit klaren Flags kennzeichnen.
- Dokumentation (`GLASS_DESIGN_SYSTEM.md`, `docs/`) nachziehen, wenn neue Tokens/Utilities hinzukommen.
- Nach Abschluss: `npm run lint` / `npm run test` / `npm run build` ausführen und Ergebnisse dokumentieren.

Diese Liste dient als Arbeitsgrundlage; während der Umsetzung auftauchende Abhängigkeiten möglichst hier ergänzen.
