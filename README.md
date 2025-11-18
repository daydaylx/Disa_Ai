# Disa AI

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/daydaylx/Disa_Ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.com/daydaylx/Disa_Ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/disa-ai?label=version&style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-Private-blue?style=for-the-badge)](#-lizenz)

**Disa AI** ist eine professionelle, mobile-first AI-Chat Progressive Web App (PWA), entwickelt mit React, Vite, TypeScript und Tailwind CSS. Die Anwendung ist für eine optimale Darstellung auf mobilen Endgeräten konzipiert und zeichnet sich durch ein modernes, auf Performance und Barrierefreiheit optimiertes Design-System, eine robuste Codebasis und eine sicherheitsorientierte Architektur aus.

---

## Inhaltsverzeichnis

- [🎨 Design-System & UI](#-design-system--ui)
- [🏛️ Architektur](#️-architektur)
- [🛠️ Tech-Stack](#️-tech-stack)
- [🚀 Erste Schritte](#-erste-schritte)
  - [Voraussetzungen](#voraussetzungen)
  - [Installation & Start](#installation--start)
- [📜 Verfügbare Skripte](#-verfügbare-skripte)
- [🧪 Qualitätssicherung & Testing](#-qualitätssicherung--testing)
- [☁️ Build & Deployment](#️-build--deployment)
- [🤝 Contributing](#-contributing)
- [📜 Lizenz](#-lizenz)

---

## 🎨 Design-System & UI

Das Design der Anwendung basiert auf einem performanten und wartbaren System, das von modernen UI-Frameworks wie **Microsoft Fluent 2** inspiriert ist. Es setzt auf flache Oberflächen, subtile Schatten ("Glassmorphism") und eine klare visuelle Hierarchie anstelle von ressourcenintensiven Effekten wie Neumorphismus.

### Design-Token-System

Das Fundament des Designs bildet ein zentrales Token-System:

1.  **TypeScript-Tokens (`src/styles/tokens/`)**: Alle grundlegenden Design-Entscheidungen (Farben, Abstände, Radien, Schatten) sind als typsichere TypeScript-Objekte in thematischen Dateien (`color.ts`, `shadow.ts`, etc.) definiert.
2.  **CSS Custom Properties**: Ein Skript (`scripts/generate-tokens.mjs`) generiert aus den TypeScript-Tokens globale CSS-Variablen, die zur Laufzeit im Browser verfügbar sind. Dies zentralisiert die Design-Sprache und ermöglicht globale Änderungen an einer einzigen Stelle.
3.  **Tailwind-Konfiguration (`tailwind.config.ts`)**: Die Tailwind-Konfiguration konsumiert diese CSS-Variablen, um die Utility-Klassen zu erzeugen.
    ```typescript
    // tailwind.config.ts
    theme: {
      extend: {
        colors: {
          primary: 'hsl(var(--color-brand-primary))',
        },
        spacing: {
          4: 'var(--spacing-4)', // -> 1rem
        }
      }
    }
    ```

### Komponenten-Bibliothek (`src/components/ui`)

Die Anwendung nutzt eine wiederverwendbare Komponenten-Bibliothek mit folgenden Prinzipien:

-   **Headless-Komponenten von Radix UI**: Für komplexe UI-Elemente wie Dialoge, Dropdowns oder Schalter wird Radix UI als ungestylte, barrierefreie Basis verwendet. Dies trennt die Logik und das State-Management der Komponente von ihrem Aussehen.
-   **Styling mit `class-variance-authority` (cva)**: Jede Komponente (z. B. `button.tsx`) verwendet `cva`, um verschiedene Varianten (`variant: 'primary' | 'secondary'`) und Größen (`size: 'sm' | 'lg'`) typsicher zu definieren.
-   **Klassen-Management mit `tailwind-merge`**: Löst Konflikte bei Tailwind-Klassen automatisch auf (z. B. `p-2` und `p-4` wird korrekt zu `p-4`).

### Layout & Mobile-First

-   **Mobile-First & Safe Area**: Das Layout ist primär für mobile Geräte konzipiert. `env(safe-area-inset-*)` wird genutzt, um sicherzustellen, dass UI-Elemente nicht von der "Notch" oder den Home-Indikatoren verdeckt werden.
-   **Dynamische Viewport-Höhe**: Die App passt die Höhe des Layouts dynamisch an den sichtbaren Bereich an, um Probleme mit mobilen Browser-UIs (z. B. Adressleiste) zu umgehen.

## 🏛️ Architektur

Die Anwendung ist als moderne Single-Page-Application (SPA) aufgebaut und folgt einer klaren, modularen Struktur.

-   **Einstiegspunkt**: `src/main.tsx` initialisiert die React-Anwendung.
-   **Routing (`src/app/router.tsx`)**: Verwendet `react-router-dom`, um die Seiten der Anwendung zu verwalten. Alle Seiten werden mittels `React.lazy()` dynamisch geladen (Code-Splitting), um die initiale Ladezeit zu minimieren.
-   **Business-Logik**: Die Kernlogik ist in wiederverwendbare React-Hooks ausgelagert (z. B. `src/hooks/useChat.ts`).
-   **API-Services (`src/api/`)**: Kapselt die Kommunikation mit externen APIs wie OpenRouter.
-   **Zustandsverwaltung**: Hauptsächlich über React-Hooks und Kontexte. Für die Persistierung von Daten wird `Dexie.js` (IndexedDB) verwendet.

```
src/
├── api/          # API-Clients (z.B. OpenRouter)
├── app/          # App-Setup: Router, Layouts, globale Kontexte
├── components/   # Wiederverwendbare UI-Komponenten
├── config/       # Statische Konfigurationen (Modelle, Feature-Flags)
├── hooks/        # Zentrale Business-Logik als React-Hooks
├── lib/          # Allgemeine Hilfsfunktionen (z.B. `cn`)
├── pages/        # Seiten/Views für das Routing
├── services/     # Gekapselte Browser-APIs (z.B. Storage)
├── styles/       # Globale Styles und Design-Tokens
└── types/        # Globale TypeScript-Typdefinitionen
```

## 🛠️ Tech-Stack

| Kategorie | Technologien & Begründung |
| --- | --- |
| **Framework** | **React, TypeScript, Vite**: Für eine moderne, typsichere und performante Entwicklungsumgebung. |
| **Styling** | **Tailwind CSS, Radix UI, Lucide Icons**: Utility-First-CSS, ungestylte barrierefreie Primitives und leichtgewichtige Icons. |
| **State & Routing** | **React Hooks, React Router, Dexie.js**: Lokaler State mit Hooks, Standard-SPA-Router und IndexedDB für Client-seitige Speicherung. |
| **PWA / Offline** | **Vite PWA Plugin (Workbox)**: Industriestandard zur Erstellung robuster Service Worker für Offline-Fähigkeiten. |
| **Unit-Testing** | **Vitest, Testing Library**: Schnelle, Vite-native Test-Engine für Unit-Tests. |
| **E2E-Testing** | **Playwright, @axe-core/playwright**: Zuverlässiges Browser-Testing mit integrierten Accessibility-Prüfungen. |
| **Code-Qualität** | **ESLint, Prettier, Husky, lint-staged**: Strikte Regeln für Code-Konsistenz, die automatisch vor jedem Commit erzwungen werden. |
| **Deployment** | **Cloudflare Pages**: Statisches Hosting mit CI/CD-Integration. |

## 🚀 Erste Schritte

### Voraussetzungen

-   **Node.js**: Version `>=20.19.0` (siehe `package.json`).
-   **npm**: Node Package Manager (wird mit Node.js installiert).

### Installation & Start

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
    Die Anwendung ist anschließend unter `http://localhost:5173` (oder einem anderen freien Port) erreichbar.

## 📜 Verfügbare Skripte

Die wichtigsten Skripte aus `package.json`:

| Befehl | Beschreibung |
| --- | --- |
| `npm run dev` | Startet den Vite-Entwicklungsserver mit Hot-Reloading. |
| `npm run build` | Erstellt einen optimierten Produktions-Build im `dist`-Ordner. |
| `npm run preview` | Startet einen lokalen Server, um den Produktions-Build zu testen. |
| `npm run typecheck` | Überprüft das Projekt auf TypeScript-Fehler. |
| `npm run lint` | Führt ESLint aus, um Code-Stil-Probleme zu finden. |
| `npm run test:unit` | Führt alle Unit-Tests mit Vitest aus. |
| `npm run e2e` | Führt alle End-to-End-Tests mit Playwright aus. |
| `npm run verify` | Führt `typecheck`, `lint` und `test:unit` nacheinander aus (CI-Skript). |

## 🧪 Qualitätssicherung & Testing

-   **Unit-Tests (`src/**/__tests__`)**: Fokussieren sich auf die Business-Logik in Hooks und kritische Utility-Funktionen.
-   **End-to-End-Tests (`tests/e2e`)**: Simulieren vollständige Nutzer-Flows wie das Senden einer Nachricht oder das Ändern von Einstellungen. Sie mocken alle Netzwerk-Anfragen, um unabhängig und deterministisch zu sein.
-   **Barrierefreiheit**: `@axe-core/playwright` ist in die E2E-Tests integriert, um bei jedem Testlauf automatische Accessibility-Prüfungen durchzuführen.

## ☁️ Build & Deployment

Der Build-Prozess wird durch Vite gesteuert und ist für Cloudflare Pages optimiert.

-   **Befehl**: `npm run build`
-   **Output**: Das `dist`-Verzeichnis, bereit für statisches Hosting.
-   **CI/CD**: Das Repository ist für Deployments über Cloudflare Pages konfiguriert. Jeder Push auf den `main`-Branch löst einen neuen Build und ein Deployment aus.

## 🤝 Contributing

-   **Commit-Konvention**: Das Projekt folgt der **Conventional Commits** Spezifikation.
-   **Entwicklungsmodell**: Es wird ein **Trunk-Based Development**-Modell mit kurzlebigen Feature-Branches verfolgt.
-   **Versionsverwaltung**: Das Projekt nutzt Changesets für eine systematische Verwaltung von Versionsänderungen.

## 📜 Lizenz

Dieses Projekt ist privat und urheberrechtlich geschützt. Eine Weitergabe, Vervielfältigung oder Modifikation des Quellcodes ist ohne ausdrückliche schriftliche Zustimmung des Autors nicht gestattet.
