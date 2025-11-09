# Disa AI

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/daydaylx/Disa_Ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.com/daydaylx/Disa_Ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/disa-ai?label=version&style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-Private-blue?style=for-the-badge)](#-lizenz)

**Disa AI** ist eine professionelle, mobile-first AI-Chat Progressive Web App (PWA), die mit React, Vite, TypeScript und Tailwind CSS entwickelt wurde. Die Anwendung ist speziell für eine optimale Darstellung auf mobilen Endgeräten konzipiert und zeichnet sich durch ein modernes Dramatic Neumorphism Design-System, eine robuste Codebasis und eine auf Sicherheit und Performance ausgerichtete Architektur aus.

---

## Inhaltsverzeichnis

- [🏛️ Architektur-Überblick](#️-architektur-überblick)
- [⚙️ Detaillierte Funktionsweise](#️-detaillierte-funktionsweise)
  - [Der Chat-Lebenszyklus](#der-chat-lebenszyklus)
  - [Komponenten-Architektur](#komponenten-architektur)
  - [Konfiguration & Feature Flags](#konfiguration--feature-flags)
  - [PWA und Offline-Fähigkeit](#pwa-und-offline-fähigkeit)
- [📱 Mobile Navigation & Swipe Gestures](#-mobile-navigation--swipe-gestures)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Erste Schritte](#-erste-schritte)
  - [Voraussetzungen](#voraussetzungen)
  - [Installation & Start](#installation--start)
- [📜 Verfügbare Skripte](#-verfügbare-skripte)
- [🧪 Qualitätssicherung & Testing](#-qualitätssicherung--testing)
- [☁️ Build & Deployment](#️-build--deployment)
- [🤝 Contributing](#-contributing)
- [📜 Lizenz](#-lizenz)

---

## 🎨 UI & Design System

Das Design der Anwendung ist auf ein modernes, konsistentes und performantes Nutzererlebnis ausgerichtet. Es basiert auf einem durchdachten System aus Design-Tokens, atomaren Komponenten und Utility-First-CSS.

### Design-Token-System

Das Fundament des Designs bildet ein zweistufiges Token-System:

1.  **CSS Custom Properties (`src/styles/design-tokens.css`)**: Hier werden alle grundlegenden Design-Entscheidungen als CSS-Variablen definiert. Dies umfasst Farben (`--color-primary`), Abstände (`--spacing-4`), Radien (`--radius-md`), Schatten und Schriftgrößen. Dieses Vorgehen zentralisiert die Design-Sprache und ermöglicht globale Änderungen an einer einzigen Stelle.

2.  **Tailwind-Konfiguration (`tailwind.config.ts`)**: Die Tailwind-Konfiguration konsumiert diese CSS-Variablen, um die Utility-Klassen zu erzeugen. Anstatt Werte hart zu kodieren, werden die Variablen referenziert:
    ```javascript
    // tailwind.config.ts
    theme: {
      extend: {
        colors: {
          primary: 'hsl(var(--primary))',
        },
        spacing: {
          4: 'var(--spacing-4)', // -> 16px
        }
      }
    }
    ```
    Dieses Vorgehen kombiniert die Flexibilität von Tailwind mit der Wartbarkeit eines zentralen Token-Systems.

### Komponenten-Bibliothek (`src/components/ui`)

Die Anwendung verfügt über eine eigene, wiederverwendbare Komponenten-Bibliothek, die auf folgenden Prinzipien basiert:

- **Headless-Komponenten von Radix UI**: Für komplexe UI-Elemente wie Dialoge, Dropdowns oder Checkboxen wird Radix UI als ungestylte, barrierefreie Basis verwendet. Dies trennt die Logik und das State-Management der Komponente von ihrem Aussehen.
- **Styling mit `class-variance-authority`**: Jede Komponente (z.B. `button.tsx`) verwendet `cva` um verschiedene Varianten (z.B. `variant: 'default' | 'destructive'`) und Größen (`size: 'sm' | 'lg'`) zu definieren. Dies erzeugt eine typsichere API zur Erstellung konsistenter UI-Elemente.
- **Klassen-Management mit `cn` (`src/lib/cn.ts`)**: Eine kleine Hilfsfunktion, die `clsx` und `tailwind-merge` kombiniert. Sie ermöglicht das bedingte Zusammenfügen von Klassen und löst Konflikte bei Tailwind-Klassen automatisch auf (z.B. `p-2` und `p-4` wird korrekt zu `p-4`).

### Styling & Layout

- **UI-Grundsätze**: Ein klares, reduziertes Design-System mit maximaler Funktionalität und dramatischen neumorphen Effekten. Das Dramatic Neumorphism Design-System verwendet tiefe, mehrschichtige Schatten und erhabene Oberflächen für eine taktile, dreidimensionale Benutzererfahrung mit konsistenten Abständen und Farben.
- **Mobile-First & Safe Area**: Das Layout ist primär für mobile Geräte konzipiert. `env(safe-area-inset-*)` wird in der Tailwind-Konfiguration genutzt, um sicherzustellen, dass UI-Elemente nicht von der "Notch" oder den Home-Indikatoren auf iOS- und Android-Geräten verdeckt werden.
- **Dynamische Viewport-Höhe**: `App.tsx` enthält eine Logik, die die tatsächliche sichtbare Höhe des Viewports (`window.visualViewport.height`) misst und als CSS-Variable (`--vh`) setzt. Dies löst das klassische Problem auf mobilen Browsern, bei dem die Adressleiste die `100vh`-Einheit verfälscht.

## 📱 Mobile Navigation & Swipe Gestures

Die Anwendung verfügt über eine optimierte mobile Navigation mit einem rechtsseitigen Sidepanel, das durch intuitive Gesten gesteuert werden kann:

### Öffnen des Panels

- **Edge-Swipe (Mobil)**: Wische vom rechten Bildschirmrand (innerhalb von 20px) nach links, um das Navigations-Panel zu öffnen. Die Geste benötigt mindestens 40px horizontale Bewegung und respektiert eine vertikale Toleranz von 30px, um nicht mit Scroll-Gesten zu kollidieren.
- **Menu-Button (Desktop/Mobil)**: Tippe auf das Menu-Icon in der rechten oberen Ecke.
- **Tastatur**: Navigiere mit Tab zum Menu-Button und drücke Enter oder Space.

### Schließen des Panels

- **Swipe nach links**: Wische das geöffnete Panel nach links.
- **Schließen-Button**: Tippe auf das X-Icon im Panel-Header.
- **Backdrop-Klick**: Tippe auf den abgedunkelten Bereich außerhalb des Panels.
- **Escape-Taste**: Drücke Escape zum Schließen (Tastatur-Barrierefreiheit).

### Technische Details

- **Edge-Detection**: 20px breiter, unsichtbarer Touch-Bereich am rechten Rand
- **Scroll-Sicherheit**: Vertikales Scrolling bleibt unbeeinträchtigt
- **Browser-Kompatibilität**: Getestet auf iOS Safari und Android Chrome
- **Barrierefreiheit**: WCAG 2.1 AA konform, vollständige Tastaturnavigation, Screen-Reader-Unterstützung
- **Performance**: GPU-beschleunigte Animationen, respektiert `prefers-reduced-motion`

Für detaillierte Informationen siehe [docs/MOBILE_NAVIGATION.md](docs/MOBILE_NAVIGATION.md).

## 🏛️ Architektur-Überblick

- [🏛️ Architektur-Überblick](#️-architektur-überblick)
- [🎨 UI & Design System](#-ui--design-system)
- [⚙️ Detaillierte Funktionsweise](#️-detaillierte-funktionsweise)

Die Anwendung ist als moderne Single-Page-Application (SPA) aufgebaut und folgt einer klaren, modularen Struktur, um Wartbarkeit und Erweiterbarkeit zu gewährleisten.

- **Einstiegspunkt**: `src/main.tsx` initialisiert die React-Anwendung und bindet sie in das DOM ein.
- **Hauptkomponente (`src/App.tsx`)**: Diese Komponente ist verantwortlich für das globale Setup, einschließlich:
  - Import globaler CSS-Dateien und Design-Tokens.
  - Einrichtung von Providern für Kontexte (z.B. `StudioProvider`, `ToastsProvider`).
  - Implementierung eines Mobile-Gates (`MobileOnlyGate`), um die Nutzung auf Desktops einzuschränken.
  - Dynamische Anpassung der Viewport-Höhe (`--vh`) zur Behebung von Layout-Problemen auf mobilen Geräten mit virtuellen Tastaturen.
- **Routing (`src/app/router.tsx`)**: Verwendet `react-router-dom` v6, um die verschiedenen Seiten der Anwendung zu verwalten. Alle Seiten werden mittels `React.lazy()` dynamisch geladen (Code-Splitting), um die initiale Ladezeit zu minimieren. Ein `Suspense`-Fallback sorgt für eine Ladeanzeige.
- **Business-Logik**: Die Kernlogik ist in wiederverwendbare React-Hooks ausgelagert (z.B. `src/hooks/useChat.ts`), die den Zustand und die Interaktionen verwalten.
- **UI-Komponenten**: Ein System aus atomaren und zusammengesetzten Komponenten in `src/components/`, das auf `Radix UI` für Barrierefreiheit und `Tailwind CSS` für das Styling setzt.

```
src/
├── api/          # Externe API-Aufrufe (z.B. OpenRouter)
├── app/          # App-Setup: Router, Layouts, globale Kontexte
├── components/   # Wiederverwendbare UI-Komponenten (atomar & zusammengesetzt)
├── config/       # Statische Konfiguration: Modelle, Prompts, Feature-Flags
├── hooks/        # Zentrale Business-Logik (z.B. useChat, useMemory)
├── lib/          # Allgemeine, framework-unabhängige Hilfsfunktionen
├── pages/        # Ansichten für einzelne Routen (z.B. Chat, Settings)
├── services/     # Hintergrunddienste und Kapselung von Browser-APIs
├── state/        # Globales Zustandsmanagement (falls über Hooks hinausgehend)
└── types/        # Globale TypeScript-Typdefinitionen
```

## ⚙️ Detaillierte Funktionsweise

### Der Chat-Lebenszyklus

Der Prozess von der Nutzereingabe bis zur Anzeige der KI-Antwort ist eine zentrale Funktion und folgt diesem Ablauf:

1.  **Eingabe**: Der Nutzer tippt eine Nachricht in die `ChatComposer`-Komponente (`src/components/chat/ChatComposer.tsx`). Der Zustand der Eingabe wird lokal verwaltet.
2.  **Senden**: Bei Klick auf "Senden" oder Drücken der Enter-Taste wird die `append`-Funktion aus dem `useChat`-Hook (`src/hooks/useChat.ts`) aufgerufen.
3.  **Zustands-Update im Hook**: `useChat` fügt die neue Nutzernachricht sofort zum Nachrichten-Array hinzu und setzt den `isLoading`-Status auf `true`. Dies sorgt für eine sofortige UI-Rückmeldung.
4.  **API-Anfrage**: Der Hook ruft die `chatStream`-Funktion in `src/api/openrouter.ts` auf. Zuvor werden die Nachrichten-Historie und ein optionaler System-Prompt vorbereitet.
5.  **Authentifizierung & Fetch**: `openrouter.ts` liest den API-Schlüssel aus dem `sessionStorage` (via `src/lib/openrouter/key.ts`), konstruiert die Header und sendet eine `POST`-Anfrage mit `fetch` an die OpenRouter-API. Die Anfrage nutzt einen `AbortController` zur Abbruchsteuerung.
6.  **Streaming-Verarbeitung**: Die Antwort der API ist ein `NDJSON` (Newline Delimited JSON) Stream. `chatStream` liest diesen Stream Stueck für Stueck:
    - Jede Zeile ist ein JSON-Objekt, das ein Text-Delta enthält.
    - Der Hook `useChat` erhält diese Deltas und aktualisiert die letzte (assistenteigene) Nachricht in Echtzeit, was den "Tipp"-Effekt erzeugt.
7.  **Abschluss & Fehlerbehandlung**:
    - Wenn der Stream mit `[DONE]` endet, wird der `isLoading`-Status auf `false` gesetzt.
    - Fehler (z.B. Netzwerkprobleme, Rate-Limits) werden in `src/lib/errors` abgebildet und im UI-Zustand gespeichert, um dem Nutzer eine verständliche Fehlermeldung anzuzeigen. `RateLimitError` wird speziell behandelt, um eine Cooldown-Periode zu erzwingen.

### Komponenten-Architektur

Die UI ist aus kleinen, wiederverwendbaren Bausteinen aufgebaut.

- **`ChatComposer.tsx`**: Eine kontrollierte Komponente, die das Eingabefeld sowie Senden/Stopp-Logik kapselt (z. B. Enter-Verhalten, Sperren während laufender Streams).
- **`MobileModelsInterface.tsx`**: Das mobile Modell-Explorer-Interface lädt den Katalog (`src/config/models.ts`), bietet Filter/Sortier-Funktionen und virtualisiert lange Listen.
- **`ChatMessage.tsx`**: Rendert Chatnachrichten inklusive Inline-Code-Blöcken mit Syntax-Highlighting und Kopierfunktion.
- **Primitives (`src/components/ui/`)**: Basis-Komponenten wie `Button`, `Card`, `Input` etc. basieren auf `Radix UI` für maximale Barrierefreiheit und werden mit `tailwind-merge` und `clsx` für flexibles Styling erweitert.

### Konfiguration & Personas

Die Anwendung ist hochgradig konfigurierbar, um Flexibilität und einfache Wartung zu gewährleisten. Die Konfiguration ist auf mehrere Dateien im `src/config/`-Verzeichnis und öffentliche JSON-Dateien aufgeteilt.

- **Statische Konstanten (`src/config/defaults.ts`)**
  Diese Datei ist die "Single Source of Truth" für alle hartkodierten Werte, die an mehreren Stellen in der App verwendet werden. Sie verhindert "magische Strings" und erleichtert globale Änderungen.
  - `STORAGE_KEYS`: Legt die exakten Namen für Schlüssel im `sessionStorage` und `localStorage` fest (z.B. `disa_api_key`, `disa_settings_v1`).
  - `REQUEST_CONFIG` & `APP_CONFIG`: Enthalten Timeout-/Retry-Defaults sowie Präfixe und Versionsangaben für gespeicherte Daten.

- **Umgebungsvariablen (`src/config/env.ts`)**
  Diese Datei ist für die Verarbeitung von Build-Zeit-Variablen zuständig, die über eine `.env`-Datei oder den Build-Prozess bereitgestellt werden (alle mit `VITE_` Präfix).
  - **Validierung mit Zod**: Ein `zod`-Schema definiert, welche Variablen erwartet werden, welchen Typ sie haben und was ihre Standardwerte sind.
  - **Typensicherheit**: Nach der Validierung steht ein stark typisiertes `EnvConfig`-Objekt zur Verfügung.
  - **Beispiele**: `VITE_OPENROUTER_BASE_URL`, `VITE_ENABLE_ANALYTICS` (wird von einem String zu einem Boolean transformiert), `VITE_BUILD_ID`.

- **Feature Flags (`src/config/featureFlags.ts`)**
  Ermöglicht das Umschalten von Funktionen zur Laufzeit, ohne einen neuen Build zu benötigen. Die Zustände werden im `localStorage` gespeichert und können von Entwicklern manuell geändert werden.
  - `getPreferRolePolicy()` / `setPreferRolePolicy()`: Steuert, ob die Sicherheits-Policy einer Rolle die Modellauswahl einschränken soll.
  - `getVirtualListEnabled()` / `setVirtualListEnabled()`: Aktiviert/deaktiviert die Virtualisierung der Modell-Liste.

- **Modell-Katalog (`src/config/models.ts`)**
  Diese Datei enthält die komplexe Logik zum Laden, Filtern und Aufbereiten der verfügbaren KI-Modelle.
  - `loadModelCatalog()`: Ruft die Rohdaten von der OpenRouter-API ab, filtert sie anhand einer erlaubten Liste (`styles.json`) und reichert sie mit benutzerfreundlichen deutschen Beschreibungen an.
  - `GERMAN_DESCRIPTIONS`: Ein großes Mapping, das den oft kryptischen API-Beschreibungen verständliche deutsche Erklärungen zuweist.
  - **Fallback-Logik**: Falls die API nicht erreichbar ist, gibt es mehrere Fallback-Ebenen, bis hin zu einer statischen Notfall-Liste, um die Funktionsfähigkeit der App sicherzustellen.

- **Personas / Rollen (`public/persona.json`)**
  Eine zentrale JSON-Datei, die die verschiedenen "Persönlichkeiten" definiert, die die KI annehmen kann.
  - **Struktur**: Jede Persona hat eine `id`, einen `name` und einen `system`-Prompt, der das Verhalten der KI steuert.
  - **Modell-Einschränkungen**: Optional kann ein `allow`-Array von Modell-IDs angegeben werden, um sicherzustellen, dass eine Persona nur mit geeigneten Modellen verwendet wird (z.B. unzensierte Personas nur mit unzensierten Modellen).

### PWA und Offline-Fähigkeit

Die Anwendung ist als Progressive Web App konzipiert, um eine native-ähnliche Erfahrung zu bieten.

- **Service Worker (`public/sw.js`)**: Ein manuell konfigurierter Service Worker, der auf Workbox basiert. Er implementiert Caching-Strategien, um die App offline verfügbar zu machen:
  - **Network-First** für das Haupt-HTML-Dokument: Versucht immer, die neueste Version vom Server zu laden. Wenn das fehlschlägt, wird die zwischengespeicherte Version ausgeliefert.
  - **Stale-While-Revalidate** für Assets (JS, CSS, Bilder): Liefert sofort die zwischengespeicherte Version aus (schnelle Ladezeit) und versucht im Hintergrund, eine neue Version zu laden.
  - Eine `offline.html` Seite wird als Fallback angezeigt, wenn weder Netzwerk noch Cache verfügbar sind.
- **Manifest (`public/manifest.webmanifest`)**: Definiert App-Name, Icons, Start-URL und Display-Modus, damit die App zum Startbildschirm hinzugefügt werden kann.
- **Build-Integration (`vite.config.ts`)**: Das `VitePWA`-Plugin wird verwendet, um den Service Worker zu bauen und das Precache-Manifest (eine Liste aller zu cachenden Assets) automatisch zu injizieren.

## 🛠️ Tech Stack

| Kategorie           | Technologien & Begründung                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**       | **React 19, TypeScript 5, Vite 7**: Für eine moderne, typsichere und performante Entwicklungsumgebung.                                                         |
| **Styling**         | **Tailwind CSS, Radix UI, Lucide Icons**: Utility-First-CSS für schnelles Prototyping; ungestylte, barrierefreie Primitives von Radix; leichtgewichtige Icons. |
| **State & Routing** | **React Hooks, React Router v6, Zod**: Lokaler State mit Hooks für Einfachheit; Standard-Router für SPAs; Schema-Validierung mit Zod für robuste Daten.        |
| **PWA / Offline**   | **Vite PWA Plugin (Workbox)**: Industriestandard zur Erstellung robuster Service Worker und Offline-Fähigkeiten.                                               |
| **Performance**     | **Virtualized Rendering**: Nachrichten-Virtualisierung für skalierbare Chat-Performance; Lazy Loading für optimierte Ladezeiten.                               |
| **Unit-Testing**    | **Vitest, Happy DOM, MSW**: Schnelle, Vite-native Test-Engine; leichtgewichtige DOM-Umgebung; Mocking von Netzwerk-Anfragen für stabile Tests.                 |
| **E2E-Testing**     | **Playwright, @axe-core/playwright**: Zuverlässiges Browser-Testing über mehrere Engines; integrierte Accessibility-Prüfungen.                                 |
| **Code-Qualität**   | **ESLint, Prettier, Husky, lint-staged**: Strikte Regeln für Code-Konsistenz, die automatisch vor jedem Commit erzwungen werden.                               |
| **Deployment**      | **Cloudflare Pages, Netlify**: Konfigurationen für beide Plattformen vorhanden, Fokus auf statisches Hosting mit CI/CD.                                        |

## 🚀 Erste Schritte

### Voraussetzungen

- **Node.js**: Version `^20.14.0` (siehe `.nvmrc` und `package.json`).
- **npm**: Node Package Manager (wird mit Node.js installiert).

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
    Die Anwendung ist anschließend unter `http://localhost:5173` erreichbar.

## 📜 Verfügbare Skripte

Die wichtigsten Skripte aus `package.json`:

| Befehl              | Beschreibung                                                                   |
| ------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`       | Startet den Vite-Entwicklungsserver mit Hot-Reloading.                         |
| `npm run build`     | Erstellt einen optimierten Produktions-Build im `dist`-Ordner.                 |
| `npm run preview`   | Startet einen lokalen Server, um den Produktions-Build zu testen.              |
| `npm run typecheck` | Überprüft das gesamte Projekt auf TypeScript-Fehler.                           |
| `npm run lint`      | Führt ESLint aus, um Code-Stil-Probleme zu finden.                             |
| `npm run test:unit` | Führt alle Unit-Tests mit Vitest aus.                                          |
| `npm run test:e2e`  | Führt alle End-to-End-Tests mit Playwright aus.                                |
| `npm run verify`    | Führt `typecheck`, `lint`, `test:unit` und `e2e` nacheinander aus (CI-Skript). |

## 🧪 Qualitätssicherung & Testing

- **Unit-Tests (`src/__tests__`)**: Fokussieren sich auf die Business-Logik in Hooks (z.B. Race-Conditions in `useChat`) und kritische Utility-Funktionen.
- **End-to-End-Tests (`tests/e2e`)**: Simulieren vollständige Nutzer-Flows wie das Senden einer Nachricht, das Ändern von Einstellungen und das Filtern von Modellen. Sie laufen auf einem emulierten "Pixel 7"-Gerät und mocken alle Netzwerk-Anfragen, um unabhängig und deterministisch zu sein.
- **Barrierefreiheit**: `axe-core` ist in die Playwright-Tests integriert, um bei jedem Testlauf automatische Accessibility-Prüfungen durchzuführen.

## ☁️ Build & Deployment

Der Build-Prozess wird durch `vite.config.ts` gesteuert.

- **Befehl**: `npm run build`
- **Output**: Das `dist`-Verzeichnis, bereit für statisches Hosting.
- **Asset-Struktur**: Vite generiert JS, CSS und andere Assets mit Hashes in den Dateinamen für effektives Caching. Die Konfiguration sortiert sie in untergeordnete Verzeichnisse (`assets/js`, `assets/css`, etc.).
- **CI/CD**: Das Repository enthält Konfigurationsdateien für Cloudflare Pages (`cloudflare-pages.json`) und Netlify (`netlify.toml`), die automatische Deployments bei Pushes auf den `main`-Branch ermöglichen. Sicherheitsheader aus `public/_headers` werden dabei automatisch übernommen.
- **GitHub Pages**: Für `disaai.de` sorgt `.github/workflows/pages.yml` dafür, dass auf `main` jede Änderung gebaut, samt `CNAME` und SPA-Fallback (`404.html`) in das `dist`-Artefakt kopiert und anschließend via `actions/deploy-pages` veröffentlicht wird.

## 🤝 Contributing

- **Commit-Konvention**: Das Projekt folgt der **Conventional Commits** Spezifikation.
- **Entwicklungsmodell**: Es wird ein **Trunk-Based Development**-Modell mit kurzlebigen Feature-Branches verfolgt.
- **Vorlagen**: Im `.github`-Verzeichnis befinden sich Vorlagen für Issues und Pull Requests.

## 📜 Lizenz

Dieses Projekt ist privat und urheberrechtlich geschützt. Eine Weitergabe, Vervielfältigung oder Modifikation des Quellcodes ist ohne ausdrückliche schriftliche Zustimmung des Autors nicht gestattet.
