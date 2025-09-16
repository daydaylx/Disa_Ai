Disa AI — Private KI-Chat PWA

Eine moderne, lokal konfigurierbare Chat-App für KI-Modelle mit verschiedenen Rollen (18+) und geringere Police. Fokus: klare UX, robuste Builds, reproduzierbares Deployment und nachvollziehbare Qualitätssicherung.

**Live:** https://disaai.pages.dev/  
**Repository:** https://github.com/daydaylx/Disa_Ai

> Stand: 13. September 2025

## ✅ Production Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-59%2F59-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-15.78%25-yellow)
![Security](https://img.shields.io/badge/security-compliant-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue)

**CI/CD Pipeline**: 8 Gates ✅ Setup → Secrets → Lint → Typecheck → Unit → E2E → Build → Deploy  
**Code Quality**: ESLint + Prettier automatisch enforced  
**Security**: sessionStorage-only, TruffleHog scanning, CSP headers  
**Testing**: Offline-first E2E mit Playwright, Unit Tests mit Vitest  
**Documentation**: [Vollständige Rescue-Dokumentation](docs/status/rescue-checklist.md)

---

## Inhaltsverzeichnis

1. [Ziele & Scope](#ziele--scope)
2. [Feature-Überblick](#feature-überblick)
3. [Technikstack](#technikstack)
4. [Projektstruktur](#projektstruktur)
5. [Lokale Entwicklung](#lokale-entwicklung)
6. [Sicherheit & API-Key-Flow](#sicherheit--api-key-flow)
7. [Umgebungsvariablen](#umgebungsvariablen)
8. [NPM-Skripte](#npm-skripte)
9. [Tests & Qualitätssicherung](#tests--qualitätssicherung)
10. [Styling & Designsystem](#styling--designsystem)
11. [Deployment (Cloudflare Pages)](#deployment-cloudflare-pages)
12. [Fehlervertrag & Error Handling](#fehlervertrag--error-handling)
13. [Contributing Guidelines](#contributing-guidelines)
14. [Architektur-Entscheidungen (ADRs)](#architektur-entscheidungen-adrs)
15. [Caching & Stale-Content vermeiden](#caching--stale-content-vermeiden)
16. [MCP/Agent-Setup (optional)](#mcpagent-setup-optional)
17. [Roadmap & interne Doks](#roadmap--interne-doks)
18. [Troubleshooting](#troubleshooting)
19. [Lizenz](#lizenz)

---

## Ziele & Scope

- **Privates KI-Chat-Frontend** für den Eigengebrauch, optimiert für Mobile und Desktop.
- **Einfaches Deployment** über Cloudflare Pages, Build-Output `dist/`.
- **Nüchterne Qualitätssicherung**: Type-Checks, Linting, Tests.
- **Bewusstes Designsystem** mit Token-First-Ansatz anstelle willkürlicher Farbcodes.

---

## Feature-Überblick

- Reaktionsschnelle **Chat-UI** mit moderner Dark-Theme-Basis.
- **Konfigurierbare Backends/Modelle** via `.env` bzw. Cloudflare Project-Vars.
- **Klare Build-Pipelines**: lokaler Dev-Server, Production-Build, optionaler Preview.
- **Qualitätssicherung**: TypeScript Typecheck, ESLint, Unit/E2E-Tests (siehe Skripte).
- **Stale-Content-Schutz**: Header/Cache-Regeln und deaktivierter SW zur Vermeidung alter App-Stände.

---

## Technikstack

- **Build:** Vite
- **UI:** React + TypeScript
- **Styles:** Tailwind CSS, CSS Custom Properties (Tokens)
- **Tests:** Vitest (Unit), Playwright (E2E)
- **CI:** GitHub Actions (Checks), Deployment via **Cloudflare Pages** (Git-Integration)

> Exakte Versionen bitte der `.nvmrc` und `package.json` entnehmen.

---

## Projektstruktur

Top-Level (Auszug):

```
.claude/             # Projektbezogene Vorgaben/Prompts für Agenten
.github/             # Workflows (CI)
.husky/              # Git Hooks
docs/                # Interne Dokumentation
e2e/                 # End-to-End Tests (Playwright)
ops/                 # Betriebs-/Scriptmaterial
public/              # Statische Public-Assets (inkl. _headers)
scripts/             # Node/Utility-Skripte (Build/Analyse)
src/                 # App-Quellcode (React/TS, Styles, Utilities)
tests/               # Unit-/Integrationstests (Vitest)
.env.example         # Vorlage für lokale Umgebungsvariablen
tailwind.config.ts   # Tailwind-Setup mit Token-Anbindung
vite.config.ts       # Vite-Build/Dev-Konfiguration
vitest.config.ts     # Test-Setup
```

Code kopieren

Hilfs-Markdowns (Auswahl) im Repo: `AGENTS.md`, `ANALYSIS.md`, `REFACTOR_PLAN.md`, `UX_FINDINGS.md`, `DEPENDENCIES.md`, `DEPLOYMENT_READINESS.md`. Diese dokumentieren Analyse- und Umbaupläne, UI-Befunde und Abhängigkeiten.

---

## Lokale Entwicklung

**Voraussetzungen**

- Node gemäß `.nvmrc`
- Ein Paketmanager (npm oder pnpm). Nutze den, für den ein Lockfile im Repo liegt.

**Setup**

```bash
# Repository klonen
git clone https://github.com/daydaylx/Disa_Ai.git
cd Disa_Ai

# Node-Version setzen (empfohlen)
# nvm use

# Abhängigkeiten installieren
npm ci          # oder: pnpm install

# .env anlegen
cp .env.example .env
# Variablen im .env ausfüllen (siehe nächsten Abschnitt)

# Entwicklung starten
npm run dev

# Production-Build
npm run build

# Lokaler Preview des Build-Outputs
npm run preview
```

---

## Sicherheit & API-Key-Flow

### 🔐 Sichere API-Key-Verwaltung

**Speicherung:**

- API-Keys werden **nur in sessionStorage** gespeichert (session-only, sicherer als localStorage)
- Automatische Migration von localStorage → sessionStorage bei App-Start
- Vollständige Löschung aus localStorage nach erfolgreicher Migration

**Key-Lifecycle:**

```typescript
// Key setzen (sessionStorage only)
writeApiKey("sk-your-key");

// Key abrufen (mit automatischer Migration)
const key = readApiKey();

// Alle Keys löschen (logout)
clearAllApiKeys();

// Key-Status prüfen
const hasKey = hasApiKey();
```

**Migration & Cleanup:**

- App migriert automatisch vorhandene localStorage-Keys zu sessionStorage
- Unterstützt mehrere Key-Kandidaten: `disa_api_key`, `openrouter_key`, `OPENROUTER_API_KEY`
- Keys werden bei Browser-Neustart automatisch gelöscht (session-only)

**Architektur-Entscheidung:** [ADR-0004: SessionStorage für API-Keys](docs/adr/0004-sessionStorage-api-keys.md)

### 🛡️ Security Headers

Strikte Sicherheitsrichtlinien via `public/_headers`:

**Content Security Policy (CSP):**

```
Content-Security-Policy: default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://openrouter.ai;
  worker-src 'self';
  manifest-src 'self';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self'
```

**Zusätzliche Sicherheits-Headers:**

- `X-Frame-Options: DENY` - Clickjacking-Schutz
- `X-Content-Type-Options: nosniff` - MIME-Type-Sniffing blockieren
- `Referrer-Policy: strict-origin-when-cross-origin` - Kontrollierte Referrer-Übertragung
- `X-XSS-Protection: 1; mode=block` - XSS-Schutz im Browser
- `Permissions-Policy` - Hardware-Zugriff (Kamera, Mikrofon, etc.) blockieren
- `Cross-Origin-Embedder-Policy: require-corp` - COEP-Schutz
- `Cross-Origin-Opener-Policy: same-origin` - COOP-Isolation

**Wichtig:** Keine `unsafe-inline` oder `unsafe-eval` Direktiven - alle Styles und Scripts werden über separate Dateien geladen für maximale Sicherheit.

### 🔍 Secret Scanning

CI-Pipeline mit TruffleHog zur Erkennung versehentlich commiteter Secrets:

- Scannt gesamte Git-History
- Bricht Build bei Secret-Fund ab
- Läuft vor allen anderen CI-Gates

---

## Umgebungsvariablen

**Lokale Entwicklung:**

```bash
# .env basierend auf .env.example anlegen
cp .env.example .env
# Variablen ausfüllen
```

**Typische Variablen:**

- `VITE_OPENROUTER_API_KEY` - OpenRouter API-Schlüssel
- `VITE_BASE_URL` - Basis-URL für Deployment
- `VITE_DEFAULT_MODEL` - Standard-Modell-ID

**Cloudflare Pages:**

- Setze dieselben Variablen als **Project Variables** in Cloudflare Dashboard
- **Wichtig:** Keine Secrets ins Repository commiten!

---

## NPM-Skripte

**Entwicklung:**

```bash
npm run dev          # Dev-Server starten (http://localhost:5173)
npm run build        # Production-Build in dist/
npm run preview      # Lokaler Preview von dist/ (http://localhost:4173)
```

**Qualitätssicherung:**

```bash
npm run typecheck    # TypeScript-Checks (alle tsconfig.*.json)
npm run lint         # ESLint auf gesamte Codebase
npm run lint:fix     # ESLint mit automatischen Fixes
npm run format       # Prettier check
npm run format:fix   # Prettier mit automatischen Fixes
npm run verify       # Typecheck + Lint + Unit Tests
```

**Tests:**

```bash
npm run test         # Unit Tests (Vitest watch mode)
npm run test:unit    # Unit Tests (single run)
npm run test:ci      # Unit Tests mit Coverage
npm run test:e2e     # E2E Tests (Playwright)
npm run test:e2e:ui  # E2E Tests mit UI
```

**Cleanup:**

```bash
npm run clean        # dist, cache, coverage, test-results löschen
```

---

## Tests & Qualitätssicherung

Hinweis: Generierte Test-Artefakte sind CI-only und werden nicht versioniert. Folgende Pfade sind in `.gitignore` erfasst: `coverage/`, `playwright-report/`, `test-results/`, `*.zip`.

### 🏗️ Offline-First Testing

**Prinzip:** Alle Tests laufen **ohne echte Netzwerkaufrufe**

- **Unit Tests:** Mocked Dependencies via Vitest
- **E2E Tests:** Request Interception via Playwright mit JSON-Fixtures

### Unit Tests (Vitest)

```bash
# Watch mode für Entwicklung
npm run test

# Single run für CI
npm run test:unit

# Mit Coverage
npm run test:ci
```

**Test-Dateien:**

- `src/**/*.{test,spec}.{ts,tsx}` - Component/Logic Tests
- `tests/unit/` - Isolated Unit Tests
- `tests/smoke/` - Integration/Smoke Tests

### E2E Tests (Playwright)

**Offline-Modus mit Request Interception:**

```bash
npm run test:e2e
```

**Setup:**

- `tests/e2e/setup/intercept.ts` - Request Interception
- `e2e/fixtures/*.json` - API Response Fixtures
- Scenarios: success, rate-limit, timeout, server-error, abort

**Artefakte:** Test-Reports und Coverage sind CI-only - nicht im Repository.

**Architektur-Entscheidung:** [ADR-0003: Offline-First Testing](docs/adr/0003-offline-first-testing.md)

**Test Coverage:**

- Chat flow (send message, receive response)
- Error handling (rate limits, timeouts, network errors)
- Accessibility (skip links, focus management)
- Keyboard shortcuts

### CI-Pipeline (GitHub Actions)

8 Gates müssen grün sein:

1. **Setup** - Dependencies installieren
2. **Secret Scan** - TruffleHog auf Git-History
3. **Lint** - ESLint Code-Quality
4. **Typecheck** - TypeScript Validation
5. **Unit Tests** - Vitest mit Coverage
6. **E2E Tests** - Playwright offline
7. **Build** - Production Build
8. **Deploy Gate** - Cloudflare Pages bereit

### Code Quality Standards

**TypeScript:**

- Strict mode aktiviert
- `noUncheckedIndexedAccess: true`
- `useUnknownInCatchVariables: true`

**ESLint:**

- Type-aware rules
- Import sorting & unused import detection
- React hooks rules
- JSX accessibility checks

---

## Styling & Designsystem

### 🎨 Token-First Approach

**Design Tokens:** `src/styles/tokens.css`

- HSL-basierte Farbdefinitionen
- Semantische Variablen (background, foreground, primary, etc.)
- Dark-Mode als Standard mit Theme-Presets

**Tailwind Integration:** `tailwind.config.ts`

- Mapping von Tokens auf Tailwind-Klassen
- Konsistente Farbpalette app-weit

### Utility Classes

**Flächen:**

- `glass` - Glasmorphism-Effekt
- `card-solid`, `card-gradient` - Karten-Styles

**Buttons:**

- `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`

**Inputs:**

- `input` - Einheitlicher Input-Style (auch select, textarea)

**Navigation:**

- `nav-pill`, `nav-pill--active` - Tab-Navigation

### 📂 Korrekte Style-Import-Reihenfolge

**Essentiell:** Styles müssen in `src/main.tsx` genau in dieser Reihenfolge geladen werden:

```typescript
import "./ui/base.css"; // 1. Reset & Basis-Styles
import "./styles/globals.css"; // 2. Globale Variablen & Layouts
import "./styles/brand.css"; // 3. Brand-Colors & Aurora-Effekte
import "./styles/theme.css"; // 4. Design-Tokens & Utility-Klassen
import "./styles/chat.css"; // 5. Komponenten-spezifische Styles
```

**Kritisch:** Diese Reihenfolge gewährleistet korrekte CSS-Kaskade und verhindert Design-Token-Konflikte.

**React-Root-Setup:**
Der React-Root (`#root`) erhält automatisch `app-bg bg-bg text-foreground` und `min-h-[100svh] relative` für Aurora-Background und korrekte Viewport-Behandlung.

### Do / Don't

- **Do:** feste Utility-Klassen über `@apply` definieren und bei dynamischen Klassen die Tailwind-Safelist pflegen (`tailwind.config.ts`).
- **Do:** Wrapper-Elemente statt Inline-Styles nutzen, um Gradients/Blurs einzubetten.
- **Don't:** Inline-Styles für Farben oder Layout verwenden; verwende Tokens/Utilities.
- **Don't:** neue Stylesheets außerhalb des Imports in `src/main.tsx` anlegen – konsolidierte Layers halten Purge stabil.

**Hinweis:** Aurora- und Token-Styles liegen in `src/styles/brand.css` und `src/styles/theme.css`; zusätzliche Kompat-Schichten werden nicht mehr benötigt.

---

## Deployment (Cloudflare Pages)

### 🚀 Git-Integration Deployment

**Quelle:** Cloudflare Pages (nicht GitHub Actions)

- **Branch:** `main` (automatische Builds bei Push)
- **Build Output:** `dist/`
- **Build Command:** `npm run build && npm run postbuild`

### Setup-Schritte

1. **Cloudflare Pages Projekt erstellen**
   - Repository: `github.com/daydaylx/Disa_Ai`
   - Production Branch: `main`

2. **Build-Konfiguration**

   ```
   Build Command: npm run build && npm run postbuild
   Build Output: dist
   Node Version: 22
   ```

3. **Environment Variables**
   - Setze Project Variables in Cloudflare Dashboard
   - Verwende dieselben Keys wie in `.env.example`
   - **Keine Secrets ins Git Repository!**

4. **Deployment**
   - Push zu `main` → automatischer Build
   - Deploy-URL: https://disaai.pages.dev/

### CI vs. Deployment

**GitHub Actions:** Nur Quality Gates (CI)

- Secret Scanning, Lint, TypeScript, Tests, Build-Verification

**Cloudflare Pages:** Deployment + Hosting

- Automatische Builds, CDN, Edge-Optimization

---

## Fehlervertrag & Error Handling

### 🚨 Definierte Fehlerklassen

**Netzwerk-Fehler:**

- `TimeoutError` - Request-Timeouts (configurable)
- `AbortError` - User-initiated cancellation
- `RateLimitError` - API rate limits (429)
- `NetworkError` - Konnektivitätsprobleme

**API-Fehler:**

- `AuthenticationError` - Invalid API key (401)
- `ServerError` - Upstream-Probleme (5xx)
- `ValidationError` - Malformed requests (400)

### Error Mapping & UI

**Konsistente Behandlung:**

```typescript
// src/lib/errors/mapper.ts
export function mapError(error: unknown): AppError {
  // Unified error classification
}
```

**UI-Verhalten:**

- **Retry-Strategien** mit exponential backoff
- **User-friendly Fehlermeldungen** (keine technischen Details)
- **Graceful Degradation** bei API-Ausfällen
- **Offline-Modus** Anzeige bei Konnektivitätsverlust

**Implementierung siehe:**

- [Error Types](src/lib/errors/types.ts): Strukturierte Error-Klassen
- [Error Mapper](src/lib/errors/mapper.ts): `mapError()` für einheitliche Konvertierung
- [Human Error](src/lib/errors/humanError.ts): User-friendly UI-Meldungen

**Architektur-Entscheidung:** [ADR-0001: Error Handling Strategy](docs/adr/0001-error-handling.md)

---

## Contributing Guidelines

### 🔄 Trunk-Based Development

**Branch-Strategie:** [ADR-0002: Trunk-Based Development](docs/adr/0002-trunk-based-development.md)

- Ein Hauptbranch: `main`
- Kurze Feature-Branches (1-2 Tage max.)
- Kleine, atomare PRs (<400 Zeilen)

**Workflow:**

```bash
git checkout main
git pull origin main
git checkout -b feat/neue-funktion
# Entwickeln...
git push -u origin feat/neue-funktion
# PR erstellen
```

### Commit-Konventionen

**Conventional Commits Format:**

```
feat(scope): kurze Beschreibung im Imperativ

Längere Beschreibung falls nötig.

- Bullet Points für Details
- Closes #123
```

**Typen:**

- `feat` - Neue Features
- `fix` - Bugfixes
- `chore` - Wartung/Refactoring
- `docs` - Dokumentation
- `test` - Tests hinzufügen/ändern

### Review-Checkliste

**Vor PR-Erstellung:**

- [ ] `npm run verify` bestanden
- [ ] Tests für neue Features geschrieben
- [ ] README/Docs bei API-Änderungen aktualisiert
- [ ] Keine Secrets/Keys im Code

**CI-Gates (alle müssen grün sein):**

1. Secret Scanning
2. Lint
3. Typecheck
4. Unit Tests
5. E2E Tests (Stable)
6. Build
7. Deploy Gate – Cloudflare Ready (kein GitHub-Deploy)

Empfohlene Required Checks (Branch‑Protection):
`Lint`, `Typecheck`, `Unit Tests`, `E2E Tests (Stable)`, `Build`, `Deploy Gate - Cloudflare Ready`.

**Detaillierte Guidelines:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Architektur-Entscheidungen (ADRs)

**ADR-Verzeichnis:** [`docs/adr/`](docs/adr/)

**Aktuelle ADRs:**

- [ADR-0001: Error Handling Strategy](docs/adr/0001-error-handling.md)
- [ADR-0002: Trunk-Based Development](docs/adr/0002-trunk-based-development.md)
- [ADR-0003: Offline-First Testing](docs/adr/0003-offline-first-testing.md)

**ADR-Template:** [`docs/adr/template.md`](docs/adr/template.md)

---

## Caching & Stale-Content vermeiden

### 📦 Cache-Strategie

**HTML-Caching:** `public/_headers`

- `no-store` für `index.html` (immer frisch)
- `no-cache` für Service Worker und Manifest
- `max-age=31536000` für Assets (mit Hashing)

**Service Worker:**

- Bewusst deaktiviert für Development
- Verhindert festgeklemmte alte Bundles

### Stale-Content Debugging

**Cloudflare Pages:**

1. Dashboard → Caching → "Purge Everything"
2. Wait 30 seconds → Test

**Browser-seitig:**

1. Hard Refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`
2. DevTools → Network Tab → "Disable Cache"
3. Manual: Clear site data via DevTools → Application
   MCP/Agent-Setup (optional)
   Das Repo enthält .mcp.json und einen .claude/ Ordner. Diese Dateien standardisieren lokale Agent-Capabilities und Regeln für toolgestützte Code-Analysen und Umbauten.
   Nützlich, wenn du Code-Assistenten per CLI nutzt, die MCP/Agent-Profile lesen.
   Roadmap & interne Doks
   Umbau/Refactor: REFACTOR_PLAN.md
   UX-Befunde: UX_FINDINGS.md
   Abhängigkeiten: DEPENDENCIES.md
   Deployment-Prüfungen: DEPLOYMENT_READINESS.md
   Analyse-Notizen: ANALYSIS.md
   Diese Dateien begleiten die Weiterentwicklung und dokumentieren Entscheidungen.
   Troubleshooting
   Cloudflare zeigt alten Stand
   Pages-Cache leeren (Purge)
   Browser-Cache / Service Worker checken
   ESLint-Regeln inkonsistent
   Konsolidiert: Eine Flat ESLint-Config (eslint.config.js)
   Build schlägt lokal fehl
   Node-Version gemäß .nvmrc setzen
   Lockfile respektieren (keine Mischformen aus npm/pnpm)

## What's Next

### 🚀 Performance & Observability Roadmap

**1. Performance Monitoring**

- Bundle analyzer für Größen-Optimierung
- Web Vitals tracking (CLS, FID, LCP)
- React DevTools Profiler für Render-Performance

**2. Error Tracking & Analytics**

- Sentry integration für Production error monitoring
- User session tracking für UX insights
- API response time & error rate dashboards

**3. Advanced Testing**

- Visual regression testing mit Playwright
- Performance budgets in CI/CD pipeline
- Accessibility testing automation (axe-core)

**Priorität**: Performance > Observability > Advanced Testing

---

## Lizenz

Im Repository ist keine explizite Lizenzdatei hinterlegt. Wenn externe Nutzung geplant ist, eine passende Open-Source-Lizenz ergänzen (z. B. MIT, Apache-2.0) oder eine Closed-Source-Lizenz definieren.

### Hinweise für Beiträge

PRs und Issues sind willkommen, sofern sie:

- reproduzierbare Fehlerberichte mit Logs/Schritten enthalten,
- UI/UX-Vorschläge mit konkreten Code-Diffs oder Screenshots untermauern,
- und keine Secrets/Keys enthalten.

### Changelog

Siehe [Rescue-Checklist](docs/status/rescue-checklist.md) für detaillierte Projekt-Transformation und Git-History für chronologische Änderungen.

## CI & Gates

Die GitHub Actions Pipeline prüft in dieser Reihenfolge:

1. **Lint**
2. **Typecheck**
3. **Unit Tests**
4. **E2E (offline)** – alle Netzwerkaufrufe werden via Interception/Fixtures beantwortet. Keine echten Upstream-Requests.
5. **Build**
6. **Deploy Gate** – reines Gate. Der produktive Deploy erfolgt ausschließlich über **Cloudflare Pages**.

Test- und Report-Artefakte (`coverage/`, `playwright-report/`, `test-results/`) werden nicht eingecheckt und nur als CI-Artefakte bei Fehlschlägen erzeugt.
