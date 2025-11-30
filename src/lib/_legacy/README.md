# Legacy Library Code

Diese Utilities werden aktuell nicht verwendet.

## Status: DEPRECATED (November 2025)

| Datei                   | Beschreibung                | Grund für Deprecation                   |
| ----------------------- | --------------------------- | --------------------------------------- |
| `font-loader.ts`        | Dynamisches Font-Loading    | Fonts jetzt via CSS                     |
| `formatRelativeTime.ts` | Relative Zeitformatierung   | Ersetzt durch `Intl.RelativeTimeFormat` |
| `logging.ts`            | Logging-Utility             | Ersetzt durch `production-logger.ts`    |
| `highlighting/`         | Syntax-Highlighting (Prism) | Lazy-loading nicht implementiert        |
| `loadScript.ts`         | Dynamisches Script-Loading  | Nicht verwendet                         |
| `loadStylesheet.ts`     | Dynamisches CSS-Loading     | Nicht verwendet                         |
| `sw-versioning.ts`      | Service Worker Versioning   | Ersetzt durch Vite PWA Plugin           |
| `useTouchGestures.ts`   | Touch-Gesten Hook           | Ersetzt durch `gestures.ts`             |

## Löschung

Diese Dateien können nach 3 Monaten (Februar 2026) gelöscht werden.
