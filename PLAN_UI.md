# Implementationsplan: Neuer Hintergrund und transparentere Glass-Kacheln

## Ziel

Implementierung eines radialen Dark-Gradient Hintergrunds mit dezenter Noise-Textur und transparenteren Glass-Kacheln bei gleichzeitiger Beibehaltung der Funktionalität.

## Schritte

### 1. Tailwind-Konfiguration erweitern (tailwind.config.ts)

Füge neue Design-Token für transparentere Glass-Effekte hinzu:

- `--glass-bg-alpha-6`: rgba(255, 255, 255, 0.06) für Hintergrund-Transparenz
- `--glass-bg-alpha-8`: rgba(255, 255, 255, 0.08) für Hintergrund-Transparenz
- `--glass-bg-alpha-10`: rgba(255, 255, 255, 0.10) für Hintergrund-Transparenz
- `--glass-border-alpha-10`: rgba(255, 255, 255, 0.10) für Rahmen-Transparenz
- `--glass-border-alpha-12`: rgba(255, 255, 255, 0.12) für Rahmen-Transparenz
- `--glass-border-alpha-14`: rgba(255, 255, 255, 0.14) für Rahmen-Transparenz
- `--blur-md`: 12px für kontrollierten Blur-Effekt
- `--saturation-110`: 110% für leichte Sättigungssteigerung

### 2. CSS-Variablen definieren (src/styles/design-tokens.css)

Füge neue Variablen für:

- Radialen Hintergrundgradienten: `--bg-radial-gradient`
- Noise-Overlay: `--bg-noise-overlay`
- Neue Glassmorphism-Tokens mit angepassten Alphas:
  - Hintergrund-Alpha: 6-10%
  - Rahmen-Alpha: 10-14%
  - Blur: 10-14px
  - Sättigung: ~110%

### 3. Hintergrund-Design implementieren (src/styles/design-tokens.css)

- Body-Element erhält radialen Dark-Gradient als Hintergrund
- Optional: dezentes Noise-Overlay für Tiefe
- Sicherstellen, dass Text nicht überlagert wird

### 4. Glass-Kacheln optimieren (src/styles/design-tokens.css)

- Neue `.glass-tile` Klasse mit kontrollierter Transparenz
- Verwende neue Token für bessere Kontrolle:
  - Hintergrund: 6-10% Alpha
  - Rahmen: 10-14% Alpha
  - Blur: 10-14px
  - Leichte Sättigungssteigerung (~110%)

### 5. Kontrastverbesserung (src/styles/design-tokens.css)

- Neue Utility-Klassen für verbesserten Kontrast
- Sorge für ≥ 4.5:1 Kontrastverhältnis für Fließtext
- Verwende neue Overlay-Ebenen für Textsicherheit

### 6. Fokus-Management aktualisieren

- Erhöhe Fokus-Ring auf ≥ 2px für bessere Sichtbarkeit
- Verwende ausreichenden Kontrast für Fokus-Indikatoren
