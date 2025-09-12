# Disa_Ai — Projektgedächtnis (CLAUDE.md)

## Arbeitsweise
- Kleine, reversible PRs. Conventional Commits.
- Tests laufen **offline** (Unit + E2E), keine echten Netzwerkaufrufe.
- Fehlervertrag bindend: Abbruch/Timeout, RateLimit, Upstream/HTTP. UI zeigt konsistente Fehlermeldungen mit Retry/Backoff.
- Ziel-Ausgaben für PR-Prompts: Unified Diff + kurze PR-Beschreibung + "Manual steps". Keine Screenshots, keine Prosa-Romane.

## CI/Deploy
- Gates: Lint → Typecheck → Unit → E2E → Build. Deploy nur via Cloudflare Pages, erst nach grünen Checks.
- Bei roten Checks: kein Merge.

## Sicherheitsgrundsätze
- Keine Reads von `.env`, `secrets/**`, `*.pem`, `**/build`, `**/dist`.
- Keine `curl`/`wget`/Netzwerk-Tools ohne explizite Freigabe.
- Keine Edits an `package-lock.json` ohne expliziten Auftrag.

## Nützliche Kommandos
- Lint: `npm run lint`
- Tests: `npm run test`, `npm run test:e2e`
- Build: `npm run build`

