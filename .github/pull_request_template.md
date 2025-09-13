## Beschreibung

<!-- Kurze Beschreibung der Änderungen -->

## Typ der Änderung

- [ ] 🚀 Neues Feature (feat)
- [ ] 🐛 Bugfix (fix) 
- [ ] 🔧 Wartung/Refactoring (chore)
- [ ] 📚 Dokumentation (docs)
- [ ] 🎨 Style/UI Änderungen
- [ ] ⚡ Performance Verbesserung
- [ ] 🧪 Tests hinzugefügt/geändert

## Checkliste

### ✅ Pflicht-Checks (Alle müssen ✅ sein)

- [ ] **CI-Pipeline ist grün** (alle Gates bestanden)
- [ ] **Tests hinzugefügt/aktualisiert** für neue Funktionalität
- [ ] **Lokale Verifikation**: `npm run verify` bestanden
- [ ] **Conventional Commit** Format verwendet
- [ ] **Breaking Changes dokumentiert** (falls vorhanden)

### 📋 Code-Qualität

- [ ] **Code folgt Projektkonventionen** (ESLint, Prettier)
- [ ] **TypeScript Typen sind korrekt** (keine `any`, `unknown` nur wo nötig)
- [ ] **Imports sind sauber** (keine ungenutzten Imports)
- [ ] **Komponenten sind testbar** (gute Props, Single Responsibility)

### 🧪 Testing

- [ ] **Unit Tests** für neue Funktionen geschrieben
- [ ] **E2E Tests** aktualisiert falls UI-Änderungen
- [ ] **Edge Cases** abgedeckt (Error Handling, leere States)
- [ ] **Tests laufen offline** (keine echten API-Calls)
- [ ] **Keine bekannten flaky Tests betroffen** (Tests sind deterministisch und stabil)

### 📝 Dokumentation

- [ ] **CLAUDE.md aktualisiert** falls neue Kommandos/Prozesse
- [ ] **README aktualisiert** falls öffentliche API-Änderungen  
- [ ] **ADR erstellt** für wichtige Architektur-Entscheidungen
- [ ] **Inline-Kommentare** für komplexe Logik hinzugefügt

### 🚀 Deployment

- [ ] **Build erfolgreich** (`npm run build`)
- [ ] **Keine Secrets** im Code oder in Logs
- [ ] **Umgebungsvariablen** dokumentiert (falls neue)
- [ ] **Rückwärtskompatibel** oder Migration geplant

## Verknüpfte Issues/ADRs

<!-- Referenzen zu verwandten Issues, ADRs oder anderen PRs -->
- Closes #
- Related to #
- References ADR: 

## Manual Steps (falls erforderlich)

<!-- Schritte die nach dem Merge manuell durchgeführt werden müssen -->

- [ ] Umgebungsvariablen setzen
- [ ] Cloudflare-Konfiguration anpassen  
- [ ] Dokumentation extern aktualisieren
- [ ] Dependencies installieren

## Testing

<!-- Wie wurde diese Änderung getestet? -->

### Lokale Tests

- [ ] Unit Tests: `npm run test`
- [ ] E2E Tests: `npm run test:e2e`  
- [ ] Build Test: `npm run build`
- [ ] Linting: `npm run lint`

### Manuelle Tests

<!-- Beschreibung der durchgeführten manuellen Tests -->

## Screenshots/Videos (optional)

<!-- Für UI-Änderungen: Screenshots oder kurze Videos -->

---

## Review-Hinweise

<!-- Spezielle Bereiche auf die Reviewer achten sollten -->

### ⚠️ Breaking Changes

<!-- Beschreibung aller Breaking Changes und Migration Steps -->

### 🔍 Besonders zu beachten

<!-- Kritische Bereiche, komplexe Logik, Performance-Auswirkungen -->

---

*Diese PR folgt den [Contributing Guidelines](../CONTRIBUTING.md) und der Trunk-Based Development Strategie.*
