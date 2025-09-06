# Analysebericht – Disa AI (Phase A)

Stand: jetzt (lokal, read‑only). Keine Produktionscode‑Änderungen in Phase A.

## Snapshot & Kernmetriken

- Node: v22.18.0
- TypeScript: `npm run typecheck` OK (0 TS‑Fehler)
- Tests: Vitest CLI ohne `--threads` verfügbar; Thread‑lose Ausführung nicht unterstützt. Testlauf nicht bewertet (lokale Umgebungsschranke), siehe Gate in Phase B.
- ESLint: `npm run lint` ist „disabled“ (Script). `lint-staged` ist aktiv (pre‑commit), nutzt `eslint --fix` auf Stage.

## Strukturinventar (src/)

- Schichten: `components/`, `views/`, `services/`, `config/`, `features/`, `hooks/`, `lib/`, `styles/`, `state/`, `utils/`, `entities/`, `shared/`, `widgets/`.
- Routen/Views: `App.tsx` (Hash‑Routing: chat/settings), `views/ChatView.tsx`, `views/SettingsView.tsx`.
- Chat‑Pfad: `services/chatService.ts` (Streaming, OpenRouter), `views/ChatView.tsx` (UI), `components/status/OrbStatus.tsx`, `components/chat/*` (Hilfen).
- Settings‑Pfad: `views/SettingsView.tsx`, `components/ModelPicker.tsx`, `config/*` (Modelkatalog, Rollen, Settings), `services/openrouter.ts` (Key mgmt).
- PWA: `public/sw.js`, `src/lib/pwa/registerSW.ts`, `vite-plugin-pwa`.

## Import-/Abhängigkeitsbeobachtungen (Hotspots)

- Hotspots (manuell verifiziert):
  - `views/ChatView.tsx` – hoher Out‑Degree (zieht Services, Config, Komponenten zusammen).
  - `components/ModelPicker.tsx` – zentraler Katalog‑Reader, Filter.
  - `config/*` – Modelle, Rollen, Settings: werden von Views/Components genutzt.
  - `services/chatService.ts` – Streaming‑Client.
- Alias: tsconfig `paths` → `@/*`, Vite `resolve.alias` → `@` (kongruent). Vitest nutzt Vite‑Config, keine separate Alias‑Dopplung nötig.
- Zyklische Imports: keine offensichtlichen Zyklen im Hauptpfad (manuelle Stichprobe). `features/*` ist aus tsconfig ausgeschlossen (Legacy/Zweitpfad).

## Statik – Typisierung/Nullability

- `exactOptionalPropertyTypes: true` aktiv. Häufige Fehlerquelle (vermeidbar): optionale Felder nicht mit `undefined` belegen → bereits meist korrekt (sanitizer in `roleStore`, bedingtes Setzen von `signal`).
- Abort/Signal: breit genutzt (Chat, API, Role‑Fetch). Nachziehen: nur `signal` setzen, wenn vorhanden (ist umgesetzt).
- Storage: Settings und API‑Key werden ausschließlich in `localStorage` gehalten; pfadweise defensive Zugriffe vorhanden (try/catch).

## Build/Tooling‑Audit

- tsconfig: `baseUrl` + `paths` vorhanden; `sourceMap`/`inlineSources` NICHT aktiviert (Debug‑Optimierung möglich – Phase B). `exclude` schließt `features/`, `entities/`, `widgets/`, `shared/` aus (Hinweis auf Legacy/Parallelcode).
- Vite: `build.sourcemap: false` (ok für Prod; Debug‑Build optional aktivierbar in Batches).
- Vitest: jsdom, Setupdatei, Coverage v8 (text+html). CLI akzeptiert hier kein `--threads=false`.
- Husky/Lint‑staged: vorhanden. pre‑commit hook triggert `lint-staged` (eslint --fix, prettier). Globales `npm run lint` ist Platzhalter.

## UI/A11y‑Check (ohne Änderungen)

- Responsiveness: Layout nutzt Tailwind; `max-w-4xl`, mobile fixed Composer, Safe‑Area im FAB (`env(safe-area-inset-bottom)` in chat/ScrollToEndFAB).
- A11y: `main` mit `role=main`, ARIA‑Labels für Buttons (Kopieren, Senden/Stop), Skip‑Link‑Install.
- Tastatur: Composer Enter/Shift+Enter korrekt, Links als Buttons mit `onClick` sind jeweils mit `e.preventDefault()` abgesichert, Fokuspfad ok.
- Hit‑Targets: FAB `h-11 w-11` (44px), Buttons ausreichend.
- Kontrast: überwiegend neutral‑900/800‑Kontraste, lesbar; PWA‑Banner/Text in Ordnung.

## Festgestellte Probleme & Risiken (Phase A)

1. Doppelte/uneinheitliche Komponenten (Duplikate)
   - `src/components/CodeBlock.tsx` vs `src/components/chat/CodeBlock.tsx` vs Inline‑CodeBlock in `ChatView` → Konsolidieren.
   - `src/components/Avatar.tsx` vs `src/components/chat/Avatar.tsx` → Konsolidieren.
   - `src/components/ScrollToEndFAB.tsx` vs `src/components/chat/ScrollToEndFAB.tsx` → Konsolidieren.
     Nutzen: weniger Pflege, geringeres Regressionsrisiko.

2. Mehrere OpenRouter‑Zugänge
   - `src/services/openrouter.ts`, `src/api/openrouter.ts`, `src/lib/openrouter/*` (Key) → einheitliche Client‑Schicht definieren, Fallbacks und Error‑Mapping zentralisieren.

3. Legacy/Parallelcode aus Typecheck ausgeschlossen
   - `src/features/**`, `src/entities/**`, `src/widgets/**`, `src/shared/**` sind aus TS‑Check ausgenommen. Teile wirken funktionsfähig (z. B. `features/chat/ChatPanel.tsx`), werden aber im aktuellen App‑Pfad nicht verwendet. Kandidaten für Quarantäne/.graveyard (nach Beleg).

4. Tests – Runner‑Inkompatibilität
   - In dieser Umgebung unterstützt Vitest‑CLI die Option `--threads` nicht. Tests sind daher hier nicht aussagekräftig. Phase B Gate: Standard `npm t` ausführen und bewerten.

5. Debug‑Sourcemaps
   - Nicht aktiviert. Für gezieltes Debugging in Batches sinnvoll (`tsconfig: sourceMap/inlineSources`, `vite.build.sourcemap: true` für Debug‑Build).

## Quick‑Wins (S/M/L, Aufwandsschätzung)

- S: Komponenten‑Duplikate entfernen, gemeinsame Implementierung verwenden (2–4h, kein UI‑Verlust).
- S: Alias‑/Signal‑Hygiene fortschreiben (bereits begonnen) (0.5h).
- M: OpenRouter‑Client konsolidieren (1–2 Tage inkl. Tests).
- M: Test‑Stabilisierung (Vitest Runner, ggf. JS‑DOM Anpassungen) (0.5–1 Tag).
- L: Legacy‑Pfade (features/entities/shared/widgets) feingranular prüfen, in `.graveyard/` überführen (2–4 Tage inkrementell, mit Gates).
