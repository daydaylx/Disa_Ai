# Mobile Navigation & Swipe-Open

## Übersicht

Die Disa AI App verfügt über ein mobiles, rechtsseitiges Navigations-Sidepanel mit intuitiver Edge-Swipe-Funktionalität. Das Panel ermöglicht schnellen Zugriff auf alle wichtigen App-Bereiche und kann sowohl durch Gesten als auch durch Buttons gesteuert werden.

## Bedienung

### Edge-Swipe zum Öffnen

Das Panel kann durch eine Wischgeste vom rechten Bildschirmrand geöffnet werden:

1. **Startposition**: Beginnen Sie die Wischgeste innerhalb der 20px breiten Edge-Zone am rechten Bildschirmrand
2. **Wischrichtung**: Wischen Sie horizontal nach links (mindestens 40px Bewegung)
3. **Vertikale Toleranz**: Bis zu 30px vertikale Abweichung wird toleriert, um Konflikte mit dem Scrollen zu vermeiden
4. **Ergebnis**: Das Panel öffnet sich von rechts

**Wichtig**: Die Geste ist so kalibriert, dass vertikales Scrollen der Hauptseite nicht beeinträchtigt wird. Bei überwiegend vertikaler Bewegung (>30px) wird die Swipe-Geste abgebrochen und das normale Scrollverhalten greift.

### Wischen zum Schließen

Ein geöffnetes Panel kann durch Wischen nach rechts wieder geschlossen werden:

1. Wischen Sie vom Panel aus nach rechts (mindestens 40px)
2. Das Panel schließt sich mit einer flüssigen Animation

### Button-Bedienung (Desktop/Fallback)

Für Desktop-Nutzer oder als Alternative zur Swipe-Geste:

1. **Menü-Button**: Klicken Sie auf das Menü-Icon (☰) oben rechts
2. **Schließen-Button**: Klicken Sie auf das X-Icon im Panel-Header
3. **Overlay-Click**: Klicken Sie außerhalb des Panels auf den dunklen Overlay-Bereich
4. **Escape-Taste**: Drücken Sie die Escape-Taste, um das Panel zu schließen

### Panel-Modi

Das Panel unterstützt zwei Anzeigemodi:

- **Erweitert** (280px): Zeigt Labels und zusätzliche Informationen an
- **Kompakt** (96px): Zeigt nur Icons mit Tooltips
- Umschalten: Klicken Sie auf das Panel-Modus-Icon im Header

## Barrierefreiheit

Das Sidepanel wurde nach WCAG 2.1 AA Standards implementiert:

### Tastaturnavigation

- **Tab**: Navigation zwischen Elementen im Panel
- **Shift + Tab**: Rückwärts navigieren
- **Enter/Space**: Aktivieren von Buttons und Links
- **Escape**: Panel schließen
- **Focus Trap**: Der Tastaturfokus bleibt im geöffneten Panel (zyklisch)

### Screen Reader Unterstützung

- Alle interaktiven Elemente haben aussagekräftige `aria-label` Attribute
- Das Panel hat die Rolle `navigation` mit Label "Hauptnavigation"
- Der Öffnungs-/Schließstatus wird über `aria-expanded` kommuniziert
- Der Overlay hat `aria-hidden="true"` und ist für Screenreader unsichtbar

### Bewegungsreduzierung

Bei aktivierter `prefers-reduced-motion` Browser-Einstellung:

- Alle Übergangsanimationen werden deaktiviert
- Das Panel öffnet/schließt sich sofort ohne Animation
- GPU-Beschleunigung wird reduziert

### Kontrastverhältnisse

- Alle Texte erfüllen WCAG AA Anforderungen (mindestens 4.5:1)
- Im High-Contrast-Modus werden Rahmen verstärkt (2px statt 1px)

### Touch-Targets

- Alle interaktiven Elemente haben mindestens 44x44px Touch-Target-Größe
- Die Edge-Swipe-Zone ist 20px breit für präzise Erkennung
- Buttons haben ausreichend Abstand zueinander

## Technische Details

### Swipe-Erkennung

Die Swipe-Gesten-Erkennung basiert auf folgenden Parametern:

```typescript
const SWIPE_THRESHOLD = 40; // Horizontal threshold in px
const VERTICAL_TOLERANCE = 30; // Max vertical movement in px
const EDGE_SWIPE_WIDTH = 20; // Edge detection area in px
const SWIPE_VELOCITY_THRESHOLD = 0.5; // Minimum velocity in px/ms
```

### Performance-Optimierungen

- **GPU-Beschleunigung**: `transform: translateZ(0)` und `will-change: transform`
- **Passive Event Listeners**: Touch-Events nutzen `passive: true` für bessere Scroll-Performance
- **Reduzierte Repaints**: Animationen nutzen nur `transform` und `opacity`
- **Overscroll-Verhalten**: `overscroll-behavior: contain` verhindert Bounce-Effekte

