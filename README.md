# Disa AI

Eine mobile-first AI-Chat-Anwendung mit Offline-Funktionalität und Dark-Theme. Optimiert für deutsche Nutzer auf mobilen Geräten.

## Features

### 🎯 Kernfunktionen

- **AI-Chat:** OpenRouter-Integration für verschiedene Sprachmodelle
- **Modell-Auswahl:** Durchsuchbare Modell-Bibliothek mit Filtern (Kostenlos, Coding, Performance)
- **Mobile-optimiert:** Touch-freundliche Bedienung mit 48px Mindest-Touch-Targets
- **Offline-first:** PWA mit Service Worker und Offline-Fallbacks

### 📱 Mobile UX

- **Responsives Design:** Optimiert für 390×844px (Mobile-first)
- **Visual Viewport API:** Intelligentes Keyboard-Handling ohne Composer-Überschneidung
- **Stick-to-Bottom:** Automatisches Scrollen bei neuen Nachrichten
- **Safe Area:** Vollständige Unterstützung für iOS-Notch und Android-Gesten

### 🎨 Design System

- **Dark-Only Theme:** Einheitliches dunkles Design ohne Theme-Switcher
- **Glassmorphism:** Backdrop-Blur und transluzente Oberflächen
- **Design Tokens:** Zentralisierte CSS Custom Properties
- **Accessibility:** WCAG 2.1 AA konforme Kontraste und Focus-Ringe

### 🔒 Sicherheit & Datenschutz

- **Session-Storage:** API-Keys werden nur temporär gespeichert
- **Keine Server:** Direkte Kommunikation mit OpenRouter
- **CSP-Headers:** Content Security Policy über Cloudflare
- **Secret Scanning:** TruffleHog-Integration in CI

## Technologie-Stack

### Frontend

- **React 18.3.1** mit TypeScript
- **Vite 7.1.6** für Build & Development
- **Tailwind CSS 3.4.17** mit Design Token System
- **Radix UI** Primitives für Accessibility

### PWA & Mobile

- **Service Worker** mit intelligentem Caching
- **Web App Manifest** mit deutschen Shortcuts
- **Visual Viewport API** für Keyboard-Handling
- **File & Protocol Handlers** für Deep Links

### Entwicklung & Tests

- **TypeScript strict** mit noUncheckedIndexedAccess
- **ESLint flat config** mit Type-aware Rules
- **Vitest** für Unit Tests (88 Tests)
- **Playwright** für E2E Tests mit Offline-Simulation

## Schnellstart

### Entwicklung

```bash
# Installation
npm ci

# Development Server (localhost:5173)
npm run dev

# Production Build
npm run build

# Preview Build (localhost:4173)
npm run preview
```

### Quality Assurance

```bash
# Alle Checks ausführen
npm run verify

# Einzelne Checks
npm run typecheck  # TypeScript
npm run lint       # ESLint (max 0 warnings)
npm run test:unit  # Unit Tests
npm run test:e2e   # E2E Tests
```

## Architektur

### Verzeichnisstruktur

```
src/
├── api/              # OpenRouter Client
├── app/              # Router & App Shell
├── components/       # Reusable UI Components
├── hooks/            # React Hooks (12+ hooks)
├── lib/              # Utilities & Error Handling
├── pages/            # Page Components (/chat, /models, /settings)
├── styles/           # Design Tokens & CSS
└── ui/               # UI Primitives & Views
```

### 3-Seiten-Architektur

- **`/chat`** - Hauptchat mit Model-Switcher und Streaming
- **`/models`** - Modellkatalog mit Filtern und Auswahl
- **`/settings`** - API-Key Management und PWA-Installation

### Error Handling

Strukturierte Error-Klassen für robuste Fehlerbehandlung:

- `TimeoutError` - Request Timeouts
- `RateLimitError` - API Rate Limits
- `NetworkError` - Connectivity Issues
- `AuthenticationError` - Invalid API Keys

## Deployment

### Cloudflare Pages

- **Platform:** Cloudflare Pages mit Git-Integration
- **Branch:** `main` für Production
- **Build:** `npm run build && npm run postbuild`
- **Cache:** Optimierte Cache-Headers in `public/_headers`

### Cache-Strategie

```
HTML:    no-store für index.html
Assets:  max-age=31536000 mit Hashing
SW:      Network-first für HTML, stale-while-revalidate
```

⚠️ **Cache-Purging:** Bei UI-Updates Cloudflare Cache manuell leeren für sofortige Updates.

## Browser-Unterstützung

### Minimum Requirements

- **Chrome/Edge:** 88+ (Visual Viewport API)
- **Safari:** 14+ (iOS 14+)
- **Firefox:** 91+

### PWA Features

- **Install Prompt:** Chrome/Edge Desktop & Mobile
- **iOS:** Manuelle Installation über Safari Teilen-Menü
- **Offline:** Vollständige Offline-Funktionalität

## API-Integration

### OpenRouter

- **Base URL:** `https://openrouter.ai/api/v1`
- **Authentication:** Bearer Token in sessionStorage
- **Models:** Automatischer Katalog-Download
- **Streaming:** NDJSON Response Handling

### Error Recovery

- Automatische Retry-Logik mit Exponential Backoff
- Graceful Degradation bei Network-Problemen
- User-freundliche Fehlermeldungen auf Deutsch

## Entwicklung

### Code Conventions

- **TypeScript strict mode** aktiviert
- **Functional Components** only
- **Import Sorting** via simple-import-sort
- **No hardcoded hex colors** (ESLint enforced)

### Performance

- **Bundle Splitting:** React, UI, Data, Markdown
- **Code Splitting:** Route-based mit React.lazy
- **Tree Shaking:** Optimierte Imports
- **Gzip Size:** ~190KB total

### Testing

- **Unit Tests:** Vitest mit MSW für API-Mocking
- **E2E Tests:** Playwright mit Offline-Simulation
- **Visual Tests:** Snapshot-basierte Regression Tests
- **A11y Tests:** @axe-core/playwright Integration

## Lizenz

Dieses Projekt ist privat und nicht für öffentliche Nutzung bestimmt.

---

**Live Demo:** https://disaai.pages.dev/
**Repository:** Private GitHub Repository
