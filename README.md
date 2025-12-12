# Disa AI

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/daydaylx/Disa_Ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.com/daydaylx/Disa_Ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-Private-blue?style=for-the-badge)](#lizenz)

---

## Übersicht

**Disa AI** ist eine mobile-first Progressive Web App (PWA) für KI-gestützte Unterhaltungen. Die App ermöglicht Chats mit verschiedenen KI-Modellen über [OpenRouter](https://openrouter.ai), bietet ein Rollen-/Persona-System und ist vollständig offline-fähig (Shell und UI).

**Zielgruppe:** Private Nutzung als persönlicher KI-Chat. Kein Enterprise-Produkt.

**Live-Demo:** [disaai.de](https://disaai.de)

---

## Features

| Feature             | Beschreibung                                                                       |
| ------------------- | ---------------------------------------------------------------------------------- |
| **Chat**            | Streaming-Antworten, Markdown-Rendering, Code-Highlighting, LaTeX-Support          |
| **Modellwahl**      | Wechsel zwischen verschiedenen KI-Modellen (GPT-4, Claude, Mistral, etc.) pro Chat |
| **Rollen/Personas** | Vordefinierte Rollen für verschiedene Gesprächstypen (Berater, Recherche, kreativ) |
| **Jugendschutz**    | Konfigurierbarer Filter für Modelle und Inhalte                                    |
| **PWA**             | Installierbar, offline-fähige Shell, App-ähnliches Erlebnis                        |
| **Mobile-First**    | Touch-optimiert, Safe-Area-Support, dynamische Viewport-Höhe                       |
| **Chat-Verlauf**    | Lokale Speicherung aller Gespräche im Browser (IndexedDB)                          |
| **Feedback**        | In-App Feedback-Funktion (E-Mail via Resend)                                       |

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
| **PWA**           | vite-plugin-pwa (Workbox) | 1.1.0   |
| **Unit-Tests**    | Vitest                    | 3.2.4   |
| **E2E-Tests**     | Playwright                | 1.57.0  |
| **Hosting**       | Cloudflare Pages          | –       |

---

## Installation

### Voraussetzungen

- **Node.js**: Version `22.19.0` (siehe `.nvmrc`)
- **npm**: Wird mit Node.js installiert

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

| Command             | Beschreibung                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Startet Vite Dev-Server mit Hot-Reload            |
| `npm run build`     | Erstellt Production-Build in `dist/`              |
| `npm run preview`   | Lokale Vorschau des Production-Builds             |
| `npm run verify`    | Führt Typecheck + Lint + Unit-Tests aus (CI-Gate) |
| `npm run typecheck` | TypeScript-Prüfung                                |
| `npm run lint`      | ESLint-Prüfung                                    |
| `npm run lint:fix`  | ESLint mit Auto-Fix                               |
| `npm run test:unit` | Vitest Unit-Tests                                 |
| `npm run e2e`       | Playwright E2E-Tests                              |
| `npm run e2e:live`  | E2E-Tests gegen Live-Site (disaai.de)             |
| `npm run clean`     | Entfernt Build-Artefakte                          |

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
- **IndexedDB**: Bei >500 Gesprächen kann die Performance nachlassen.
- **Service Worker Updates**: Update-Banner kann verzögert erscheinen.

**Vollständige Liste:** [`docs/guides/known-issues.md`](docs/guides/known-issues.md)

---

## Weitere Dokumentation

| Dokument                                                                       | Inhalt                          |
| ------------------------------------------------------------------------------ | ------------------------------- |
| [`docs/OVERVIEW.md`](docs/OVERVIEW.md)                                         | App-Nutzung und UI-Erklärung    |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)                                 | Technische Architektur          |
| [`docs/CONFIG.md`](docs/CONFIG.md)                                             | Konfiguration und Feature-Flags |
| [`docs/guides/ENVIRONMENT_VARIABLES.md`](docs/guides/ENVIRONMENT_VARIABLES.md) | Alle Umgebungsvariablen         |
| [`docs/guides/FEEDBACK_SETUP.md`](docs/guides/FEEDBACK_SETUP.md)               | Feedback-Funktion einrichten    |
| [`docs/guides/RELEASE_PLAYBOOK.md`](docs/guides/RELEASE_PLAYBOOK.md)           | Release-Prozess                 |
| [`AGENTS.md`](AGENTS.md)                                                       | Richtlinien für AI-Agenten      |
| [`CLAUDE.md`](CLAUDE.md)                                                       | Claude Code Referenz            |

---

## Deployment

Die App wird über **Cloudflare Pages** gehostet.

### Build-Output

```bash
npm run build
```

Erzeugt `dist/` mit statischen Assets. Der `postbuild`-Schritt kopiert `_headers` und verifiziert den Build.

### Manuelle Verifikation

```bash
npm run verify:dist
```

Prüft, dass `dist/index.html` nur auf gebundelte Assets verweist und keine `.tsx`-Dateien enthält.

---

## Contributing

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat(chat): add streaming`)
- **Branches**: Kurzlebige Feature-Branches von `main`
- **Changesets**: `npm run changeset:add` für user-facing Changes
- **PRs**: Müssen `npm run verify` bestehen

---

## Lizenz

Dieses Projekt ist **privat und urheberrechtlich geschützt**. Eine Weitergabe, Vervielfältigung oder Modifikation des Quellcodes ist ohne ausdrückliche schriftliche Zustimmung des Autors nicht gestattet.

---

## Kontakt

- **E-Mail**: grunert94@hotmail.com
- **Repository**: [github.com/daydaylx/Disa_Ai](https://github.com/daydaylx/Disa_Ai)
