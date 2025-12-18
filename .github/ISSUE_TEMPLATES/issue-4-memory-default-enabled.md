# Gedächtnisfunktion: Default = aktiviert (mit sauberem Fallback)

**Labels:** `enhancement`, `behavior`, `settings`
**Bereich:** KI-Verhalten / Memory

## Problem

Die Gedächtnisfunktion soll standardmäßig aktiviert sein. Aktuell ist sie offenbar aus oder inkonsistent.

## Ziel

Beim ersten Start (oder wenn keine User-Preference existiert) ist Memory automatisch an.

## Akzeptanzkriterien

- [ ] Fresh install / cleared storage → Memory ist ON
- [ ] Bestehende Nutzer-Einstellung wird respektiert (nicht ungefragt überschrieben)
- [ ] UI-Schalter zeigt den echten Zustand (kein „ON" aber intern OFF)
- [ ] Falls es Datenschutz/UX-Hinweis gibt: Hinweistext bleibt korrekt und nicht nervig

## ToDos

- [ ] Default-Value in Settings/Storage definieren
- [ ] Falls nötig: Migration "undefined → true"
- [ ] Integration prüfen: wirkt sich Memory wirklich auf Requests/History aus?
