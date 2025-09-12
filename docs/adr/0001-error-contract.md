# ADR 0001: Einheitlicher Fehlervertrag

## Status

Akzeptiert

## Kontext

Die Fehlerbehandlung im Frontend war bisher auf mehrere Module verteilt (`src/lib/net/errorMapping.ts`, `src/lib/errors/humanError.ts`, `src/lib/chat/types.ts`). Dies führte zu inkonsistenten Fehlerobjekten und erschwerte die zentrale Verarbeitung und Anzeige von Fehlern. Es fehlte eine klare Hierarchie und ein "Single Source of Truth" für Fehler, die von der API oder durch Netzwerkprobleme verursacht wurden.

## Entscheidung

Wir führen einen einheitlichen Fehlervertrag ein, der in `src/lib/errors` zentralisiert ist. Dieser besteht aus:

1.  **Einer klaren Fehlerhierarchie:** Eine `ApiError`-Basisklasse und spezialisierte Unterklassen für verschiedene Fehlerszenarien (Netzwerk, HTTP-Client/-Server, Rate-Limiting etc.).
2.  **Einem Mapping-Layer:** Eine `mapError(error: unknown)`-Funktion, die jeden beliebigen Fehler (z.B. von `fetch`, `AbortController` oder HTTP-Responses) auf eine unserer definierten `ApiError`-Klassen abbildet.
3.  **Einem User-Facing-Mapper:** Die bestehende `humanError`-Funktion wird angepasst, um die neuen, strukturierten Fehlerobjekte in für den Nutzer verständliche Meldungen umzuwandeln.

Dieses Vorgehen schafft eine robuste und vorhersagbare Fehlerbehandlung im gesamten System.

### Fehlerklassen (`src/lib/errors/types.ts`)

Die Implementierung der Fehlerklassen folgt dem Muster, `name` im Konstruktor nach `super()` zu setzen und `Error.captureStackTrace` zu verwenden, anstatt `name` als Klassenfeld zu deklarieren. Dies umgeht `TS4114` und stellt eine korrekte Stack-Trace-Erfassung sicher.

-   `ApiError` (Basisklasse)
-   `NetworkError` (z.B. `fetch` schlägt fehl, Timeout, Offline)
-   `AbortError` (Anfrage vom Nutzer abgebrochen)
-   `HttpError` (Basisklasse für HTTP-Fehler)
    -   `RateLimitError` (HTTP 429)
    -   `AuthenticationError` (HTTP 401)
    -   `PermissionError` (HTTP 403)
    -   `NotFoundError` (HTTP 404)
    -   `ApiClientError` (andere 4xx-Fehler)
    -   `ApiServerError` (5xx-Fehler)
-   `UnknownError` (Fallback für alle anderen Fehler)

## Konsequenzen

-   **Vorteile:**
    -   Zentralisierte und konsistente Fehlerlogik.
    -   Einfachere und typsichere Fehlerbehandlung in den UI-Komponenten.
    -   Bessere Testbarkeit der Fehler-Mappings.
    -   Klare Trennung zwischen internen Fehlertypen und für den Nutzer sichtbaren Meldungen.
-   **Nachteile:**
    -   Initialer Refactoring-Aufwand, um alle bestehenden Fehlerbehandlungs-Stellen zu migrieren.
-   **Migration:**
    -   Alle `catch`-Blöcke, die API-Aufrufe behandeln, werden so umgebaut, dass sie `mapError` verwenden.
    -   Die UI-Komponenten (Toasts, Banner) werden angepasst, um auf die neuen Fehlerklassen zu reagieren.
    -   Die alten Module (`errorMapping.ts`, `chat/types.ts`) werden entfernt.
