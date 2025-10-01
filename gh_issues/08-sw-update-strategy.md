## Beschreibung

Veraltete gecachte Bundles können zu weißen Screens führen. Es braucht eine deterministische Cache-/Update-Strategie, Versionierung und nutzerfreundliche Update-Hinweise.

## Akzeptanzkriterien

- Precache nur versionierte, unveränderliche Assets
- Laufzeit-Caching mit klarer Strategie pro Ressourcentyp
- SW-Update signalisiert dem Nutzer (Broadcast-Update/Reload-Hinweis)
- Kein „Cache-Only“ für HTML-Navigationsanfragen

## Tasks

- Workbox-Strategien je Route/Asset prüfen
- Versioning + Cache-Bust erzwingen
- Update-Toast implementieren
