#!/usr/bin/env bash
set -euo pipefail

# Repo kann via ENV überschrieben werden: REPO=owner/name ./scripts/create_github_issues.sh
REPO="${REPO:-daydaylx/Disa_Ai}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "FEHLT: $1"; exit 1; }; }
need gh
need mktemp

echo ">> Prüfe GitHub-Authentifizierung…"
gh auth status >/dev/null || { echo "Nicht bei GitHub eingeloggt. 'gh auth login' ausführen."; exit 1; }

echo ">> Ziel-Repo: $REPO"
gh repo view "$REPO" >/dev/null || { echo "Repo '$REPO' nicht gefunden."; exit 1; }

ensure_label () {
  local name="$1" color="$2" desc="$3"
  gh label view "$name" --repo "$REPO" >/dev/null 2>&1 || \
    gh label create "$name" --color "$color" --description "$desc" --repo "$REPO" >/dev/null
}

echo ">> Stelle Labels sicher…"
# type
ensure_label "type:fix"      "d73a4a" "Bugfix / konkreter Fix"
ensure_label "type:chore"    "cfd3d7" "Aufräumen / Maintenance"
ensure_label "type:refactor" "0366d6" "Refactor / Struktur"
ensure_label "type:test"     "5319e7" "Tests / E2E / Unit"
ensure_label "type:ci"       "a2eeef" "CI / Automatisierung"
# priority
ensure_label "priority:critical" "b60205" "Blocker / Produktionsfehler"
ensure_label "priority:high"     "d93f0b" "Hoch priorisiert"
ensure_label "priority:medium"   "fbca04" "Mittlere Priorität"
# scope
ensure_label "scope:routing"  "0e8a16" "Routing / SPA / Router"
ensure_label "scope:security" "e99695" "Security / CSP / Headers"
ensure_label "scope:ui"       "1d76db" "UI / Styling / Layer"
ensure_label "scope:ci"       "0052cc" "CI / Workflows"
ensure_label "scope:infra"    "5319e7" "Infra / Deps / Build"

new_issue () {
  local title="$1"; shift
  local labels_csv="$1"; shift
  local body="$1"; shift || true

  local tmp
  tmp="$(mktemp)"
  printf "%s\n" "$body" > "$tmp"
  gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --label "$labels_csv" \
    --body-file "$tmp"
  rm -f "$tmp"
}

