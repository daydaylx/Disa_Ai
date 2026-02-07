# Known Issues – Beta Release Candidate

> Letzte Aktualisierung: 2026-02-07
> Version: v1.0.0 Beta RC

Diese Datei listet bekannte Probleme auf, die während der Beta-Phase auftreten können. Die meisten sind Minor-Issues und werden in kommenden Updates behoben.

---

## 🔴 Kritisch

### ✅ FIXED: Unsichere CORS Origin-Validierung (2026-02-07)
- **Beschreibung**: Chat-Proxy und Feedback-Endpoint verwendeten unsichere `startsWith()`-Prüfung für Origins
- **Risiko**: Erlaubte Spoofing-Angriffe (z.B. `disaai.de.evil.com`)
- **Status**: ✅ Behoben - Strikte URL-Parsing und exakte Hostname-Prüfung implementiert
- **Fix-Commit**: [siehe commit history]

### ✅ FIXED: Feedback-Endpoint ohne Rate Limiting (2026-02-07)
- **Beschreibung**: Feedback-API hatte `Access-Control-Allow-Origin: *` und kein Rate Limiting
- **Risiko**: Spam/Abuse von beliebigen Origins möglich
- **Status**: ✅ Behoben - CORS-Allowlist + KV-basiertes Rate Limiting (5 req / 10 min) implementiert
- **Fix-Commit**: [siehe commit history]

### ✅ FIXED: Streaming Performance bei langen Conversations (2026-02-07)
- **Beschreibung**: `chatReducer` nutzte `slice().reverse()` pro Token-Chunk → O(n) Arbeit
- **Symptom**: UI-Lags bei 500+ Nachrichten während Streaming
- **Status**: ✅ Behoben - Index-Caching implementiert für O(1) Updates
- **Fix-Commit**: [siehe commit history]

---

## 🟠 Wichtig

### Mobile Keyboard Handling
- **Beschreibung**: Auf einigen Android-Geräten kann das virtuelle Keyboard den Chat-Composer überdecken
- **Workaround**: Scrollen oder Keyboard manuell schließen und neu öffnen
- **Status**: Wird untersucht (Browser-abhängig)
- **Issue**: TBD

### Service Worker Update-Prompt
- **Beschreibung**: Update-Banner erscheint manchmal verzögert nach App-Update
- **Workaround**: Seite manuell neu laden (Ctrl+R / Cmd+R)
- **Status**: PWA-spezifisches Verhalten
- **Issue**: TBD

---

## 🟡 Minor

### IndexedDB Storage Limits
- **Beschreibung**: Bei sehr vielen Gesprächen (>500) kann IndexedDB langsam werden
- **Workaround**: Alte Gespräche regelmäßig exportieren und löschen
- **Status**: Performance-Optimierung geplant
- **Issue**: TBD

### Theme-Switching Flicker
- **Beschreibung**: Kurzes Aufblitzen beim Wechsel zwischen Dark/Light Mode
- **Workaround**: Keiner erforderlich (kosmetisch)
- **Status**: CSS-Transitions werden optimiert
- **Issue**: TBD

### Markdown Rendering Edge Cases
- **Beschreibung**: Sehr komplexe verschachtelte Code-Blöcke werden manchmal nicht korrekt gerendert
- **Workaround**: Code-Block vereinfachen oder manuell formatieren
- **Status**: Prism.js-Limitierung (KaTeX/LaTeX ist aktuell nicht implementiert)
- **Issue**: TBD

---

## ✅ Browser-Kompatibilität

| Browser | Desktop | Mobile | PWA Install | Notes |
|---------|---------|--------|-------------|-------|
| Chrome | ✅ | ✅ | ✅ | Empfohlen |
| Edge | ✅ | ✅ | ✅ | Chromium-basiert |
| Safari | ⚠️ | ⚠️ | ⚠️ | Einige PWA-Features limitiert |
| Firefox | ✅ | ✅ | ❌ | PWA-Install nicht unterstützt |
| Samsung Internet | ✅ | ✅ | ✅ | Android empfohlen |

**Legende:**
✅ Voll unterstützt | ⚠️ Eingeschränkt | ❌ Nicht unterstützt

---

## 📱 Mobile-Spezifisch

### iOS Safari
- **Issue**: Virtuelle Viewport-Höhe (`100dvh`) kann bei Toolbar-Animation springen
- **Workaround**: Wird durch CSS `env(safe-area-inset)` gemildert
- **Status**: iOS-Browser-Einschränkung

### Android WebView
- **Issue**: Pull-to-Refresh kann mit Swipe-Gesten kollidieren
- **Workaround**: In nativen Apps WebView-Overscroll deaktivieren
- **Status**: WebView-Konfiguration

---

## 🛠️ Development/Testing

### Vitest Coverage Thresholds
- **Issue**: Coverage könnte initial unter 60% liegen (Target: 60-70%)
- **Status**: Tests werden kontinuierlich erweitert
- **Action**: Siehe `vitest.config.ts` für aktuelle Thresholds

### E2E Test Flakiness
- **Issue**: Einige Playwright-Tests können in CI intermittierend fehlschlagen
- **Workaround**: Retry-Strategie aktiv (1 Retry in CI)
- **Status**: Timeouts werden optimiert

---

## 🔒 Sicherheit & Privacy

### OpenRouter API Key Storage
- **Beschreibung**: API-Key wurde bisher in localStorage persistiert.
- **Status**: Ab 27.11.2025 Migration auf sessionStorage-only; Legacy-Keys werden beim Laden nach sessionStorage migriert und aus localStorage entfernt. Verschlüsselung bleibt Roadmap-Item.
- **Workaround**: Keys regelmäßig rotieren; Tab schließen entfernt gespeicherten Key.

---

## 📋 Meldung neuer Issues

Wenn du ein Problem findest, das hier nicht aufgelistet ist:

1. **Prüfe**: Ist es reproduzierbar? (mindestens 2x)
2. **Info sammeln**:
   - Browser & Version
   - Device (Desktop/Mobile, OS)
   - Schritte zur Reproduktion
   - Screenshots/Console-Logs (falls relevant)
3. **Melden**:
   - GitHub Issue erstellen: [Issues](https://github.com/daydaylx/Disa_Ai/issues)
   - Oder per E-Mail: [Support-Kontakt einfügen]

---

## ✨ Positives Feedback

Falls die App **ohne** Issues läuft, freuen wir uns über Feedback zu:
- Performance auf deinem Device
- UI/UX-Verbesserungsvorschläge
- Feature-Wünsche

Danke fürs Testen! 🚀
