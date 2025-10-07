# Disa AI

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/daydaylx/Disa_Ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.com/daydaylx/Disa_Ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/disa-ai?label=version&style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-Private-blue?style=for-the-badge)](#-lizenz)

**Disa AI** ist eine professionelle, mobile-first AI-Chat Progressive Web App (PWA), die mit React, Vite, TypeScript und Tailwind CSS entwickelt wurde. Die Anwendung ist speziell für eine optimale Darstellung auf mobilen Endgeräten (insbesondere Android) konzipiert und zeichnet sich durch ein modernes Glassmorphism-Design, eine robuste Codebasis und eine auf Sicherheit und Performance ausgerichtete Architektur aus.

---

## Inhaltsverzeichnis

- [✨ Features](#-features)
  - [Kernfunktionen](#kernfunktionen)
  - [Mobile-First User Experience](#mobile-first-user-experience)
  - [Design & UI](#design--ui)
  - [Sicherheit & Datenschutz](#sicherheit--datenschutz)
- [🛠️ Tech Stack](#-tech-stack)
- [🏛️ Projektarchitektur](#️-projektarchitektur)
- [🚀 Erste Schritte](#-erste-schritte)
  - [Voraussetzungen](#voraussetzungen)
  - [Installation](#installation)
- [📜 Verfügbare Skripte](#-verfügbare-skripte)
- [🧪 Qualitätssicherung & Testing](#-qualitätssicherung--testing)
  - [Unit-Tests](#unit-tests)
  - [End-to-End-Tests](#end-to-end-tests)
  - [Code-Qualität](#code-qualität)
- [☁️ Deployment](#️-deployment)
- [🤝 Contributing](#-contributing)
- [🔒 Sicherheit](#-sicherheit)
- [📜 Lizenz](#-lizenz)

## ✨ Features

### Kernfunktionen

- **Flexible AI-Integration**: Anbindung an OpenRouter.ai mit Unterstützung für NDJSON-Streaming, was eine breite Palette von Sprachmodellen zugänglich macht.
- **Dynamischer Modell-Katalog**: Eine filterbare Ansicht ermöglicht die schnelle Auswahl von Modellen nach Kriterien wie Preis, Kontextfenster oder Anbieter.
- **Erweitertes Rollensystem**: Vordefinierte und extern geladene Persona-Templates (z.B. "E-Mail-Profi", "Kreativ-Autor") passen das Verhalten der KI an. NSFW-Rollen können in den Einstellungen aktiviert werden.
- **Kontext-Gedächtnis (Optional)**: Die App kann sich Benutzerpräferenzen merken und diese als Systemkontext bei jeder Anfrage mitsenden, ohne den sichtbaren Chatverlauf zu überladen.
- **Progressive Web App (PWA)**: Vollständig installierbar mit Offline-Fähigkeiten dank eines Service Workers, der Caching-Strategien wie Network-First und Stale-While-Revalidate nutzt.

### Mobile-First User Experience

- **Optimiert für Smartphones**: Das primäre Design zielt auf einen Viewport von 390x844px (iPhone 12/13/14), ist aber vollständig responsiv.
- **Tastatur-sicheres Layout**: Durch die Nutzung von `VisualViewport` und `100dvh` wird verhindert, dass das Eingabefeld von der virtuellen Tastatur verdeckt wird.
- **Barrierefreiheit**: Alle interaktiven Elemente haben eine Mindestgröße von 48x48px, um die WCAG 2.1-Richtlinien für Touch-Ziele zu erfüllen.
- **Safe-Area-Unterstützung**: Das Layout berücksichtigt die "Notch" bei iPhones und die Gestensteuerung bei Android-Geräten.

### Design & UI

- **Konsistenter Dark Mode**: Eine sorgfältig ausgewählte, augenschonende Farbpalette, die für OLED-Displays optimiert ist.
- **Glassmorphism-Effekte**: Wiederverwendbare `glass`- und `glass-strong`-Utilities sorgen für ein durchgängiges, modernes Design mit transparenten Ebenen.
- **Design-Token-System**: Farben, Typografie, Abstände und Radien sind als TypeScript-basierte Design-Tokens in `src/styles/design-tokens.ts` definiert und werden über Tailwind CSS konsistent angewendet.

### Sicherheit & Datenschutz

- **Client-seitige Schlüsselverwaltung**: API-Schlüssel werden ausschließlich im `sessionStorage` des Browsers gespeichert und bei Beendigung der Sitzung automatisch gelöscht.
- **Strikte Content Security Policy (CSP)**: Eine umfassende CSP, die in `public/_headers` konfiguriert ist, minimiert das Risiko von XSS-Angriffen, indem sie unsichere Skripte blockiert und Ressourcen auf vertrauenswürdige Quellen beschränkt.
- **Getrennter Systemkontext**: Rollen- und Gedächtnis-Prompts werden zur Laufzeit injiziert und erscheinen nicht im Chat-Log, was für eine klare und aufgeräumte Benutzeroberfläche sorgt.

## 🛠️ Tech Stack

| Kategorie           | Technologien                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| **Framework**       | React 19, TypeScript 5.9, Vite 7                                          |
| **Styling**         | Tailwind CSS, Radix UI Primitives, Lucide Icons, `clsx`, `tailwind-merge` |
| **State & Routing** | React Router v6, Zod (für Schema-Validierung)                             |
| **PWA / Offline**   | Vite PWA Plugin (Workbox)                                                 |
| **Unit-Testing**    | Vitest, Happy DOM, MSW (Mock Service Worker)                              |
| **E2E-Testing**     | Playwright, @axe-core/playwright (für Accessibility-Tests)                |
| **Code-Qualität**   | ESLint, Prettier, Husky, lint-staged                                      |
| **Deployment**      | Cloudflare Pages                                                          |

## 🏛️ Projektarchitektur

Das Projekt folgt einer klaren Ordnerstruktur, die auf der Trennung von Zuständigkeiten basiert.

```
src/
├── api/          # API-Aufrufe (z.B. OpenRouter)
├── app/          # App-Setup: Router, Layouts, globale Zustände
├── components/   # Wiederverwendbare UI-Komponenten
├── config/       # Konfiguration: Modelle, Prompts, Feature-Flags, Einstellungen
├── data/         # Daten-Adapter und Transformationen
├── hooks/        # Zentrale Business-Logik (z.B. useChat, useMemory)
├── lib/          # Allgemeine Hilfsfunktionen
├── pages/        # Ansichten für einzelne Routen (z.B. Chat, Einstellungen)
├── services/     # Hintergrunddienste
├── state/        # Zustandsmanagement
├── styles/       # Globale Stile und Tailwind-Layer
└── types/        # Globale Typdefinitionen
```

## 🚀 Erste Schritte

### Voraussetzungen

- Node.js: `^20.14.0` (wie in `package.json` und `.nvmrc` definiert)
- npm (oder ein kompatibler Paketmanager)

### Installation

1.  **Repository klonen:**

    ```bash
    git clone https://github.com/daydaylx/Disa_Ai.git
    cd Disa_Ai
    ```

2.  **Abhängigkeiten installieren:**

    ```bash
    npm install
    ```

3.  **Entwicklungsserver starten:**
    ```bash
    npm run dev
    ```
    Die Anwendung ist anschließend unter `http://localhost:5173` erreichbar.

## 📜 Verfügbare Skripte

| Befehl              | Beschreibung                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`       | Startet den Vite-Entwicklungsserver.                                                               |
| `npm run build`     | Erstellt einen optimierten Produktions-Build im `dist`-Ordner.                                     |
| `npm run preview`   | Startet einen lokalen Server, um den Produktions-Build zu testen.                                  |
| `npm run typecheck` | Überprüft das gesamte Projekt auf TypeScript-Fehler.                                               |
| `npm run lint`      | Führt ESLint aus, um Code-Stil-Probleme zu finden.                                                 |
| `npm run format`    | Überprüft den Code mit Prettier auf Formatierungsfehler.                                           |
| `npm run test:unit` | Führt alle Vitest-Unit-Tests einmalig aus.                                                         |
| `npm run test:e2e`  | Führt alle Playwright-End-to-End-Tests aus.                                                        |
| `npm run verify`    | Führt `typecheck`, `lint` und `test:unit` nacheinander aus. Ein wichtiger Befehl vor jedem Commit. |

## 🧪 Qualitätssicherung & Testing

Das Projekt verfügt über eine umfassende Test-Suite, um eine hohe Code-Qualität sicherzustellen.

### Unit-Tests

- **Framework**: [Vitest](https://vitest.dev/) mit [Happy DOM](https://github.com/capricorn86/happy-dom) für eine schnelle und browser-ähnliche Testumgebung.
- **Mocking**: Netzwerk-Anfragen werden mit [Mock Service Worker (MSW)](https://mswjs.io/) abgefangen, um Tests deterministisch und offline-fähig zu machen.
- **Struktur**: Testdateien (`*.test.ts(x)`) befinden sich direkt neben den zu testenden Quelldateien.

### End-to-End-Tests

- **Framework**: [Playwright](https://playwright.dev/) wird für E2E-Tests verwendet.
- **Konfiguration**: Die Tests sind für einen mobilen Viewport ("Pixel 7") konfiguriert und laufen offline, indem Netzwerk-Anfragen abgefangen werden.
- **Accessibility**: Barrierefreiheitstests werden mit `@axe-core/playwright` in die E2E-Suite integriert.

### Code-Qualität

- **Linting & Formatting**: ESLint und Prettier sind konfiguriert, um einen einheitlichen und fehlerfreien Code-Stil zu gewährleisten.
- **Pre-Commit-Hooks**: [Husky](https://typicode.github.io/husky/) und [lint-staged](https://github.com/okonet/lint-staged) führen vor jedem Commit automatisch Linting und Formatierung für die geänderten Dateien aus.

## ☁️ Deployment

- **Hosting**: Die Anwendung wird auf [Cloudflare Pages](https://pages.cloudflare.com/) gehostet.
- **Continuous Deployment**: Jeder Push auf den `main`-Branch löst automatisch einen neuen Build und ein Deployment aus.
- **Caching**:
  - Assets mit Hash-Namen (JS, CSS) werden mit `max-age=31536000` (ein Jahr) aggressiv gecacht.
  - Der Service Worker verwendet eine `Network-First`-Strategie für HTML-Dokumente und `Stale-While-Revalidate` für andere Assets.
- **Sicherheit**: Eine strikte Content Security Policy (CSP) wird über eine `_headers`-Datei ausgeliefert. **Wichtig:** Cloudflare Web Analytics muss deaktiviert sein, da das Skript von der CSP blockiert wird.

## 🤝 Contributing

- **Commit-Konvention**: Das Projekt folgt der [Conventional Commits](https://www.conventionalcommits.org/) Spezifikation. Dies wird durch Pre-Commit-Hooks erzwungen.
- **Entwicklungsmodell**: Es wird ein Trunk-Based Development-Modell mit kurzlebigen Feature-Branches verfolgt, die nach einem Review in den `main`-Branch gemerged werden.
- **Templates**: Für Issues und Pull Requests stehen in `.github/` Vorlagen zur Verfügung.

## 🔒 Sicherheit

Dieses Projekt legt großen Wert auf Sicherheit. Eine detaillierte Übersicht über die Sicherheitsarchitektur, die Handhabung von API-Schlüsseln und die Meldung von Schwachstellen finden Sie im Dokument [SECURITY.md](SECURITY.md).

## 📜 Lizenz

Dieses Projekt ist privat und urheberrechtlich geschützt. Eine Weitergabe, Vervielfältigung oder Modifikation des Quellcodes ist ohne ausdrückliche schriftliche Zustimmung des Autors nicht gestattet.
