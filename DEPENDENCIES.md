# Abhängigkeitsüberblick (Phase A)

Hinweis: Read‑only Erhebung. Kein vollständiger Graph, aber belastbare Knoten & Kanten.

## Alias/Konfiguration

- tsconfig `paths`: `@/*` → `src/*`
- vite `resolve.alias`: `@` → `./src`
- vitest: nutzt Vite‑Config; keine separate Aliasdefinition nötig

## Zentrale Knoten (Hotspots)

- `views/ChatView.tsx`: verbindet Config (Settings/Prompt), Services (Chat), UI (Status/Avatar/FAB)
- `components/ModelPicker.tsx`: nutzt `config/models` (Katalog), ist in Settings eingebunden
- `services/chatService.ts`: Streaming‑Client; wird von ChatView gerufen
- `config/*`: Modelle (Katalog & Auswahl), Rollen (roleStore), Settings (localStorage)
- `services/openrouter.ts` & `api/openrouter.ts`: getrennte OpenRouter‑Zugänge

## Externe Schnittstellen

- OpenRouter HTTP: `/api/v1/chat/completions` (SSE/NDJSON)
- PWA/Service Worker: precache, App‑Shell, keine API‑Caches

## Vermutete Zyklen

- Keine im Hauptpfad beobachtet. `features/*` ist vom TS‑Check ausgeschlossen (Parallel/Legacy), daher aus Zyklenanalyse ausgenommen.

## Empfohlene Konsolidierung

- OpenRouter‑Client(s) zu einem Modul zusammenführen
- Einheitliche CodeBlock/Avatar/FAB‑Komponenten verwenden
