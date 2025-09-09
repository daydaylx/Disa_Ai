# Disa_Ai – Agent Guardrails & Workflow

## Ziele (minimal-invasive Fixes)

- Reproduzierbarer Build: `pnpm i --frozen-lockfile && pnpm typecheck && pnpm -s build`
- TS-Fixer: Nur kleinste Typ-Fixes (z. B. optionale Props korrekt), keine großen Umbauten.
- Tailwind/PostCSS: Direktiven konsistent, keine toten Layers.
- Cloudflare Pages: Workflows mit `actionlint` prüfen; bei Fehlern minimalen, stabilen Workflow vorschlagen.
- Visuelle Regressionen: Vorher/Nachher-Screens (3 Breakpoints) erzeugen, bevor UI-Patches gemerged werden.

## Schritte, die der Agent ausführen soll

1. `pnpm clean` (falls vorhanden), `pnpm i --frozen-lockfile`, `pnpm typecheck`, `pnpm -s build`.
2. Fehlerliste sammeln; **Plan** mit atomaren Patches vorschlagen. Keine Major-Updates „ins Blaue“.
3. `actionlint` gegen `.github/workflows/**/*.yml` laufen lassen; Findings dokumentieren.
4. **Snyk MCP** laufen lassen:
   - Code Scan (Snyk Code) und SCA für `dependencies`.
   - Nur Low-Risk-Upgrades/Fixes vorschlagen; keine massiven Major-Bumps ohne Begründung.
5. UI-Check: Headless-Browser Screens in 360 / 768 / 1280 px.
6. PR-Text generieren: Befunde, Befehle, Diff, Screenshots.

## Sicherheitsregeln

- Änderungsvorschläge zuerst als Patch/Diff zeigen; **keine** Mass-Refactors.
- Keine Secrets anfassen. Keine Cloudflare-Settings „erraten“.
- Netzwerkzugriffe **nur** bei Bedarf (Snyk/Tavily) und erst nach Freigabe.

## Security "Secure at inception" (Snyk)

- Nach _jedem_ Code- oder Dependency-Change Snyk-Scan → Fix → Rescan bis „clean“.
