# ADR-0003: Offline-First Testing

**Status:** Accepted  
**Datum:** 2025-01-12  
**Autor(en):** @daydaylx  

## Kontext

Die Chat-Anwendung macht externe API-Calls zu OpenRouter. Für robuste Tests benötigen wir:

- **Reproduzierbare Tests:** Deterministische Ergebnisse unabhängig von Netzwerk
- **CI-Reliability:** Tests dürfen nicht durch externe Service-Ausfälle fehlschlagen
- **Development-Speed:** Schnelle Test-Ausführung ohne echte API-Latency
- **Error-Scenario-Testing:** Simulation von Rate-Limits, Timeouts, Server-Errors

Die ursprüngliche Implementierung verwendete echte API-Calls in Tests, was zu flaky tests und CI-Instabilität führte.

## Betrachtete Optionen

### Option A: Echte API-Calls mit Test-Keys
- **Beschreibung:** Tests verwenden echte OpenRouter-API mit separaten Test-Accounts
- **Vorteile:** 
  - Realistisches Testing
  - Echte API-Kompatibilität
- **Nachteile:**
  - Flaky tests durch Netzwerk-Issues
  - API-Kosten für Tests
  - Abhängigkeit von externer Service-Verfügbarkeit
  - Schwierige Error-Scenario-Simulation

### Option B: MSW (Mock Service Worker) für API-Mocking
- **Beschreibung:** Network-level mocking mit MSW für Unit Tests
- **Vorteile:** 
  - Realistische HTTP-Interception
  - Deterministisches Verhalten
  - Error-Scenarios einfach simulierbar
- **Nachteile:**
  - Zusätzliche Setup-Komplexität
  - MSW-spezifische Bugs möglich
  - Divergenz zwischen Mock und echter API

### Option C: Request Interception in E2E + MSW in Unit
- **Beschreibung:** Playwright Request Interception für E2E, MSW für Unit Tests
- **Vorteile:** 
  - Browser-native E2E-Mocking
  - Vollständige Offline-Fähigkeit
  - JSON-Fixtures für verschiedene Scenarios
  - Realistische Browser-Verhalten
- **Nachteile:**
  - Doppelte Mock-Infrastruktur
  - Playwright-spezifische Setup-Komplexität

## Entscheidung

Wir haben uns für **Option C: Request Interception in E2E + MSW in Unit** entschieden.

**Begründung:**
- **Reliability:** Tests laufen offline und deterministisch
- **Speed:** Keine Netzwerk-Latency in Tests
- **Scenarios:** Einfache Simulation von Error-Cases
- **Realistic:** E2E-Tests verwenden echte Browser-Request-Pipeline

**Entscheidungskriterien:**
- CI-Stability: Kritisch → Offline-Tests notwendig
- Error-Testing: Kritisch → Mock-Framework für Scenario-Simulation
- Performance: Hoch → Lokale Tests deutlich schneller
- Maintenance: Medium → JSON-Fixtures einfach zu updaten

## Konsequenzen

### Positive Auswirkungen
- **Stabile CI:** Tests fehlschlagen nicht durch externe Service-Probleme
- **Schnelle Tests:** Lokale Ausführung ohne Netzwerk-Latency
- **Error-Coverage:** Umfassende Tests für Rate-Limits, Timeouts, Server-Errors
- **Development-UX:** Tests laufen offline, no API-Keys für Development nötig

### Negative Auswirkungen
- **Mock-Maintenance:** JSON-Fixtures müssen bei API-Änderungen updated werden
- **Drift-Risiko:** Mocks können von echter API divergieren
- **Setup-Komplexität:** Zusätzliche Test-Infrastruktur nötig

### Implementierung
- [x] Playwright Request Interception implementiert
- [x] JSON-Fixtures für verschiedene API-Scenarios erstellt
- [x] MSW-Setup für Unit Tests konfiguriert
- [x] E2E-Tests für Chat-Flows mit offline Mocks
- [x] Error-Scenario-Tests (rate-limit, timeout, server-error)
- [ ] API-Contract-Tests für Mock-Validierung

## Links & Referenzen

- [E2E Request Interception](../../tests/e2e/setup/intercept.ts)
- [JSON Fixtures](../../e2e/fixtures/)
- [MSW Test Setup](../../src/test/setup.ts)
- [Playwright Configuration](../../playwright.config.ts)
- [Vitest Configuration](../../vitest.config.ts)

---

**Review:** Dieses ADR wurde reviewed von: Team  
**Letztes Update:** 2025-01-12