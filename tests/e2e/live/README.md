# Live-E2E-Checks

- `npm run e2e:live` startet Playwright gegen die produktive Seite (Default: `https://disaai.de`).
- Setze `LIVE_BASE_URL` für andere Hosts und `LIVE_PATHS` als Komma-Liste (z.\u00a0B. `/,/pricing,/impressum`).
- Artefakte liegen unter `test-results/live` (Screenshots, Axe-JSON, Konsolen-Logs).
- Im Live-Modus laufen zwei Playwright-Projekte: `android-chrome` (Pixel 7) und `desktop-chrome` (1366x768).
- Accessibility-Verstöße werden soft geprüft (`expect.soft`); Details stehen in den Axe-Reports.
