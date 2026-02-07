# Disa AI – Architektur

Diese Dokumentation beschreibt die technische Architektur der Anwendung für Entwickler.

---

## Übersicht

Disa AI ist eine **Single-Page-Application (SPA)** mit folgender Grundstruktur:

```
┌──────────────────────────────────────────────────────────┐
│                      Browser                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  React App (Vite)                                   │ │
│  │  ├─ Router (React Router v7)                        │ │
│  │  ├─ Contexts (Settings, Toast, Studio)              │ │
│  │  ├─ Pages (lazy-loaded)                             │ │
│  │  └─ Components                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Browser Storage                                    │ │
│  │  ├─ sessionStorage (API-Key)                        │ │
│  │  ├─ localStorage (Settings, Favorites)              │ │
│  │  └─ IndexedDB (Chat-Verlauf)                        │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Service Worker (PWA)                               │ │
│  │  └─ Workbox (Caching, Offline)                      │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────┐
│  OpenRouter API                                           │
│  └─ /api/v1/chat/completions (Streaming)                 │
└──────────────────────────────────────────────────────────┘
```

---

## Verzeichnisstruktur

```
src/
├── api/                 # Externe API-Aufrufe
│   └── openrouter.ts    # OpenRouter Chat-Streaming
│
├── app/                 # App-Setup
│   ├── router.tsx       # Route-Definitionen
│   ├── components/      # App-Shell-Komponenten
│   │   ├── RouteWrapper.tsx
│   │   ├── AnimatedLogo.tsx
│   │   └── BrandWordmark.tsx
│   └── contexts/        # Globale Provider
│
├── components/          # UI-Komponenten
│   ├── ui/             # Basis-Komponenten (Button, Card, Dialog, etc.)
│   ├── chat/           # Chat-spezifisch (ChatMessage, ChatComposer, etc.)
│   ├── models/         # Modell-Explorer
│   ├── roles/          # Rollen-Verwaltung
│   ├── navigation/     # Navigation, Sidepanel
│   └── layout/         # Layout-Komponenten
│
├── config/              # Konfiguration
│   ├── defaults.ts      # Storage-Keys, Konstanten
│   ├── env.ts           # Umgebungsvariablen (Zod-validiert)
│   ├── models.ts        # Modell-Katalog-Laden
│   ├── roleStore.ts     # Persona-Laden
│   ├── flags.ts         # Feature-Flags
│   └── settings.ts      # Settings-Schema
│
├── contexts/            # React Contexts
│   ├── SettingsContext.tsx
│   └── ToastContext.tsx
│
├── hooks/               # Business-Logik
│   ├── useChat.ts       # Kernlogik Chat + Streaming
│   ├── useSettings.ts   # Settings-Management
│   ├── useMemory.ts     # Kontext-/Gedächtnis-Logik
│   └── useConversationManager.ts
│
├── lib/                 # Framework-unabhängige Utilities
│   ├── errors/          # Error-Typen, Error-Mapping
│   ├── net/             # Netzwerk-Utilities (fetchTimeout, etc.)
│   ├── openrouter/      # API-Key-Management
│   ├── pwa/             # Service-Worker-Registration
│   ├── storage/         # Storage-Wrapper (safeStorage)
│   └── utils/           # Allgemeine Helfer
│
├── pages/               # Seiten-Komponenten
│   ├── Chat.tsx
│   ├── ModelsPage.tsx
│   ├── RolesPage.tsx
│   ├── SettingsOverviewPage.tsx
│   └── ...
│
├── services/            # Browser-API-Wrapper
│   └── storage.ts       # IndexedDB, localStorage Abstraktionen
│
├── state/               # State-Reducer
│   └── chatReducer.ts   # Chat-State-Management
│
├── styles/              # CSS
│   ├── design-tokens.css # CSS-Variablen
│   ├── index.css         # Tailwind-Imports
│   └── DESIGN_SYSTEM.md  # Dokumentation
│
└── types/               # TypeScript-Typen
    ├── chat.ts
    ├── models.ts
    └── settings.ts
```

---

## Einstiegspunkte

### `src/main.tsx`

Initialisiert React und rendert die App in das DOM.

### `src/App.tsx`

- Importiert globale Styles
- Setzt Provider (Settings, Toast, etc.)
- Korrigiert Viewport-Höhe (`--vh`)
- Rendert Router und App-Layout

### `src/app/router.tsx`

