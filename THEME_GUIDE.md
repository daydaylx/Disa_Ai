# Theme Guide - Glassmorphism Design System für Disa AI

## 1. Einführung

Diese Anleitung erklärt die neuen Design-Tokens für das Glassmorphism-Design-System von Disa AI. Die Implementierung bietet verbesserte Konsistenz, Barrierefreiheit und Leistung auf mobilen Geräten.

## 2. Neue Overlay-Tokens

Das System verfügt über neue Overlay-Tokens für unterschiedliche Deckkraftanforderungen:

### 2.1 Overlay-Varianten

- `glass-overlay-weak` (5% Deckkraft) - Sehr subtile Effekte
- `glass-overlay-soft` (10% Deckkraft) - Subtile Effekte
- `glass-overlay-medium` (15% Deckkraft) - Moderat starke Effekte
- `glass-overlay-strong` (20% Deckkraft) - Starkere Effekte
- `glass-overlay-intense` (30% Deckkraft) - Sehr starke Effekte

## 3. Verwendung der neuen `glass-card` Utility

Die zentrale `glass-card` Klasse bietet alle Funktionen des Glassmorphismus mit verbesserter Performance und Zugänglichkeit:

### 3.1 Grundlegende Verwendung

```jsx
<div className="glass-card">
  <p>Inhalt mit Glassmorphismus-Effekt</p>
</div>
```

### 3.2 Mit Overlay-Varianten

```jsx
<div className="glass-card overlay-medium">
  <p>Inhalt mit mittlerem Overlay für besseren Kontrast</p>
</div>
```

## 4. Komponentenbeispiele

### 4.1 Card-Komponente

```jsx
<Card className="w-full">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Inhalt der Karte</p>
  </CardContent>
  <CardFooter>
    <button>Aktion</button>
  </CardFooter>
</Card>
```

### 4.2 Button-Komponente

```jsx
<button className="glass-card rounded-lg px-4 py-2">Button mit Glassmorphismus</button>
```

### 4.3 Input-Feld

```jsx
<div className="glass-card p-2">
  <input
    type="text"
    placeholder="Eingabefeld mit Glassmorphismus"
    className="w-full border-none bg-transparent focus:outline-none"
  />
</div>
```

## 5. Best Practices

### 5.1 Textlesbarkeit

- Verwende `overlay-medium` bis `overlay-strong` für weißen Text auf hellen Hintergründen
- Teste ausreichenden Farbkontrast (mindestens 4.5:1 für normalen Text)

### 5.2 Interaktive Zustände

- Die `glass-card` Klasse beinhaltet automatisch Hover-, Active- und Focus-Zustände
- Hover: Leichte Aufbewegung und erhöhter Glanz
- Active: Sofortige Rückmeldung bei Berührung
- Focus: Sichtbare Fokus-Ringe für Barrierefreiheit

### 5.3 Responsivität

- Die Klassen sind für mobile Geräte optimiert
- Standard-Touch-Zielgröße von 48px eingehalten
- Bezieht sich auf mobile Viewport-Größen

## 6. Migration bestehender Komponenten

### 6.1 Alte Klassen

- `glass-surface` → `glass-card` (neue zentrale Klasse)
- `tile-glass` → `glass-card` (wird über Legacy-Regeln unterstützt)
- `card-glass` → `glass-card` (wird über Legacy-Regeln unterstützt)

### 6.2 Neue Overlay-Optionen

Statt inline `opacity`-Werten, verwende die neuen Overlay-Klassen:

- `opacity-70` → `overlay-soft` (oder andere Overlay-Varianten je nach Bedarf)

## 7. Entwickler-Hinweise

### 7.1 CSS-Variable

Direkter Zugriff auf die neuen Overlay-Variablen:

- `var(--glass-overlay-weak)`
- `var(--glass-overlay-soft)`
- `var(--glass-overlay-medium)`
- `var(--glass-overlay-strong)`
- `var(--glass-overlay-intense)`

### 7.2 Tailwind-Konfiguration

Die neuen Hintergrundfarben sind als Tailwind-Klassen verfügbar:

- `bg-glass-overlay-weak`
- `bg-glass-overlay-soft`
- `bg-glass-overlay-medium`
- `bg-glass-overlay-strong`
- `bg-glass-overlay-intense`

## 8. Barrierefreiheit

- Alle Interaktionszustände sind für Screenreader optimiert
- Fokus-Indikatoren gewährleisten Tastatur-Navigation
- Farbkontraste entsprechen WCAG AA-Standards
- Mindestgröße für Touch-Ziele beträgt 48px
