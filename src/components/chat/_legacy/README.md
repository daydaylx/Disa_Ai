# Legacy Chat Components

Diese Komponenten werden aktuell nicht verwendet, wurden aber aufbewahrt, da sie möglicherweise nützlichen Code enthalten.

## Status: DEPRECATED (November 2025)

### Komponenten

| Datei                     | Beschreibung                       | Grund für Deprecation                            |
| ------------------------- | ---------------------------------- | ------------------------------------------------ |
| `ChatHistoryDrawer.tsx`   | Drawer für Chat-Verlauf            | Ersetzt durch `HistorySidePanel`                 |
| `ChatLiveRegion.tsx`      | ARIA Live-Region für Accessibility | Nicht integriert                                 |
| `ChatScreen.tsx`          | Alte Chat-Screen-Implementierung   | Ersetzt durch `Chat.tsx` in pages/               |
| `MessageBubble.tsx`       | Alte Nachrichtenbubble             | Ersetzt durch `ChatMessage.tsx`                  |
| `MessageBubbleCard.tsx`   | Card-Variante der Bubble           | Nicht verwendet                                  |
| `MobileChatComposer.tsx`  | Mobile Eingabe-Komponente          | Ersetzt durch `ChatInputBar` + `ContextBar`      |
| `MobileOptimizedChat.tsx` | Mobile-optimierte Ansicht          | In Hauptkomponente integriert                    |
| `ModelSelector.tsx`       | Alte Modellauswahl                 | Ersetzt durch `ContextBar/ModelSelector`         |
| `QuickSettingsPanel.tsx`  | Einstellungs-Panel                 | Ersetzt durch `ContextBar/QuickSettingsDropdown` |
| `QuickstartGrid.tsx`      | Quickstart-Kacheln                 | Nicht mehr im Design                             |
| `RoleActiveBanner.tsx`    | Banner für aktive Rolle            | In `ContextBar/PersonaSelector` integriert       |

### Unterordner

- `components/` - Alte History-Komponenten (ChatHistoryEmpty, ChatHistoryItem, ChatHistoryLoading)
- `hooks/` - Alte Hooks (useChatHistory, useDrawerEffects)

## Migration

Falls diese Komponenten reaktiviert werden sollen:

1. Prüfen ob das Feature noch benötigt wird
2. Code an aktuelles Design-System ("Ink Theme") anpassen
3. Tests hinzufügen
4. In Hauptordner verschieben

## Löschung

Diese Dateien können nach 3 Monaten (Februar 2026) gelöscht werden, falls sie bis dahin nicht reaktiviert wurden.
