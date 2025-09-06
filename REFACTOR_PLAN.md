# Refactor- & Debug-Plan (Phase B)

0. Prämissen & Nichtziele

- Keine Feature- oder UI-Änderungen. Keine Text-/Layoutänderungen.
- Ziel: Stabilität, Typen, Imports, Build/Tests grün. Duplikate konsolidieren ohne UI-Regression.
- Netzwerk bleibt aus. Nur Whitelist-Kommandos.

1. Typ-Hygiene

- Nur `signal`-Übergabe konditional setzen (bereits angepasst in Kernpfad).
- Optionale Felder nie mit `undefined` schreiben (beibehalten, Sanitizer in `roleStore`).
- Props schärfen, wo `any`/breite Unions vorkommen (z. B. ModelSafety vs Safety im ModelPicker – umgesetzt).

2. Alias-/Path-Harmonisierung

- tsconfig `@/*` ↔ vite `@` ↔ vitest (über Vite) deckungsgleich – verifizieren (OK).
- Keine Änderung nötig, nur Gate-Check je Batch, dass Importauflösung funktioniert.

3. Fehlertyp-Cluster (Erwartung: vorher → nachher)

- TS: aktuell 0. Gate: bleibt 0 nach jedem Batch.
- ESLint: globales `npm run lint` ist disabled; rely auf lint-staged. Gate simuliert durch `typecheck`+Tests grün.

4. UI-Regressionsquellen (Fix-Muster ohne Optikänderung)

- Konsolidierung doppelter UI-Bausteine (CodeBlock/Avatar/FAB):
  - Beibehaltung API/Props, nur interne Wiederverwendung.
  - Snapshot Smoke-Tests für Render vorhanden (ergänzen falls nötig minimal, ohne Golden-Snapshots).

5. Build/Tooling

- Debug-Sourcemaps nur für Debug-Builds (nicht default).
- Keine Änderung an Prod-Build.

6. Tests

- `npm run typecheck` nach jedem Batch.
- `npm t` (Vitest) nach jedem Batch. Wenn Runner in Umgebung instabil: lokal als Gate.
- Ziel: bestehende Unit- und Smoke-Tests grün.

7. Safe-Cleanup-Protokoll

- Kandidaten: `components/chat/*` (Avatar/CodeBlock/FAB), `services/api`-Dopplung, `features/*`/`entities/*`/`widgets/*`/`shared/*`.
- Vorgehen je Block: Quarantäne (`.graveyard/`), Gates laufen lassen, ggf. Revert. Erst später Purge.

8. Rollback-Plan & DoD

- Rot bei Gates ⇒ unmittelbarer `git revert --no-edit HEAD`.
- Definition of Done: Typecheck=0, Tests grün, keine UI-Regression laut Smoke; Duplikate entfernt oder konsolidiert; Build unverändert.

## Batches (≤10 Dateien oder ≤150 Zeilen je Commit)

Batch 1 – Konsolidierung CodeBlock (refactor/ui)

- Ziel: `ChatView` nutzt `components/CodeBlock`; Entfernen der Inline-Version; `components/chat/CodeBlock.tsx` in `.graveyard/` (Quarantäne).
- Gates: typecheck, tests.

Batch 2 – Konsolidierung Avatar (refactor/ui)

- Ziel: `components/chat/Avatar.tsx` ersetzen durch `components/Avatar.tsx`; Quarantäne der Chat-Variante.
- Gates: typecheck, tests.

Batch 3 – Konsolidierung ScrollToEndFAB (refactor/ui)

- Ziel: ein FAB nutzen (bevorzugt `components/chat/ScrollToEndFAB.tsx` oder `components/ScrollToEndFAB.tsx` – wählen nach Funktionsparität); Quarantäne der anderen.
- Gates: typecheck, tests.

Batch 4 – OpenRouter-Client Entflechtung (refactor)

- Ziel: `services/chatService` auf gemeinsamen Client aufsetzen; `api/openrouter.ts` nur belassen wenn gebraucht; andernfalls Quarantäne. Keine API-Verhaltensänderung.
- Gates: typecheck, tests.

Batch 5 – Sourcemap Debug-Konfiguration (chore/config)

- Ziel: `tsconfig` (sourceMap+inlineSources) in separater Debug-Datei dokumentieren; optional `vite.build.sourcemap` via ENV toggelbar (keine Default-Änderung).
- Gates: typecheck, build (optional), tests.

Batch 6 – Legacy-Ordner Quarantäne (chore/cleanup)

- Ziel: nicht referenzierte Teile aus `features/*`/`entities/*`/`shared/*`/`widgets/*` schrittweise in `.graveyard/` verschieben.
- Gates: typecheck, tests; ggf. Revert.

## Gate-Sequenz je Batch

1. `npm run typecheck`
2. `npm run lint` (no-op; dokumentieren)
3. `npm t` (oder lokal laufende Tests)
4. optional `vite build` (nur Batch 5)

Bei Rot: Abbruch + Revert. Bei Grün: Commit nach Schema.
