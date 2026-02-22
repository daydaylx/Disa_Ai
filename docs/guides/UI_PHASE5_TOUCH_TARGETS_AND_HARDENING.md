# UI Phase 5 - Touch Targets & Hardening

## Status

In Progress (gestartet)

## Ziel

- Quality-Gate aus dem Redesign-Plan systematisch absichern.
- Touch-Targets für sekundäre Aktionen auf mindestens 44px bringen.
- Fehlende Zustands-Tests auf Seitenebene ergänzen.

## Umsetzung (Block 1)

### Touch-Target-Härtung

- `src/components/models/ModelsCatalog.tsx`
  - Favoriten-Icon von `40px` auf `44px` erhöht.
  - `Details`-Action mit `min-h/min-w` auf 44px gebracht.

- `src/components/roles/EnhancedRolesInterface.tsx`
  - Favoriten-Icon von `40px` auf `44px` erhöht.
  - `Details`-Action mit `min-h/min-w` auf 44px gebracht.

- `src/features/settings/TabbedSettingsView.tsx`
  - `Details`-Action mit `min-h/min-w` auf 44px gebracht.

- `src/pages/ThemenPage.tsx`
  - `Details`-Action mit `min-h/min-w` auf 44px gebracht.

- `src/components/conversation/ConversationCard.tsx`
  - Expand/Collapse-Action auf 44px gebracht und `aria-label` ergänzt.
  - Delete-Action auf `Button size="icon"` normalisiert (44px).

- `src/pages/FeedbackPage.tsx`
  - Remove-Action für Bildanhänge auf 44px gebracht.

### Test-Härtung

- `src/features/settings/__tests__/TabbedSettingsView.test.tsx`
  - Daten-State abgedeckt.
  - Empty-State abgedeckt.
  - Error-State + Retry-Pfad abgedeckt.

## Nächste Schritte (Block 2)

- Zusätzliche A11y-Regressionstests für kritische Flows (`/chat`, `/models`, `/roles`) ergänzen.
- Safe-Area/Tap-Target-Checks als feste CI-Checks schärfen.
