# Artefakt- und Report-Hygiene

## Ziel: Repo schlank, CI zeigt genug

### Strategie

Das Projekt implementiert strikte Hygiene-Regeln für Build-Artefakte und Reports um Repository-Bloat zu vermeiden und CI-Kosten zu minimieren.

## .gitignore Konfiguration

### Test/Reports/Logs
```
playwright-report/
test-artifacts/
test-results/
coverage/
coverage/.tmp/
docs/screenshots/
*.html-report/
*.xml
*.lcov
allure-results/
allure-report/
*.trx
*.junit.xml
```

### Build/Cache
```
.cache/
.parcel-cache/
.turbo/
.next/
.nuxt/
.vercel/
.eslintcache
tsconfig.tsbuildinfo
```

### IDE Files
```
.vscode/
.idea/
*.swp
*.swo
*~
.vim/
.emacs.d/
.sublime-project
.sublime-workspace
*.code-workspace
```

### Temp/Backup Files
```
*.bak
*.bak.*
*.tmp
*.temp
.temp/
Thumbs.db
```

## CI-Artefakte Optimierung

### Retention-Zeiten (Minimiert)

**Coverage Reports**: 3 Tage (nur bei Fehlern)
```yaml
- name: Upload coverage reports
  if: failure() && hashFiles('coverage/**') != ''
  retention-days: 3
```

**E2E Artifacts**: 3 Tage (nur bei Fehlern)
```yaml
- name: Upload E2E artifacts on failure
  if: failure()
  retention-days: 3
```

**Build Artifacts**: 7 Tage (nur bei main branch)
```yaml
- name: Upload build artifacts
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  retention-days: 7
```

**Flaky Test Artifacts**: 1 Tag (Monitoring only)
```yaml
- name: Upload flaky test artifacts
  if: always()
  retention-days: 1
```

### Upload-Bedingungen

- **Coverage**: Nur bei Test-Fehlern (`if: failure()`)
- **E2E**: Nur bei E2E-Fehlern (`if: failure()`)
- **Build**: Nur bei main-Branch pushes
- **Flaky**: Immer, aber nur 1 Tag retention

## Pre-commit Hooks

### Lint-Staged Konfiguration

**Automatische Code-Qualität** vor jedem Commit:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,scss}": [
      "prettier --write"
    ]
  }
}
```

**Husky Integration**:
```bash
#!/usr/bin/env sh
set -eu
echo "pre-commit: run lint-staged"
npx lint-staged
```

### Vorteile

- **Konsistente Formatierung**: Kein unformatierter Code in Commits
- **Automatische Fixes**: ESLint-Fixes werden automatisch angewendet
- **Performance**: Nur staged Files verarbeitet
- **Team-Compliance**: Unmöglich, Style-Violations zu committen

## Repository-Status

### Große Files (>500KB) Status

**Aktuell bereinigt:**
- ✅ Test-Results entfernt
- ✅ Coverage-Reports entfernt  
- ✅ Screenshots in .gitignore

**Übrig (akzeptabel):**
- docs/screenshots/*.png (→ .gitignore, legacy files bleiben)

### Artefakt-Größen Monitoring

```bash
# Große Files finden (>500KB)
find . -type f -size +500k -not -path "*/node_modules/*" -not -path "*/.git/*"

# Build-Artefakte prüfen
du -sh dist/ coverage/ test-results/ playwright-report/

# Repository-Größe
du -sh .git/
```

## Maintenance Commands

### Lokale Bereinigung
```bash
# Test/Coverage Artifacts
npm run clean

# Git-ignoriete Files entfernen
git clean -fdX

# Alle untracked files (vorsichtig!)
git clean -fd
```

### CI-Cache Management
```bash
# Node modules cache key
node-modules-${{ runner.os }}-${{ hashFiles('package-lock.json') }}

# Automatische Invalidierung bei package-lock.json Änderungen
```

## Best Practices

### 1. Entwicklung
- **Keine Screenshots committen** → docs/screenshots/ in .gitignore
- **Build-Output lokal testen** → npm run clean vor Push
- **Coverage lokal prüfen** → npm run test:ci

### 2. CI-Pipeline
- **Artefakte nur bei Fehlern** uploaden (außer Build für main)
- **Kurze Retention** für Debug-Artefakte (1-3 Tage)
- **Größe minimieren** durch selective paths

### 3. Repository
- **Regelmäßige .gitignore Updates** bei neuen Tools
- **Large file monitoring** in Git hooks
- **Cleanup vor Releases** um Repository-Größe zu kontrollieren

---

**Ziel erreicht**: Repository bleibt schlank, CI-Kosten minimal, Debug-Info verfügbar wenn nötig.