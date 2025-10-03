# Disa AI

<!--
**Hinweis für den Entwickler:** Bitte ersetzen Sie 'your-github-username/disa-ai' in den Badge-URLs durch den korrekten Pfad zum GitHub-Repository, sobald dieses öffentlich ist.
-->

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/your-github-username/disa-ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.io/your-github-username/disa-ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/disa-ai?label=version&style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-Private-blue?style=for-the-badge)](#-lizenz)

**Disa AI** ist eine professionelle, mobile-first AI-Chat Progressive Web App (PWA). Die Anwendung ist für ein optimales Erlebnis auf mobilen Endgeräten, insbesondere Android, konzipiert und verfügt über ein klares Glassmorphism-Design im Dark-Mode.

Der Fokus liegt auf einer sauberen Codebasis, robusten Build-Prozessen und einer auf Sicherheit, Performance und exzellente User Experience optimierten Architektur.

---

## Inhaltsverzeichnis

- [✨ Features](#-features)
  - [Kernfunktionen](#kernfunktionen)
  - [Mobile-First UX](#mobile-first-ux)
  - [Design & UI](#design--ui)
  - [Sicherheit & Architektur](#sicherheit--architektur)
- [🛠️ Tech Stack](#-tech-stack)
- [🏛️ Projektstruktur & Architektur](#️-projektstruktur--architektur)
- [🚀 Installation & Entwicklung](#-installation--entwicklung)
- [🧪 Qualitätssicherung & Testing](#-qualitätssicherung--testing)
- [☁️ Deployment & Caching](#️-deployment--caching)
- [🤝 Contributing](#-contributing)
- [📜 Lizenz](#-lizenz)

## ✨ Features

### Kernfunktionen

- **Flexible AI-Integration:** Anbindung an [OpenRouter](https://openrouter.ai/), die den Zugriff auf eine Vielzahl von Sprachmodellen ermöglicht, inklusive Streaming via NDJSON.
- **Modell-Katalog:** Durchsuchbare und filterbare Bibliothek zur Auswahl des passenden Sprachmodells (z.B. nach Kosten, Performance, Fähigkeiten).
- **PWA & Offline-Fähigkeit:** Vollständig installierbar für ein natives App-Gefühl, mit Service-Worker-Caching für Offline-Verfügbarkeit von Kernfunktionen.
- **Zustandsverwaltung:** Robuste Verwaltung von Konversationen und App-Einstellungen, die im `localStorage` des Benutzers gespeichert werden.

### Mobile-First UX

- **Optimiert für mobile Viewports:** Primäres Design-Ziel ist der `390×844px` Viewport (iPhone 12/13/14).
- **Dynamisches Viewport-Handling:** Nutzung von `100dvh` und der `VisualViewport` API zur Vermeidung von UI-Überlappungen durch die virtuelle Tastatur.
- **Touch-Optimierung:** Alle interaktiven Elemente haben eine Mindestgröße von `48x48px`, um die WCAG 2.1-Anforderungen für Touch-Ziele zu erfüllen.
- **Safe Area Insets:** Korrekte Darstellung auf Geräten mit Notches (iOS) und Gesten-Navigation (Android).

### Design & UI

- **Pures Dark-Mode-Design:** Die gesamte UI ist für den Dark-Mode optimiert, um die Lesbarkeit auf mobilen Geräten zu maximieren und den Akku zu schonen.
- **Glassmorphism:** Ein modernes UI-Konzept, das auf `backdrop-filter` für durchscheinende, glasähnliche Oberflächen setzt.
- **Design-Token-System:** Eine auf TypeScript basierende Architektur für Design-Tokens, die konsistente Stile (Farben, Abstände, Typografie) im gesamten Projekt sicherstellt.

### Sicherheit & Architektur

- **Client-seitige API-Keys:** API-Schlüssel werden ausschließlich in der `sessionStorage` gespeichert und verlassen den Client niemals in Richtung eines Backend-Servers.
- **Gehärtete Sicherheits-Header:** Eine strikte Content Security Policy (CSP) und weitere Header (`Permissions-Policy`, HSTS) minimieren die Angriffsfläche.
- **Strukturierte Fehlerbehandlung:** Definierte Fehlerklassen (`TimeoutError`, `NetworkError`, `AuthenticationError`) ermöglichen ein vorhersagbares und benutzerfreundliches Fehlermanagement.

## 🛠️ Tech Stack

| Kategorie               | Technologie & Bibliotheken                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Framework**      | [React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)                                                |
| **Styling**             | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) Primitives, [Lucide Icons](https://lucide.dev/), `clsx`, `tailwind-merge` |
| **Routing & Schema**    | [React Router](https://reactrouter.com/) v6, [Zod](https://zod.dev/) für Schema-Validierung                                                               |
| **PWA & Offline**       | [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) (Workbox-basiert)                                                                                    |
| **Unit-Tests**          | [Vitest](https://vitest.dev/), [Happy DOM](https://github.com/capricorn86/happy-dom), [MSW](https://mswjs.io/) für API-Mocking                            |
| **E2E- & Visual-Tests** | [Playwright](https://playwright.dev/), [@axe-core/playwright](https://github.com/dequelabs/axe-core) für Accessibility-Tests                              |
| **Code-Qualität**       | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/), `lint-staged`                                |
| **Deployment**          | [Cloudflare Pages](https://pages.cloudflare.com/)                                                                                                         |

## 🏛️ Projektstruktur & Architektur

Die Codebasis ist in klar definierte Verantwortungsbereiche unterteilt, um die Wartbarkeit und Skalierbarkeit zu fördern.

```
src/
├── api/          # Client-seitige API-Logik (z.B. OpenRouter)
├── app/          # App-Routing, Layouts und globaler State
├── components/   # Wiederverwendbare, zustandslose UI-Komponenten
├── config/       # App-Konfiguration (Feature-Flags, Modelle, etc.)
├── hooks/        # Benutzerdefinierte React Hooks für Geschäftslogik
├── lib/          # Allgemeine Hilfsfunktionen und Klassen
├── pages/        # Seitenkomponenten, die Routen zugeordnet sind
├── services/     # Übergreifende Dienste (z.B. Caching)
├── styles/       # Globale Stile und Design-Token-Definitionen
└── types/        # Globale TypeScript-Typdefinitionen
```

Die Anwendung folgt einer **3-Seiten-Architektur**:

1.  **`/chat`**: Die Hauptansicht für die Interaktion mit dem AI-Modell.
2.  **`/models`**: Der Katalog zur Auswahl und Verwaltung der verfügbaren Modelle.
3.  **`/settings`**: Die Seite zur Verwaltung von API-Schlüsseln und App-Einstellungen.

## 🚀 Installation & Entwicklung

### Voraussetzungen

- Node.js `(Version >=20.14.0 <24)`
- `npm` (wird mit Node.js geliefert)

### Installation & Start

1.  **Repository klonen:**

    ```bash
    git clone <repository-url>
    cd disa-ai
    ```

2.  **Abhängigkeiten installieren:**
    Verwenden Sie `npm ci`, um eine exakte Reproduktion der Abhängigkeiten aus der `package-lock.json` sicherzustellen.

    ```bash
    npm ci
    ```

3.  **Development-Server starten:**
    Die Anwendung ist anschließend unter `http://localhost:5173` erreichbar.
    ```bash
    npm run dev
    ```

## 🧪 Qualitätssicherung & Testing

Qualität wird durch automatisierte Checks und eine umfassende Test-Suite sichergestellt.

| Befehl                | Beschreibung                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `npm run verify`      | **Komplett-Check:** Führt Type-Checking, Linting und Unit-Tests aus.    |
| `npm run test:unit`   | Führt alle Unit-Tests mit Vitest im Headless-Modus aus.                 |
| `npm run test:e2e`    | Startet die End-to-End-Tests mit Playwright auf einem mobilen Viewport. |
| `npm run test:visual` | Führt visuelle Regressionstests durch, um UI-Änderungen zu erkennen.    |
| `npm run lint:fix`    | Behebt automatisch alle von ESLint gemeldeten Probleme.                 |
| `npm run format:fix`  | Formatiert den gesamten Code automatisch mit Prettier.                  |

## ☁️ Deployment & Caching

Das Deployment erfolgt automatisiert über **Cloudflare Pages** bei jedem Push auf den `main`-Branch.

### Caching-Strategie

Die Caching-Strategie ist für maximale Performance und schnelle Updates optimiert und wird über die `public/_headers`-Datei gesteuert:

- **`index.html`**: Wird mit `no-store` ausgeliefert, um sicherzustellen, dass Benutzer immer die neueste App-Version erhalten.
- **Gehashte Assets (JS, CSS):** Werden mit `max-age=31536000` (1 Jahr) aggressiv gecacht.
- **Service Worker:** Verwendet eine `Network-first`-Strategie für das HTML und `Stale-While-Revalidate` für andere Assets.

⚠️ **Wichtig:** Bei kritischen UI-Updates sollte der Cloudflare Cache manuell geleert werden, um eine sofortige Verteilung zu gewährleisten.

## 🤝 Contributing

Beiträge zur Codebasis folgen klaren Richtlinien, um die Qualität hoch zu halten.

- **Conventional Commits:** Alle Commits müssen der [Conventional Commits](https://www.conventionalcommits.org/) Spezifikation folgen. Dies wird durch `husky` pre-commit hooks erzwungen.
- **Trunk-Based Development:** Feature-Branches sollten kurzlebig sein und nach einem erfolgreichen Review zeitnah in den `main`-Branch integriert werden.
- **Templates:** Bitte verwenden Sie die Vorlagen im [.github/ISSUE_TEMPLATE](.github/ISSUE_TEMPLATE)-Verzeichnis für Bug-Reports und Feature-Requests und orientieren Sie sich an der [pull_request_template.md](.github/pull_request_template.md).

## 📜 Lizenz

Dieses Projekt ist derzeit privat und wird unter einer proprietären Lizenz entwickelt. Es ist keine Weiterverwendung, Verteilung oder Modifikation ohne ausdrückliche schriftliche Genehmigung gestattet.
