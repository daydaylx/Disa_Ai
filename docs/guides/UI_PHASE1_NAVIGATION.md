# UI Navigation Phase 1

## Status

Accepted (Phase 1 umgesetzt)

## Ziel

- Primäre Ziele dauerhaft im unteren Daumenbereich verfügbar.
- Secondary-Ziele im Drawer bündeln, damit die Hauptnavigation klar bleibt.

## Ergebnis

### Bottom Navigation (Mobile)

Primärziele unten:

- Chat (`/chat`)
- Modelle (`/models`)
- Rollen (`/roles`)
- Einstellungen (`/settings`)

Implementiert über:

- `src/components/navigation/MobileBottomNav.tsx`
- `src/components/navigation/PrimaryNavigation.tsx` (`orientation="bottom"`)

### Drawer als Secondary-Navigation

Secondary-Ziele:

- Verlauf (`/chat/history`)
- Themen (`/themen`)
- Feedback (`/feedback`)
- Impressum (`/impressum`)
- Datenschutz (`/datenschutz`)

Implementiert über:

- `DRAWER_NAV_ITEMS` in `src/config/navigation.tsx`
- `AppMenuDrawer`-Einbindung in:
  - `src/app/layouts/AppShell.tsx`
  - `src/pages/Chat.tsx`

## Safe-Area & Layout

- BottomNav-Höhe zentralisiert mit `--app-bottom-nav-height` in `src/index.css`.
- Content-Container reservieren Platz für die BottomNav in `src/app/layouts/AppShell.tsx`.
- Chat-Composer bekommt zusätzliche Bottom-Reserve gegen Kollision in `src/pages/Chat.tsx`.

## Hinweise

- Side-Nav auf Desktop bleibt im Code vorhanden, Mobile-Bottom-Nav ist der primäre Pfad.
- Active-State bleibt bewusst auf Primärseiten fokussiert; Secondary-Seiten werden über Drawer erreicht.
