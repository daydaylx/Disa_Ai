#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------
# Disa_Ai Projekt-Setup (Cloudflare SPA, CSP, E2E, CI)
# Terminal-only. Keine Placebos. Keine Rückfragen.
# ---------------------------------------------

require() { command -v "$1" >/dev/null 2>&1 || { echo "FEHLT: $1"; exit 1; }; }

echo ">> Preflight"
require git
require node
require jq
require npx

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "${REPO_ROOT}" ]; then
  echo "Nicht in einem Git-Repo. Erst 'git init' oder ins Repo wechseln."
  exit 1
fi
cd "${REPO_ROOT}"

# Node >= 18 prüfen
NODE_MAJ="$(node -p "process.versions.node.split('.')[0]")"
if [ "${NODE_MAJ}" -lt 18 ]; then
  echo "Node ${NODE_MAJ} ist zu alt. Node >= 18 erforderlich."
  exit 1
fi

# Package Manager wählen (pnpm > npm)
if command -v pnpm >/dev/null 2>&1; then PM=pnpm
elif command -v npm  >/dev/null 2>&1; then PM=npm
else
  echo "Weder pnpm noch npm gefunden."
  exit 1
fi

# Git-Branch
SETUP_BRANCH="chore/project-setup"
git fetch --all >/dev/null 2>&1 || true
git checkout -b "${SETUP_BRANCH}" 2>/dev/null || git checkout "${SETUP_BRANCH}"

mkdir -p public tests/e2e .github/workflows scripts ops docs src

# ---------------------------------------------
# 1) Cloudflare SPA-Fallback einrichten
# ---------------------------------------------
echo ">> Cloudflare SPA-Fallback (public/_redirects)"
cat > public/_redirects <<'EOF'
/* /index.html 200
EOF

# 404.html entfernen, wenn sie das Fallback torpediert
if [ -f public/404.html ]; then
  git rm -f public/404.html || true
fi

# ---------------------------------------------
# 2) Security-Header / CSP via public/_headers
#    connect-src ggf. erweitern, wenn du weitere APIs nutzt.
# ---------------------------------------------
echo ">> Security-Header (public/_headers)"
cat > public/_headers <<'EOF'
/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.openrouter.ai
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
EOF

# ---------------------------------------------
# 3) Tailwind: Content-Globs und Safelist-Quelle
#    Strategie: sichere Quell-Datei mit Klassen-Strings,
#    damit Tailwind (v3/v4) die dynamischen Klassen sieht.
# ---------------------------------------------
echo ">> Tailwind Safelist-Quelle src/_safelist.ts"
cat > src/_safelist.ts <<'EOF'
// Diese Datei stellt sicher, dass Tailwind dynamische Klassen im Build sieht.
// Docs: Tailwind scannt Quell-Dateien auf Klassen. (Siehe offizielle 'content' / 'detecting classes' Doku.)
// Füge hier alle dynamisch erzeugten Namen hinzu, die sonst weggepurged würden.

export const TAILWIND_SAFELIST = [
  // Kachel-/Button-/Surface-Varianten – anpassen/erweitern:
  "tile", "tile-lg", "tile-sm",
  "card", "card-ghost", "card-solid",
  "surface", "surface-muted",
  "bubble", "bubble-primary", "bubble-secondary",
  "btn", "btn-primary", "btn-secondary", "btn-ghost",
  // Falls du arbitäre Werte nutzt, hier referenzieren:
  "rounded-2xl", "backdrop-blur", "shadow-xl", "shadow-2xl",
];
EOF

# Tailwind content-Globs konservativ sicherstellen, falls tailwind.config.* existiert
TAILWIND_CFG="$(ls -1 tailwind.config.* 2>/dev/null | head -n1 || true)"
if [ -n "${TAILWIND_CFG}" ]; then
  echo ">> Tailwind config erkannt: ${TAILWIND_CFG}"
  # Nur Hinweise: Wir erzwingen nichts Aggressives per sed, aber geben Warnung aus.
  echo "   Prüfe: content-Globs decken src/**/*.{ts,tsx,css,html} ab. Safelist via src/_safelist.ts referenziert."
else
  echo ">> Keine Tailwind-Konfiguration gefunden. Überspringe Autopatch."
fi

