# Disa AI

Eine **mobile-only** AI-Chat-PWA mit **Dark-only** Design und Offline-Funktionalität. Speziell für deutsche Nutzer auf /Android optimiert.

## Features

### 🎯 Kernfunktionen

- **AI-Chat:** OpenRouter-Integration für verschiedene Sprachmodelle
- **Modell-Auswahl:** Durchsuchbare Modell-Bibliothek mit Filtern (Kostenlos, Coding, Performance)
- **Mobile-optimiert:** Touch-freundliche Bedienung mit 48px Mindest-Touch-Targets
- **Offline-first:** PWA mit Service Worker und Offline-Fallbacks

### 📱 Mobile-Only UX

- **:** Primary Target 390×844px Viewport
- **100dvh/100svh:** Modern Viewport Units für echte Fullscreen-UX
- **Visual Viewport API:** Intelligentes Keyboard-Handling ohne UI-Überlappung
- **Safe Area Insets:** Vollständige iOS-Notch und Android-Gesture-Navigation
- **Touch-Optimiert:** Minimum 44px Targets für komfortable Bedienung

### 🎨 Dark-Only Design System

- **Strict Dark Mode:** Kein Light-Theme, optimiert für Mobile-Nutzung
- **Glassmorphism UI:** Backdrop-Blur und transparente Overlays
- **Design Tokens:** TypeScript-basierte Token → CSS Custom Properties
- **Mobile Accessibility:** WCAG 2.1 AA + Touch-optimierte Focus-States

### 🔒 Security-First Architecture

- **Session-Only Storage:** API-Keys nur in sessionStorage, nie persistent
- **Client-Only:** Direkte OpenRouter-Integration, keine eigenen Server
- **Gehärtete Headers:** HSTS, CSP, Permissions-Policy (20+ APIs deaktiviert)
- **CI Security:** Secret-Scanning, Dependency-Audits, deterministische Builds

## Technologie-Stack

### Frontend

- **React 18.3.1** mit TypeScript
- **Vite 7.1.6** für Build & Development
- **Tailwind CSS 3.4.17** mit Design Token System
- **Radix UI** Primitives für Accessibility

### Mobile PWA

- **Service Worker** mit Build-ID basiertem deterministischen Caching
- **Native Installation** auf  für App-like Experience
- **Visual Viewport API** für perfektes Keyboard-Handling
- **Offline-First** mit intelligenten Fallbacks

### Entwicklung & Tests

- **TypeScript strict** mit noUncheckedIndexedAccess
- **ESLint flat config** mit Type-aware Rules
- **Vitest** für Unit Tests (87 Tests)
- **Playwright** für Mobile E2E Tests (iPhone 12 Pro Viewport) + Offline-Simulation

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

## Mobile Browser Support

### Primary Targets

- **Android Chrome:** 88+ (Android 8+)
- **Samsung Internet:** 15+ (Galaxy S10+)

### PWA Installation


- **Android:** Chrome → Menü → "App installieren" → Home Screen Icon
- **Features:** Offline-Modus, Push-Notifications, File-Sharing

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

### Mobile Performance

- **Optimierter Bundle:** Dependency-Bereinigung (-116 Pakete)
- **Lazy Loading:** Route-based Code Splitting
- **Service Worker:** Intelligentes Caching mit Build-ID Invalidation
- **Mobile-First:** 390×844px Viewport, Touch-optimierte Interaktionen

### Mobile-First Testing

- **Unit Tests:** Vitest mit MSW (87 Tests, offline-first)
- **E2E Tests:** Playwright Mobile-Szenarien
- **Real-World Tests:** Touch-Targets, Keyboard-Handling, Offline-Modi
- **Accessibility:** Mobile-optimierte a11y Tests mit @axe-core

## Lizenz

Dieses Projekt ist privat und nicht für öffentliche Nutzung bestimmt.

---

**Live Demo:** https://disaai.pages.dev/
**Repository:** Private GitHub Repository
