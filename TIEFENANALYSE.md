# Projektübersicht (Tiefenanalyse)

- **Projektname:** `disa-ai` (bestätigt aus `package.json`)
- **Zweck / Ziel:** Das Projekt ist eine hochgradig konfigurierbare, mobile-first KI-Chat PWA, die als Client für den **OpenRouter**-Dienst fungiert. Kernfunktionen sind die Auswahl verschiedener KI-Modelle und die Anwendung vordefinierter **Personas** (System-Prompts), um das Verhalten der KI zu steuern. Die App ist für eine performante und sichere Nutzung auf Mobilgeräten optimiert.
- **Aktueller Reifegrad:** **Produktionsnah / Professionell**. Die Code-Analyse bestätigt den hohen Reifegrad. Das Projekt nutzt eine vollumfängliche Toolchain mit automatisierten Checks (`lint-staged`, `husky`), ein ausgefeiltes Build-System mit Code-Splitting (`vite`), ein professionelles Release-Management (`changeset`) und eine sehr robuste API-Implementierung.

# Architektur & Aufbau

- **Gesamtstruktur des Repos:** Die Struktur ist sauber und folgt etablierten Konventionen für professionelle React-Projekte.
  - `src/`: Quellcode der Anwendung.
  - `public/`: Statische Assets und zentrale Konfigurations-JSONs.
  - `tests/`: E2E-Tests.
  - `scripts/`: Automatisierungs-Skripte für den Build-Prozess.

- **Beschreibung pro Hauptordner:**
  - `src/`: Die Unterteilung in `api`, `app`, `components`, `hooks`, `lib`, `pages`, `services`, `state`, `theme` und `types` zeigt eine klare Umsetzung von **Clean Architecture** und "Separation of Concerns".
  - `public/`: Enthält nicht nur PWA-Assets, sondern auch die zentralen Konfigurationsdateien `models.json` und `persona.json`, die das Kernverhalten der App steuern.

- **Verwendete Frameworks/Libs:**
  - **Core:** React 19, Vite, TypeScript.
  - **UI-Komponenten:** **Radix UI** (`@radix-ui/*`) wird als Basis für zugängliche, ungestylte UI-Primitive (Dialoge, Menüs, etc.) verwendet. Dies ist eine moderne und robuste Wahl.
  - **Styling:** **Tailwind CSS**, erweitert durch `class-variance-authority` und `tailwind-merge` für die Erstellung von Komponenten-Varianten. Ein token-basiertes Design-System wird aus `src/theme/tokens.ts` in die Tailwind-Konfiguration geladen.
  - **Routing:** `react-router-dom` mit konsequentem **Lazy Loading** für alle Seiten-Komponenten zur Optimierung der Ladezeit.
  - **State Management:** **Keine externe State-Management-Bibliothek** (wie Redux/Zustand). Der Zustand wird über Reacts Bordmittel (Hooks) und **React Context** (`StudioProvider` in `App.tsx`) verwaltet.
  - **Validierung:** `zod` wird für die Datenvalidierung eingesetzt.

- **Besondere Architekturmuster:**
  - **Token-basiertes Design-System:** Farben, Abstände, Schatten etc. sind in `src/theme/tokens.ts` zentral definiert und werden von Tailwind konsumiert.
  - **Robuster API-Client:** Der OpenRouter-Client in `src/api/openrouter.ts` ist sehr ausgereift und implementiert Timeouts, Retries, Concurrency-Management und sicheres API-Key-Handling.
  - **Mobile-Only Gate:** Die `<MobileOnlyGate>`-Komponente in `App.tsx` deutet darauf hin, dass die App primär oder ausschließlich für mobile Viewports gedacht ist.

# Module / Komponenten

- **Liste wichtiger Module/Komponenten:**
  - `SoftDepthSurface` (in `Glass.tsx`): Die zentrale UI-Komponente für das "Glassmorphism"- bzw. "Soft-Depth"-Design. Sie nutzt CSS-Variablen und bietet verschiedene Varianten (`subtle`, `standard`, `strong`). Der Dateiname `Glass.tsx` ist hier leicht irreführend.
  - `app/router.tsx`: Definiert alle Routen der Anwendung, inklusive Fallbacks und statischer Seiten wie Impressum/Datenschutz. Alle Seiten werden performant via `React.lazy` geladen.
  - `api/openrouter.ts`: Implementiert die gesamte Kommunikation mit der OpenRouter-API, inklusive `chatOnce` (für einzelne Anfragen) und `chatStream` (für Streaming-Antworten).
  - `state/StudioContext.tsx`: **VERMUTUNG:** Die zentrale Context-Implementierung, die den globalen Zustand der Anwendung (gewählte Persona, Modell, etc.) verwaltet.

# Daten- und API-Ebene

