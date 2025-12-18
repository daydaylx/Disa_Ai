# OpenRouter Modell-Liste fixen: Free-Modelle vollständig laden statt nur 6

**Labels:** `bug`, `api`, `enhancement`, `high priority`
**Bereich:** Modell-Auswahl (OpenRouter Integration)

## Problem

Aktuell werden nur ~6 Modelle von OpenRouter gelesen. Erwartet wird: immer alle Free-Modelle zur Auswahl (und realistisch sind das deutlich mehr als 6).

## Ziel

Die App soll die OpenRouter-Modelle korrekt abrufen, filtern und anzeigen, sodass die Liste der Free-Modelle vollständig ist.

## Akzeptanzkriterien

- [ ] Modellliste enthält deutlich mehr als 6 Einträge, sofern OpenRouter mehr Free-Modelle liefert.
- [ ] Filter „Free" basiert auf nachvollziehbaren Kriterien (nicht "zufällig").
- [ ] Keine harte Limitierung (z. B. slice(0, 6), Pagination ignoriert, UI-Limit ohne Hinweis).
- [ ] Robustes Handling: API-Fehler → sinnvolle Fehlermeldung + Fallback (z. B. Cache/letzte Liste).
- [ ] Optional: Caching mit TTL, damit nicht bei jedem UI-Render neu geladen wird.

## ToDos (typische Ursachen checken)

- [ ] Prüfen ob API-Response gepaginated ist und Pagination fehlt
- [ ] Prüfen ob irgendwo hart begrenzt wird (limit/slice)
- [ ] Prüfen ob Free-Filter falsch ist (z. B. falsches Feld, alte Annahmen)
- [ ] UI: Liste performant darstellen (Suche/Virtualisierung optional, je nach Umfang)
