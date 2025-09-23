# Refactoring Plan

## Zusammenfassung

Die Analyse des "Disa AI"-Projekts zeigt eine solide Codebasis mit guter statischer Qualität (keine Type-, Lint- oder Test-Fehler). Das Build-System ist modern und die Abhängigkeiten sind aktuell. Das Hauptproblem ist das manuelle Routing, das zu nicht ladenden Unterseiten führt und die Wartbarkeit erschwert. Weitere Punkte betreffen die Code-Struktur und ungenutzte Dateien.

## Entscheidungskriterien

- **NOTWENDIG**: Behebt einen reproduzierbaren Fehler, einen Build-Blocker oder ein klares Sicherheitsrisiko.
- **SINNVOLL**: Verbessert die Wartbarkeit, Performance oder Developer Experience (DX) mit messbarem, kurzfristigem Gewinn.

## Top-Befund „Unterseiten laden nicht“

- **Problem**: Ein Hard-Reload auf einer Unterseite (z.B. `/models`) führt zu einem 404-Fehler, da kein serverseitiges SPA-Fallback konfiguriert ist und das clientseitige Routing nicht auf `react-router-dom` basiert.
- **Evidenz**:
  - `src/App.tsx` implementiert ein manuelles, Hash-basiertes Routing.
  - Es gibt keine `react-router-dom`-Abhängigkeit in `package.json`.
  - Die `public/_headers` Datei enthält keine SPA-Redirect-Regel.

## Priorisierte Maßnahmen

### 1. Routing-Implementierung

- **Dateien/Orte**: `src/App.tsx`, `src/main.tsx`, `package.json`
- **Problembeschreibung**: Das manuelle Hash-Routing in `App.tsx` ist fehleranfällig, nicht erweiterbar und verursacht Probleme mit dem Browser-Verlauf und direkten Seitenaufrufen.
- **Einstufung**: NOTWENDIG (behebt den Hauptfehler der Anwendung)
- **Akzeptanzkriterien**:
  - Die Anwendung nutzt `react-router-dom` für das clientseitige Routing.
  - Direkte Aufrufe von `/models` und `/settings` nach einem Hard-Reload funktionieren.
  - Die Navigation über die Navigationsleiste funktioniert wie erwartet.
- **Prüf-/Testnachweise**: `npm run test:e2e` (nach Anpassung der Tests), manuelle Überprüfung im Browser.
- **Aufwand**: M, **Risiko**: mittel, **Impact**: hoch

### 2. SPA-Fallback für Netlify/Vercel

- **Dateien/Orte**: `public/_headers`
- **Problembeschreibung**: Es fehlt eine Redirect-Regel, die alle Anfragen auf `index.html` umleitet, was für SPAs notwendig ist.
- **Einstufung**: NOTWENDIG (behebt 404-Fehler bei direkten Seitenaufrufen)
- **Akzeptanzkriterien**: Die `public/_headers` Datei enthält die Regel `/* /index.html 200`.
- **Prüf-/Testnachweise**: Manuelle Überprüfung der deployten Anwendung.
- **Aufwand**: S, **Risiko**: niedrig, **Impact**: hoch

### 3. Unbenutzte Dateien und Code entfernen

- **Dateien/Orte**: `src/routes/Debug.tsx`, `src/ui2/` (teilweise), diverse ungenutzte Komponenten.
- **Problembeschreibung**: Es gibt ungenutzte Komponenten und Code-Teile, die die Codebasis unnötig vergrößern und die Wartung erschweren.
- **Einstufung**: SINNVOLL (verbessert die Wartbarkeit)
- **Akzeptanzkriterien**: `npm run build` läuft ohne Fehler und die ungenutzten Dateien sind gelöscht.
- **Prüf-/Testnachweise**: `npm run verify`
- **Aufwand**: M, **Risiko**: niedrig, **Impact**: mittel

## Rollout-Reihenfolge

1.  **Routing-Implementierung**: Zuerst das Routing auf `react-router-dom` umstellen.
2.  **SPA-Fallback**: Danach die Redirect-Regel hinzufügen.
3.  **Code-Bereinigung**: Abschließend ungenutzten Code entfernen.

## Anhang A: Roh-Outputs

- **`npm run verify`**: Lief erfolgreich durch.
- **`npm run build`**: Lief erfolgreich durch.

## Anhang B: Gekürzter Dateibaum

```
/home/d/Schreibtisch/Disa Ai/
├───.github/
├───build/
├───dist/
├───docs/
├───node_modules/
├───public/
├───scripts/
├───src/
│   ├───App.tsx
│   ├───main.tsx
│   ├───components/
│   ├───config/
│   ├───hooks/
│   ├───lib/
│   ├───routes/
│   ├───services/
│   ├───state/
│   ├───styles/
│   ├───ui2/
│   └───views/
├───tests/
└───tools/
```
