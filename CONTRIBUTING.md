# Contributing

## Branch-Strategie

- Ein Trunk: `main`.
- Kleine, fokussierte PRs. Keine Batch-Refactors.
- **Nie** mergen, wenn Checks rot sind.

## Required Checks (gating)

- Lint → Typecheck → Unit → E2E (offline) → Build.

## Tests

- Unit & E2E laufen **offline** (Mocks/Interception). Keine echten Netzwerkanfragen.

## PR-Regeln

- Conventional Commits.
- PR beschreibt Scope, Risiken, manuelle Schritte.
- CI muss grün sein. Bei Fail: fixen oder revert, nicht „wird schon“.

## Code-Qualität

- Eine ESLint-Konfig (Flat oder klassisch, siehe Repo).
- Eine TS-Basis (`tsconfig.base.json`) plus minimale `extends`.
- Prettier zentral, kein Formatier-Mix.

## Security

- Keine Secrets/Keys commiten.
- Secret-Scanning ernst nehmen; bei Fund: Schlüssel rotieren.