### Browser-Gesten

Die Implementierung ist so gestaltet, dass sie nicht mit Browser-eigenen Gesten interferiert:

- **Browser-Back-Swipe** (linker Rand): Wird nicht beeinträchtigt, da unser Panel rechts ist
- **Vertikales Scrollen**: Hat Vorrang bei überwiegend vertikaler Bewegung
- **Pull-to-Refresh**: Wird durch `overscroll-behavior: contain` nicht ausgelöst

### Z-Index Hierarchie

```
50: Sidepanel
45: Edge Swipe Area
40: Overlay
30: App Header
20: Content Layer
10: Background Layer
```

## Wartung & Erweiterung

### Anpassen der Swipe-Parameter

Die Swipe-Parameter können in `src/components/navigation/NavigationSidepanel.tsx` angepasst werden:

```typescript
const SWIPE_THRESHOLD = 40; // Wie weit muss gewischt werden?
const VERTICAL_TOLERANCE = 30; // Wie viel vertikale Abweichung erlaubt?
const EDGE_SWIPE_WIDTH = 20; // Wie breit ist die Edge-Zone?
```

### Hinzufügen neuer Navigationselemente

Navigationselemente werden in `src/app/layouts/AppShell.tsx` definiert:

```typescript
const NAV_ITEMS = [
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/models", label: "Modelle", icon: Cpu },
  // Neues Element hier hinzufügen
];
```

### Styling anpassen

Die Panel-Styles befinden sich in:

- `src/styles/sidepanel.css`: Spezifische Panel-Styles
- `src/styles/design-tokens.css`: Farben und Spacing
- `tailwind.config.ts`: Tailwind-Konfiguration

### State Management

Der Panel-Zustand wird über den `SidepanelContext` verwaltet:

```typescript
import { useSidepanel } from "../../app/state/SidepanelContext";

const { isOpen, openPanel, closePanel, togglePanel } = useSidepanel();
```

## Testing

### Unit Tests

Tests für die Swipe-Funktionalität befinden sich in:

```
src/components/navigation/__tests__/NavigationSidepanel.swipe.test.tsx
```

Ausführen mit:

```bash
npm run test:unit -- NavigationSidepanel.swipe.test.tsx
```

### E2E Tests

End-to-End-Tests mit Playwright:

```
tests/e2e/navigation-swipe.spec.ts
```

Ausführen mit:

```bash
npm run e2e -- navigation-swipe.spec.ts
```

### Manuelles Testen

**Checkliste für manuelle Tests:**

- [ ] Edge-Swipe öffnet Panel auf Android Chrome
- [ ] Edge-Swipe öffnet Panel auf iOS Safari
- [ ] Vertikales Scrollen funktioniert ohne Panel zu öffnen
- [ ] Panel schließt bei Swipe nach rechts
- [ ] Menü-Button öffnet/schließt Panel
- [ ] Escape-Taste schließt Panel
- [ ] Overlay-Click schließt Panel
- [ ] Tastaturnavigation funktioniert (Tab-Reihenfolge)
- [ ] Focus kehrt zu Menü-Button zurück beim Schließen
- [ ] Screen Reader kündigt Panel-Status korrekt an
- [ ] Reduced Motion: Keine Animationen
- [ ] Touch-Targets sind groß genug (min. 44x44px)

## Bekannte Einschränkungen

1. **Desktop-Browser**: Swipe-Gesten funktionieren nur auf Touch-Geräten; Desktop-Nutzer verwenden den Menü-Button
2. **Landscape-Modus**: Panel nimmt mehr relativen Platz ein; empfohlene Nutzung im Portrait-Modus
3. **Alte Browser**: Browser ohne Touch-Event-Unterstützung (<IE11) fallen zurück auf Button-Bedienung
4. **Horizontal Scrolling**: Bei horizontal scrollbaren Elementen innerhalb der App kann es zu Konflikten kommen (selten)

## Weiterführende Ressourcen

- [Touch Gesture Handler](../../lib/touch/gestures.ts): Low-Level Touch-Gesten-API
- [Focus Trap Hook](../../hooks/useFocusTrap.ts): Fokus-Management-Logik
- [Sidepanel Context](../../app/state/SidepanelContext.tsx): Zustandsverwaltung
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Best Practices](https://web.dev/pwa/)

## Changelog

### Version 1.0.0 (2025-10-19)

- ✨ Initial Implementation: Edge-Swipe-Navigation
- ✅ Edge detection mit 20px Zone (16-24px range)
- ✅ Swipe threshold: 40px horizontal, 30px vertical tolerance
- ✅ Scroll-Sicherheit: Vertikales Scrollen hat Vorrang
- ✅ Desktop-Fallback: Menü-Button immer verfügbar
- ✅ Accessibility: Focus trap, Escape, ARIA, prefers-reduced-motion
- ✅ Unit & E2E Tests
- ✅ Dokumentation
