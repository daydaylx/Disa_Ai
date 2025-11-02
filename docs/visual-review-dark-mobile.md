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
