# Known Issues (Beta)

## Performance & Stability
- **Storage Stats Latency:** Die Berechnung der Speicherstatistiken (Anzahl Gespräche, Größe) kann bei großen Datenmengen verzögert sein oder beim ersten Laden 0 anzeigen.
- **Large Exports:** Der Export sehr großer Konversationshistorien kann auf mobilen Geräten zu Memory-Warnings führen.

## UI/UX (Mobile)
- **Soft-Keyboard Layout:** In seltenen Fällen kann das Einblenden der Tastatur zu Layout-Sprüngen führen, die durch `100dvh` nicht vollständig abgefangen werden (z.B. ältere iOS Versionen).
- **Touch Targets:** Einige sekundäre Icons könnten noch knapp an der 44px Grenze liegen, werden aber kontinuierlich optimiert.

## PWA
- **Offline-Start:** Nach dem ersten Offline-Start kann es kurz dauern, bis die gecachten Modelle geladen sind.
- **Updates:** Der "Update verfügbar" Toast muss explizit bestätigt werden.

## Integration
- **Sentry:** In der Beta-Phase werden Fehler nur geloggt, wenn der DSN konfiguriert ist (Prod only).
