Deployment: Cloudflare Pages

Hinweis: Dieses Repo ist für Cloudflare Pages konfiguriert. CI baut automatisch auf `main` und deployed nach Pages (siehe `.github/workflows/deploy-cloudflare-pages.yml`).

Buildkommando: `npm run build` → Ausgabeverzeichnis: `dist/`.

Setze in den Repo‑Secrets:

- `CLOUDFLARE_API_TOKEN` (Pages:Edit‑Token)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`
