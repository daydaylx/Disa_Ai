#!/usr/bin/env bash
set -euo pipefail

# Disa_Ai Issue-Workflow Helper
# Terminal-only. Macht Branch -> Fix -> Acceptance -> Commit -> Push -> PR.
# Benötigt: gh, jq, rg, node, npm|pnpm, npx

need() { command -v "$1" >/dev/null 2>&1 || { echo "FEHLT: $1"; exit 1; }; }
need gh; need jq; need rg; need node; need npx
PM="npm"; command -v pnpm >/dev/null 2>&1 && PM="pnpm"

REPO="${REPO:-daydaylx/Disa_Ai}"
gh repo view "$REPO" >/dev/null || { echo "Repo $REPO nicht erreichbar"; exit 1; }

# Hilfsfunktion: Issue-ID per Titel holen (exakter Match)
iid() {
  local title="$1"
  gh issue list --repo "$REPO" --state open --json number,title \
    --jq '.[]|select(.title=="'"$title"'")|.number'
}

# PR erstellen mit Fixes-Verknüpfung
create_pr() {
  local title="$1"
  local id="$2"
  gh pr create --repo "$REPO" -t "$title" -b "Fixes #$id" || true
}

# ---------- Issue 1: SPA-Fallback ----------
spa() {
  local TITLE="Cloudflare Pages: SPA-Fallback erzwingen"
  local ID; ID="$(iid "$TITLE")"
  if [ -z "${ID}" ]; then echo "Issue nicht offen: $TITLE"; return 1; fi

  git switch -c "fix/spa-fallback-#$ID" 2>/dev/null || git switch "fix/spa-fallback-#$ID"
  mkdir -p public
  printf "/* /index.html 200\n" > public/_redirects
  [ -f public/404.html ] && git rm -f public/404.html || true
  git add public/_redirects
  git commit -m "chore(pages): add SPA fallback redirects for Cloudflare (Fixes #$ID)"
  git push -u origin HEAD
  create_pr "SPA fallback via _redirects" "$ID"

  # Acceptance (Prod curl): Hinweis, lokal nicht prüfbar
  echo ">>> Prüfe Prod (manuell):"
  echo "curl -sI https://disaai.pages.dev/models   | rg -i '200|text/html'"
  echo "curl -sI https://disaai.pages.dev/settings | rg -i '200|text/html'"
}

# ---------- Issue 2: CSP/Headers ----------
csp() {
  local TITLE="CSP/Headers gegen reale Runtime schärfen"
  local ID; ID="$(iid "$TITLE")"
  if [ -z "${ID}" ]; then echo "Issue nicht offen: $TITLE"; return 1; fi

  git switch -c "chore/csp-#$ID" 2>/dev/null || git switch "chore/csp-#$ID"
  mkdir -p public
  cat > public/_headers <<'EOF'
/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; frame-ancestors 'none';
    script-src 'self';
    style-src 'self';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self' https://api.openrouter.ai\;
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
EOF
  git add public/_headers
  git commit -m "chore(security): align CSP & headers with runtime (Fixes #$ID)"
  git push -u origin HEAD
  create_pr "CSP/Headers: tighten to runtime needs" "$ID"

  echo ">>> Nach Deploy Prod-Konsole checken: keine CSP-Violations."
}

# ---------- Issue 5: E2E Deep-Link ----------
deeplink() {
  local TITLE="E2E: Deep-Link + Reload Tests hinzufügen"
  local ID; ID="$(iid "$TITLE")"
  if [ -z "${ID}" ]; then echo "Issue nicht offen: $TITLE"; return 1; fi

  git switch -c "test/deeplink-#$ID" 2>/dev/null || git switch "test/deeplink-#$ID"
  mkdir -p tests/e2e
  cat > tests/e2e/deeplink.spec.ts <<'TS'
import { test, expect } from '@playwright/test';
const routes = ['/quickstart', '/models', '/settings'];
for (const route of routes) {
  test(`SPA deep link + reload: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('[data-testid="app-root"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-testid="app-root"]')).toBeVisible();
  });
}
TS
  # playwright.config.ts minimal, falls fehlt
  if [ ! -f playwright.config.ts ]; then
    cat > playwright.config.ts <<'CFG'
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173' },
  projects: [{ name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }],
  webServer: { command: 'npm run dev', port: 5173, reuseExistingServer: true, timeout: 120000 }
});
CFG
  fi

  # devDep sicherstellen
  if [ "$PM" = "pnpm" ]; then pnpm add -D @playwright/test; else npm i -D @playwright/test; fi
  npx playwright install --with-deps

  git add -A
  git commit -m "test(e2e): add SPA deep link + reload test (Fixes #$ID)"
  git push -u origin HEAD
  create_pr "E2E: deep-link + reload" "$ID"

  echo ">>> Lokal: npx playwright test -g 'deep link'"
}

# ---------- Issue 6: Logs/Secrets ----------
logs() {
  local TITLE="Logs und potenzielle Secrets entfernen"
  local ID; ID="$(iid "$TITLE")"
  if [ -z "${ID}" ]; then echo "Issue nicht offen: $TITLE"; return 1; fi

  git switch -c "chore/logs-#$ID" 2>/dev/null || git switch "chore/logs-#$ID"
  git rm --cached -f autopilot.log 2>/dev/null || true
  grep -qxF 'autopilot.log' .gitignore 2>/dev/null || echo 'autopilot.log' >> .gitignore
  git add .gitignore
  git commit -m "chore(security): drop logs from repo and ignore going forward (Fixes #$ID)"
  git push -u origin HEAD
  create_pr "Hygiene: remove logs & ignore" "$ID"

  echo ">>> Check: git ls-files | rg -n 'autopilot\\.log' || echo OK"
}

# ---------- Issue 9: Deps aufräumen ----------
deps() {
  local TITLE="Dependencies aufräumen (depcheck + audit)"
  local ID; ID="$(iid "$TITLE")"
  if [ -z "${ID}" ]; then echo "Issue nicht offen: $TITLE"; return 1; fi

  git switch -c "chore/deps-#$ID" 2>/dev/null || git switch "chore/deps-#$ID"
  npx depcheck || true
  npm audit --audit-level=moderate || true
  echo ">>> Entferne ungenutzte Deps manuell, dann weiter:"
  echo "git add -A && git commit -m 'chore(deps): prune unused and fix audit findings (Fixes #$ID)' && git push -u origin HEAD"
  echo ">>> Danach PR erstellen:"
  echo "gh pr create --repo '$REPO' -t 'Deps: prune & audit' -b 'Fixes #$ID'"
}

# ---------- Order ----------
order() {
  # empfohlene Reihenfolge für das Grobe
  spa || true
  logs || true
  csp || true
  deeplink || true
  deps || true
  echo ">>> Restliche Issues (Tailwind/Layers/Hooks/CI/Router) jetzt per Patch-Pfad abarbeiten."
}

usage() {
  cat <<USG
Nutzung: $0 [spa|csp|deeplink|logs|deps|order]
  spa       Issue 1 fixen (_redirects) + PR
  csp       Issue 2 CSP/Headers baseline + PR
  deeplink  Issue 5 Playwright-Test + PR
  logs      Issue 6 Logs raus + PR
  deps      Issue 9 depcheck/audit (halbautomatisch) + PR
  order     empfohlene Reihenfolge 1->6->2->5->9
REPO überschreiben: REPO=daydaylx/Disa_Ai $0 order
USG
}

cmd="${1:-usage}"
case "$cmd" in
  spa|csp|deeplink|logs|deps|order) "$cmd" ;;
  *) usage ;;
esac