# -------------------------------
# Issue 1 — SPA-Fallback
# -------------------------------
new_issue "Cloudflare Pages: SPA-Fallback erzwingen" \
"type:fix,priority:critical,scope:routing" \
"**Kategorie:** Bug/Deployment  
**Severity:** Critical  
**Scope of change:** \`public/_redirects\` (neu), optional \`public/404.html\` entfernen

**Current behavior**  
Direktaufrufe/Reloads auf Subroutes liefern 404 oder leere Seite.

**Expected behavior**  
Alle Subroutes rendern die App (\`index.html\`) auch bei Deep-Link und Reload.

**Repro (Terminal, Prod):**
\`\`\`bash
curl -sI https://disaai.pages.dev/models    | rg -i '200|text/html' || echo FAIL
curl -sI https://disaai.pages.dev/settings  | rg -i '200|text/html' || echo FAIL
curl -sI https://disaai.pages.dev/nicht-da  | rg -i '200|text/html' || echo FAIL
\`\`\`

**Fix**  
\`public/_redirects\` anlegen mit exakt:
\`\`\`
/* /index.html 200
\`\`\`
Falls \`public/404.html\` existiert und kein Custom-404 benötigt wird: löschen.

**Risks/Rollback**  
Minimal; bei Problemen \`_redirects\` revertieren.

**Acceptance (messbar)**
- Obige \`curl\`-Checks zeigen jeweils \`200\` und \`content-type: text/html\`.
- Playwright-Deeplink-Test (Issue 5) grün.

**Commit:** \`chore(pages): add SPA fallback redirects for Cloudflare (Refs: spa-fallback-cloudflare)\`
"

# -------------------------------
# Issue 2 — CSP/Headers
# -------------------------------
new_issue "CSP/Headers gegen reale Runtime schärfen" \
"type:chore,priority:high,scope:security" \
"**Kategorie:** Security/Config  
**Severity:** High  
**Scope of change:** \`public/_headers\`

**Current behavior**  
CSP ist potenziell zu strikt/zu lax. Risiko: blockierte Styles/Skripte oder offene Policy.

**Expected behavior**  
Eine konsistente CSP in \`_headers\`, die alle real genutzten Origins erlaubt und sonst dicht ist.

**Repro**
1) Externe Origins aus Code extrahieren:
\`\`\`bash
rg -No '(https?://[a-z0-9\.\-]+(?:/[^\")'\''\s]+)?)' -g '!node_modules' -g 'src/**' | sort -u
\`\`\`
2) Prod-Konsole öffnen, auf CSP-Violations prüfen (keine Errors).

**Fix (Beispiel, anpassen falls weitere Endpoints/Fonts/CDNs):**
\`\`\`
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
\`\`\`

**Risks/Rollback**  
Zu strikte CSP blockiert Runtime. Vor Deploy lokal testen.

**Acceptance**
- Keine CSP-Violations in Prod-Konsole.
- Lighthouse „Best Practices/Security“ ≥ 90, keine geblockten App-Assets.

**Commit:** \`chore(security): align CSP and headers with runtime (Refs: csp-headers-audit)\`
"

# -------------------------------
# Issue 3 — Tailwind Safelist/Content
# -------------------------------
new_issue "Tailwind: Content-Globs + Safelist für dynamische Klassen" \
"type:fix,priority:high,scope:ui" \
"**Kategorie:** UI/Build  
**Severity:** High  
**Scope of change:** \`tailwind.config.ts\` (content + \`safelist\`), optional \`src/_safelist.ts\`

**Current behavior**  
Dynamisch erzeugte Klassen (z. B. \`tile-*\`, \`card-*\`, \`btn-*\`) fehlen im Prod-CSS; Kacheloptik abweichend.

**Expected behavior**  
Alle benötigten dynamischen Klassen werden nicht weggepurged.

**Repro**
\`\`\`bash
npm run build || pnpm build
rg -n 'tile-|card-|btn-|bubble-|surface-' dist/**/*.css || echo FEHLT
\`\`\`

**Fix**
- \`tailwind.config.ts\`:
\`\`\`ts
export default {
  content: ['./index.html','./src/**/*.{ts,tsx,js,jsx,css,html}'],
  safelist: [{ pattern: /^(tile|card|surface|bubble|btn)(-|:|$).*/ }]
}
\`\`\`
- Optional \`src/_safelist.ts\` mit String-Referenzen beibehalten.

**Risks/Rollback**  
CSS minimal größer.

**Acceptance**
- \`rg\`-Check findet die Präfixe in \`dist/**/*.css\`.
- Startkacheln visuell unverändert (Vergleichs-Screenshot).

**Commit:** \`fix(ui): stabilize tile/card styles via Tailwind safelist + content globs (Refs: tailwind-safelist-content)\`
"

# -------------------------------
# Issue 4 — Kachel-Design Layer
# -------------------------------
new_issue "Kachel-Design via Komponenten-Layer stabilisieren" \
"type:refactor,priority:high,scope:ui" \
"**Kategorie:** Architecture/UI  
**Severity:** High  
**Scope of change:** \`src/theme.css\` (neu/erweitern), \`src/main.tsx\` (Import-Reihenfolge)

**Current behavior**  
Spezifität/Import-Order kippt Design; Kacheln wirken inkonsistent.

**Expected behavior**  
Stabile \`.tile*\`-Klassen in \`@layer components\` und korrekte Import-Reihenfolge.

**Repro**
- Vorher/Nachher-Screenshot der Startkacheln.
- Reihenfolge in \`src/main.tsx\`: Tailwind base → Tokens/Theme → Components → Page.

**Fix (Beispiel)**
\`\`\`css
/* src/theme.css */
@layer components {
  .tile { @apply rounded-2xl shadow-xl backdrop-blur p-4; }
  .tile--primary { @apply shadow-2xl; }
}
\`\`\`
Sicherstellen, dass \`theme.css\` nach Tailwind base/Token, aber vor page-CSS importiert wird.

**Risks/Rollback**  
Nur optische Layering-Anpassungen.

**Acceptance**
- Visuelle Parität (Radius, Shadow, Blur, Spacing).
- Keine unerwarteten Überschreibungen.

**Commit:** \`refactor(ui): reintroduce tile component layer with stable specificity (Refs: kachel-design-restore)\`
"

# -------------------------------
# Issue 5 — E2E Deep-Link
# -------------------------------
new_issue "E2E: Deep-Link + Reload Tests hinzufügen" \
"type:test,priority:medium,scope:routing" \
"**Kategorie:** DevOps/Quality  
**Severity:** Medium  
**Scope of change:** \`tests/e2e/deeplink.spec.ts\` (neu), CI-Job nutzt \`npx playwright test\`

**Current behavior**  
Kein automatischer Test deckt SPA-Fallback/Router ab.

**Expected behavior**  
E2E failt, wenn Deep-Links/Reloads brechen.

**Repro**
\`\`\`bash
npx playwright test -g 'SPA deep link'
\`\`\`

**Fix (Test-Snippet)**
\`\`\`ts
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
  test(\`SPA deep link + reload: \${route}\`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('[data-testid=\"app-root\"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-testid=\"app-root\"]')).toBeVisible();
  });
}
\`\`\`

**Risks/Rollback**  
Keine; Test kann temporär \`skip\` erhalten.

**Acceptance**
- Test grün lokal und in CI.
- Bei Regression wird PR blockiert.

**Commit:** \`test(e2e): add SPA deep link + reload test (Refs: e2e-deeplink)\`
"

# -------------------------------
# Issue 6 — Logs/Secrets
# -------------------------------
new_issue "Logs und potenzielle Secrets entfernen" \
"type:chore,priority:high,scope:security" \
"**Kategorie:** Security/Maintenance  
**Severity:** High  
**Scope of change:** \`autopilot.log\` (untracken), \`.gitignore\`, optional History-Scan

**Current behavior**  
Logdateien im Repo; mögliches Leaken von Inhalten.

**Expected behavior**  
Keine Logs im Repo; \`.gitignore\` blockt künftige.

**Repro**
\`\`\`bash
git ls-files | rg -n 'autopilot\.log' || echo OK
\`\`\`

**Fix**
\`\`\`bash
git rm --cached autopilot.log 2>/dev/null || true
printf '\nautopilot.log\n' >> .gitignore
\`\`\`
Optional History-Scan (gitleaks/trufflehog) und Ergebnis verlinken.

**Risks/Rollback**  
Keine.

**Acceptance**
- Repro zeigt „OK“.
- Secret-Scan ohne Treffer.

**Commit:** \`chore(security): drop logs from repo and ignore going forward (Refs: logs-and-secrets)\`
"

# -------------------------------
# Issue 7 — React Hooks/Async
# -------------------------------
new_issue "React: Hooks-Dependencies und Async-Fehlerpfade verhärten" \
"type:fix,priority:medium,scope:ui" \
"**Kategorie:** Reliability/Code-Qualität  
**Severity:** Medium  
**Scope of change:** ESLint-Regeln, betroffene \`src/**\`-Dateien

**Current behavior**  
Ungesicherte \`await\`s, leere \`catch {}\`, unvollständige \`useEffect\`-Deps führen zu Whitescreens statt Fehler-UI.

**Expected behavior**  
Strikte Hook-Regeln; Async-Flows fangen Fehler und zeigen eine Nutzer-Fehlermeldung.

**Repro**
\`\`\`bash
npm run lint || pnpm lint
rg -n 'await ' src | rg -v '\.catch|try' || true
rg -n 'catch\s*\(\)\s*\{' src || true
\`\`\`

**Fix**
- \`react-hooks/exhaustive-deps: \"error\"\` aktivieren.
- Kritische Async-Pfade in \`try/catch\` mit sichtbarer Error-UI.
- Teure Mappings/Filters memoisieren.

**Risks/Rollback**  
Gering; initial mehr Lint-Funde.

**Acceptance**
- Lint ohne Hook-Fehler.
- Simulierter Netzwerkfehler zeigt Fehler-Banner, kein Blank.

**Commit:** \`fix(react): harden async flows and hook deps (Refs: eslint-react-rules)\`
"

# -------------------------------
# Issue 8 — CI härten
# -------------------------------
new_issue "CI härten: CodeQL, Dependabot, Tests als Gates" \
"type:ci,priority:medium,scope:ci" \
"**Kategorie:** Security/DevOps  
**Severity:** Medium  
**Scope of change:** \`.github/workflows/**\`, \`dependabot.yml\`, Branch Protection

**Current behavior**  
Merges sind nicht durch Security/Tests geschützt.

**Expected behavior**  
PRs lassen sich ohne grüne Checks nicht mergen.

**Repro**
- Prüfen, ob Workflows laufen und Required Checks aktiv sind.

**Fix**
- CodeQL-Workflow für JS/TS.
- CI-Job mit Playwright und Unit-Tests.
- Dependabot für \`npm\` und \`github-actions\`.
- Branch Protection: Required Checks setzen (\`CI\`, \`CodeQL\`, optional \`Unit\`).

**Risks/Rollback**  
Keine.

**Acceptance**
- Actions laufen grün.
- PR-Merge ohne grüne Checks unmöglich.

**Commit:** \`ci(security): enable codeql/dependabot and gate on tests (Refs: gha-security-ci)\`
"

# -------------------------------
# Issue 9 — Dependencies aufräumen
# -------------------------------
new_issue "Dependencies aufräumen (depcheck + audit)" \
"type:chore,priority:medium,scope:infra" \
"**Kategorie:** Security/Performance  
**Severity:** Medium  
**Scope of change:** \`package.json\`, Lockfile

**Current behavior**  
Unnötige/verwundbare Pakete blähen Build und Angriffsfläche auf.

**Expected behavior**  
Keine ungenutzten Deps; keine High/Critical Advisories.

**Repro**
\`\`\`bash
npx depcheck || true
npm audit --audit-level=moderate || true
\`\`\`

**Fix**
- Unused deps entfernen oder ersetzen.
- Advisories fixen; ggf. Versionen pinnen.

**Risks/Rollback**  
Mögliche peer-dep-Reibungen; Tests fahren.

**Acceptance**
- \`depcheck\` zeigt keine Unused.
- \`npm audit\` ohne High/Critical.

**Commit:** \`chore(deps): prune unused and fix audit findings (Refs: depcheck-npm-audit)\`
"

# -------------------------------
# Issue 10 — Routing-Strategie
# -------------------------------
new_issue "Routing-Strategie konsolidieren (Hash vs History)" \
"type:refactor,priority:medium,scope:routing" \
"**Kategorie:** Architecture/Routing  
**Severity:** Medium  
**Scope of change:** Router-Setup (\`src/**\`), ggf. \`_redirects\`

**Current behavior**  
Mischformen/Wechsel führen zu unvorhersehbarem Verhalten.

**Expected behavior**  
Ein Router-Modus. Entweder:
- History-Router + funktionierendes SPA-Fallback (\`_redirects\`), oder
- Hash-Router ohne Abhängigkeit von \`_redirects\`.

**Repro**
- Back/Forward/Reload auf \`/models\` und \`/settings\` durchspielen.
- E2E ergänzen (Back/Forward-Flows).

**Fix**
- Modus festlegen, Implementierung vereinheitlichen.
- Falls History: sicherstellen, dass Issue 1 umgesetzt ist.

**Risks/Rollback**  
Niedrig, kann Bookmark-Verhalten ändern.

**Acceptance**
- E2E für Back/Forward/Reload grün.
- Keine 404/Blank-Screens bei Navigation.

**Commit:** \`refactor(routing): unify router mode and navigation behavior (Refs: routing-strategy)\`
"

echo ">> Alle Issues wurden (sofern nicht bereits vorhanden) erstellt."
