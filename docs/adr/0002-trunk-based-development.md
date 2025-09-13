# ADR-0002: Trunk-Based Development

**Status:** Accepted  
**Datum:** 2025-01-12  
**Autor(en):** @daydaylx  

## Kontext

Das Projekt benötigt eine klare Branch-Strategie für:

- **Entwicklungsgeschwindigkeit:** Schnelle Feature-Entwicklung ohne komplexe Merge-Konflikte
- **Deployment-Simplicity:** Einfache, vorhersagbare Deployments
- **Code-Quality:** Sicherstellen dass nur getesteter Code deployed wird
- **Team-Coordination:** Klare Regeln für Collaboration

Alternative Branch-Strategien wie GitFlow oder GitHub Flow wurden evaluiert, aber die Komplexität erscheint für ein Solo/Small-Team-Projekt überdimensioniert.

## Betrachtete Optionen

### Option A: GitFlow
- **Beschreibung:** Separate develop/release/hotfix/feature branches
- **Vorteile:** 
  - Etablierter Standard
  - Klare Release-Zyklen
- **Nachteile:**
  - Hohe Komplexität für kleine Teams
  - Merge-Konflikte zwischen develop/main
  - Langlebige Feature-Branches führen zu Integration-Problemen

### Option B: GitHub Flow
- **Beschreibung:** Feature-Branches + main, aber ohne develop
- **Vorteile:** 
  - Einfacher als GitFlow
  - PRs enforced
- **Nachteile:**
  - Kann zu langlebigen Feature-Branches führen
  - Keine expliziten Integration-Regeln

### Option C: Trunk-Based Development
- **Beschreibung:** Ein main-Branch, kurze Feature-Branches (<2 Tage)
- **Vorteile:** 
  - Minimale Merge-Konflikte
  - Kontinuierliche Integration
  - Schnelle Feedback-Zyklen
  - Einfache Deployment-Pipeline
- **Nachteile:**
  - Erfordert Feature-Flags für unfertige Features
  - Höhere Disziplin bei Commit-Quality

## Entscheidung

Wir haben uns für **Option C: Trunk-Based Development** entschieden.

**Begründung:**
- **Geschwindigkeit:** Keine langwierigen Integration-Branches
- **Simplicity:** Eine einzige Source of Truth (`main`)
- **Quality Gates:** CI-Pipeline enforced saubere Commits
- **Deployment:** Jeder Commit auf main ist potentiell deploybar

**Entscheidungskriterien:**
- Team-Größe: Klein (1-3 Entwickler) → wenig Koordinationsoverhead
- Release-Frequency: Kontinuierlich → kein Bedarf für Release-Branches
- Feature-Größe: Kleine, atomare Features → kurze Entwicklungszyklen

## Konsequenzen

### Positive Auswirkungen
- **Schnelle Integration:** Features werden schnell integriert und getestet
- **Einfache CI/CD:** Linear pipeline ohne Branch-Komplexität
- **Weniger Merge-Konflikte:** Kurze Feature-Branches reduzieren Konflikte
- **Bessere Code-Quality:** Continuous feedback durch häufige Integration

### Negative Auswirkungen
- **Feature-Flag-Overhead:** Unfertige Features benötigen Feature-Flags
- **Commit-Disziplin:** Jeder Commit muss production-ready sein
- **Breaking-Changes:** Müssen durch Migration-Strategien abgefedert werden

### Implementierung
- [x] Branch Protection Rules für `main` konfiguriert
- [x] CI-Pipeline mit Quality Gates implementiert
- [x] CONTRIBUTING.md mit Trunk-Based-Rules dokumentiert
- [x] PR-Template mit Review-Checkliste erstellt
- [ ] Feature-Flag-System für experimentelle Features

## Links & Referenzen

- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [CI Pipeline](.github/workflows/ci.yml)
- [Trunk-Based Development](https://trunkbaseddevelopment.com/)
- [PR Template](../../.github/pull_request_template.md)

---

**Review:** Dieses ADR wurde reviewed von: Team  
**Letztes Update:** 2025-01-12