# PWA-Installations-Modal

## Übersicht

Das PWA-Installations-Modal ist eine benutzerdefinierte UI-Komponente, die Nutzern die Installation der PWA als native App ermöglicht. Das Modal wird nur angezeigt, wenn die App noch nicht installiert ist und der Nutzer eine bestimmte Interaktion (Scroll oder Klick) durchgeführt hat oder eine Verzögerungszeit abgelaufen ist.

## Funktionsweise

### Installationserkennung

Die Komponente prüft automatisch, ob die App bereits installiert ist:

- **Desktop/Chrome/Android**: `window.matchMedia("(display-mode: standalone)")`
- **iOS Safari**: `(navigator as any).standalone === true`

Wenn die App bereits installiert ist, wird das Modal niemals angezeigt.

### Installations-Flow

#### Chrome/Android (Desktop & Mobile)

1. Browser löst `beforeinstallprompt` Event aus
2. Event wird abgefangen und für später gespeichert (`deferredPrompt`)
3. Modal erscheint nach Verzögerung (5s) oder Nutzerinteraktion
4. Klick auf "Installieren" → `deferredPrompt.prompt()` wird aufgerufen
5. Native Installations-Dialog wird angezeigt
6. Nutzerentscheidung wird ausgewertet (`accepted`/`dismissed`)
7. Bei Erfolg: Modal schließen, Status aktualisieren

#### iOS Safari

iOS Safari unterstützt kein `beforeinstallprompt` Event. Daher wird stattdessen eine Installationsanleitung angezeigt:

1. Modal erscheint nach Verzögerung (5s) oder Nutzerinteraktion
2. Anleitung wird angezeigt: "Teilen"-Icon → "Zum Home-Bildschirm"
3. Nur "Verstanden"-Button, kein Installieren-Button
4. Klick auf "Verstanden" → Modal schließen

### Cooldown-Logik

Um Nutzer nicht zu nerven, wird ein Cooldown-System implementiert:

- **LocalStorage-Schlüssel**: `pwa-install-dismissed`
- **Cooldown-Zeit**: 7 Tage
- **Ablaufdatum**: ISO-8601 String im LocalStorage gespeichert
- **Prüfung**: Bei jedem Modal-Erscheinen wird geprüft, ob das Ablaufdatum überschritten ist

### Anti-Spam-Mechanismen

Das Modal wird erst angezeigt, wenn:

1. **Verzögerungszeit** (5 Sekunden) abgelaufen ist **ODER**
2. **Erste Nutzerinteraktion** (Scroll oder Klick) erfolgt ist

### Interaktions-Tracking

Die Komponente trackt Nutzerinteraktionen:

- **Scroll-Events**: `window.addEventListener("scroll", ...)`
- **Click-Events**: `window.addEventListener("click", ...)`

Sobald eine Interaktion stattgefunden hat, wird `hasUserInteracted` auf `true` gesetzt und das Modal wird nach einer kurzen Verzögerung (1s) angezeigt.

## API

### `usePWAInstall` Hook

```typescript
interface UsePWAInstallResult {
  isStandalone: boolean;        // App läuft bereits als App?
  canInstall: boolean;         // Installation verfügbar? (deferredPrompt vorhanden)
  isIOS: boolean;              // iOS-Safari erkannt?
  showPrompt: boolean;          // Soll Modal angezeigt werden?
  installed: boolean;           // App bereits installiert?
  triggerInstall(): Promise<"accepted" | "dismissed">;  // Installation auslösen
  dismiss(outcome?: "accepted" | "dismissed"): void;      // Modal schließen
  hasUserInteracted: boolean;   // Nutzer hat bereits interagiert?
}
```

### `PWAInstallModal` Komponente

Die Komponente kann direkt in App.tsx verwendet werden:

```tsx
import { PWAInstallModal } from "./components/pwa/PWAInstallModal";

// In AppContent oder Root-Komponente
<PWAInstallModal />
```

## Manuelle Tests

### Chrome/Android (Desktop & Mobile)

