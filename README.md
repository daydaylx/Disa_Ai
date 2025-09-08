Deployment: Cloudflare Pages (Wrangler)

Automatisch per GitHub Actions bei Push auf `main` und als Preview bei Pull Requests.

Secrets (GitHub → Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` – Token mit „Cloudflare Pages — Edit“
- `CLOUDFLARE_ACCOUNT_ID` – deine Account ID
- `CLOUDFLARE_PAGES_PROJECT` – Projektname in Pages (z. B. `disa-ai`)

Build/Deploy:

- Workflow: `.github/workflows/cloudflare-pages.yml` (Wrangler v3)
- Build: `npm run build` mit `BASE_URL=./` (relative Pfade für Pages)
- Deploy: `wrangler pages deploy ./dist --project-name $CLOUDFLARE_PAGES_PROJECT`

Hinweise:

- `public/_headers` kann Caching‑Regeln enthalten (falls vorhanden)
- `.github/workflows/ci.yml` läuft weiter für Build/Tests (ohne Deploy)

Aurora Dark Theme (Styling)

- Tokens (HSL) sind in `src/styles/tokens.css` definiert und werden in Tailwind über `tailwind.config.ts` als semantische Farben bereitgestellt (`background`, `foreground`, `card`, `primary`, `muted-foreground`, `ring`, usw.).
- Die App setzt beim Start einen Dark‑Baseline (`initTheme()` in `src/main.tsx`), d. h. `.dark` auf `<html>` wird gesetzt; das aktive Preset bleibt via `data-theme` erhalten.
- Nutze Utilities aus `src/styles/theme.css` statt ad‑hoc Farben:
  - Flächen: `glass`, `card-solid`, `card-gradient`
  - Buttons: `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`
  - Inputs: `input` (auch für `select`, `textarea`)
  - Navigation: `nav-pill`, `nav-pill--active` (mit Unterstrich)
  - Text: `text-foreground`, `text-text`, `text-text-muted`, `text-muted-foreground`
- Vermeide `neutral-*`/`bg-white/*` im App‑Code; stattdessen obige Tokens/Utilities nutzen.
- Legacy‑CSS in `src/styles/brand.css`, `src/styles/glass.css`, `src/ui/kit.css` ist abgespeckt (Kompat‑Helfer). Neues Styling bitte über `theme.css` lösen.
