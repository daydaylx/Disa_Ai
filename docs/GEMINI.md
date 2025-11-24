# GEMINI.md

> Kurzreferenz für das interne Gemini-Backend. Der technische Überblick lebt bereits im `README.md`; diese Datei hält nur den Verweis aktuell.

- **Technologie-Stack:** Siehe `README.md` → Abschnitt „Tech Stack“ (React 19.2.0, TS 5.9.3, Vite 7.2.4, Router 7.9.6).
- **Build & Tests:** `npm run dev`, `npm run build`, `npm run verify`, `npm run e2e` (Details im README).
- **Security:** API-Key-Handhabung, CSP und Sentry-Konfiguration sind in `docs/ENVIRONMENT_VARIABLES.md` und `src/lib/monitoring/README.md` beschrieben.
- **Architektur:** Einstieg `src/main.tsx`, Routen in `src/app/router.tsx`, Design-Tokens in `src/styles/design-tokens-consolidated.css`.

Falls Informationen divergieren: README ist die Quelle der Wahrheit; diese Datei nur als Verweis beibehalten, damit bestehende Links nicht brechen.
