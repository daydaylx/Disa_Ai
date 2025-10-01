## Beschreibung

Die Rollenauswahl wirkt visuell entkoppelt. Auslagerung in eigenen Flow: dedizierte Seite oder Bottom-Sheet mit Suche, Kategorien/Filter, Live-Preview und explizitem 18+/NSFW-Toggle.

## Akzeptanzkriterien

- Eigene Route oder Sheet `roles/` mit Suchfeld, Kategorie-Filtern, Toggle „18+ anzeigen“
- Einträge als Liste mit Avatar, Kurzbeschreibung, „Übernehmen“-Button
- Preview/Detail bei Tap, Rücksprung behält Scroll-Position
- Empty-State mit Anleitung, wenn keine Rollen vorhanden

## Tasks

- Neue View + State-Management
- NSFW-Flag aus Datenquelle berücksichtigen
- Empty-States gestalten
