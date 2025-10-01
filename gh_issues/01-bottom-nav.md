## Beschreibung

Die drei Top-Bereiche sind aktuell nicht als ständig sichtbare Hauptnavigation abgebildet. Für mobile UIs ist eine persistente Bottom-Navigation mit 3 Zielen Standard und reduziert Fehlbedienungen.

## Akzeptanzkriterien

- Unterer Navigationsbalken mit exakt 3 Zielen: „Chat“, „Rollen“, „Einstellungen“
- Icon + Label, klarer Active-State; erneuter Tap scrollt Liste nach oben
- Pro Tab wird Scroll-Position und UI-State erhalten (Tab-Restoration)
- Keine Überlappungen mit Composer oder Systemleisten (Safe-Area-Insets)

## Tasks

- `BottomNav`-Komponente implementieren
- Routing auf Tabs umstellen, Deep-Linking prüfen
- Safe-Area-Insets (Viewport-Fit) berücksichtigen
