# Neues-Main Branch Analyse & Entscheidung

## Status Quo

- **Branch**: `neues-main` (existiert lokal und remote)
- **Letzter Commit**: `240b3ac chore(repo): remove test/coverage artifacts; harden .gitignore`
- **Merge-Base mit main**: `240b3ac` (identisch mit letztem Commit)
- **Divergenz**: `neues-main` ist identisch mit dem letzten Commit des Merge-Base

## Branch-Vergleich

### Main Branch (aktuell)

```
61047e6 feat(ci): CI-Pipeline mit Deploy-Gates konsolidieren
5641d1c Add coverage reports directory to .gitignore
f3e13c5 Aktualisieren von README.md
2427e78 Aktualisieren von README.md
557f6b2 fix: Resolve build error and ignore coverage files
```

### Neues-Main Branch

```
240b3ac chore(repo): remove test/coverage artifacts; harden .gitignore  ← MERGE BASE
0582ff8 kein plan
99abc28 chore(core): phase-1 cleanup — remove legacy Shell/Header...
b01ad0c f
93f7996 feat(ui): polish bottom nav tabs, settings headings...
2683393 fix
4fd003d feat(ui): adopt design example patterns...
a60686c feat(ui): friendlier dark tone + subtle background...
11a9df2 style(theme): lighten dark baseline, tone down tab pills...
c72ac5f style(chat): migrate chat bubbles to Aurora tokens...
```

## Analyse der Änderungen

### Neues-Main Commits (10 Commits vor Merge-Base)

1. **UI/Theme Änderungen** (7 commits):
   - Aurora design system Implementierung
   - Glass effects, button variants
   - Chat bubbles styling
   - Navigation improvements

2. **Cleanup/Chore** (2 commits):
   - Legacy component removal (Shell.tsx, Header.tsx)
   - Old token system cleanup

3. **Unklare Commits** (1 commit):
   - `"kein plan"` und `"f"` - keine aussagekräftige Beschreibung

## Bewertung

### ✅ Wertvoll

- **Aurora Design System**: Umfassende UI-Improvements
- **Component Cleanup**: Entfernung von Legacy-Code
- **Theme System**: Moderne Token-basierte Architektur

### ⚠️ Problematisch

- **Merge-Konflikt-Potenzial**: Umfangreiche UI-Änderungen
- **Fehlende Tests**: Keine E2E-Tests für UI-Änderungen
- **Unklare Commits**: Schwer nachvollziehbare Änderungen

## Empfehlung: **Cherry-Pick & Close**

### Strategie

1. **Selektive Übernahme**: Wertvollen Code über separate PRs integrieren
2. **Branch schließen**: `neues-main` nach Extraktion schließen
3. **Dokumentation**: Entscheidung in ADR festhalten

### Konkrete Schritte

1. **Phase 1**: Aurora Theme System (3-4 PRs)

   ```
   PR1: Core theme tokens and utilities
   PR2: Button and input components
   PR3: Navigation and glass effects
   PR4: Chat bubble styling
   ```

2. **Phase 2**: Legacy Cleanup (1 PR)

   ```
   PR5: Remove Shell.tsx, Header.tsx, old tokens
   ```

3. **Phase 3**: Branch-Bereinigung
   ```bash
   git branch -D neues-main
   git push origin --delete neues-main
   ```

### Risiken & Mitigation

- **Merge-Konflikte**: Durch kleine, atomare PRs minimieren
- **Regression**: E2E-Tests vor jedem Merge aktualisieren
- **Design-Konsistenz**: Screenshots und Design-Review für jeden UI-PR

## Timeline

- **Woche 1**: Theme-System PRs (1-2)
- **Woche 2**: Komponenten PRs (3-4)
- **Woche 3**: Cleanup PR (5) + Branch schließen

---

_Entscheidung getroffen in PR #5 - Branch-Strategie & Contributing Guidelines_
_Basis: Trunk-Based Development Prinzipien_
