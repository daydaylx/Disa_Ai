# Cleanup-Kandidaten (nur Befund, keine Löschung in Phase A)

## Duplikate (konsolidieren)

- CodeBlock:
  - `src/components/CodeBlock.tsx`
  - `src/components/chat/CodeBlock.tsx`
  - Inline in `src/views/ChatView.tsx`
- Avatar:
  - `src/components/Avatar.tsx`
  - `src/components/chat/Avatar.tsx`
- ScrollToEndFAB:
  - `src/components/ScrollToEndFAB.tsx`
  - `src/components/chat/ScrollToEndFAB.tsx`
- OpenRouter-Client(e):
  - `src/services/openrouter.ts`
  - `src/api/openrouter.ts`
  - (Key mgmt in `src/lib/openrouter/*` bleibt)

## Legacy/Parallelcode (aus TS-Check ausgeschlossen)

- `src/features/**`, `src/entities/**`, `src/widgets/**`, `src/shared/**`
  - Vorgehen Phase C: Quarantäne über `.graveyard/` nach statischer+dyn. Verifikation

## Assets/Configs – Doppelung

- `public/styles.json` und `public/persona.json` – beide werden vom `roleStore` unterstützt (Kandidatenliste); nicht löschen, aber Quelle zentralisieren

## Protokoll (Phase C – Safe-Cleanup)

- Schritt A: Statische Verifikation (`rg` auf Importe/Verwendung)
- Schritt B: Dynamische Verifikation (temporäres Umbenennen, Typecheck+Tests)
- Schritt C: Quarantäne (`git mv` → `.graveyard/<YYYYMMDD>/...`)
- Schritt D: Stabilitätslauf; ggf. Revert
- Schritt E: Purge erst nach Freigabe
