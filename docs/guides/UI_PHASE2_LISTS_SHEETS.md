# UI Phase 2 - ListRow + BottomSheet

## Status

Accepted (Phase 2 umgesetzt)

## Ziel

- Listen-Screens wirken aus einem Guss.
- Detailinformationen erscheinen konsistent in einem BottomSheet statt inline-expanding Sonderfällen.

## Deliverables

### Neue Primitives

- `src/ui/ListRow.tsx`
  - Einheitliche Zeilenstruktur für katalogartige Listen
  - Unterstützt Leading-Icon, Badge/Meta, Trailing-Actions, Accent-Bar und Press-Overlay

- `src/ui/BottomSheet.tsx`
  - Generischer, wiederverwendbarer Mobile-Detail-Sheet
  - Escape-/Backdrop-Close, Safe-Area-Padding, optional Footer-Actions

### Exporte

- `src/ui/index.ts` erweitert um:
  - `BottomSheet`
  - `ListRow`

## Migrationen

- Models:
  - `src/components/models/ModelsCatalog.tsx`
  - Listendarstellung auf `ListRow`
  - Detailansicht auf `BottomSheet`

- Roles:
  - `src/components/roles/EnhancedRolesInterface.tsx`
  - Listendarstellung auf `ListRow`
  - Detailansicht auf `BottomSheet`

- Settings Overview:
  - `src/features/settings/TabbedSettingsView.tsx`
  - Listendarstellung auf `ListRow`
  - Detailansicht pro Bereich auf `BottomSheet`

## UX-Verhalten

- Primärtap auf Zeile bleibt direkte Hauptaktion (Aktivieren/Öffnen).
- `Details`-Action öffnet den Sheet mit konsistentem Layout und CTA.
- Kategorien/Akzente bleiben über Accent-Bar, Icon-Surface und Badge sichtbar.
