## Zusammenfassung

Kurzbeschreibung des Ziels und der wichtigsten Änderungen.

## Änderungen

- [ ] Light-Theme als Standard (Dark bleibt verfügbar)
- [ ] Glass‑Flächen (bg-white/60–70, border-white/30, backdrop‑blur‑lg)
- [ ] Buttons/Inputs/Selects/Tabs vereinheitlicht
- [ ] Chat‑Bubbles (User/AI) und Codeblöcke (Cards)
- [ ] Model‑Picker (Chips + Details‑Panel)

## Risiko / Scope

- [ ] Keine Logikänderungen (nur Styles/Markup)
- [ ] E2E‑Selektoren unverändert

## Verifikation

1. `npm ci`
2. `npm run build && npm run preview` → http://localhost:4173
3. Mobil (390×844) und Desktop (1440px) manuell prüfen
4. Optional E2E:
   - `npx playwright install --with-deps`
   - Terminal A: `npm run preview`
   - Terminal B: `npm run test:e2e`

## A11y

- [ ] Fokus‑Ringe sichtbar, AA‑Kontrast ok
- [ ] Tap‑Targets ≥ 44px

## Performance

- [ ] Kein Vollflächen‑Blur; Panels ok
- [ ] Scrollen flüssig (ggf. blur‑Stärke reduzieren)

## Screenshots

Bitte 3–6 aktuelle Screens anhängen (Mobil + Desktop).
