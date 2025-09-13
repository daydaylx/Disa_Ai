# Changesets für Disa_Ai

Dieses Projekt verwendet [Changesets](https://github.com/changesets/changesets) für automatisches Versioning und CHANGELOG-Generierung.

## Workflow für Changes

### 1. Change hinzufügen

Wenn du eine bedeutende Änderung machst (Features, Fixes, Breaking Changes):

```bash
npm run changeset:add
```

Dies startet einen interaktiven Dialog:
- **Bump-Type wählen**: patch (bugfix), minor (feature), major (breaking)
- **Beschreibung eingeben**: Was wurde geändert?

### 2. Changeset Commit

Der generierte Changeset (`.changeset/*.md`) wird mit committet:

```bash
git add .changeset/
git commit -m "feat: add new feature with changeset"
```

### 3. Versioning (automatisch in CI)

Bei Merges zu `main` kann ein Release-PR erstellt werden:

```bash
npm run changeset:version  # Aktualisiert version in package.json + CHANGELOG.md
```

### 4. Publishing (manuell)

```bash
npm run changeset:publish  # Veröffentlicht neue Version
```

## Beispiel-Changesets

### Feature (minor)
```markdown
---
"disa-ai": minor
---

Add offline-first E2E testing with Playwright fixtures
```

### Bugfix (patch)
```markdown
---
"disa-ai": patch
---

Fix API key migration from localStorage to sessionStorage
```

### Breaking Change (major)
```markdown
---
"disa-ai": major
---

BREAKING: Remove deprecated /auth/legacy endpoint. Use /auth/login instead.
```

## Status prüfen

```bash
npm run changeset:status  # Zeigt aktuelle unreleased changes
```

---

**Dokumentation**: [Changesets Intro](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
