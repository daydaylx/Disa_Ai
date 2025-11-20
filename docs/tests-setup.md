# Test-Setup Dokumentation

Diese Dokumentation beschreibt das Test-Setup zur Sicherstellung der Stabilität von Build-Pipeline, CSS-Generierung und React-Entrypoints.

## Übersicht

Wir prüfen, ob die "Verdrahtung" der Anwendung korrekt ist, bevor wir tiefergehende Feature-Tests durchführen. Dies verhindert Fehler wie "nacktes HTML" (fehlendes CSS) oder abstürzende Root-Komponenten.

### 1. Config-Smoke-Tests (`npm run test:config`)
**Pfad:** `tests/build/config.test.ts`

Diese Tests laufen in Node.js und prüfen die statische Konfiguration:
- **PostCSS**: Existiert `postcss.config.js` und lädt Tailwind + Autoprefixer?
- **Tailwind**: Existiert `tailwind.config.ts` und deckt die Content-Globs `index.html` und `src` ab?
- **Global CSS**: Enthält `src/index.css` die `@tailwind`-Direktiven?
- **Main Entry**: Importiert `src/main.tsx` das CSS?
- **HTML**: Enthält `index.html` den korrekten Mount-Point (`#app`) und das Entry-Script?

**Warum?** Fehlkonfigurationen hier führen oft dazu, dass Tailwind nicht geladen wird oder Styles fehlen.

### 2. React-Entrypoint-Smoke (`npm run test:smoke`)
**Pfad:** `tests/smoke/app.test.tsx`

Dieser Test rendert die komplette `<App />`-Komponente in einer JSDOM-Umgebung (mit Mocks für Router und Service Worker).
- **Ziel**: Sicherstellen, dass die App ohne Laufzeitfehler ("Crash") mountet.
- **Warum?** Wenn Context-Provider fehlen oder Hooks beim Start crashen, bleibt der Bildschirm weiß.

### 3. Build-Integration (`npm run test:build`)
**Pfad:** `scripts/test-build.mjs`

Ein Skript, das den echten `npm run build`-Prozess ausführt und das Ergebnis (`dist/`-Ordner) analysiert.
- **Prüfung**:
  - Lief der Build erfolgreich durch?
  - Wurden CSS-Dateien generiert?
  - Enthalten die CSS-Dateien Tailwind-Klassen (z.B. `.flex`, `--tw-`)?
- **Warum?** Manchmal läuft der Build erfolgreich, aber das CSS ist leer (z.B. durch falsche Content-Pfade in der Tailwind-Config). Dieser Test fängt das ab.

### 4. E2E-Tests (`npm run test:e2e`)
**Pfad:** `tests/e2e/`

Verwendet Playwright, um die Anwendung im echten Browser zu testen.

## Ausführung

Alle Tests lokal ausführen:

```bash
# 1. Konfiguration prüfen
npm run test:config

# 2. App-Start prüfen (Smoke)
npm run test:smoke

# 3. Echten Build testen (dauert etwas länger)
npm run test:build
```

## Typische Fehler & Lösungen

| Fehler | Ursache | Lösung |
|--------|---------|--------|
| `tailwind.config.ts should include src ts/tsx files` | Content-Globs in `tailwind.config.ts` falsch. | Prüfen, ob `content` Array `src/**/*.{ts,tsx}` enthält. |
| `Could not find standard Tailwind classes` | Build lief, aber CSS ist leer. | Prüfen, ob Dateien in `src` wirklich von Tailwind gescannt werden (Pfadfehler). |
| `App renders without crashing` fails | Ein Hook oder Provider in `<App />` wirft einen Fehler. | Prüfen, ob im Test Mocks für Browser-APIs (z.B. `ResizeObserver`) fehlen. |
