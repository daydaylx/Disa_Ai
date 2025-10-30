Projekt: Disa Ai (React + Vite + Tailwind)
Ziel: Mobile-first Chat App mit Rollen-, Modell- und Einstellungsseiten

Aktive Einstiegskette

- src/main.tsx
- src/App.tsx
- src/app/router.tsx
- src/app/layouts/MobileAppShell.tsx
- src/components/layout/MobileNavigation.tsx

CSS-Strategie

- Globales CSS wird ausschließlich in src/main.tsx geladen
- src/App.tsx lädt KEINE globalen Styles
- Zusätzliche mobile Styles liegen unter src/styles/\*.css

Deploy

- Aktive Deploy-Dateien liegen unter deploy/
- Dateien im Root sind NICHT zu ändern

Einstellungen

- Hauptansicht: src/features/settings/SettingsView.tsx
- Routen: /settings, /settings/api, /settings/memory, /settings/filters, /settings/appearance, /settings/data
- Agent soll nur eine Sektion pro Lauf ändern

Verbote

- keine gleichzeitige Änderung von Navigation und Styles
- keine neuen Root-Dateien erzeugen
