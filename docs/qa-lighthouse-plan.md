# QA – Lighthouse & Axe (Dark Theme Baseline)

## Hintergrund
Der manuelle Lighthouse-Lauf im lokalen Container schlägt aktuell mit `spawnSync /bin/sh EPERM` fehl – Chrome fehlt im Environment. Damit trotzdem kontinuierlich Accessibility-/Performance-Berichte entstehen, sollte Lighthouse/Axe in der CI (z. B. GitHub Actions) laufen.

## Empfohlene Schritte

### 1. Github Action für Lighthouse
```yaml
name: Lighthouse CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npx serve -s dist -l 4173 &
      - run: npx lighthouse http://localhost:4173 --only-categories=accessibility,best-practices,performance --chrome-flags="--headless --disable-gpu"
        env:
          CI: true
```
*Optional:* Ergebnisse in `.lighthouseci/` speichern oder Lighthouse CI Service anbinden.

### 2. Axe Tests in Playwright / Storybook
- Playwright-Axe-Erweiterung (`@axe-core/playwright`) nutzen, um zentrale Seiten (Chat, Command Palette, Settings) auf WCAG-Violations zu prüfen.
- Alternativ Storybook + Storybook A11y Plugin für Komponenten.

### 3. Lokale Checks (Fallback)
Falls Chrome verfügbar:
```bash
npm run build
npx http-server dist -p 4173
npx lighthouse http://localhost:4173 --only-categories=accessibility --chrome-flags="--headless"
```

## Offene Punkte
- Chat History `aria-selected` – eigener Issue empfohlen.
- Safari `color-mix` Fallback mittelfristig ergänzen.
