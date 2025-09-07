# PR: UI Light-Theme + Glassmorphism (ohne Logikänderungen)

## Zusammenfassung

- Light-Theme als Standard, Dark weiterhin verfügbar.
- Neues, freundliches Farbsystem: Primary `#5B8CFF`, Secondary `#7C4DFF`, Accent `#22C55E`, Amber `#F59E0B`.
- Einheitliche Glass-Flächen: `bg-white/60–70`, `border-white/30`, `backdrop-blur-lg`, `shadow-soft`.
- Buttons/Inputs/Selects/Tabs konsolidiert; Fokuszustände sichtbar (AA-Kontrast).
- Chat-Bubbles: User = weiß/glasig; AI = zarter violett‑blauer Verlauf; Codeblöcke als Cards.
- Model-Picker als luftige Kartenreihen mit Chips (free/policy/tags) + Details-Panel.
- Keine Feature-/Logikänderungen, nur Styles/Markup.

## Motivation

- Lesbarkeit, Konsistenz und „helle“ Stimmung auf Mobil/Desk.
- Einheitliche Tokens/Utilities für schnellere Weiterentwicklung.

## Scope der Änderungen

- Tailwind/Tokens: `src/styles/theme.css`, `tailwind.config.ts`.
- Komponenten/Views: nur Klassen/Markup in `src/components/*`, `src/views/*`.
- Keine API-, State- oder Routingänderungen.

## Verifikation (lokal)

1. Install: `npm ci`
2. Build + Preview:
   - `npm run build`
   - `npm run preview` → http://localhost:4173
3. Mobil (390×844) prüfen:
   - Tapp-Ziele ≥ 44px, Fokus-Ring sichtbar
   - Chat: Eingabe → Senden → Stream → Stop
   - Bottom-Nav und Header-Pills lesbar/bedienbar
4. Desktop (1440px):
   - Max-Breiten harmonisch (keine „verlorenen“ Flächen)
   - Karten/Abschnitte glasig, Schatten weich
5. E2E (optional):
   - `npx playwright install --with-deps`
   - Terminal A: `npm run preview`
   - Terminal B: `npm run test:e2e`

## A11y/AA

- Textkontraste gegen helle Flächen ≥ 4.5:1 (Spot-Checks durchgeführt)
- Fokuszustände sichtbar (Primary‑Ring), Navigationsreihenfolge unverändert

## Performance

- Keine Vollflächen‑Blur; Blur gezielt auf Panels.
- Bei Low‑End-Problemen: `backdrop-blur-lg → md` auf Listen/Feeds reduzieren.

## Risiken / Rollback

- Risiken: rein visuelle Änderungen. Rollback: Tag `pre-refactor-<timestamp>` vorhanden.

## Screenshots (bitte ergänzen)

- [ ] Mobil: Chat, Quickstart, Settings
- [ ] Desktop: Chat, Model-Picker, Settings
