# Roadmap

> Hinweis (24.11.2025): Historisches Planungsdokument; aktuelle Prioritäten ggf. abweichend.

Das Projekt ist funktional und auf einer professionellen technischen Basis aufgebaut, leidet aber unter einer hohen Komplexität und Uneinheitlichkeit im Styling (CSS). Die Roadmap zielt darauf ab, diese technischen Schulden zu beseitigen, die UI/UX zu konsolidieren und eine saubere, dokumentierte Struktur für die zukünftige Weiterentwicklung durch KI-Agenten zu schaffen.

## Status-Update (31.10.2025)

- Überschriften-Hierarchie in den mobilen Rollengittern ist wieder WCAG-konform (`src/pages/MobileStudio.tsx`, `src/components/studio/MobileRolesInterface.tsx`).
- Icon-only-Steuerflächen im Composer und Memory-Panel besitzen jetzt deutsche Screenreader-Beschriftungen (`src/components/chat/ChatComposer.tsx`, `src/components/memory/MemoryPanel.tsx`).
- Rollen-Konfiguration wird zentral über den `StudioContext` geladen (`src/app/state/StudioContext.tsx`), Verbraucher wie `MobileStudio`/`MobileRolesInterface` greifen nicht mehr direkt auf `persona.json` zu.

## Phase 1: Bestandsaufnahme & Aufräumen

- **Projektstruktur finalisieren:** Das bestehende technische Überblicksdokument (`TIEFENANALYSE.md`) als Referenz für die Architektur verwenden und bei Änderungen aktualisieren.
- **Ungenutzte Komponenten identifizieren:** Führe eine statische Code-Analyse durch (z.B. mit `npx unimported`), um nicht genutzte Dateien und Exporte zu finden. Liste die Ergebnisse in einer neuen Datei `DEPRECATED_FILES.md` auf, um sie später sicher entfernen zu können.
- **CSS-Struktur konsolidieren:** Reduziere die Anzahl der globalen CSS-Importe in `src/App.tsx` und `src/main.tsx`. Fasse die Inhalte der folgenden 9+ CSS-Dateien in eine logische und nachvollziehbare Struktur von maximal 3-4 Dateien zusammen (z.B. `base.css`, `tailwind-output.css`, `theme.css`):
  - `index.css`
  - `styles/design-tokens.css`
  - `styles/mobile-fixes.css`
  - `styles/bottomsheet.css`
  - `ui/base.css`
  - `styles/a11y-improvements.css`
  - `styles/mobile-enhanced.css`
  - `styles/mobile-components.css`
  - `theme/tokens.css`
- **Zentrale Konfiguration sicherstellen:** Verifiziere, dass alle Konfigurationen (`public/models.json`, `public/persona.json`) über einen zentralen Service oder Hook geladen und an die Komponenten weitergegeben werden, anstatt dass Komponenten diese direkt laden.
- **Namenskonventionen durchsetzen:** Benenne die Datei `src/components/Glass.tsx` zu `src/components/SoftDepthSurface.tsx` um, damit sie mit dem darin exportierten Komponentennamen (`SoftDepthSurface`) übereinstimmt.

## Phase 2: UI/UX Konsolidierung

- **Primäres Designsystem festlegen:** Lege "Fluent 2 Soft-Depth" (basierend auf `theme/tokens.css` und `SoftDepthSurface.tsx`) als das einzige primäre Designsystem fest. Entferne alle CSS-Klassen und -Variablen, die diesem System widersprechen oder von einem anderen System (z.B. reines Glassmorphism) stammen.
- **Globale Layout-Komponenten vereinheitlichen:** Überprüfe, ob die `MobileAppShell` (`src/app/layouts/MobileAppShell.tsx`) konsistent auf allen Seiten in `src/app/router.tsx` als Haupt-Layout-Wrapper verwendet wird. Extrahiere die Navigationsleiste aus der Shell in eine eigene, wiederverwendbare Komponente `src/components/layout/GlobalNav.tsx`.
- **Mobile Navigation reparieren:** Stelle sicher, dass die mobile Navigation (vermutlich ein Hamburger-Menü in `GlobalNav.tsx`) korrekt über allen Inhalten als Overlay angezeigt wird und das Scrollen der darunterliegenden Seite unterbindet, wenn sie geöffnet ist.
- **Seiten für Rollen/Modelle entwirren:** Überarbeite die Seiten `src/pages/MobileModels.tsx` und `src/pages/MobileStudio.tsx`. Füge clientseitige Filter- und Suchfunktionen hinzu. Implementiere eine Gruppierung der Einträge (z.B. nach Anbieter in `models.json` oder nach `tags` in `persona.json`), um die Übersichtlichkeit zu verbessern.

