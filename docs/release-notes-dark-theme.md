# Release Notes – Dark Theme Konsolidierung (November 2025)

## Neues Erscheinungsbild
- Komplettes UI auf Dark Mode fixiert (helle Varianten entfernt).
- Mobile-first Überarbeitung (Android-Fokus): einheitliche Gutter, reduzierte Glow-Effekte, ruhigere Shadows (`shadow-neo-sm/md`).
- Settings-, Template- und Welcome-Screens passen sich den neuen Tokens an (Floating Surfaces & dezente Gradients).

## UX-Verbesserungen
- Buttons/Badges/Tabs nutzen harmonisierte Hover-/Focus-States (`shadow-focus-neo`, `shadow-glow-brand-subtle`).
- Chat History Drawer & Command Palette erhielten klare Fokusführung und übersichtliche Layouts.
- PWA-Installprompt & Toasts aktualisiert: weichere Card-Optik, konsistente Shadows.

## Accessibility & QA
- Manuelle Dark-Theme-Stichprobe (docs/mobile-visual-review.md).
- Accessibility Quick Check (docs/accessibility-dark-mobile.md): Fokus, Screenreader, Kontrast; keine Blocker.
- Lighthouse & Axe Automatisierung (docs/qa-lighthouse-plan.md) vorbereitet – CI-Setup empfohlen.

## Breaking Changes
- Theme Switcher entfernt; `data-theme` ist dauerhaft `dark`.
- Light-Mode-spezifische Tokens (`--color-surface-*`) deprecated, durch `--surface-neumorphic-*` ersetzt.

## Offene Punkte
1. GitHub Action für Lighthouse/Axe ausrollen, um Berichte zu automatisieren.
2. Chat History Accessibility (optional `aria-selected`).
3. Safari-Fallback für `color-mix` definieren.

## Credits
- Umsetzung durch Dark-Theme Konsolidierungsteam (Phase 1–4, November 2025).
