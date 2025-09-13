# Contributing zu Disa_Ai

Dieses Projekt folgt einer **Trunk-Based Development** Strategie mit strikten Qualitäts-Gates.

## Branch-Strategie

### Trunk-Based Development

- **Ein Hauptbranch**: `main` ist der einzige langlebige Branch
- **Kurze Feature-Branches**: Maximal 1-2 Tage, dann PR zurück zu `main`
- **Kleine PRs**: Keine großen Änderungen; lieber mehrere kleine, atomare PRs
- **Direktes Arbeiten auf `main`**: Für Hotfixes und kleinere Änderungen erlaubt
- **Keine Dual-Trunks**: Branches wie `neues-main` werden umgehend zusammengeführt oder geschlossen (kein Parallel‑Main)

### Branch-Namenskonventionen

```
feat/kurze-beschreibung     # Neue Features
fix/issue-beschreibung      # Bugfixes
chore/wartung-beschreibung  # Wartungsarbeiten
docs/dokumentation         # Dokumentation
```

## Pull Request Workflow

### 1. Branch erstellen und entwickeln

```bash
git checkout main
git pull origin main
git checkout -b feat/neue-funktion
# Entwickeln...
git push -u origin feat/neue-funktion
```

### 2. PR erstellen

- **PR-Template** wird automatisch geladen
- **Alle Checkboxen** in der Checkliste abhaken
- **Beschreibung** nach Template ausfüllen

### 3. Review & Merge

- **CI muss grün sein** - keine Ausnahmen
- **Mindestens 1 Approval** für größere Änderungen
- **Squash & Merge** bevorzugt für saubere History
- **Branch nach Merge löschen**

## Qualitäts-Gates

### CI-Pipeline (Alle Gates müssen bestehen)

1. **Install** - Abhängigkeiten installieren (`npm ci`)
2. **Secrets** - Secret-Scanning mit TruffleHog
3. **Lint** - Code-Style prüfen (`npm run lint`)
4. **Typecheck** - TypeScript-Typen prüfen (`npm run typecheck`)
5. **Unit Tests** - Unit-Tests ausführen (`npm run test`)
6. **E2E Tests** - End-to-End Tests offline (`npm run test:e2e`)
7. **Build** - Produktions-Build (`npm run build`)
8. **Deploy Gate** - Cloudflare Pages deployment (nur bei `main`)

### Vor dem Commit (Lokal)

```bash
# Vollständige Verifikation
npm run verify

# Oder einzeln:
npm run typecheck
npm run lint
npm run test
npm run build
```

## Conventional Commits

