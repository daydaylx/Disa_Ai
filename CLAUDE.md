# Disa_Ai – Projektanweisungen für Claude

## Ziel & Scope

- Deutschsprachiger, privater, mobil-only Chat-Client (React/Vite) für OpenRouter.
- Keine Server-Features. Kein Nutzertracking. Offline nur minimal (App-Shell).
- Sicherheitsziel: CSP strikt, API-Key bleibt im `sessionStorage`.

## Agentenverhalten (wichtig)

- Arbeite **nur** im Frontend. Keine Backend/Proxy-Einführung vorschlagen.
- Bevorzuge **kleine, isolierte Commits** mit klaren Messages.
- Schreib deutsche UI-Texte. Keine i18n-Frameworks einbauen.
- Berücksichtige Mobilkram: `100dvh`, Safe-Area, Tastatur-Überdeckung, Touch-Ziele ≥44px.
- Halte dich an die bestehenden CSP-Direktiven in `public/_headers`. Keine Inline-Skripte erzeugen.
- Storage: Konversationen in **IndexedDB**, API-Key ausschließlich `sessionStorage`.

## Was du NICHT tun darfst

- Keine neuen Abhängigkeiten ohne triftigen Grund (>1 Datei Codeersparnis, Sicherheitscheck).
- Kein PWA-Großumbau (Workbox etc.). Wenn SW, dann nur App-Shell + Update-Prompt.
- Keine „Tool/Function-Calling“-Features vorschlagen. Nicht im Scope.

## Projektstruktur (Kurz)

- `src/` React Code, UI, Netz-Layer
- `public/` Manifest, `_headers` (CSP/Cache)
- `tests/` Vitest + Playwright (mobiler Viewport)

## Befehle (npm)

- `npm run dev` – lokale Entwicklung
- `npm run build` – Produktion
- `npm run test` – Unit-Tests
- `npm run e2e` – E2E Smoke (mobiler Viewport)

## Qualitätsregeln

- Lint/Typecheck müssen grün sein, sonst kein Patch.
- A11y: Fokus nach Routenwechsel auf `<main>`, Kontrast AA.
- Keine langen CSS-„Glass“-Transparenzen unter Fließtext.

## Häufige Aufgaben (für Agenten)

- „Fix: Composer verdeckt durch Tastatur auf iOS“ → CSS/JS nur im mobilen Pfad anfassen, Safe-Area respektieren.
- „CSP bricht bei Bild-Upload“ → `img-src` prüfen, **nicht** `default-src` aufweichen.
- „Verlauf exportieren/importieren“ → JSON-Export implementieren, Duplikate verhindern.

## Nützliche Referenzen importieren

Siehe @README für Überblick und @package.json für Scripts.
