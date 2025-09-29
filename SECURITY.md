# Security Policy

## Supported Versions

Disa AI ist ein experimentelles PWA-Projekt. Sicherheitsupdates werden nur für die neueste Version bereitgestellt.

| Version  | Supported          |
| -------- | ------------------ |
| latest   | :white_check_mark: |
| < latest | :x:                |

## Security Architecture

### Client-Side Security

**API Key Management:**

- API-Schlüssel werden ausschließlich in `sessionStorage` gespeichert
- Automatische Löschung beim Schließen des Browsers
- Keine Übertragung an Server oder externe Services
- Validierung des OpenRouter-Format (`sk-or-*`)

**Content Security Policy:**

- Strict CSP-Header in `public/_headers`
- Inline-Scripts nur mit Nonce
- Keine eval() oder unsafe-inline Ausführung
- Externe Ressourcen auf vertrauenswürdige Domains beschränkt

**Data Handling:**

- Alle Unterhaltungen lokal in IndexedDB/localStorage
- Keine Server-seitige Speicherung von Nutzerdaten
- Offline-First Architektur minimiert Datenübertragung

### Infrastructure Security

**Deployment:**

- Gehostet auf Cloudflare Pages mit Edge-Security
- HTTPS-only mit HSTS-Header
- Automatische SSL/TLS-Verschlüsselung
- DDoS-Schutz durch Cloudflare

**Build Security:**

- Deterministische Builds mit Build-ID Tracking
- Dependency-Scanning in CI/CD Pipeline
- Secret-Scanning mit TruffleHog
- Automated Security Updates (Dependabot/Renovate)

## Reporting a Vulnerability

**Bevorzugte Meldewege:**

1. GitHub Security Advisory (bevorzugt für kritische Issues)
2. GitHub Issues (für weniger kritische Probleme)
3. E-Mail an Repository-Maintainer

**Was zu melden:**

- Sicherheitslücken in Dependencies
- XSS oder andere Client-Side Vulnerabilities
- Probleme mit API-Key-Handling
- CSP-Umgehungen
- Session-Management-Probleme

**Response Timeline:**

- **Acknowledgment:** 48 Stunden
- **Initial Assessment:** 1 Woche
- **Resolution:** 2-4 Wochen (je nach Schweregrad)

**Severity Levels:**

- **Critical:** API-Key Exfiltration, RCE, Data Breach
- **High:** XSS, CSRF, Authentication Bypass
- **Medium:** Information Disclosure, DoS
- **Low:** UI Redressing, Non-Critical Information Leaks

## Security Considerations for Contributors

**Development Guidelines:**

- Niemals Geheimnisse oder API-Keys committen
- ESLint-Security-Rules beachten
- Input-Validierung für alle User-Inputs
- Sichere Default-Einstellungen verwenden

**Testing:**

- Security-Tests in der CI-Pipeline erforderlich
- Manuelle Security-Reviews für kritische Änderungen
- Dependency-Updates regelmäßig testen

**Third-Party Integrations:**

- Neue Dependencies müssen Security-Review durchlaufen
- Minimale Berechtigungen für externe Services
- Regelmäßige Audits der Dependency-Chain

## Known Security Limitations

**Client-Side Application:**

- Vollständiger Schutz vor Client-Side-Manipulation nicht möglich
- Source-Code ist öffentlich einsehbar
- Browser-Sicherheitsfeatures sind erforderlich

**API-Abhängigkeit:**

- Sicherheit abhängig von OpenRouter API-Security
- Rate-Limiting und Abuse-Protection durch API-Provider
- Keine Kontrolle über Upstream-Sicherheit

**Offline-Funktionalität:**

- Lokale Datenspeicherung kann bei kompromittierten Geräten zugänglich sein
- Service Worker Cache kann sensitive Daten enthalten
- Browser-Sicherheitsmodell ist entscheidend

## Security Updates

**Monitoring:**

- Automated Dependency-Scanning mit Dependabot
- GitHub Security Advisories für kritische Issues
- Regelmäßige Manual-Reviews der Security-Posture

**Update-Prozess:**

- Sicherheitsupdates haben höchste Priorität
- Breaking Changes werden dokumentiert
- Rollback-Strategie für kritische Fixes verfügbar
