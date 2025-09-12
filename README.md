Disa AI — Private KI-Chat PWA

Eine moderne, lokal konfigurierbare Chat-App für KI-Modelle mit verschiedenen Rollen (18+) und geringere Police. Fokus: klare UX, robuste Builds, reproduzierbares Deployment und nachvollziehbare Qualitätssicherung.

**Live:** https://disaai.pages.dev/  
**Repository:** https://github.com/daydaylx/Disa_Ai

> Stand: 12. September 2025

---

## Inhaltsverzeichnis

1. [Ziele & Scope](#ziele--scope)  
2. [Feature-Überblick](#feature-überblick)  
3. [Technikstack](#technikstack)  
4. [Projektstruktur](#projektstruktur)  
5. [Lokale Entwicklung](#lokale-entwicklung)  
6. [Umgebungsvariablen](#umgebungsvariablen)  
7. [NPM-Skripte](#npm-skripte)  
8. [Tests & Qualitätssicherung](#tests--qualitätssicherung)  
9. [Styling & Designsystem](#styling--designsystem)  
10. [Deployment (Cloudflare Pages)](#deployment-cloudflare-pages)  
11. [Caching & Stale-Content vermeiden](#caching--stale-content-vermeiden)  
12. [MCP/Agent-Setup (optional)](#mcpagent-setup-optional)  
13. [Roadmap & interne Doks](#roadmap--interne-doks)  
14. [Troubleshooting](#troubleshooting)  
15. [Lizenz](#lizenz)

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
.claude/                 # Projektbezogene Vorgaben/Prompts für Agenten .github/                 # Workflows (CI) .graveyard/              # Archiv/Altlasten .husky/                  # Git Hooks docs/                    # Interne Dokumentation e2e/                     # End-to-End Tests (Playwright) ops/                     # Betriebs-/Scriptmaterial public/                  # Statische Public-Assets (inkl. _headers) scripts/                 # Node/Utility-Skripte (Build/Analyse) src/                     # App-Quellcode (React/TS, Styles, Utilities) tests/                   # Unit-/Integrationstests (Vitest) .env.example             # Vorlage für lokale Umgebungsvariablen tailwind.config.ts       # Tailwind-Setup mit Token-Anbindung vite.config.ts           # Vite-Build/Dev-Konfiguration vitest.config.ts         # Test-Setup
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
Umgebungsvariablen
Lege eine .env basierend auf .env.example an.
Typischerweise sind hier API-Keys, Basispfade und Modell-Voreinstellungen enthalten.
Für das Deployment auf Cloudflare Pages setze dieselben Keys als Project Variables.
Wichtig: Keine Secrets ins Repo commiten.
NPM-Skripte
Die gängigen Skripte sind in package.json definiert, u. a.:
dev – lokalen Dev-Server starten
build – Production-Build in dist/
preview – lokalen Preview auf Basis von dist/
typecheck – TypeScript ohne Emission
lint – ESLint-Checks
test – Vitest (Unit)
E2E (Playwright) – je nach Scriptkonvention (test:e2e oder via npx playwright test)
Präzise Bezeichner bitte direkt der package.json entnehmen.
Tests & Qualitätssicherung
TypeScript: strikt, npm run typecheck
ESLint: Projekt nutzt mehrere ESLint-Configs. Mittelfristig Zusammenführung empfohlen.
Vitest: schnelles Unit-Testing
Playwright: E2E-Flows
CI führt primär die Checks aus (typecheck, lint, test). Deployment erfolgt über Cloudflare Pages, nicht über Actions.
Styling & Designsystem
Token-First: zentrale HSL-Tokens in src/styles/tokens.css
Tailwind-Mapping in tailwind.config.ts auf semantische Farben (background, foreground, card, primary, muted-foreground, ring, …)
Dark-Baseline: App setzt beim Start .dark auf <html>; aktives Preset via data-theme
Utilities in src/styles/theme.css:
Flächen: glass, card-solid, card-gradient
Buttons: btn, btn-primary, btn-secondary, btn-ghost
Inputs: input (auch select, textarea)
Navigation: nav-pill, nav-pill--active
Typografie: text-foreground, text-text, text-text-muted, text-muted-foreground
Hinweis: Legacy-CSS in src/styles/brand.css, src/styles/glass.css, src/ui/kit.css nur als Kompat-Helfer; neue Styles bitte über Tokens/Utilities lösen.
Deployment (Cloudflare Pages)
Modell: Git-Integration auf Branch main, Build-Output dist/.
Wichtig: GitHub Actions machen nur CI-Checks; die Veröffentlichung übernimmt Cloudflare Pages.
Kurzablauf:
Cloudflare Pages Projekt auf Repo verbinden (Branch main).
Build Command aus package.json verwenden, Output-Folder dist/.
Project Variables in Cloudflare setzen (statt .env im Repo).
Nach erfolgreichem Build wird disaai.pages.dev aktualisiert.
Caching & Stale-Content vermeiden
HTML-Caching: public/_headers setzt no-store für index.html, damit die App immer frisch lädt.
Service Worker: bewusst deaktiviert (in src/main.tsx), um alte Bundles nicht festzukleben.
Wenn doch mal Altstände auftauchen:
In Cloudflare Pages: Purge Everything
Clientseitig: Browser-Cache leeren bzw. evtl. alten SW manuell entfernen
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
Perspektivisch die fragmentierten ESLint-Configs konsolidieren
Build schlägt lokal fehl
Node-Version gemäß .nvmrc setzen
Lockfile respektieren (keine Mischformen aus npm/pnpm)
Lizenz
Im Repository ist keine explizite Lizenzdatei hinterlegt. Wenn externe Nutzung geplant ist, eine passende Open-Source-Lizenz ergänzen (z. B. MIT, Apache-2.0) oder eine Closed-Source-Lizenz definieren.
Hinweise für Beiträge
PRs und Issues sind willkommen, sofern sie:
reproduzierbare Fehlerberichte mit Logs/Schritten enthalten,
UI/UX-Vorschläge mit konkreten Code-Diffs oder Screenshots untermauern,
und keine Secrets/Keys enthalten.
Changelog
Siehe Git-History und ggf. docs/ für begleitende Änderungen