# Lint-Staged Pre-Commit Hooks

## Konfiguration

Das Projekt verwendet `lint-staged` mit Husky für automatische Code-Qualitätsprüfungen vor jedem Commit.

### Setup

**Pre-commit Hook** (`.husky/pre-commit`):
```bash
#!/usr/bin/env sh
set -eu
echo "pre-commit: run lint-staged"
npx lint-staged
```

**Lint-Staged Konfiguration** (`package.json`):
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

## Workflow

### Bei jedem Commit:

1. **ESLint + Auto-Fix** für TypeScript/JavaScript Files
2. **Prettier Formatting** für alle Files
3. **Nur staged Files** werden verarbeitet (nicht das gesamte Repo)

### Fehlerbehandlung:

- **Lint Errors**: Commit wird blockiert bis Fehler behoben sind
- **Auto-fixable Issues**: Werden automatisch korrigiert und zu Staging hinzugefügt
- **Format Issues**: Werden automatisch formatiert

### Commands:

```bash
# Hook manuell ausführen
npx lint-staged

# Hook umgehen (NICHT empfohlen)
git commit --no-verify

# Husky Setup erneuern
npm run prepare
```

## Vorteile

- **Konsistente Code-Qualität**: Alle Commits folgen ESLint + Prettier Standards
- **Automatische Fixes**: Viele Style-Issues werden automatisch korrigiert
- **Performance**: Nur staged Files verarbeitet, nicht das gesamte Repo
- **Team-Compliance**: Unmöglich, unformatierten Code zu committen

## Konfiguration Details

### File Patterns:

- **`*.{ts,tsx,js,jsx}`**: TypeScript/JavaScript → ESLint + Prettier
- **`*.{json,md,css,scss}`**: Config/Docs/Styles → Nur Prettier

### ESLint Integration:

- `--fix` Flag aktiviert automatische Fehlerbehebung
- Konforme mit `.eslintrc` Konfiguration
- Type-aware Rules für TypeScript

### Prettier Integration:

- `--write` überschreibt Files mit korrektem Format
- Konforme mit `.prettierrc` Konfiguration 
- Konsistente Formatierung über alle File-Types

---

**Performance Note:** Lint-staged ist deutlich schneller als vollständige Repo-Scans, da nur geänderte Files verarbeitet werden.