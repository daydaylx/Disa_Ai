# Mobile Visual Review (Phase 3 – 02.11.2025)

Kurzer manueller Abgleich der zentralen Screens auf einem Android-Viewport (Pixel 6, 412×915):

## Chat / Composer
- **Container**: `surface-neumorphic-base` + Seiten-Gutter (12–20 px) sichtbar, Messages nutzen volle Breite.
- **Composer**: Sticky Footer mit reduziertem Shadow (`shadow-neumorphic-md`), Touch-Ziele ≥48 px.
- **Focus**: Button-Fokus (Send) zeigt dezentes `shadow-focus-neo`.

## Chat History (Drawer & Mobile Overlay)
- Drawer Cards mit `shadow-neo-sm`, aktive Einträge `shadow-glow-brand-subtle`.
- Filter-Chips nutzen subtile Glow-Variante, keine dauerhafte Neon-Wirkung.
- Suchfeld: Inset-Shadow, Tastatur-Overlap getestet (Scroll-Padding greift).

## Settings & Welcome (Baseline)
- Layout verwendet neue Button/Badge-Stile; größere Flächen noch `surface-neumorphic-raised`.
- TODO Phase 3b: Card-Spacing und Section-Borders auf neues Schema anpassen.

## Overlays / Feedback
- Command Palette: Blur-Overlay + `shadow-neo-md`, Liste nutzt ruhige Farb- & Glow-Akzente.
- Tooltip/Toast/Dialog: Shadows reduziert, Fokus über `shadow-focus-neo`.

### Auffälligkeiten
1. **Settings Cards** wirken weiterhin sehr hell (keine `hero/contrast`-Surfaces). → In Phase 3b ausarbeiten.
2. **Welcome Hero**: Gradient noch stark gesättigt, optional zukünftig `--surface-neumorphic-hero`.
3. **Command Palette**: Inline `color-mix` für Description/Shortcut – Browser-Support ok (Chromium 111+), trotzdem prüfen für Safari 16.

### Empfehlung
- Phase 3b auf Settings/Welcome ausweiten (Cards, hero sections).
- Abschließend visuelle Regression via Percy/Loki einplanen.
