Deployment & CI

Deploy via Cloudflare Pages Git-Integration (Branch main, Output dist/). GitHub Actions führt nur CI-Checks aus (typecheck + lint:full + test). Theme nutzt CSS Custom Properties statt hard-coded Tailwind-Farben für bessere Konsistenz.

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
