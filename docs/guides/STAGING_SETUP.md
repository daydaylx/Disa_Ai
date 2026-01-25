# Staging-Umgebung Setup Guide

Diese Dokumentation beschreibt die Einrichtung einer dedizierten Staging-Umvironment für Disa AI.

## Übersicht

Disa AI nutzt bereits **Preview-Deployments** für Pull Requests über Cloudflare Pages. Dieses Dokument beschreibt die Erweiterung mit einem dedizierten Staging-Branch für umfassende Tests vor der Produktion.

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                        │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Production   │  │   Staging    │  │   Preview    │ │
│  │   (main)    │  │ (staging)    │  │     (PRs)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                │                │                │
│         ▼                ▼                ▼                │
│  disaai.de      staging.disaai.de   <hash>.disa-ai.pages.dev│
│                                                           │
│  Environment Variables:                                      │
│  - OPENROUTER_API_KEY (prod)                               │
│  - OPENROUTER_API_KEY (staging - separater Key)             │
│  - ZAI_API_KEY (prod)                                    │
│  - ZAI_API_KEY (staging - separater Key)                   │
└─────────────────────────────────────────────────────────────┘
```

## Voraussetzungen

1. **Cloudflare Pages** bereits konfiguriert
2. **GitHub Repository** mit Cloudflare Pages Integration
3. **Separate API-Keys** für Staging (OpenRouter, Z.AI, etc.)

## Einrichtung

### 1. Staging-Branch erstellen

```bash
# Erstelle Staging-Branch von main
git checkout main
git pull origin main
git checkout -b staging
git push -u origin staging
```

### 2. Cloudflare Pages Staging-Projekt erstellen

1. Öffne Cloudflare Dashboard → Pages
2. Klicke "Create a project"
3. Verbinde mit GitHub Repository
4. **Build Settings:**
   - **Branch name:** `staging`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Environment Variables:**
   - Setze alle Secrets mit `STAGING_` Prefix
   - **Wichtig:** Nutze separate API-Keys für Staging

### 3. Custom Domain für Staging konfigurieren

1. Öffne Staging-Projekt in Cloudflare Pages
2. Gehe zu "Custom domains"
3. Füge Domain hinzu: `staging.disaai.de`
4. DNS-Einträge werden automatisch erstellt

### 4. Environment Variables konfigurieren

#### Production (disaai.de)
```bash
OPENROUTER_API_KEY=sk-or-v1-<prod-key>
ZAI_API_KEY=<prod-key>
RESEND_API_KEY=<prod-key>
DISA_FEEDBACK_TO=grunert94@hotmail.com
SENTRY_AUTH_TOKEN=<prod-sentry-token>
SENTRY_DSN=<prod-sentry-dsn>
```

#### Staging (staging.disaai.de)
```bash
OPENROUTER_API_KEY=sk-or-v1-<staging-key>
ZAI_API_KEY=<staging-key>
RESEND_API_KEY=<staging-key>
DISA_FEEDBACK_TO=test-feedback@disaai.de
SENTRY_AUTH_TOKEN=<staging-sentry-token>
SENTRY_DSN=<staging-sentry-dsn>
SENTRY_ENVIRONMENT=staging
```

### 5. Routing-Regeln für API-Endpunkte

Erstelle `wrangler.toml` für Staging:

```toml
# wrangler.toml for Staging
name = "disa-ai-staging"
main = "functions/api/chat.ts"
compatibility_date = "2024-01-01"

[env.staging]
vars = { ENVIRONMENT = "staging" }

[[env.staging.routes]]
pattern = "staging.disaai.de/api/*"
```

## Workflow

### Feature-Development

```bash
# 1. Erstelle Feature-Branch von staging
git checkout staging
git pull origin staging
git checkout -b feature/my-feature

# 2. Entwickle und teste lokal
npm run dev

# 3. Commit und Push
git add .
git commit -m "feat: add my feature"
git push -u origin feature/my-feature