1. DevTools öffnen
2. Application Tab → Service Workers → "Update on reload" aktivieren
3. Page reload
4. Mobile-Ansicht simulieren (DevTools → Toggle device toolbar)
5. **Warten 5 Sekunden** oder scrollen/klicken
6. Überprüfen: Modal erscheint
7. "Installieren" anklicken
8. Native Installations-Dialog bestätigen
9. App installieren
10. **Neuer Tab öffnen** und zu App navigieren
11. Überprüfen: Modal erscheint nicht mehr (installiert)

### iOS Safari (Nur echtes iOS-Gerät!)

Hinweis: iOS-Simulator unterstützt keine PWA-Installation. Test nur auf echtem Gerät.

1. Safari auf iOS-Gerät öffnen
2. Zur App navigieren
3. **Warten 5 Sekunden** oder scrollen
4. Überprüfen: Modal mit Installationsanleitung erscheint
5. "Verstanden" anklicken
6. **LocalStorage löschen** (Settings → Safari → Clear History → Website Data)
7. Page reload
8. Modal erscheint erneut (Cooldown zurückgesetzt)

### Testen des Cooldowns

1. Modal öffnen (siehe oben)
2. "Später" anklicken oder Installation ablehnen
3. **LocalStorage prüfen**: `localStorage.getItem("pwa-install-dismissed")`
4. Überprüfen: Datum ist 7 Tage in der Zukunft
5. Page reload
6. Modal erscheint nicht mehr
7. **LocalStorage löschen** oder Datum manipulieren (in der Vergangenheit)
8. Page reload
9. Modal erscheint erneut

### Testen der Accessibility

1. Modal öffnen
2. Überprüfen: Focus ist auf "Schließen"-Button
3. **TAB-Taste drücken**: Focus bewegt sich durch interaktive Elemente
4. **ESC-Taste drücken**: Modal schließt sich
5. **ARIA-Attribute prüfen**:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-label` für Buttons

## Dateistruktur

```
src/
├── hooks/
│   └── usePWAInstall.ts        # Hook für PWA-Installations-Logik
├── components/
│   └── pwa/
│       ├── PWAInstallModal.tsx # Custom Modal mit iOS-Handling
│       └── PWADebugInfo.tsx    # Debug-Informationen (optional)
└── App.tsx                    # Integration in Root-Komponente
```

## Akzeptanzkriterien

✅ **Installiert/standalone**: Modal erscheint nie
✅ **beforeinstallprompt**: Install-Button funktioniert
✅ **iOS**: Installationsanleitung statt Button
✅ **Cooldown**: 7 Tage nach "Später"/Ablehnung
✅ **Interaktion**: Modal nach Scroll/Klick oder 5s Verzögerung
✅ **Accessibility**: Focus-Management, ESC-Taste, ARIA-Attribute
✅ **Cleanup**: EventListener werden sauber entfernt

## Bekannte Einschränkungen

- **iOS-Simulator**: Keine PWA-Installation möglich (nur echtes Gerät)
- **Firefox/Edge Desktop**: `beforeinstallprompt` wird nicht immer ausgelöst
- **Privater Modus**: LocalStorage kann blockiert sein → Fallback zu Standard-Verhalten

## Troubleshooting

### Modal erscheint nicht

1. Überprüfen: Service Worker ist registriert (`navigator.serviceWorker.controller`)
2. Überprüfen: Manifest ist geladen (`document.querySelector('link[rel="manifest"]')`)
3. Überprüfen: HTTPS ist aktiv (nur localhost erlaubt ohne HTTPS)
4. Überprüfen: App ist nicht bereits installiert (Standalone-Mode)
5. **LocalStorage prüfen**: Cooldown aktiv?
6. **DevTools Console**: Fehlermeldungen?

### Install-Button funktioniert nicht

1. Überprüfen: `beforeinstallprompt` Event wurde gefeuert
2. Überprüfen: `deferredPrompt` ist gespeichert
3. Überprüfen: Browser ist Chrome/Edge (Safari unterstützt das nicht)
4. **DevTools Console**: Fehler beim Aufrufen von `prompt()`?

### iOS-Anweisungen werden nicht angezeigt

1. Überprüfen: User-Agent enthält iOS (`/iphone|ipad|ipod/i`)
2. Überprüfen: Standalone-Mode ist `false`
3. Überprüfen: `showPrompt` ist `true`
