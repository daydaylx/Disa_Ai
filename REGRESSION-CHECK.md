# Regressions-Test-Checkliste - Glassmorphism Design-System

## 1. Allgemeine Tests

### 1.1 Konsistenzprüfung

- [ ] Alle Card-Komponenten verwenden die neue `glass-card`-Klasse
- [ ] Keine visuellen Unterschiede zwischen verschiedenen Card-Typen (RoleCard, StaticGlassCard, Radix Card)
- [ ] Einheitliche Ränder, Abstände und Effekte
- [ ] Konsistente Interaktionszustände (Hover, Active, Focus)

### 1.2 Performance

- [ ] Smooth Animations (60fps)
- [ ] Keine Paint-Performance-Probleme
- [ ] Responsive Verhalten auf allen Bildschirmgrößen
- [ ] Scroll-Performance unverändert oder verbessert

## 2. Barrierefreiheit

### 2.1 Kontrast

- [ ] Text auf Karten hat ausreichenden Kontrast (min. 4.5:1)
- [ ] Weiße Texte auf farbigen Overlays sind lesbar
- [ ] Besonders bei Overlay-Varianten: Textlesbarkeit prüfen

### 2.2 Touch-Ziele

- [ ] Alle interaktiven Elemente haben mindestens 48px Höhe/Breite
- [ ] Abstand zwischen Touch-Zielen ist ausreichend
- [ ] Keine Touch-Ziele, die zu nah beieinander liegen

### 2.3 Fokus-Management

- [ ] Sichtbare Fokus-Ringe bei Tastatur-Navigation
- [ ] Fokus-Ringe überlagern keine wichtigen Inhalte
- [ ] Fokus-Reihenfolge ist logisch

## 3. Mobile Tests

### 3.1 Layout

- [ ] Karten passen korrekt auf mobile Bildschirme
- [ ] Keine horizontalen Scrollbalken
- [ ] Abstandshaltung auf kleinen Bildschirmen korrekt
- [ ] Touch-Interaktionen funktionieren korrekt

### 3.2 Spezielle mobile Anforderungen

- [ ] Virtuelle Tastatur beeinflusst nicht die Darstellung
- [ ] Viewport-Höhen-Berechnung funktioniert korrekt
- [ ] Safe Area Insets werden korrekt berücksichtigt

## 4. Overlay-Tests

### 4.1 Overlay-Varianten

- [ ] `overlay-weak` ist kaum sichtbar
- [ ] `overlay-soft` bietet leichte Kontrastverbesserung
- [ ] `overlay-medium` verbessert Kontrast für die meisten Inhalte
- [ ] `overlay-strong` bietet guten Kontrast für weißen Text
- [ ] `overlay-intense` bietet starken Kontrast

### 4.2 Textlesbarkeit

- [ ] Weiße Texte auf farbigen Hintergründen sind lesbar
- [ ] Besonders bei RoleCard Komponente prüfen
- [ ] Unterschiedliche Farbverläufe mit Overlay testen

## 5. Komponenten-spezifische Tests

### 5.1 Card-Komponenten

- [ ] `RoleCard` in Studio.tsx
- [ ] `StaticGlassCard` in Settings.tsx
- [ ] Radix `Card` Komponenten in verschiedenen Kontexten
- [ ] Responsive Verhalten aller Card-Typen

### 5.2 Button-Stile

- [ ] Buttons mit Glassmorphismus-Effekt
- [ ] Hover- und Active-Zustände korrekt
- [ ] Focus-Management korrekt

### 5.3 Input-Elemente

- [ ] Input-Felder mit Glassmorphismus
- [ ] Textfarben und Lesbarkeit
- [ ] Placeholder-Text-Visibilität

### 5.4 Modale und Overlays

- [ ] Dialoge mit neuem Design
- [ ] Modal-Backdrops korrekt
- [ ] Overlay-Effekte in modaler Nutzung

## 6. Browser-Kompatibilität

### 6.1 Moderne Browser

- [ ] Chrome (aktuelle Version)
- [ ] Firefox (aktuelle Version)
- [ ] Safari (aktuelle Version)
- [ ] Edge (aktuelle Version)

### 6.2 Mobile Browser

- [ ] Chrome auf Android
- [ ] Safari auf iOS
- [ ] Firefox auf Android

## 7. Fehlerszenarien

### 7.1 Fehlerzustände

- [ ] ErrorBoundary-Komponenten mit neuem Design
- [ ] Validierungsfehler mit korrektem Styling
- [ ] Lade-Fehler für Bilder mit neuem Overlay-System

### 7.2 Randfälle

- [ ] Sehr breite Karten
- [ ] Sehr hohe Karten
- [ ] Karten mit langem Text
- [ ] Karten mit vielen Elementen

## 8. Cross-Feature-Tests

### 8.1 Chat-Funktion

- [ ] Nachrichten-Blasen mit neuem Design
- [ ] Kompositions-Bereich mit neuen Effekten
- [ ] Input-Bereich korrekt gestylt

### 8.2 Studio-Funktion

- [ ] Rollen-Auswahl mit neuen RoleCards
- [ ] Hover-Effekte und Interaktionen
- [ ] Selektierte Zustände korrekt

### 8.3 Einstellungen

- [ ] Einstellungs-Karten mit neuem Design
- [ ] Farbauswahl-Elemente korrekt
- [ ] Overlay-Tests für komplexe Hintergründe

## 9. Dokumentation

### 9.1 Theme-Guide

- [ ] Beispiele im THEME_GUIDE.md funktionieren
- [ ] Verweise auf neue Klassen korrekt
- [ ] Best Practices werden korrekt beschrieben

## 10. Endgültige Validierung

### 10.1 Visuelle Vergleiche

- [ ] Screenshot-Vergleich vor/nach Implementierung
- [ ] Identische visuelle Struktur
- [ ] Verbesserte Textlesbarkeit bestätigt

### 10.2 Benutzerfreundlichkeit

- [ ] Verbesserte Lesbarkeit auf allen Karten
- [ ] Klare visuelle Hierarchie erhalten
- [ ] Interaktionen intuitiv