- **Externe Dienste:** **OpenRouter** ist der einzige externe KI-Dienst.
- **API-Client-Details:**
  - **Authentifizierung:** Der API-Key wird aus einem sicheren Speicher (`readApiKey()`) gelesen, nicht aus dem `localStorage`.
  - **Streaming:** Die `chatStream`-Funktion verarbeitet Server-Sent Events (SSE) korrekt, parst JSON-Payloads und erkennt das `[DONE]`-Signal.
  - **Resilienz:** `fetchWithTimeoutAndRetry` macht die Anfragen widerstandsfähig gegenüber Netzwerkproblemen. `chatConcurrency` verhindert Race Conditions bei schnellen, aufeinanderfolgenden Anfragen.
- **Relevante Konfigurationsdateien:**
  - `public/models.json`: Detaillierte Liste der verfügbaren KI-Modelle mit Namen, Beschreibungen und Preisen.
  - `public/persona.json`: **Herzstück der App-Funktionalität.** Definiert eine umfangreiche Liste von System-Prompts, die das Verhalten der KI steuern. Enthält diverse Personas von "Neutral" über "Jurist" bis hin zu expliziten NSFW-Rollen. Jede Persona kann auf bestimmte Modelle beschränkt sein.

# Aktueller Zustand / technische Schulden

- **DOPPELT / ÜBERLAPPEND:** **Komplexe CSS-Struktur.** In `App.tsx` und `main.tsx` werden **mindestens 9 verschiedene CSS-Dateien** importiert. Darunter Tailwind, `design-tokens.css`, `mobile-fixes.css`, `bottomsheet.css` und `theme/tokens.css` (mit "Fluent 2"-Bezug). Diese hohe Anzahl an globalen Stylesheets stellt eine **signifikante technische Schuld** dar. Es ist unklar, welche Regeln Vorrang haben und woher bestimmte Styles kommen. Dies erschwert die Wartung des Stylings erheblich.
- **INKONSISTENZ:** Die Komponente in `Glass.tsx` heißt intern `SoftDepthSurface`. Dies ist eine kleine, aber vermeidbare Inkonsistenz zwischen Dateiname und Komponentenname.
- **BEHOBEN (31.10.2025):** Die fehlerhafte Überschriften-Hierarchie in den Rollengittern wurde korrigiert (`src/pages/MobileStudio.tsx`, `src/components/studio/MobileRolesInterface.tsx`) und Icon-only-Buttons in Composer sowie Memory-Panel erhielten explizite `aria-labels` für Screenreader (`src/components/chat/ChatComposer.tsx`, `src/components/memory/MemoryPanel.tsx`).
- **BEHOBEN (31.10.2025):** Rollen werden nun zentral im `StudioContext` über `loadRoles()` aus dem RoleStore geladen; Komponenten greifen nicht mehr per Direkt-Import auf `persona.json` zu (`src/app/state/StudioContext.tsx`, `src/pages/MobileStudio.tsx`, `src/components/studio/MobileRolesInterface.tsx`).
- **Stärken (keine Schulden):**
  - **Hervorragendes Testing:** Umfassende Unit- und E2E-Tests.
  - **Strikte Code-Qualität:** ESLint, Prettier und TypeScript werden konsequent und automatisiert eingesetzt.
  - **Performante Architektur:** Lazy Loading, Code-Splitting und eine resiliente API-Schicht sind professionell umgesetzt.

# Für KI nutzbarer Kontext

- **Auflistung relevanter Dateien für spätere KI-Aufrufe (verfeinert):**
  1.  `public/persona.json` & `public/models.json`: Für Aufgaben, die das Verhalten oder die Auswahl der KI betreffen.
  2.  `src/state/StudioContext.tsx`: (Pfad verifizieren) Für Änderungen am globalen Zustand.
  3.  `src/api/openrouter.ts`: Für Anpassungen an der API-Logik.
  4.  **Die diversen CSS-Dateien** (`src/styles/*.css`, `src/theme/*.css`, `src/ui/base.css`): **KRITISCH** für jede Style-Anpassung. Eine Änderung an einer Stelle kann an anderer Stelle unerwartete Effekte haben.
  5.  `tailwind.config.ts` und `src/theme/tokens.ts`: Für Änderungen am Design-System.
  6.  `src/components/chat/...`: Für UI-Änderungen im Chat.
  7.  `package.json`: Um zu prüfen, ob neue Bibliotheken benötigt werden.

- **Hinweise für nachfolgende KI-Modelle:**
  - **"ACHTUNG bei Styles:** Das Projekt lädt viele globale CSS-Dateien. Bevor du CSS änderst, musst du die Hierarchie und die Auswirkungen auf andere Komponenten prüfen. Änderungen in `tailwind.config.ts` sind global, aber es gibt viele überschreibende, spezifische CSS-Regeln."
  - "Der globale Zustand wird über React Context (`StudioProvider`) verwaltet. Suche nach dem `useStudio()`-Hook, um auf den Zustand zuzugreifen oder ihn zu ändern."
  - "UI-Komponenten basieren auf Radix UI. Nutze die Radix-Dokumentation, wenn du grundlegende Funktionalität von Dialogen, Dropdowns etc. anpassen musst."