# ---------------------------------------------
# 4) Playwright E2E: Config + Deeplink-Test
# ---------------------------------------------
echo ">> Playwright E2E Setup"
# playwright.config.ts (falls nicht vorhanden) – Mobile-Projekt + WebServer
if [ ! -f playwright.config.ts ]; then
cat > playwright.config.ts <<'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173'
  },
  // Ein mobiles Projekt (Pixel 5); erweiterbar bei Bedarf
  projects: [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }
  ],
  // Startet Vite-Devserver automatisch; PORT anpassbar via ENV
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER || 'npm run dev',
    port: parseInt(process.env.PLAYWRIGHT_WEB_PORT || '5173', 10),
    reuseExistingServer: true,
    timeout: 120 * 1000
  }
});
EOF
fi

# Deeplink-Reload-Test
cat > tests/e2e/deeplink.spec.ts <<'EOF'
import { test, expect } from '@playwright/test';

const routes = [
  '/quickstart',
  '/models',
  '/settings/api',
  '/settings/memory',
  '/settings/filters',
  '/settings/appearance',
  '/settings/data',
];

for (const route of routes) {
  test(`SPA deep link + reload: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('[data-testid="app-root"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-testid="app-root"]')).toBeVisible();
  });
}
EOF

# @playwright/test installieren + Browser
if [ "${PM}" = "pnpm" ]; then
  pnpm add -D @playwright/test
else
  npm i -D @playwright/test
fi
npx playwright install --with-deps

# package.json Scripts ergänzen (idempotent)
if [ -f package.json ]; then
  echo ">> package.json Scripts ergänzen"
  TMP=$(mktemp)
  jq '
    .scripts = (.scripts // {}) |
    .scripts += {
      "test:e2e": "playwright test",
      "playwright": "playwright"
    }
  ' package.json > "$TMP" && mv "$TMP" package.json
fi

# ---------------------------------------------
# 5) Repo-Hygiene: Logs raus, .gitignore anpassen
# ---------------------------------------------
echo ">> Repo-Hygiene"
git rm --cached -f autopilot.log 2>/dev/null || true
grep -qxF 'autopilot.log' .gitignore 2>/dev/null || echo 'autopilot.log' >> .gitignore

# ---------------------------------------------
# 6) GitHub Actions: CI (E2E), CodeQL, Dependabot
# ---------------------------------------------
echo ">> GitHub Actions & Dependabot"

# E2E CI (Node + Playwright)
cat > .github/workflows/ci.yml <<'EOF'
name: CI

on:
  push:
    branches: [ "**" ]
  pull_request:
    branches: [ "**" ]

jobs:
  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install deps
        run: |
          if command -v pnpm >/dev/null 2>&1; then
            corepack enable
            pnpm i
          else
            npm ci
          fi
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run E2E
        env:
          PLAYWRIGHT_WEB_SERVER: npm run dev
          PLAYWRIGHT_WEB_PORT: "5173"
          PLAYWRIGHT_BASE_URL: http://localhost:5173
        run: npx playwright test
EOF

# CodeQL (JS/TS)
cat > .github/workflows/codeql.yml <<'EOF'
name: "CodeQL"

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  schedule:
    - cron: "0 2 * * 1"

jobs:
  analyze:
    name: Analyze (JS/TS)
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    strategy:
      fail-fast: false
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript
          queries: security-extended
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:javascript"
EOF

# Dependabot
mkdir -p .github
cat > .github/dependabot.yml <<'EOF'
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
EOF

# ---------------------------------------------
# 7) Erste Commits
# ---------------------------------------------
echo ">> Git-Commits"
git add -A
git commit -m "chore(ops): Cloudflare SPA fallback, CSP headers, E2E (Playwright), CI (Actions), Dependabot, hygiene"

# ---------------------------------------------
# 8) Hinweise
# ---------------------------------------------
cat <<'TXT'

Setup abgeschlossen.

NÄCHSTE SCHRITTE (ohne Ausreden):
  1) Pushen und PR aufmachen:
       git push --set-upstream origin chore/project-setup
  2) Cloudflare Pages neu deployen.
  3) Auf Prod prüfen:
       - Deep-Link rendert App statt 404 (z.B. /irgendeine-nicht-existierende-route)
       - Konsole zeigt KEINE CSP-Violations
  4) Falls dynamische Klassen fehlen/anders aussehen:
       - src/_safelist.ts erweitern
       - Tailwind content-Globs in tailwind.config.* prüfen

CI blockt Merges, wenn E2E rot ist. Genau so soll es sein.
TXT

echo ">> Fertig."
