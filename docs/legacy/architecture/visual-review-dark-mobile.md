# Visuelle Stichprobe – Dark Theme (Android, Pixel 6)

| Screen | Snapshot / Eindruck | Auffälligkeiten |
| --- | --- | --- |
| Chat (Start) | Gutter 12–20 px, Composer sticky mit `shadow-neumorphic-md` | CTA „Neuer Chat“ wirkt präsent; History-Button outline passt |
| Chat History Drawer | Cards `shadow-neo-sm`, Filter-Chips mit `shadow-glow-brand-subtle` | Aktive Chats heben sich mit Glow ab |
| Command Palette | Overlay blur, Container `shadow-neo-md`, Liste farblich ruhig | Accent Tint (color-mix) leicht leuchtend, ok |
| Settings Overview | Cards/Fokus neu, Icon Bubbles `shadow-neo-sm` | Hero-Karte harmoniert mit Brand |
| Template Card | Icon-Boxes & Badges ohne harte Glow-Gradients | CTA area unter der Karte wirkt ruhig |
| Welcome Screen | Discussion Panel: `surface-floating`, Chips `shadow-neo-sm` | CTA Buttons (brand/outline) konsistent |

## Notizen
- Keine regressiven Visuellen Ausreißer, dunkle Flächen homogen.
- `color-mix` in Command Palette & Badges (hover) → Cross-browser: Chrome/Firefox ok, Safari 16+ prüfen (Fallback: 70 % brand + white).
- TemplateCard hat nur Border + Shadow; evtl. minimalen Tint in Icon-Container (Variante?) überlegen.

## Nächste QA-Schritte
1. Accessibility Sweep (Kontrast + Focus).
2. Lighthouse (Performance/Accessibility).
3. Evtl. Percy-Setup für automatisierte Snapshots.

## Phase 4 Follow-up – 02./03.11.2025 (Android Fokus)

- Chat Start & Composer: Composer-Container jetzt mit `shadow-inset-subtle` + Float-Surface, Übergang zum Hauptbereich wirkt auf AMOLED sichtbar softer; CTA bleibt prominent ohne Neon-Kante.
- Chat History Drawer: ARIA-Anpassungen greifen, zusätzlich sorgt `scroll-padding-top` für sauberes Scrollen bei Tastatureinblendung.
- Command Palette: Blur + Shadow-Setup weiterhin ruhig; Safari-Fallback liefert nun RGBA-Farbe für Descriptions falls `color-mix` fehlt.
- Templates & Header Icons: Select-Komponenten und Checkmarks nutzen `shadow-neumorphic-icon`; kein manuelles `drop-shadow` mehr.
- Settings Overview: Card-Stack bleibt etwas flach; Empfehlung bleibt, Hero künftig mit `surface-neumorphic-hero` + `shadow-neo-lg` weiter zu betonen.
- Header & CTA: GlobalNav + mobile Header nutzen `surface-neumorphic-floating` + Inset-Schatten, CTA „Neuer Chat“ arbeitet mit Vollton-Brand & Glow ohne Verlauf.
- Form Controls: Select-Komponente migriert auf `shadow-neumorphic-icon` und reduzierten Hover-Kontrast, Badge-Default nutzt Neomorph-Basis statt Pastell.
- Rollenübersicht: Kategorien & Tags verwenden die `--role-accent-*`-Tokens; Zähler-Badge erhält inset Shadow für konsistente Neomorph-Optik.

### Offene UI-Optimierungen (Mobile Dark Theme)

1. **Safari Fallbacks:** `color-mix()`-Fallbacks für verbleibende Komponenten (Badges in Cards, Motion-Bubbles) weiter ausrollen.
2. **Icon Shadows:** `shadow-neumorphic-icon` auf Tooltips, Menü-Buttons & restliche SVG-Icons anwenden.
3. **Runtime Error in Prod:** Fehlerbericht `ReferenceError: Cannot access 'i' before initialization` (siehe Userlog) blockiert aktuell alle Seiten. Build untersuchen (`ui-components-*.js`) und in Phase 4 Issue Tracker aufnehmen.