- Definiert alle Routen mit `react-router-dom`
- Alle Seiten sind lazy-loaded (`React.lazy()`)
- `RouteWrapper` umhüllt jede Seite mit Layout

---

## Kernflüsse

### Chat-Lebenszyklus

```
1. User tippt Nachricht in ChatComposer
   │
2. Enter → useChat.append(message)
   │
3. chatReducer: Fügt User-Nachricht hinzu, isLoading = true
   │
4. api/openrouter.ts: chatStream()
   │  ├─ Liest API-Key aus sessionStorage
   │  ├─ Baut Request (Model, Messages, System-Prompt)
   │  └─ Sendet POST an OpenRouter
   │
5. Response: NDJSON-Stream (Server-Sent Events)
   │
6. useChat: Verarbeitet Stream-Chunks
   │  └─ Fügt Text-Deltas zur Assistant-Nachricht hinzu
   │
7. Stream endet ([DONE])
   │
8. chatReducer: isLoading = false
   │
9. Speichert Gespräch in IndexedDB
```

### Modell-Katalog laden

```
1. App startet
   │
2. config/models.ts: loadModelCatalog()
   │  ├─ Parallel: OpenRouter /models API
   │  └─ Parallel: public/models_metadata.json (kuratierte Metadaten)
   │
3. Filtert: Nur kostenlose Modelle (:free oder Preis=0)
   │
4. Merged: API-Daten + Metadaten (Beschreibungen, Quality-Scores)
   │
5. Ergebnis: ModelCatalog mit allen verfügbaren Modellen
```

### Persona/Rolle laden

```
1. App startet
   │
2. config/roleStore.ts: loadRoles()
   │  └─ Fetch: public/persona.json
   │
3. Ergebnis: Array von Personas mit id, name, system (Prompt)
   │
4. Optional: allow-Array schränkt nutzbare Modelle ein
```

---

## State-Management

### Lokaler State (Hooks)

Die meiste State-Logik liegt in React Hooks:

| Hook | Zweck |
|------|-------|
| `useChat` | Chat-State, Streaming, Error-Handling |
| `useSettings` | User-Settings, Persistenz |
| `useMemory` | Kontext-Länge, Gedächtnis |
| `useConversationManager` | Gespräche speichern/laden |

### Globaler State (Contexts)

| Context | Zweck |
|---------|-------|
| `SettingsContext` | Globale Settings |
| `ToastContext` | Benachrichtigungen |

### Reducer

`chatReducer` verwaltet den Chat-State mit Actions wie:
- `ADD_MESSAGE` - Fügt neue Nachricht hinzu
- `UPDATE_MESSAGE` - Aktualisiert bestehende Nachricht (z.B. streaming chunks)
- `SET_MESSAGES` - Ersetzt alle Nachrichten
- `SET_LOADING` - Setzt loading state
- `SET_ERROR` - Setzt error state

**Performance-Optimierung:** Der Reducer cached den Index der aktuell streamenden Assistant-Message (`currentAssistantMessageIndex`), um O(1) Updates statt O(n) Array-Reverse bei jedem Chunk zu ermöglichen.

---

## API-Integration

### OpenRouter (`src/api/openrouter.ts`)

**Hauptfunktionen:**

```typescript
// Chat mit Streaming
chatStream(messages, options): AsyncIterable<StreamChunk>

// Modelle abrufen
getRawModels(): Promise<OpenRouterModel[]>
```

**Authentifizierung:**
- API-Key aus `sessionStorage` (`disa_api_key`)
- HTTP-Header: `Authorization: Bearer <key>`

**Streaming:**
- Response ist `text/event-stream` (NDJSON)
- Jede Zeile: `data: {"choices": [{"delta": {"content": "..."}}]}`
- Ende: `data: [DONE]`

### Error-Handling

Errors werden in `src/lib/errors/` typisiert:

| Error | Bedeutung |
|-------|-----------|
| `RateLimitError` | OpenRouter Rate-Limit erreicht |
| `AuthenticationError` | API-Key ungültig |
| `NetworkError` | Keine Verbindung |
| `APIError` | Allgemeiner API-Fehler |

Bei `RateLimitError` wird eine Cooldown-Periode erzwungen.

---

## Speicherung

### sessionStorage

| Key | Inhalt |
|-----|--------|
| `disa_api_key` | OpenRouter API-Key |

### localStorage

