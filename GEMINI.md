# Disa_Ai – Projektkontext für Gemini

## Ziele & Grenzen

- Deutschsprachige, private, mobil-only Nutzung.
- Keine Server-Seite. Kein Telemetrie-Einbau.

## Regeln für Änderungen

- Nur Frontend anfassen. CSP respektieren. Kein Inline-Script erzeugen.
- IndexedDB für Verläufe beibehalten, API-Key in `sessionStorage`.

## Mobiles Verhalten sicherstellen

- Tastatur-Überdeckung verhindern, Safe-Area (iOS) beachten.
- Scroll-Auto-Follow nur, wenn Nutzer nicht nach oben scrollt.

## Standardaufgaben

- UI-Bugfixes, kleine Komponenten, Test-Reparaturen, Export/Import-Pfad.
- Keine Tool-Calling/Server-Features vorschlagen.

## Nützliche Hinweise

- Build: `npm run build` • Dev: `npm run dev` • Tests: `npm run test` / `npm run e2e`
- Lies `public/_headers` für CSP/Cache-Regeln.