Verwende [Conventional Commits](https://www.conventionalcommits.org/) Format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit-Typen

- **feat**: Neue Features oder Funktionalitäten
- **fix**: Bugfixes und Fehlerbehebungen
- **docs**: Nur Dokumentation geändert
- **style**: Code-Formatierung, Leerzeichen, Semikolons (keine Logik-Änderung)
- **refactor**: Code-Umstrukturierung ohne neue Features oder Bugfixes
- **test**: Tests hinzugefügt oder geändert
- **chore**: Build-Prozess, Dependencies, Tools (keine Source-Code-Änderung)
- **ci**: CI-Konfiguration und Skripte
- **perf**: Performance-Verbesserungen
- **revert**: Reverted einen vorherigen Commit

### Scope-Beispiele

- **auth**: Authentication/Authorization
- **ui**: User Interface Komponenten
- **api**: API-Integration und HTTP-Calls
- **test**: Test-Setup und Test-Utilities
- **deps**: Dependency-Management
- **config**: Konfigurationsdateien
- **e2e**: End-to-End Tests

### Commit-Beispiele

```
feat(auth): implement sessionStorage API key migration
fix(ui): resolve button alignment in mobile view
chore(deps): update playwright to latest version
docs(adr): add error handling architecture decision
test(e2e): add offline fixtures for API scenarios
ci(workflow): add TruffleHog secret scanning gate
refactor(api): consolidate error handling patterns
```

### Breaking Changes

Breaking Changes müssen explizit markiert werden:

```
feat(api)!: remove deprecated authentication endpoint

BREAKING CHANGE: The `/auth/legacy` endpoint has been removed.
Use `/auth/login` instead with the new request format.
```

## Entwicklungsregeln

### ✅ Erlaubt

- **Kleine, atomare Commits** - eine Änderung pro Commit
- **Rückwärtskompatible Änderungen** - keine Breaking Changes ohne ADR
- **Tests für neue Features** - sowohl Unit als auch E2E
- **Dokumentation aktualisieren** bei API-Änderungen

### ❌ Verboten

- **Commits bei roten Checks** - CI muss grün sein
- **Große PRs** (>400 Zeilen) - in kleinere PRs aufteilen
- **Merge-Commits** von Feature-Branches - nur Squash & Merge
- **Breaking Changes** ohne vorherige Diskussion und ADR

## Branch Protection

Der `main` Branch ist geschützt mit folgenden Rules:

- **Require status checks** (benannte Checks):
  - `Secret Scanning`
  - `Lint`
  - `Typecheck`
  - `Unit Tests`
  - `E2E Tests (Stable)`
  - `Build`
  - `Deploy Gate - Cloudflare Ready`
- **Require branches up to date** vor Merge
- **No direct pushes** zu `main` (außer für Maintainer)
- **Delete head branches** nach Merge

### Required Checks Configuration

Siehe README → Abschnitt "CI-Gates" für empfohlene Required Checks und den konsolidierten Workflow.

## Deployment

- **Cloudflare Pages** deployed automatisch bei Push zu `main`
- **Staging**: Jeder PR bekommt Preview-Deployment
- **Production**: Nur nach erfolgreichem CI auf `main`

## Legacy Branches

### Umgang mit `neues-main` Branch

Falls ein `neues-main` Branch existiert:

1. **Bewertung**: Prüfen ob Änderungen noch relevant/aktuell
2. **Optionen**:
   - **Merge**: Falls Änderungen wertvoll → Cherry-pick einzelne Commits
   - **Close**: Falls überholt → Branch schließen mit Begründung
3. **Dokumentation**: Entscheidung in Issue oder ADR festhalten

## Fragen?

- **Issues**: Für Bugs und Feature-Requests
- **Discussions**: Für allgemeine Fragen und Ideen
- **ADRs**: `docs/adr/` für wichtige Architektur-Entscheidungen

## Testing-Strategie

### Offline-First Testing

Alle Tests laufen **offline** ohne echte Netzwerk-Aufrufe:

- **Unit Tests**: Mit MSW für HTTP-Mocking
- **E2E Tests**: Mit Playwright Request Interception
- **Fixtures**: JSON-Responses in `e2e/fixtures/`

### Test-Konventionen

```bash
# Alle Tests ausführen
npm run test       # Unit Tests
npm run test:e2e   # E2E Tests offline

# Coverage und Watching
npm run test:watch     # Unit Tests im Watch-Mode
npm run test:coverage  # Coverage Report
```

## Fehlerbehandlung

Das Projekt folgt einem [strukturierten Fehlervertrag](docs/adr/0001-error-handling.md):

- **Konsistente Error-Types**: `TimeoutError`, `RateLimitError`, `ApiServerError`, `AuthenticationError`
- **User-friendly Mapping**: Technische Fehler → Verständliche UI-Meldungen via `humanError()`
- **Retry-Strategien**: Intelligente Wiederholungen je Fehlertyp
- **Zentrales Mapping**: `mapError()` konvertiert alle Fehler zu strukturierten Error-Klassen

## Architektur-Entscheidungen

Wichtige Entscheidungen sind in [ADRs](docs/adr/index.md) dokumentiert:

- [ADR-0001: Error Handling Strategy](docs/adr/0001-error-handling.md)
- [ADR-0002: Trunk-Based Development](docs/adr/0002-trunk-based-development.md)
- [ADR-0003: Offline-First Testing](docs/adr/0003-offline-first-testing.md)
- [ADR-0004: SessionStorage für API-Keys](docs/adr/0004-sessionStorage-api-keys.md)

---

_Letzte Aktualisierung: PR #9 - Dokumentation konsolidiert für vollständiges Onboarding_