# 4. Erstelle PR: feature/my-feature → staging
# 5. Preview-Deployment wird automatisch erstellt
# 6. Teste auf <hash>.disa-ai.pages.dev
```

### Staging → Production Merge

```bash
# 1. Nach Tests auf Staging:
git checkout staging
git merge feature/my-feature
git push origin staging

# 2. Teste auf staging.disaai.de

# 3. Merge Staging → Production
git checkout main
git merge staging
git push origin main

# 4. Production-Deployment auf disaai.de
```

## GitHub Actions Workflow

### Staging-Test-Workflow

Erstelle `.github/workflows/deploy-staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches: [staging]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run verify
      
      - name: Build for Staging
        run: npm run build
        env:
          VITE_BUILD_ID: ${{ github.sha }}
          VITE_ENVIRONMENT: staging
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: disa-ai-staging
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Sicherheit

### API-Key Isolierung

- ✅ Staging nutzt **separate API-Keys**
- ✅ Kein Zugriff auf Production-Daten
- ✅ Test-E-Mails gehen an Test-Adresse
- ✅ Sentry Environment-Tagging (`staging` vs `production`)

### Access Control

- **Staging:** Zugriff nur für Development-Team
- **Preview:** Öffentlich, aber mit Wasserzeichen
- **Production:** Öffentlich, produktionsbereit

### Rate Limiting

Staging-Umgebung kann aggressivere Rate Limits nutzen:
```bash
RATE_LIMIT_MAX_REQUESTS=200  # Staging: mehr Requests
RATE_LIMIT_WINDOW_MS=60000
```

## Monitoring

### Sentry Environment-Filtering

```javascript
// In src/lib/sentry.ts (falls vorhanden)
Sentry.init({
  environment: import.meta.env.VITE_ENVIRONMENT || 'production',
  // ...
});
```

### Lighthouse CI

Führe Lighthouse-Tests auf Staging durch:

```bash
# Lokale Tests gegen Staging
LHCI_BASE_URL=https://staging.disaai.de npm run lh
```

## Best Practices

### 1. Staging als Gate

- ✅ Alle Features müssen auf Staging getestet werden
- ✅ E2E-Tests laufen auf Staging
- ✅ Performance-Tests auf Staging
- ✅ Accessibility-Tests auf Staging

### 2. Production-Deployments

- ✅ Nur von Staging → Main
- ✅ Keine direkten Commits nach Main
- ✅ Protected Branches aktivieren
- ✅ Required Reviews: 2

### 3. Rollback-Strategie

```bash
# Rollback auf Staging
git revert <commit-hash>
git push origin staging

# Rollback auf Production
git revert <commit-hash>
git push origin main
```

## Troubleshooting

### Deployment fehlgeschlagen

1. Prüfe Cloudflare Pages Build-Logs
2. Prüfe Environment Variables
3. Lokaler Build-Test: `npm run build`

### API-Keys funktionieren nicht

1. Prüfe ob Staging-Keys korrekt gesetzt
2. Prüfe API-Key-Format (`sk-or-v1-`)
3. Prüfe Rate Limits

### Sentry-Events erscheinen in Production

1. Prüfe `VITE_ENVIRONMENT` Variable
2. Prüfe Sentry DSN
3. Prüfe Environment-Tagging in Sentry

## Kosten

### Cloudflare Pages

- **Free Tier:** 500 Builds/Monat
- **Staging:** ~50-100 Builds/Monat
- **Preview:** ~50-200 Builds/Monat
- **Production:** ~10-20 Builds/Monat

### API-Costs

- **Staging:** Nutzung mit Test-Keys (reduzierte Costs)
- **Production:** Produktive Nutzung

## Nächste Schritte

1. ✅ Staging-Branch erstellen
2. ✅ Cloudflare Pages Staging-Projekt einrichten
3. ✅ Custom Domain konfigurieren
4. ✅ Environment Variables setzen
5. ✅ GitHub Actions Workflow erstellen
6. ✅ E2E-Tests gegen Staging einrichten
7. ✅ Monitoring und Alerts konfigurieren

## Referenzen

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Sentry Environment Documentation](https://docs.sentry.io/platforms/javascript/guides/react/configuration/environments/)