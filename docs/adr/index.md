# Architecture Decision Records (ADRs)

Dieses Verzeichnis sammelt alle wichtigen Architektur-Entscheidungen für das Disa AI Projekt.

## Was sind ADRs?

Architecture Decision Records dokumentieren wichtige Architektur-Entscheidungen mit ihrem Kontext und Konsequenzen. Sie helfen dabei:

- **Entscheidungen nachvollziehbar** zu machen
- **Rationale zu bewahren** für zukünftige Entwickler
- **Änderungen zu begründen** wenn sich Anforderungen ändern

## ADR-Format

Wir verwenden ein vereinfachtes ADR-Format mit folgenden Sektionen:

- **Status** - Proposed/Accepted/Deprecated/Superseded
- **Kontext** - Situation und Problemstellung
- **Entscheidung** - Was wurde entschieden
- **Konsequenzen** - Positive und negative Auswirkungen

## Aktuelle ADRs

| Nr. | Titel | Status | Datum |
|-----|-------|--------|-------|
| [0001](0001-error-handling.md) | Error Handling Strategy | Accepted | 2025-01-12 |
| [0002](0002-trunk-based-development.md) | Trunk-Based Development | Accepted | 2025-01-12 |
| [0003](0003-offline-first-testing.md) | Offline-First Testing | Accepted | 2025-01-12 |
| [0004](0004-sessionStorage-api-keys.md) | SessionStorage für API-Keys | Accepted | 2025-01-12 |

## Neues ADR erstellen

1. **Nummer bestimmen:** Nächste fortlaufende Nummer verwenden
2. **Template kopieren:** `cp template.md XXXX-titel.md`
3. **Ausfüllen:** Alle Sektionen vervollständigen
4. **Index aktualisieren:** Eintrag in obiger Tabelle hinzufügen
5. **Review:** ADR über Pull Request einreichen

## ADR-Richtlinien

### Wann ein ADR schreiben?

- **Technologie-Entscheidungen** (Framework-Wahl, Architektur-Pattern)
- **Signifikante Code-Strukturen** (Fehlerbehandlung, State Management)
- **Build/Deploy-Strategien** (CI/CD, Testing-Approaches)
- **Security-Policies** (Authentication, Data Storage)

### Wann KEIN ADR?

- Kleine Implementation-Details
- Reine Code-Style Entscheidungen (das regelt ESLint)
- Temporäre Workarounds
- UI-Design-Entscheidungen (gehören in Design-Docs)

## Verwandte Dokumentation

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Development Guidelines
- [README.md](../../README.md) - Projekt-Übersicht
- [docs/](../) - Weitere Projekt-Dokumentation

---

**Letzte Aktualisierung:** 2025-01-12  
**Maintainer:** @daydaylx