# Disa AI Design System

## Übersicht

Das Disa AI Design System basiert auf dem "Aurora Glassmorphism"-Ansatz und ist speziell für mobile Geräte optimiert. Es kombiniert moderne Glaseffekte mit subtilen Schatten und präzisen Abständen, um eine elegante und funktionale Benutzeroberfläche zu schaffen. Das System folgt einem konsistenten Token-basierten Ansatz.

## Farbpalette

Alle Farben werden über CSS Custom Properties definiert und sollten nicht direkt als Hex-Werte verwendet werden.

### Aurora Farbsystem (Laut tailwind.config.ts)

#### Primärfarben

- `--bg-0`, `--bg-1`, `--bg-2`: Hintergrundfarben
- `--surface`, `--surface-soft`, `--surface-card`, `--surface-overlay`: Oberflächenfarben
- `--text-primary`, `--text-secondary`, `--text-muted`: Textfarben
- `--color-primary-500` (Indigo-Violet): Hauptakzentfarbe
- `--accent-aurora-green`, `--accent-lila`, `--accent-yellow`: Akzentfarben

### Statusfarben

- `--color-success-500`: Erfolgszustand (grün)
- `--color-warning-500`: Warnungszustand (gelb/orange)
- `--color-error-500`: Fehlerzustand (rot)

## Abstände (8px Raster)

Alle Abstände folgen einem konsistenten Rastersystem:

- `--spacing-0`: 0px
- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-3`: 12px
- `--spacing-4`: 16px
- `--spacing-5`: 20px
- `--spacing-6`: 24px
- `--spacing-7`: 32px
- `--spacing-8`: 40px
- `--spacing-9`: 48px
- `--spacing-10`: 64px

## Border Radius

Standardisierte Border Radius-Werte:

- `--radius-xs`: 6px (kleinste Elemente)
- `--radius-sm`: 10px (Standard-Buttons, Eingabefelder)
- `--radius-md`: 14px (Karten, Panels)
- `--radius-lg`: 18px (Hauptcontainer, Dialoge)
- `--radius-xl`: 24px (spezielle Fälle)
- `full`: 9999px (komplett runde Elemente)

## Aurora Glaseffekte

Für das charakteristische Glassmorphism-Design:

- `--shadow-light`: Subtile Hebung
- `--shadow-heavy`: Starke Hebung
- `--shadow-elevated`: Erhöhte Elemente
- `--shadow-floating`: Schwebende Elemente
- `--shadow-glow-primary`, `--shadow-glow-green`, `--shadow-glow-lila`, `--shadow-glow-subtle`: Aurora Glüh-Effekte
- `--backdrop-blur-subtle`, `--backdrop-blur-medium`, `--backdrop-blur-strong`: Hintergrundunschärfe-Ebenen

## Komponenten

### Buttons

Neue Aurora Glassmorphism-Varianten:

1. **Primary**: Hauptaktionen mit Akzentfarben und Glüheffekt
2. **Secondary**: Sekundäre Aktionen mit subtileren Effekten
3. **Ghost**: Transparente Buttons mit farbigen Hover-Effekten
4. **Link**: Text-Buttons mit Underline-Effekt

### Karten

Neue Aurora Glassmorphism-Varianten:

1. **Standard**: Mit Glaseffekten und subtilen Schatten
2. **Elevated**: Mit erhöhtem Glaseffekt für hervorgehobene Inhalte
3. **Floating**: Mit starkem Schwebeeffekt für modale Inhalte

### Navigation

Aurora Navigation-System bietet:

- Glaseffekte mit subtilen Glüh-Effekten
- Responsive Design für verschiedene Bildschirmgrößen
- Konsistente Hover- und Active-Zustände
- Touch-optimierte Targets für mobile Geräte

### Formularelemente

1. **Switch**: Moderner Schalter mit Glaseffekten
2. **Input**: Eingabefeld mit Glaseffekten und Glüh-Effekten bei Fokus
3. **Textarea**: Textbereich mit Glaseffekten
4. **Select**: Auswahlelemente mit konsistentem Glaseffekt
5. **Checkbox/Radio**: Mit Glaseffekten und Aurora Akzentfarben

### Overlay-Komponenten

1. **Dialog**: Mit starken Glaseffekten und Aurora Glüh-Effekten
2. **Drawer/Sheet**: Mit Aurora Glaseffekten und subtilen Übergängen
3. **Tooltip**: Mit Glaseffekten und Aurora Akzentfarben
4. **Toast**: Mit Aurora Glüheffekten für Benachrichtigungen

## Best Practices

1. **Mobile-First**: Alle Komponenten sind für Touch-Interaktionen optimiert
2. **Konsistenz**: Verwende immer die definierten Design Tokens
3. **Zugänglichkeit**: Achte auf ausreichende Kontraste und Touch-Target-Größen
4. **Performance**: Vermeide komplexe Schatten und Animationen auf untergeordneten Elementen
5. **Aurora Glaseffekte**: Nutze Glaseffekte gezielt, um visuelle Tiefe zu erzeugen, ohne die Lesbarkeit zu beeinträchtigen

## Integration mit Tailwind

Die Tailwind-Konfiguration ist auf die Design-Tokens abgestimmt:

- Farben: Verwendung der Aurora Farbpalette
- Abstände: 4px- und 8px-Raster
- Typografie: Konsistente Schriftgrößen und Zeilenabstände
- Schatten: Aurora Glüh- und Hebeeffekte
- Radii: Standardisierte Border Radius-Werte
- Bewegungen: Konsistente Übergangszeiten und Timing-Funktionen
