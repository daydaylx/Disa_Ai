# Disa AI

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/daydaylx/Disa_Ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.com/daydaylx/Disa_Ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.2-blue?style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-20.19.0+-green?style=for-the-badge)](.nvmrc)

---

## Übersicht

**Disa AI** ist eine mobile-first Progressive Web App (PWA) für KI-gestützte Unterhaltungen. Die App ermöglicht Chats mit verschiedenen KI-Modellen über [OpenRouter](https://openrouter.ai), bietet ein Rollen-/Persona-System und ist vollständig offline-fähig (Shell und UI).

**Zielgruppe:** Private Nutzung als persönlicher KI-Chat. Kein Enterprise-Produkt.

**Live-Demo:** [disaai.de](https://disaai.de)

> 💡 **Hinweis:** Die App befindet sich in aktiver Entwicklung. Die Dokumentation wird kontinuierlich aktualisiert (Stand: Dezember 2025).

---

## Neueste Updates

### Version 1.0.2 (Aktuell)

- **E2E-Tests**: Behebung flaky Tests für History Panel und Button-Animationen
- **UI-Verbesserungen**: Glassmorphism-Redesign für Mobile Menu Drawer
- **Chat-Branding**: Subtile Card-Borders und Gradient-Tints

### Version 1.1.0 (In Entwicklung)

- **Screenshot-Anhänge**: Feedback-System unterstützt jetzt bis zu 5 Screenshots
  - Clientseitige Bildkompression (max. 1280px, WebP/JPEG)
  - Automatisches EXIF-Stripping (GPS und Metadaten)
  - Magic Bytes Validierung (PNG, JPEG, WebP)
  - Max. 5 MB pro Bild, 15 MB gesamt

**Vollständiges Changelog:** [`CHANGELOG.md`](CHANGELOG.md)

---

## Features

| Feature                 | Beschreibung                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| **Chat**                | Streaming-Antworten, Markdown-Rendering, Code-Highlighting, LaTeX-Support                    |
| **Modellwahl**          | Wechsel zwischen verschiedenen KI-Modellen (GPT-4, Claude, Mistral, etc.) pro Chat           |
| **Rollen/Personas**     | Vordefinierte Rollen für verschiedene Gesprächstypen (Berater, Recherche, kreativ)           |
| **Jugendschutz**        | Konfigurierbarer Filter für Modelle und Inhalte                                              |
| **PWA**                 | Installierbar, offline-fähige Shell, App-ähnliches Erlebnis                                  |
| **Mobile-First**        | Touch-optimiert, Safe-Area-Support, dynamische Viewport-Höhe                                 |
| **Chat-Verlauf**        | Lokale Speicherung aller Gespräche im Browser (IndexedDB mit Dexie)                          |
| **Feedback mit Bildern** | In-App Feedback mit Screenshot-Anhängen (bis zu 5 Bilder, max. 15 MB gesamt)                |
| **Virtualisierung**     | Optimierte Performance für lange Listen (Modelle, Chat-Verlauf)                              |
| **Error Monitoring**    | Sentry-Integration für Produktions-Builds (optional)                                         |

---

## Tech-Stack

| Kategorie         | Technologie               | Version |
| ----------------- | ------------------------- | ------- |
| **Framework**     | React                     | 18.3.1  |
| **Sprache**       | TypeScript                | 5.9.3   |
| **Bundler**       | Vite                      | 7.2.4   |
| **Styling**       | Tailwind CSS              | 3.4.18  |
| **UI-Primitives** | Radix UI                  | diverse |
| **Routing**       | React Router              | 7.9.6   |
| **Validierung**   | Zod                       | 4.1.13  |
| **Database**      | Dexie (IndexedDB)         | 4.2.1   |
| **PWA**           | vite-plugin-pwa (Workbox) | 1.1.0   |
| **Monitoring**    | Sentry                    | 10.26.0 |
| **Unit-Tests**    | Vitest                    | 3.2.4   |
| **E2E-Tests**     | Playwright                | 1.57.0  |
| **Hosting**       | Cloudflare Pages          | –       |

---

## Installation

### Voraussetzungen

- **Node.js**: Version `20.19.0` oder höher (siehe `.nvmrc`)
- **npm**: Version 9.x oder höher (wird mit Node.js installiert)
- **Git**: Für Repository-Clone und Versionskontrolle

### Setup

```bash
# Repository klonen
git clone https://github.com/daydaylx/Disa_Ai.git
cd Disa_Ai

# Node-Version setzen (falls nvm installiert)
nvm use

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

---

## Entwicklung

### Wichtige Commands

| Command                  | Beschreibung                                             |
| ------------------------ | -------------------------------------------------------- |
| `npm run dev`            | Startet Vite Dev-Server mit Hot-Reload                   |
| `npm run build`          | Erstellt Production-Build in `dist/`                     |
| `npm run preview`        | Lokale Vorschau des Production-Builds                    |
| `npm run verify`         | Führt Typecheck + Lint + Unit-Tests aus (CI-Gate)        |
| `npm run typecheck`      | TypeScript-Prüfung (parallel für Build & Tests)          |
| `npm run lint`           | ESLint-Prüfung                                           |
| `npm run lint:fix`       | ESLint mit Auto-Fix                                      |
| `npm run lint:css`       | Stylelint + Hex-Color-Validierung                        |
| `npm run format:fix`     | Prettier Auto-Formatierung                               |
| `npm run test:unit`      | Vitest Unit-Tests                                        |
| `npm run test:watch`     | Unit-Tests im Watch-Modus                                |
| `npm run e2e`            | Playwright E2E-Tests                                     |
| `npm run e2e:smoke`      | Schnelle E2E Smoke-Tests                                 |
| `npm run e2e:live`       | E2E-Tests gegen Live-Site (disaai.de)                    |
| `npm run analyze`        | Bundle-Analyse öffnen                                    |
| `npm run clean`          | Entfernt Build-Artefakte und Cache                       |
| `npm run verify:dist`    | Verifiziert Build-Output                                 |
| `npm run changeset:add`  | Neuen Changeset hinzufügen                               |

### Qualitäts-Gate

Vor jedem Push/PR:

```bash
npm run verify
```

Dies entspricht der CI-Pipeline und prüft TypeScript, Linting und Unit-Tests.

---

## Konfiguration

### API-Key

Die App benötigt einen **OpenRouter API-Key** für KI-Funktionen:

1. Account bei [openrouter.ai](https://openrouter.ai) erstellen
2. API-Key generieren
3. In der App unter **Einstellungen → API-Key & Verbindung** eingeben

Der Key wird im `sessionStorage` gespeichert und verlässt nie den Browser.

### Umgebungsvariablen

Für lokale Entwicklung in `.env.local`:

```bash
# Optional: Eigene OpenRouter-Basis-URL
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Optional: Debug-Modus
VITE_ENABLE_DEBUG=true
```

**Vollständige Referenz:** [`docs/guides/ENVIRONMENT_VARIABLES.md`](docs/guides/ENVIRONMENT_VARIABLES.md)

### Server-seitige Variablen (Cloudflare)

Für die Feedback-Funktion (Cloudflare Pages Functions):

| Variable           | Beschreibung                                 |
| ------------------ | -------------------------------------------- |
| `RESEND_API_KEY`   | API-Key von [Resend.com](https://resend.com) |
| `DISA_FEEDBACK_TO` | Empfänger-Adresse (optional)                 |

---

## Seiten & Navigation

| Route                  | Seite         | Beschreibung                         |
| ---------------------- | ------------- | ------------------------------------ |
| `/chat`                | Chat          | Hauptseite, KI-Unterhaltung          |
| `/chat/history`        | Verlauf       | Alle gespeicherten Gespräche         |
| `/models`              | Modelle       | Modell-Katalog mit Filter/Suche      |
| `/roles`               | Rollen        | Persona-Auswahl und Favoriten        |
| `/themen`              | Themen        | Quickstart-Themen für neue Gespräche |
| `/settings`            | Einstellungen | Übersichtsseite                      |
| `/settings/api-data`   | API & Daten   | API-Key, Verbindungsstatus           |
| `/settings/memory`     | Gedächtnis    | Kontext-Einstellungen                |
| `/settings/behavior`   | Verhalten     | Schreibstil, Kreativität             |
| `/settings/youth`      | Jugendschutz  | Altersfilter, Modell-Einschränkungen |
| `/settings/appearance` | Darstellung   | Theme, Schriftgröße                  |
| `/settings/extras`     | Extras        | Experimentelle Features              |
| `/feedback`            | Feedback      | Bug-Reports, Feature-Requests        |
| `/impressum`           | Impressum     | Rechtliche Angaben                   |
| `/datenschutz`         | Datenschutz   | Datenschutzerklärung                 |

**Hinweis:** Die App ist mobile-first konzipiert. Auf Desktop-Geräten erscheint ein Hinweis, dass die Darstellung für mobile Geräte optimiert ist.

---

## Projekt-Statistiken

| Metrik                 | Wert                    |
| ---------------------- | ----------------------- |
| TypeScript/TSX Dateien | ~268 Dateien            |
| Seiten (Routes)        | 15+ lazy-loaded         |
| UI-Komponenten         | 50+ wiederverwendbar    |
| Personas/Rollen        | 20+ vordefiniert        |
| Test-Coverage          | Unit + E2E + Visuell    |
| Bundle Size            | < 500 KB (initial)      |
| PWA-Icons              | 21 Varianten            |
| Supported Browsers     | Chrome, Firefox, Safari |

---

## Projektstruktur

```
src/
├── api/              # OpenRouter-API-Integration
├── app/              # Router, Layouts, Provider
├── components/       # UI-Komponenten
│   ├── ui/          # Basis-Komponenten (Button, Card, Dialog, etc.)
│   ├── chat/        # Chat-spezifische Komponenten
│   ├── models/      # Modell-Explorer
│   ├── roles/       # Rollen-Verwaltung
│   └── navigation/  # Navigation, Sidepanel
├── config/          # Konfiguration, Feature-Flags, Modell-Katalog
├── contexts/        # React Contexts
├── hooks/           # Business-Logik (useChat, useSettings, etc.)
├── lib/             # Utilities (keine React-Imports)
├── pages/           # Seiten-Komponenten
├── services/        # Browser-APIs, Storage
├── state/           # State-Reducer
├── styles/          # CSS, Design-Tokens
└── types/           # TypeScript-Typen
```

---

## Design-System

Die App verwendet ein **Dark-Mode-First Design** mit folgenden Prinzipien:

- **Token-basiert**: Alle Farben, Abstände und Schatten als CSS-Variablen in `src/styles/design-tokens.css`
- **Tailwind-Integration**: Tokens werden in `tailwind.config.ts` referenziert
- **Komponenten-Varianten**: `class-variance-authority` für typsichere Varianten
- **Radix UI**: Barrierefreie Headless-Komponenten als Basis
- **Mobile-First**: Touch-Targets min. 44px, Safe-Area-Support

**Details:** [`src/styles/DESIGN_SYSTEM.md`](src/styles/DESIGN_SYSTEM.md)

---

## Bekannte Einschränkungen

- **Desktop-Nutzung**: Die App zeigt auf Desktop einen Mobile-Gate-Hinweis. Nutzung ist möglich, aber nicht optimiert.
- **Safari PWA**: Einige PWA-Features eingeschränkt (iOS-Limitierung).
- **IndexedDB**: Bei >500 Gesprächen kann die Performance nachlassen (Virtualisierung hilft).
- **Service Worker Updates**: Update-Banner kann verzögert erscheinen.
- **Screenshot-Upload**: Maximale Dateigröße 5 MB pro Bild, 15 MB gesamt (Feedback-Feature).

**Vollständige Liste:** [`docs/guides/known-issues.md`](docs/guides/known-issues.md)

---

## Weitere Dokumentation

### Allgemein

| Dokument                                                 | Inhalt                          |
| -------------------------------------------------------- | ------------------------------- |
| [`docs/OVERVIEW.md`](docs/OVERVIEW.md)                   | App-Nutzung und UI-Erklärung    |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)           | Technische Architektur          |
| [`docs/CONFIG.md`](docs/CONFIG.md)                       | Konfiguration und Feature-Flags |
| [`CHANGELOG.md`](CHANGELOG.md)                           | Versionshistorie                |

### Entwickler-Guides

| Dokument                                                                               | Inhalt                                   |
| ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`docs/guides/ENVIRONMENT_VARIABLES.md`](docs/guides/ENVIRONMENT_VARIABLES.md)         | Alle Umgebungsvariablen                  |
| [`docs/guides/FEEDBACK_SETUP.md`](docs/guides/FEEDBACK_SETUP.md)                       | Feedback-Funktion einrichten             |
| [`docs/guides/FEEDBACK_SCREENSHOTS.md`](docs/guides/FEEDBACK_SCREENSHOTS.md)           | Screenshot-Anhänge Dokumentation         |
| [`docs/guides/RELEASE_PLAYBOOK.md`](docs/guides/RELEASE_PLAYBOOK.md)                   | Release-Prozess                          |
| [`docs/guides/STORAGE_MIGRATION_GUIDE.md`](docs/guides/STORAGE_MIGRATION_GUIDE.md)     | Storage-Migration                        |
| [`docs/guides/CLOUDFLARE_FUNCTIONS_SETUP.md`](docs/guides/CLOUDFLARE_FUNCTIONS_SETUP.md) | Cloudflare Functions Setup            |
| [`docs/guides/tests-setup.md`](docs/guides/tests-setup.md)                             | Test-Setup und -Ausführung               |
| [`docs/guides/known-issues.md`](docs/guides/known-issues.md)                           | Bekannte Probleme und Workarounds        |

### AI-Agenten

| Dokument                     | Inhalt                       |
| ---------------------------- | ---------------------------- |
| [`CLAUDE.md`](CLAUDE.md)     | Claude Code Referenz         |
| [`AGENTS.md`](AGENTS.md)     | Richtlinien für AI-Agenten   |
| [`GEMINI.md`](GEMINI.md)     | Gemini-spezifische Infos     |

### Design & Styling

| Dokument                                                       | Inhalt                        |
| ------------------------------------------------------------------- | ----------------------------- |
| [`src/styles/DESIGN_SYSTEM.md`](src/styles/DESIGN_SYSTEM.md)  | Design-System Dokumentation   |
| [`docs/CATEGORY_ACCENT_SYSTEM.md`](docs/CATEGORY_ACCENT_SYSTEM.md) | Kategorie-Farben System  |

---

## Deployment

Die App wird über **Cloudflare Pages** gehostet und nutzt Cloudflare Functions für Backend-Features.

### Build-Prozess

```bash
npm run build
```

**Automatische Schritte:**

1. **Prebuild**: `scripts/build-info.js` generiert Build-Metadaten
2. **Token-Generierung**: `npm run generate-tokens` verarbeitet Design-Tokens
3. **Vite Build**: Erstellt `dist/` mit optimierten Assets
4. **Postbuild**:
   - Kopiert `_headers` für Cloudflare
   - Generiert Routen-Manifest
   - Verifiziert Build-Integrität

### Build-Verifikation

```bash
npm run verify:dist
```

Prüft, dass `dist/index.html` nur auf gebundelte Assets verweist und keine `.tsx`-Dateien enthält.

### Deployment-Ziele

- **Production**: Cloudflare Pages (auto-deploy auf `main`)
- **Preview**: Automatisch für Pull Requests
- **Local**: `npm run preview` für lokale Tests

### Cloudflare Functions

Die App nutzt Cloudflare Pages Functions für:

- **Feedback-API** (`/api/feedback`): E-Mail-Versand mit Screenshot-Anhängen
- **Chat-Proxy** (`/api/chat`): Optional für zusätzliche Sicherheit

**Setup-Guide:** [`docs/guides/CLOUDFLARE_FUNCTIONS_SETUP.md`](docs/guides/CLOUDFLARE_FUNCTIONS_SETUP.md)

---

## Contributing

### Commit-Richtlinien

Dieses Projekt nutzt [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): kurze Beschreibung
fix(scope): kurze Beschreibung
docs(scope): kurze Beschreibung
chore(scope): kurze Beschreibung
```

**Beispiele:**
- `feat(chat): add streaming response support`
- `fix(ui): resolve button alignment issue`
- `docs(readme): update installation steps`

### Workflow

1. **Branch erstellen**: `git checkout -b feature/mein-feature`
2. **Änderungen vornehmen**: Code schreiben, Tests hinzufügen
3. **Lokale Checks**: `npm run verify` ausführen
4. **Changeset hinzufügen**: `npm run changeset:add` (für user-facing Changes)
5. **Commit**: Mit Conventional Commit Message
6. **Push & PR**: Pull Request erstellen

### Code-Qualität

- **Pre-Commit Hooks**: Husky + lint-staged prüfen automatisch
- **CI Pipeline**: Muss grün sein (typecheck, lint, tests)
- **Code Review**: Mindestens ein Approval erforderlich
- **Tests**: Unit-Tests für Business-Logik, E2E für kritische Flows

### Changesets

Für alle user-facing Changes:

```bash
npm run changeset:add
```

Dies erstellt eine Changeset-Datei für die nächste Release-Version.

---

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.

Copyright (c) 2025 daydaylx

---

## Support & Kontakt

### In-App Feedback

Die App verfügt über eine integrierte Feedback-Funktion:

1. Navigiere zu **Feedback** (`/feedback`)
2. Wähle Kategorie (Bug Report, Feature Request, etc.)
3. Beschreibe dein Anliegen
4. Optional: Füge bis zu 5 Screenshots hinzu
5. Absenden

Das Feedback wird per E-Mail an das Entwicklungsteam gesendet.

### Direkt-Kontakt

- **E-Mail**: grunert94@hotmail.com
- **Repository**: [github.com/daydaylx/Disa_Ai](https://github.com/daydaylx/Disa_Ai)
- **Issues**: [GitHub Issues](https://github.com/daydaylx/Disa_Ai/issues)
- **Live-Demo**: [disaai.de](https://disaai.de)

---

## Credits & Danksagungen

Entwickelt mit:

- [React](https://react.dev/) - UI Framework
- [Vite](https://vite.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Primitives
- [OpenRouter](https://openrouter.ai/) - AI Model API
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting

Besonderer Dank an die Open-Source-Community für die wertvollen Tools und Libraries.