| Key | Inhalt |
|-----|--------|
| `disa_settings_v1` | User-Settings (JSON) |
| `disa:favorites-data` | Favorisierte Rollen |
| `disa:theme-preference` | Dark/Light-Mode |

### IndexedDB (Dexie)

| Table | Inhalt |
|-------|--------|
| `conversations` | Chat-Verläufe |
| `messages` | Einzelne Nachrichten |

---

## Design-System

### Token-Hierarchie

```
CSS-Variablen (design-tokens.css)
        │
        ▼
Tailwind-Config (tailwind.config.ts)
        │
        ▼
Komponenten-Varianten (class-variance-authority)
        │
        ▼
UI-Komponenten (src/components/ui/)
```

### Wichtige Token-Kategorien

- **Farben**: `--color-*`, `--bg-*`, `--fg-*`
- **Abstände**: `--spacing-*` (8px-Grid)
- **Radien**: `--radius-*` (sm, md, lg, xl)
- **Schatten**: `--shadow-*`
- **Typography**: `--font-*`, `--text-*`

### Komponenten-Varianten

Komponenten nutzen `class-variance-authority` (CVA) für typsichere Varianten:

```typescript
// Beispiel: Button
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-white",
      destructive: "bg-destructive text-white",
      ghost: "hover:bg-accent",
    },
    size: {
      sm: "h-8 px-3",
      md: "h-10 px-4",
      lg: "h-12 px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

---

## PWA

### Service Worker

- Generiert durch `vite-plugin-pwa` (Workbox)
- Caching-Strategien:
  - **NetworkFirst**: HTML-Dokument
  - **StaleWhileRevalidate**: JS, CSS, Bilder
- Offline-Fallback: `public/offline.html`

### Manifest

`public/manifest.webmanifest` definiert:
- App-Name, Icons
- Start-URL, Display-Mode
- Theme-Color, Background-Color

### Update-Flow

1. Neuer Service Worker wird im Hintergrund geladen
2. `workbox-window` erkennt Update
3. Banner erscheint: "Update verfügbar"
4. User klickt → `skipWaiting()` → Seite neu laden

---

## Build & Bundling

### Vite-Konfiguration

`vite.config.ts` konfiguriert:
- React-Plugin
- PWA-Plugin
- Asset-Optimierung (Splitting, Hashing)
- Aliases (`@/` → `src/`)

### Build-Output

```
dist/
├── index.html
├── assets/
│   ├── js/          # Gebundelte JS-Chunks
│   ├── css/         # Styles
│   └── images/      # Optimierte Bilder
├── manifest.webmanifest
├── sw.js            # Service Worker
└── _headers         # Cloudflare Headers
```

### Prebuild-Scripts

1. `scripts/build-info.js` – Generiert Build-Metadaten
2. `scripts/generate-tokens.mjs` – CSS-Token-Generierung

### Postbuild-Scripts

1. `scripts/generate-routes.js` – Generiert Routen-Manifest
2. `scripts/verify-dist.mjs` – Prüft Build-Integrität

---

## Testing

### Unit-Tests (Vitest)

- Konfiguration: `vitest.config.ts`
- Tests in `src/__tests__/` oder `*.test.tsx` neben Dateien
- Mock-Umgebung: `happy-dom`

**Fokus:**
- Hooks (useChat, useSettings)
- Utilities (lib/)
- Reducer (chatReducer)

### E2E-Tests (Playwright)

- Konfiguration: `playwright.config.ts`
- Tests in `tests/e2e/`
- Device-Emulation: Pixel 7
- Accessibility: `@axe-core/playwright`

**Fokus:**
- Vollständige User-Flows
- Navigation
- Chat-Interaktionen

---

## Modul-Grenzen (Architektur-Regeln)

| Verzeichnis | Erlaubt | Verboten |
|-------------|---------|----------|
| `src/lib/**` | Pure Functions, Utilities | React-Imports |
| `src/hooks/**` | Business-Logik, Orchestrierung | Direktes Rendering |
| `src/components/**` | UI, Interaktion | Direkte Network/Storage-Zugriffe |
| `src/config/**` | Konfiguration, Env, Flags | Seiteneffekte |
| `src/app/**` | Shell, Router, Layouts | Business-Logik |

---

## Weiterführende Dokumentation

- [Konfiguration](CONFIG.md)
- [Design-System](../src/styles/DESIGN_SYSTEM.md)
- [Umgebungsvariablen](guides/ENVIRONMENT_VARIABLES.md)
