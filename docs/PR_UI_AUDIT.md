# UI Audit: Konsolidierung, stabile Layout‑Tokens, E2E grün

## Zusammenfassung

- Konsolidiert UI auf kanonische Komponenten (ui/\*), entfernt Duplikate.
- Vereinheitlichte `data-testid` für zuverlässige E2E‑Selektoren.
- Layout stabilisiert über CSS‑Var `--bottomnav-h` (keine Überlappungen).
- E2E‑Flows für kritische Pfade: alle grün.

## Änderungen

- Entfernt (nicht verwendet bzw. ersetzt):
  - `src/components/Button.tsx`, `src/components/Icon.tsx`, `src/components/InlineBanner.tsx`
  - `src/components/nav/TabBar.tsx`, `src/ui/guard.ts.bak`
- Toast: React‑Toasts (ui/toast/ToastsProvider). Legacy‑Provider als Adapter
- Icons: Importe auf `components/ui/Icon` umgestellt
- Button: nur `components/ui/Button`
- HeroCard: dekorativer Orb durch CSS‑Blob ersetzt (keine Logik)
- ChatView: ARIA für Mehr‑Menü (`aria-controls`, `aria-labelledby`, Esc schließt Menü)
- `docs/ui-inventory.json`: Inventur (Views, Layout, Komponenten, Events, Duplikate, Tokens)

## Test-IDs (Auszug)

- Header: `nav-top-{chat|chats|quickstart|settings}`
- BottomNav: `nav-bottom-{chat|chats|quickstart|settings}`
- Settings: `settings-save-key`, `settings-style`, `settings-ctx-max`, `settings-ctx-reserve`, `settings-composer-offset`, `settings-model-picker`
- Chats: `chats-title-input`, `chats-new`, `chats-open`, `chats-delete`
- Chat: `composer-input`, `composer-send`, `composer-stop`, `msg-copy`, `msg-more`, `msg-delete`
- Quickstart: `quickstart-item`

## E2E (grün)

1. Quickstart → Chat → Senden/Stop → kein Layout‑Sprung
2. Settings: Toggles/Persistenz → Chat Fokus
3. Chats‑Liste: Neu → zurück → Löschen
4. Model‑Picker sichtbar

## Risiken & Hinweise

- Nur visuelle Änderungen + Selektoren/A11y, keine Featureentfernung.
- Falls Tools/Docs auf alte Komponenten verweisen, bitte auf ui/\* umstellen.

## Nach Merge

- Volllauf: `npm run verify && npm run test:e2e`
- Pages‑Deploy prüfen
