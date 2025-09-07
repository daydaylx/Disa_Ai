Deployment: Cloudflare Pages

Empfohlen: Git‑Integration von Cloudflare Pages (ohne GitHub Actions).

Einstellungen in Cloudflare Pages Projekt:

- Framework Preset: „Vite“ (oder „None“)
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 20 oder 22

Hinweise:

- `public/_headers` enthält Caching‑Regeln für wichtige Endpunkte (z. B. `persona.json`).
- `.github/workflows/ci.yml` führt weiterhin Build/Tests aus, deployt aber nicht.

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
