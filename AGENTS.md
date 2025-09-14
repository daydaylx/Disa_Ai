# Agenten-Leitfaden

## Projektprinzipien

- Deutsch, privat, mobil-first. Minimaler Fußabdruck.
- Sicherheit vor Features: CSP strikt halten, keinen externen Code nachladen.

## Arbeitsregeln

- Kleine Patches, klare Diffs, Tests anpassen.
- Kein Refactor quer durchs Repo ohne Ticket.
- Mobile UX zuerst testen (Android Chrome, Hochformat).

## Definition of Done

- Lint + Typecheck + Unit + E2E (mobil) grün.
- Kein neuer CSP-Fehler in der Konsole.
- Bundle-Größe nicht erhöht ohne Begründung.

## Change-Checklist

- [ ] Neue Abhängigkeiten dokumentiert
- [ ] A11y geprüft (Fokus, Labels, Kontrast)
- [ ] CSP/Headers geprüft
- [ ] Tests ergänzt/aktualisiert
