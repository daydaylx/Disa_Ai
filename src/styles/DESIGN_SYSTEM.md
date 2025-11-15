# Disa AI Design System

## Übersicht

Das Disa AI Design System basiert auf dem "Dramatic Glassmorphism"-Ansatz und ist speziell für mobile Geräte optimiert. Es kombiniert moderne Glaseffekte mit subtilen Schatten und präzisen Abständen, um eine elegante und funktionale Benutzeroberfläche zu schaffen.

## Farbpalette

Alle Farben werden über CSS Custom Properties definiert und sollten nicht direkt als Hex-Werte verwendet werden.

### Primärfarben

- `--accent`: Hauptakzentfarbe (Lila)
- `--accent-contrast`: Kontrastfarbe zur Hauptakzentfarbe (Weiß)
- `--accent-soft`: Abgeschwächte Akzentfarbe für Hintergründe
- `--accent-surface`: Oberflächenfarbe mit Akzent

### Neutrale Farben

- `--surface-base`: Grundfläche der Anwendung
- `--surface-card`: Karten- und Panel-Hintergründe
- `--surface-glass`: Glaseffekt-Hintergründe
- `--surface-muted`: Abgeschwächte Hintergründe

### Textfarben

- `--text-primary`: Haupttextfarbe
- `--text-secondary`: Sekundärtextfarbe
- `--text-tertiary`: Tertiärtextfarbe
- `--text-subtle`: Subtile Textfarbe

## Abstände (8-Pixel-Raster)

Alle Abstände folgen einem strikten 8-Pixel-Raster:

- `--spacing-0`: 0px
- `--spacing-1`: 8px
- `--spacing-2`: 16px
- `--spacing-3`: 24px
- `--spacing-4`: 32px
- `--spacing-5`: 40px
- `--spacing-6`: 48px
- `--spacing-7`: 56px
- `--spacing-8`: 64px
- `--spacing-9`: 72px
- `--spacing-10`: 80px

## Border Radius

Die Border Radius-Werte sind standardisiert:

- `--radius-xs`: 6px (kleinste Elemente)
- `--radius-sm`: 10px (Standard-Buttons, Eingabefelder)
- `--radius-md`: 14px (Karten, Panels)
- `--radius-lg`: 18px (Hauptcontainer, Dialoge)
- `--radius-xl`: 24px (spezielle Fälle)

## Schatten

Es gibt nur zwei Ebenen von Schatten, um visuelle Konsistenz zu gewährleisten:

- `--shadow-light`: Subtile Hebung (0 2px 8px rgba(0, 0, 0, 0.16))
- `--shadow-heavy`: Starke Hebung (0 8px 24px rgba(0, 0, 0, 0.32))
- `--shadow-elevated`: Erhöhte Elemente (0 12px 32px rgba(0, 0, 0, 0.25))
- `--shadow-floating`: Schwebende Elemente (0 16px 40px rgba(0, 0, 0, 0.3))

## Glaseffekte

Für das charakteristische Glassmorphism-Design:

- `--glass-border-soft`: Weiche Glasrahmen (rgba(255, 255, 255, 0.18))
- `--glass-border-strong`: Starke Glasrahmen (rgba(255, 255, 255, 0.28))
- `--layer-glass-panel`: Panel-Hintergründe
- `--layer-glass-inline`: Inline-Element-Hintergründe

## Komponenten

### Buttons

Neue Glassmorphism-Varianten wurden hinzugefügt:

1. **glass-accent**: Hochwertige primäre Aktionen mit stärkeren Farben und Schatten
2. **glass-secondary**: Sekundäre Aktionen mit verbesserten Hover-Effekten
3. **glass-ghost**: Transparente Buttons mit farbigen Hover-Effekten
4. **glass-primary**: Standard-Glas-Button
5. **glass-subtle**: Subtiler Glas-Button

Größen:

- `xs`: 32px Höhe
- `sm`: 36px Höhe
- `default`: 40px Höhe
- `lg`: 48px Höhe
- `xl`: 56px Höhe

### Karten

Neue Glassmorphism-Varianten:

1. **glass-raised**: Stark hervorgehobene Karten
2. **glass-elevated**: Schwebende Karten mit stärkerem Glaseffekt
3. **glass-inset**: Eingesunkene Karten für sekundäre Inhalte
4. **glass-primary**: Standard-Glas-Karte
5. **glass-subtle**: Subtile Glas-Karte

### Navigation

Die neue EnhancedBottomNav-Komponente bietet:

- Animierter aktiver Indikator
- Bessere visuelle Hierarchie
- Klarere Zustandsanzeige
- Glassmorphism-Hintergrund

### Formularelemente

1. **Switch**: Moderner Schalter mit Glaseffekten
2. **Input**: Eingabefeld mit Glaseffekten
3. **Textarea**: Textbereich mit Glaseffekten
4. **FilterChip**: Filter-Chips mit Glaseffekten

### Datenanzeige

1. **Table**: Tabellen mit Glaseffekten für Header, Body und Footer
2. **Badge**: Badges mit verschiedenen Glaseffekt-Varianten

### Overlay-Komponenten

1. **Dialog**: Dialoge mit starken Glaseffekten und präzisen Schatten
2. **Dropdown**: Dropdown-Menüs mit Glaseffekten für Inhalte und Elemente

## Best Practices

1. **Mobile-First**: Alle Komponenten sind für Touch-Interaktionen optimiert
2. **Konsistenz**: Verwende immer die definierten Design Tokens
3. **Zugänglichkeit**: Achte auf ausreichende Kontraste und Touch-Target-Größen
4. **Performance**: Vermeide komplexe Schatten und Animationen auf untergeordneten Elementen
5. **Glas-Effekte**: Nutze Glaseffekte gezielt, um visuelle Tiefe zu erzeugen, ohne die Lesbarkeit zu beeinträchtigen
