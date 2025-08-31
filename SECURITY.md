# SECURITY

## Realistische Risiken

- **API Keys**: Gehören nur lokal in den Browser (localStorage). Nicht ins Repo, nicht in Logs.
- **XSS**: User-Input niemals als HTML einbinden. Immer escapen.
- **Header**: Strikte Security-Header aktiv setzen (CSP, HSTS, COOP/COEP etc.).
- **Supply chain**: Regelmäßig `npm audit` + Updates.

## Was wir tun

- Kein Server-Proxy für den OpenRouter-Key; der Key bleibt lokal.
- Storage-Namespace: `openrouter.api_key`, `disa:*` (leicht auffindbar/löschbar).
- CSP/Headers via Cloudflare Pages (siehe \_headers oder Functions).

## Was du NICHT tust

- Keys in `.env`/Code committen.
- `dangerouslySetInnerHTML` mit ungeprüften Strings.
- Ohne CSP deployen.

## Regelmäßig

- `npm run typecheck && npm run test`
- `npm audit` (keine blinden `--force`-Orgie)
- Abhängigkeiten patchen/minor-aktualisieren
