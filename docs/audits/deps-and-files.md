# Disa AI – Dependencies & Files Audit (Inventar)

Stand: 2025‑09‑13  
Ziel: Vollständiges Inventar mit Labels – keine Löschungen in diesem PR.  
Labels: `safe delete` | `needs check` | `keep`

---

## Abhängigkeiten (package.json)

- react / react-dom – keep
  - Breite Nutzung in `src/**/*.tsx` (App, Views, UI‑Komponenten).

- zod – keep
  - Verwendet in `src/lib/validators/**`, `src/config/roleStore.ts`.

- js-yaml – keep
  - Nutzung in `src/lib/configLoader.ts` (YAML/JSON‑Config-Lader).

- zustand – safe delete
  - Keine Treffer im Code (`rg "zustand"` leer). State wird lokal/per Storage gehandhabt (`src/hooks/useConversations.ts`).

- @playwright/test + playwright – needs check
  - E2E laufen über Playwright Test (`@playwright/test`). CI nutzt `npx playwright install` – der CLI wird idR über `@playwright/test` mitgeliefert. Doppelinstallation oft redundant. Empfehlung: nur `@playwright/test` behalten, zuvor CI gegenprüfen.

- jsdom + happy-dom – needs check
  - Vitest‑Env ist `jsdom` (siehe `vitest.config.ts`), `tsconfig.test.json` listet dennoch `happy-dom` als Type. Empfehlung: Entweder Env auf `happy-dom` umstellen oder `happy-dom` entfernen und Types aus `tsconfig.test.json` streichen.

- msw – keep
  - Aktiver Einsatz in Unit‑Tests (`src/test/testServer.ts`, `src/test/setup.ts`).

- ESLint/Prettier‑Stack – keep
  - Flat‑ESLint aktiv (`eslint.config.js`), `eslint-config-prettier` eingebunden; Prettier zentral.

---

## Dateien & Verzeichnisse

- public/sw.js – needs check
  - Enthält `import { precacheAndRoute } from "workbox-precaching";` und nutzt `self.__WB_MANIFEST` (injectManifest). Im Build ist kein PWA‑Plugin konfiguriert (kein `vite-plugin-pwa`). Importgraph: Datei wird aktuell nicht aktiv registriert (siehe unten), daher vermutlich wirkungslos. Empfehlung: Entweder PWA‑Pipeline vollständig aktivieren (Inject/Bundle) oder SW entfernen.

- src/lib/pwa/registerSW.ts und src/pwa.ts – needs check
  - Beide registrieren `/sw.js`. Importgraph: Keine von beiden Dateien wird aktuell irgendwo importiert (weder in `src/main.tsx` noch `src/App.tsx`). Doppelter Code, aktuell inaktiv. Empfehlung: Eine Quelle wählen und in `src/main.tsx` einbinden – oder PWA bewusst deaktivieren und Dateien entfernen.

- tests/setup.ts, tests/setupTests.ts, src/test/setup.ts – needs check
  - Mehrfache Test‑Setups. Vitest nutzt `tests/setup.ts` (per `vitest.config.ts`). `src/test/setup.ts` richtet MSW und Stubs ein, wird aktuell nicht geladen. `tests/setupTests.ts` dupliziert nur Jest‑DOM‑Import. Empfehlung: auf ein einziges Setup konsolidieren (inkl. MSW) und übrige entfernen.

- e2e/preload.cjs – needs check
  - Polyfills (localStorage, matchMedia, randomUUID) für E2E‑Runner. Importgraph: Nicht in `playwright.config.*` referenziert. Empfehlung: Entweder als `setup`/`globalSetup` verdrahten oder entfernen.

- src/lib/cn.ts und src/lib/utils/cn.ts – needs check
  - Zwei `cn()`‑Implementierungen; beide im Einsatz (z. B. `src/components/Input.tsx` vs. `src/components/ui/Button.tsx`). Empfehlung: auf eine Variante standardisieren.

- src/lib/net/fetchWithTimeout.ts und src/lib/net/fetchTimeout.ts – needs check
  - Funktional überlappende Implementierungen (Timeout, Retry). Empfehlung: eine konsolidierte Variante verwenden.

- playwright.config.ts / playwright.breakpoints.config.ts – keep
  - Standard‑E2E und Breakpoint‑Runs (Screens). Breakpoints‑Config sinnvoll getrennt für visuelle Scans.

- docs/screenshots/ – keep
  - Dokumentations‑Screenshots. Größe im Blick behalten; optional Alt‑Material archivieren.

- test-artifacts/, test-results/, playwright-report/ – keep (ignored)
  - Lokale/CI‑Artefakte; per `.gitignore` ausgeschlossen. In Repo‑Working‑Dir vorhanden, aber nicht versioniert.

- public/persona.json, public/styles.json – keep
  - Werden vom Config‑Loader als Fallback genutzt (`src/lib/configLoader.ts`).

---

## Import‑Graph Hinweise (Auswahl)

- SW‑Registrierung
  - `src/main.tsx` importiert keine PWA‑Registrierung; `src/lib/pwa/registerSW.ts` und `src/pwa.ts` werden nicht referenziert → SW derzeit effektiv inaktiv.

- E2E Interception
  - `tests/e2e/setup/intercept.ts` wird explizit in Tests importiert; blockiert externes Netz, liefert Fixtures (Success/429/Timeout/Abort/5xx).

- Testing‑Setup
  - Vitest lädt `tests/setup.ts` (JSDOM + Polyfills). MSW‑Server liegt in `src/test/testServer.ts`, wird aber nur über `src/test/setup.ts` gestartet (der aktuell nicht geladen wird).

---

## Empfehlungen (keine Löschungen in diesem PR)

1) Dependencies
   - `zustand` → safe delete (unbenutzt) nach kurzer Gegenprüfung in Branch‑History.
   - `playwright` (zusätzlich zu `@playwright/test`) → needs check; wenn CI/CLI mit `@playwright/test` stabil: entfernen.
   - `happy-dom` vs. `jsdom` → needs check; auf eine Umgebung vereinheitlichen (Types/Config anpassen).

2) PWA / SW
   - Entweder PWA bewusst aktivieren (SW registrieren und Workbox‑Inject konfigurieren) oder SW‑Dateien entfernen. Doppeltes Registrieren auflösen.

3) Test‑Setup konsolidieren
   - Ein zentrales Setup (Vitest): Jest‑DOM + MSW + Polyfills. Überflüssige Setups/Polyfill‑Dateien entfernen.

4) Utility/Netzwerk konsolidieren
   - Eine `cn()` und eine `fetchWithTimeout` Variante wählen.

---

## Label‑Liste (Kurzform)

- zustand – safe delete
- playwright (neben @playwright/test) – needs check
- happy-dom – needs check
- public/sw.js – needs check
- src/lib/pwa/registerSW.ts, src/pwa.ts – needs check
- tests/setup.ts, tests/setupTests.ts, src/test/setup.ts – needs check
- e2e/preload.cjs – needs check
- src/lib/cn.ts, src/lib/utils/cn.ts – needs check
- src/lib/net/fetchWithTimeout.ts, src/lib/net/fetchTimeout.ts – needs check
- public/persona.json, public/styles.json – keep
- playwright.config.ts, playwright.breakpoints.config.ts – keep
- docs/screenshots/ – keep