## Phase 3: Funktionale Schicht stabilisieren

- **API-/Service-Layer zentralisieren:** Bestätige, dass alle externen API-Aufrufe ausschließlich über die Funktionen in `src/api/` (z.B. `openrouter.ts`) laufen. Refaktoriere eventuelle direkte `fetch`-Aufrufe in Komponenten in diese Service-Schicht.
- **Fehlerbehandlung und Ladezustände vervollständigen:** Ergänze in der zentralen Chat-Logik (`useChat`-Hook) spezifische `catch`-Blöcke, um API-Fehler an die UI zu melden (z.B. über einen Toast-Service). Stelle sicher, dass alle Daten-ladenden Komponenten klare Lade-Indikatoren (Spinner, Skeleton) anzeigen.
- **Konfiguration von der UI trennen:** Verifiziere, dass die UI-Komponenten zur Modell- und Persona-Auswahl ihre Daten ausschließlich aus dem globalen Zustand (geladen aus `models.json` und `persona.json`) beziehen und keine Konfigurationen hartcodiert sind.
- **Sichere Speicherung von API-Keys:** Bestätige, dass die `readApiKey()`-Funktion in `src/lib/openrouter/key.ts` den Key ausschließlich aus dem `sessionStorage` liest und es keine Fallbacks auf `localStorage` oder hartcodierte Werte im Code gibt.

## Phase 4: DX / KI-Weiterverwendung

- **Entwickler-Dokumentation für KI erstellen:** Erstelle eine neue Datei `docs/AI_DEVELOPMENT_GUIDE.md`, die erklärt, wie ein KI-Agent mit dem Projekt arbeiten soll.
- **Beispiel-Prompts bereitstellen:** Füge in `docs/AI_DEVELOPMENT_GUIDE.md` eine Sektion mit Beispiel-Prompts für gängige Aufgaben ein, z.B.: "Prompt zum Hinzufügen einer neuen Einstellung in `SettingsAppearancePage.tsx`, die den Theme-Zustand im `StudioContext` ändert."
- **Standard-Kontextliste für Agenten anlegen:** Definiere in `docs/AI_DEVELOPMENT_GUIDE.md` eine Liste von Dateien, die für die meisten Entwicklungsaufgaben relevant sind (z.B. `tailwind.config.ts`, `src/state/StudioContext.tsx`, `src/app/router.tsx`).
- **UI-Debug-Ansicht erstellen:** Erstelle eine neue Route unter `/debug/ui`, die eine Seite `src/pages/DebugUI.tsx` rendert. Diese Seite soll alle Kern-UI-Komponenten aus `src/components/ui` in verschiedenen Zuständen und Varianten anzeigen, um die Entwicklung und das Testen zu erleichtern (ähnlich einem Storybook).

## Phase 5: Optionale Erweiterungen

- **Export/Import von Konfigurationen:** Implementiere in der `SettingsDataPage.tsx` eine Funktion, die den aktuellen App-Zustand (gewähltes Modell, Persona, Chat-Verlauf) als JSON-Datei exportiert und den Import einer solchen Datei ermöglicht.
- **Build-Varianten definieren:** Passe die `vite.config.ts` und `package.json`-Skripte an, um verschiedene Builds zu ermöglichen, z.B. `npm run build:chat` (eine leichtgewichtige Version ohne die Einstellungs- und Studio-Seiten) und `npm run build:full` (die vollständige App).
- **Performance-Analyse durchführen:** Führe `npm run analyze` aus, um das Bundle zu analysieren. Identifiziere die größten Module im `vendor`-Chunk und prüfe, ob sie durch kleinere Alternativen ersetzt oder via dynamischem `import()` nachgeladen werden können, um die initiale Ladezeit zu verbessern.
