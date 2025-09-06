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
