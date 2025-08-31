https://disa-ai.vercel.app/

## Sicherheit & Datenschutz (Cloudflare)
- **API-Schlüssel** werden nur lokal im Browser gespeichert (localStorage). Sie gehen nur an OpenRouter.
- **Security-Header**: Entweder `public/_headers` nutzen *oder* Pages Functions (`functions/[[path]].ts`). Nicht beides.
- **HSTS** im Cloudflare-Dashboard aktivieren (SSL/TLS → Edge Certificates → HSTS).
- **CSP**: `connect-src` anpassen, wenn weitere APIs genutzt werden, sonst blockt der Browser.
- **XSS**: Standardmäßig als Text rendern; wenn HTML nötig, `src/utils/sanitize.ts` nutzen.
