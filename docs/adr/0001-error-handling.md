# ADR-0001: Error Handling Strategy

**Status:** Accepted  
**Datum:** 2025-01-12  
**Autor(en):** @daydaylx  

## Kontext

Disa AI als Chat-Anwendung muss verschiedene Fehlerklassen robust behandeln:

- **API-Fehler:** OpenRouter kann rate limits, auth errors, server errors zurückgeben
- **Netzwerk-Fehler:** Timeouts, Konnektivitätsverlust, Abbrüche
- **Client-Fehler:** Validation errors, malformed requests
- **UX-Anforderung:** User-friendly error messages ohne technische Details

Die ursprüngliche Implementierung hatte inkonsistente Fehlerbehandlung mit teilweise ungefangenen Exceptions und unklaren Fehlermeldungen.

## Betrachtete Optionen

### Option A: Exception-basierte Fehlerbehandlung
- **Beschreibung:** Standard JavaScript Exceptions mit try/catch
- **Vorteile:** 
  - Native JavaScript-Semantik
  - Stack traces verfügbar
- **Nachteile:**
  - Inkonsistente Error-Types
  - Schwer zentral zu behandeln
  - Keine strukturierte Metadaten

### Option B: Result-Type Pattern
- **Beschreibung:** Functional programming approach mit Result<T, E>
- **Vorteile:** 
  - Explizite Fehlerbehandlung
  - Type-safe error handling
- **Nachteile:**
  - Hoher Refactoring-Aufwand
  - Ungewöhnlich für React/TypeScript Teams
  - Komplexe Async-Chains

### Option C: Strukturierte Error Classes + Mapping
- **Beschreibung:** Custom Error-Klassen mit zentralem Error-Mapper
- **Vorteile:** 
  - Konsistente Error-Types
  - Zentrale Fehlerbehandlung möglich
  - User-friendly mapping
  - Graduelle Migration möglich
- **Nachteile:**
  - Zusätzliche Abstraktion
  - Error-Mapping muss maintained werden

## Entscheidung

Wir haben uns für **Option C: Strukturierte Error Classes + Mapping** entschieden.

**Begründung:**
- Ermöglicht konsistente UX durch zentrale Fehler-UI-Mapping
- Gradueller Rollout ohne Breaking Changes
- Bessere Debugging-Erfahrung mit strukturierten Error-Types
- Retry-Strategien können fehlerspezifisch implementiert werden

**Entscheidungskriterien:**
- UX-Impact: Hoch (user-friendly error messages)
- Maintainability: Hoch (zentrale Fehlerbehandlung)
- Migration-Effort: Medium (graduelle Einführung möglich)

## Konsequenzen

### Positive Auswirkungen
- **Konsistente UX:** Alle Fehler werden user-friendly dargestellt
- **Besseres Debugging:** Strukturierte Error-Types mit Kontext
- **Retry-Logic:** Intelligente Retry-Strategien per Fehlertyp
- **Monitoring:** Bessere Error-Klassifikation für Analytics

### Negative Auswirkungen
- **Mapping-Overhead:** Error-Mapper muss synchron gehalten werden
- **Type-Komplexität:** Zusätzliche Error-Types im Type-System

### Implementierung
- [x] Error-Klassen definieren (`TimeoutError`, `RateLimitError`, etc.)
- [x] Zentraler `mapError()` implementiert
- [x] UI-Komponenten für Error-Display
- [x] Retry-Strategien pro Error-Type
- [x] Tests für Error-Handling-Flows

## Links & Referenzen

- [Error Mapper Implementation](../../src/lib/errors/mapper.ts)
- [Error Types Definition](../../src/lib/errors/types.ts)
- [Retry Logic](../../src/lib/net/retry.ts)
- [UI Error Display](../../src/components/feedback/ErrorState.tsx)

---

**Review:** Dieses ADR wurde reviewed von: Team  
**Letztes Update:** 2025-01-12