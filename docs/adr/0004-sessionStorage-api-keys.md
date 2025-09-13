# ADR-0004: SessionStorage für API-Keys

**Status:** Accepted  
**Datum:** 2025-01-12  
**Autor(en):** @daydaylx  

## Kontext

API-Keys sind sensible Daten, die sicher gespeichert werden müssen:

- **Security:** API-Keys sollten nicht persistent gespeichert werden
- **UX:** Keys sollten während Browser-Session verfügbar bleiben
- **Migration:** Legacy localStorage-Keys müssen migriert werden
- **Multi-Tab:** Keys sollten zwischen Tabs geteilt werden (während Session)

Die ursprüngliche Implementierung verwendete localStorage, was API-Keys persistent speicherte und ein Security-Risiko darstellte.

## Betrachtete Optionen

### Option A: localStorage (Status Quo)
- **Beschreibung:** API-Keys in localStorage mit permanenter Speicherung
- **Vorteile:** 
  - Einfachste Implementierung
  - Keys überleben Browser-Restart
- **Nachteile:**
  - Security-Risiko durch permanente Speicherung
  - Keys überleben Browser-Restart (unerwünscht)
  - Zugänglich für andere Scripts
  - Schwer zu löschen bei Logout

### Option B: Nur sessionStorage
- **Beschreibung:** API-Keys nur in sessionStorage ohne localStorage-Fallback
- **Vorteile:** 
  - Session-only Speicherung (automatische Expiry)
  - Bessere Security als localStorage
  - Einfache Implementierung
- **Nachteile:**
  - Breaking Change für bestehende User
  - Keine Migration von bestehenden Keys
  - User müssen Keys neu eingeben

### Option C: sessionStorage mit localStorage-Migration
- **Beschreibung:** sessionStorage primär, automatische Migration von localStorage
- **Vorteile:** 
  - Security-Verbesserung ohne Breaking Changes
  - Graceful Migration für bestehende User
  - Session-only Speicherung für neue Keys
  - Automatic Cleanup von localStorage-Keys
- **Nachteile:**
  - Komplexere Implementierung
  - Migration-Code muss maintained werden

### Option D: Memory-only (keine Persistierung)
- **Beschreibung:** API-Keys nur im Memory, keine Browser-Speicherung
- **Vorteile:** 
  - Maximale Security
  - Keine Persistierung-Risiken
- **Nachteile:**
  - Schlechte UX (Key bei jedem Tab/Reload neu eingeben)
  - Nicht praktikabel für normale Nutzung

## Entscheidung

Wir haben uns für **Option C: sessionStorage mit localStorage-Migration** entschieden.

**Begründung:**
- **Security-First:** sessionStorage ist sicherer als localStorage (automatic expiry)
- **Backward-Compatibility:** Bestehende User behalten ihre Keys (migration)
- **UX-Balance:** Keys bleiben während Session verfügbar, aber not persistent
- **Clean Migration:** localStorage-Keys werden nach Migration gelöscht

**Entscheidungskriterien:**
- Security: Kritisch → sessionStorage-only für neue Keys
- User-Experience: Hoch → Keine Breaking Changes für bestehende User
- Maintainability: Medium → Migration-Code relativ einfach
- Compliance: Hoch → Session-only Keys reduzieren Datenschutz-Risiken

## Konsequenzen

### Positive Auswirkungen
- **Verbesserte Security:** API-Keys werden automatisch bei Browser-Close gelöscht
- **Smooth Migration:** Bestehende User merken keinen Unterschied
- **Clean State:** localStorage wird von API-Keys bereinigt
- **Session-Scoped:** Keys sind nur während aktiver Browser-Session verfügbar

### Negative Auswirkungen
- **Migration-Overhead:** Zusätzlicher Code für localStorage→sessionStorage-Migration
- **Key-Re-Entry:** User müssen API-Keys nach Browser-Restart neu eingeben
- **Multi-Device:** Keys sind nicht mehr zwischen Browser-Sessions persistent

### Implementierung
- [x] sessionStorage als primärer Key-Storage implementiert
- [x] Automatische Migration von localStorage zu sessionStorage
- [x] Multi-Candidate-Support für verschiedene Key-Namen
- [x] `clearAllApiKeys()` für secure Logout implementiert
- [x] `hasApiKey()` Helper für Key-Status-Checks
- [x] Tests für Migration und Edge-Cases
- [x] Security-Headers für zusätzliche Absicherung

## Links & Referenzen

- [Key Storage Implementation](../../src/lib/openrouter/key.ts)
- [Migration Tests](../../src/lib/openrouter/__tests__/keyLifecycle.test.ts)
- [Security Headers](../../public/_headers)
- [API Integration](../../src/api/openrouter.ts)

---

**Review:** Dieses ADR wurde reviewed von: Team  
**Letztes Update:** 2025-01-12