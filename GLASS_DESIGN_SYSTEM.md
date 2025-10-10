# 🌟 Glasmorphismus Design System

Ein konsistentes, hierarchisches Glass-Design-System für Dark Theme mit subtilen Lichtreflexionen und Tiefeneffekt.

## 📐 Design Prinzipien

### 1. **Durchscheinende Glaskacheln**

- Leicht verschwommener Hintergrund (12-20px blur)
- Subtile Transparenz (3-6% white opacity)
- Weichgezeichneter dunkler Hintergrund scheint durch

### 2. **Saubere, abgerundete Kanten**

- Radius: 6-14px je nach Element
- Hellere Oberkante (border-top) für Lichtreflex
- Subtiler Glanz durch Gradient-Overlay

### 3. **Tiefeneffekt durch Schatten**

- Mehrschichtige Schatten für Räumlichkeit
- Dunklere, weichere Schatten bei größeren Elementen
- Optional: Farbige Edge-Glows bei Hover

### 4. **Kühle, dunkle Farbpalette**

- Pure Black Background (#000000)
- Weiße Akzente mit niedriger Opacity
- Kühle Accent-Farben: Purple, Blue, Cyan

---

## 🎨 Hierarchisches System

### Primary Glass

**Verwendung:** Haupt-Interaktionselemente, Quickstart-Kacheln, wichtige Actions

```css
/* Design Tokens */
--glass-primary-bg: rgba(255, 255, 255, 0.06) --glass-primary-border: rgba(255, 255, 255, 0.14)
  --glass-primary-border-top: rgba(255, 255, 255, 0.2) --glass-primary-blur: 20px
  --glass-primary-brightness: 1.08 --glass-primary-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```

**Features:**

- ✨ Stärkste Transparenz (6%)
- 🌈 Intensivster Blur-Effekt (20px)
- 💫 Subtiler Lichtreflex an der Oberkante
- 🎭 Tiefe Schatten für Separation

### Secondary Glass

**Verwendung:** Navigation, Sidebars, Input-Felder, Sekundäre UI-Elemente

```css
/* Design Tokens */
--glass-secondary-bg: rgba(255, 255, 255, 0.04) --glass-secondary-border: rgba(255, 255, 255, 0.1)
  --glass-secondary-border-top: rgba(255, 255, 255, 0.16) --glass-secondary-blur: 16px
  --glass-secondary-brightness: 1.05 --glass-secondary-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
```

**Features:**

- 🔹 Mittlere Transparenz (4%)
- 🌫️ Moderater Blur (16px)
- ⚡ Zurückhaltender Lichtreflex
- 🎨 Weichere Schatten

### Tertiary Glass

**Verwendung:** Badges, Pills, Labels, subtile Akzente

```css
/* Design Tokens */
--glass-tertiary-bg: rgba(255, 255, 255, 0.03) --glass-tertiary-border: rgba(255, 255, 255, 0.08)
  --glass-tertiary-border-top: rgba(255, 255, 255, 0.12) --glass-tertiary-blur: 12px
  --glass-tertiary-brightness: 1.02 --glass-tertiary-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
```

**Features:**

- 💎 Minimalste Transparenz (3%)
- 🌀 Leichter Blur (12px)
- ✨ Sehr subtiler Reflex
- 🎯 Zarte Schatten

---

## 🔮 Lichtreflexionen

### Reflection Gradient

Simuliert eine Lichtquelle von oben-links (135° Winkel):

```css
--glass-reflection-gradient: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.12) 0%,
  /* Hellster Punkt */ rgba(255, 255, 255, 0.06) 20%,
  /* Mittlerer Übergang */ rgba(255, 255, 255, 0.02) 40%,
  /* Abklingend */ rgba(255, 255, 255, 0) 60% /* Transparent */
);
```

**Implementierung:**

- Via `::before` Pseudo-Element
- `pointer-events: none` für Klick-Durchleitung
- Opacity variiert nach Variant (0.4-0.6)

---

## ✨ Hover-Effekte

### Edge Glow (Optional)

Farbige Leuchteffekte bei Interaktion:

```css
/* Primary Glow - Lila */
--glass-edge-glow-primary: 0 0 20px rgba(139, 92, 246, 0.15) /* Secondary Glow - Blau */
  --glass-edge-glow-secondary: 0 0 16px rgba(59, 130, 246, 0.12) /* Tertiary Glow - Cyan */
  --glass-edge-glow-tertiary: 0 0 12px rgba(34, 211, 238, 0.1);
```

**Verwendung:**

```tsx
<GlassCard variant="primary" hoverGlow>
  Hover mich!
</GlassCard>
```

---

## 📦 Komponenten-Nutzung

### GlassCard Component

```tsx
import { GlassCard } from '@/components/ui/GlassCard';

// Primary Interactive Tile
<GlassCard variant="primary" padding="lg" hoverGlow>
  <h3>Action Card</h3>
  <p>Wichtiger Call-to-Action</p>
</GlassCard>

// Secondary Navigation
<GlassCard variant="secondary" padding="md">
  <nav>...</nav>
</GlassCard>

// Tertiary Badge
<GlassCard variant="tertiary" padding="sm">
  <span>Badge</span>
</GlassCard>

// Mit Tint Gradient
<GlassCard
  variant="primary"
  tint={{ from: 'hsl(262, 82%, 74%, 0.20)', to: 'hsl(200, 87%, 68%, 0.15)' }}
  tintOpacity={0.15}
>
  Farbiger Gradient-Overlay
</GlassCard>
```

### CSS Utility Classes

```tsx
// Direkte Klassennutzung
<div className="glass-card-primary p-6">
  <div className="glass-content">
    Inhalt über Reflexion positioniert
  </div>
</div>

// Mit Hover Glow
<button className="glass-card-secondary glass-hover-glow-secondary">
  Hover für Glow
</button>
```

---

## 🎯 Best Practices

### ✅ Do's

1. **Hierarchie beachten**
   - Primary für wichtige, interaktive Elemente
   - Secondary für Navigation und Formulare
   - Tertiary für Labels und Badges

2. **Z-Index Management**
   - Nutze `.glass-content` für Inhalte
   - Tint-Overlays mit `z-[2]`
   - Reflexionen via `::before` automatisch darunter

3. **Konsistente Rundungen**
   - Primary/Secondary: `rounded-2xl` (14px)
   - Tertiary: `rounded-lg` (10px)
   - Buttons: `rounded-full` für Pills

4. **Accessibility**
   - `aria-hidden="true"` für dekorative Overlays
   - `pointer-events: none` für nicht-interaktive Layer
   - Ausreichender Kontrast (mindestens 4.5:1)

### ❌ Don'ts

1. ~~Hardcoded Opacity-Werte~~

   ```tsx
   // ❌ Falsch
   <div className="bg-white/5">...</div>

   // ✅ Richtig
   <div className="glass-card-secondary">...</div>
   ```

2. ~~Blur ohne Border~~
   - Immer Border für klare Kanten
   - Border-top heller für Lichteffekt

3. ~~Zu viele Schichten~~
   - Maximum 3 Glass-Ebenen übereinander
   - Sonst wird es unübersichtlich

---

## 🌈 Farb-Akzente

### Cool Palette (empfohlen)

```css
Purple: #8b5cf6 (rgb(139, 92, 246))
Blue:   #3b82f6 (rgb(59, 130, 246))
Cyan:   #22d3ee (rgb(34, 211, 238))
```

### Warm Palette (optional)

```css
Pink:   #f472b6 (rgb(244, 114, 182))
Orange: #fb923c (rgb(251, 146, 60))
```

---

## 📊 Performance

### CSS Custom Properties

- Zentrale Definition in `design-tokens.css`
- Nur einmalige Berechnung
- Leicht überschreibbar für Themes

### Backdrop Filter

- Hardwarebeschleunigt auf modernen Browsern
- Fallback: `-webkit-backdrop-filter` für Safari
- Graceful Degradation ohne Blur

### Pseudo-Elemente

- Effizient: Kein zusätzliches DOM
- `::before` für Reflexion
- Automatische Vererbung von `border-radius`

---

## 🔧 Anpassung

### Theme-Variablen überschreiben

```css
:root {
  /* Stärkeres Primary Glass */
  --glass-primary-bg: rgba(255, 255, 255, 0.08);
  --glass-primary-border: rgba(255, 255, 255, 0.16);

  /* Mehr Blur */
  --blur-lg: 24px;

  /* Andere Akzentfarbe */
  --glass-edge-glow-primary: 0 0 20px rgba(34, 211, 238, 0.2);
}
```

### Neue Variant erstellen

```css
/* Custom Variant in design-tokens.css */
--glass-custom-bg: rgba(255, 255, 255, 0.05);
--glass-custom-border: rgba(255, 255, 255, 0.11);
--glass-custom-blur: var(--blur-md);

.glass-card-custom {
  background: var(--glass-custom-bg);
  backdrop-filter: blur(var(--glass-custom-blur));
  border: 1px solid var(--glass-custom-border);
}
```

---

## 📱 Mobile Optimierung

- Touch-Targets: Minimum 48px (var(--touch-recommended))
- Reduced Motion: `prefers-reduced-motion` respektieren
- Performance: Blur auf älteren Geräten reduzieren

```css
@media (prefers-reduced-motion: reduce) {
  .glass-card-primary::before {
    opacity: 0.3; /* Weniger auffälliger Reflex */
  }
}

@media (max-width: 768px) {
  :root {
    --blur-lg: 16px; /* Weniger intensiv */
  }
}
```

---

## 🎓 Beispiel-Layouts

### Card Grid

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <GlassCard variant="primary" padding="lg" hoverGlow>
    <h3>Feature 1</h3>
    <p>Beschreibung...</p>
  </GlassCard>
  <GlassCard variant="primary" padding="lg" hoverGlow>
    <h3>Feature 2</h3>
    <p>Beschreibung...</p>
  </GlassCard>
  <GlassCard variant="primary" padding="lg" hoverGlow>
    <h3>Feature 3</h3>
    <p>Beschreibung...</p>
  </GlassCard>
</div>
```

### Navigation Bar

```tsx
<nav className="glass-card-secondary px-6 py-4">
  <div className="glass-content flex items-center justify-between">
    <Logo />
    <Menu />
  </div>
</nav>
```

### Form Input

```tsx
<div className="space-y-4">
  <label className="block">
    <span className="text-white/70">Email</span>
    <input
      type="email"
      className="glass-card-secondary w-full px-4 py-3 text-white"
      placeholder="you@example.com"
    />
  </label>
  <button className="glass-card-primary glass-hover-glow-primary w-full py-3">Absenden</button>
</div>
```

---

## 🚀 Migration Guide

### Von Legacy zu neuem System

```tsx
// Vorher (Legacy)
<div className="bg-white/5 border border-white/10 backdrop-blur-lg">
  Content
</div>

// Nachher (Design System)
<GlassCard variant="secondary" padding="md">
  Content
</GlassCard>
```

---

**Version:** 1.0
**Letzte Aktualisierung:** 2025-10-09
**Autor:** Disa AI Design System Team
