Titel

- Kurzer, prägnanter Titel im Imperativ (z. B. „fix: …“ / „feat: …“)

Beschreibung

- Motivation, Scope (max. 2–3 Sätze)
- Relevante Issues/Links (z. B. Closes #123)
- ADR-Link bei Architektur-/Verhaltensänderungen

Checkliste

- [ ] CI grün: Lint, Typecheck, Unit Tests, E2E Tests (Stable), Build, Deploy Gate
- [ ] ADR verlinkt oder „N/A“ (keine Architekturänderung)
- [ ] README/Docs angepasst (bei API/CI/UI Änderungen)
- [ ] Keine Secrets/Keys im Code; CSP/Policies unverändert
- [ ] E2E Tests laufen offline; ggf. Fixtures/Intercepts aktualisiert
- [ ] PR ist klein/atomar; Scope klar; keine unnötigen Änderungen

Breaking Changes

- [ ] Breaking Change? Wenn ja: klar dokumentiert und migrierbar

Screenshots (bei UI-Änderungen)

- Vorher/Nachher auf 360/768/1280 px

Manuelle Schritte (falls notwendig)

- Migrations-/Konfig‑Hinweise für Reviewer/Deploy
