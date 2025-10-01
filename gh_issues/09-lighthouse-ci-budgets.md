## Beschreibung

Performance- und A11y-Regressionsschutz per Lighthouse-CI. PRs scheitern, wenn Budgets gerissen werden.

## Akzeptanzkriterien

- GitHub Action mit Lighthouse-CI
- Mobile Scores: Performance ≥ 85, Accessibility ≥ 90
- Budgets für Skript-/Bildgrößen definiert
- Berichte pro PR verlinkt

## Tasks

- `lighthouse-ci` konfigurieren
- Budgets (`.lighthouserc.js`) definieren
- GitHub Action einbinden
