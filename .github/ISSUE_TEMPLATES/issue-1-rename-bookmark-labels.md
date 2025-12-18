# Chat-Historie umbenennen: „Lesezeichen/Bookmark" ist veraltet

**Labels:** `ui`, `ux`, `cleanup`, `good first issue`
**Bereich:** `/chat` (Chatseite)

## Problem

Auf der Chatseite heißt die Chat-Historie aktuell noch „Lesezeichen/Bookmark". Das Design ist ok, aber die Benennung ist irreführend, weil „Bookmark"/„Lesezeichen" nicht mehr das Konzept dahinter ist.

## Ziel

Alle sichtbaren Bezeichnungen (UI-Text, Buttons, Tooltips, ggf. Menüeinträge) sollen konsistent auf „Chat-Verlauf", „Historie" o.ä. angepasst werden.

## Akzeptanzkriterien

- [ ] Kein sichtbarer UI-Text spricht mehr von „Bookmark"/„Lesezeichen" (außer bewusst in Legacy/Debug, falls nötig).
- [ ] Benennung ist konsistent (keine Mischung aus „Historie" und „Verlauf" innerhalb derselben UI).
- [ ] Falls i18n existiert: Strings in allen Sprachen aktualisiert, Keys sinnvoll benannt.
- [ ] Keine Breaking Changes in Logik: nur Text/Bezeichner, nicht Funktion.

## ToDos

- [ ] UI-Strings finden (Komponenten, i18n, Konstanten)
- [ ] Texte ersetzen + ggf. i18n-Keys umbenennen
- [ ] Kurzer UI-Check: Chatseite mobil/desktop
