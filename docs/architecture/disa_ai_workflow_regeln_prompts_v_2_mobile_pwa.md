# 📘 Disa AI – Developer Workflow & Best Practices  
_Version 2.0 — Mobile-PWA Fokus_

---

## 🧭 Zielsetzung

Dieses Dokument definiert den vollständigen Workflow, die Regeln, Prompts und Qualitätskriterien
für die Weiterentwicklung der Disa AI-PWA.  
Ziel: **Stabil, performant, mobile-optimiert** und **sauber dokumentiert**.  
Alle Arbeiten erfolgen strikt *Issue-für-Issue*, dokumentiert, getestet und mit klaren Metriken abgeschlossen.

---

## ⚙️ 1. Grundprinzipien

1. **Ein Issue zur Zeit.**  
   Niemals mehrere Baustellen gleichzeitig. Kleine, fokussierte PRs (< 300 Zeilen Diff).  

2. **Prompt → Kontext → Plan → „Beschlossen“.**  
   Immer mit dem passenden Issue-Prompt starten, dann Kontext sammeln, Plan kurz notieren, beschließen und erst dann coden.

3. **Definition of Ready (DoR)** prüfen:  
   - Problem & Beleg vorhanden  
   - Messziel klar definiert  
   - Prompt gewählt  
   - Testidee existiert  
   - Rollback-Plan notiert

4. **Feature-Flags pflichtig** für neue oder riskante Features.  
   Flags liegen in `src/config/flags.ts`. Standard: deaktiviert.

5. **Testpflicht.**  
   Mindestens ein Playwright-Flow (mobile) oder zwei Vitest-Specs pro Feature.

6. **Performance-Budget strikt.**  
   - Entry-Bundle ≤ 300 KB  
   - LCP < 2,5 s (Throttled Mid-Range)  
   - CI schlägt fehl, wenn Budget überschritten wird.

7. **Security & Secrets.**  
   Keine Secrets im Repo. Nur `.env.example` einchecken, Laufzeit-Guards bei fehlenden Keys.

8. **Definition of Done (DoD)** gilt als Gate:  
   - Lint, Typecheck, Tests, Budgets ✅  
   - Rollback-Plan dokumentiert  
   - Changelog-Zeile hinzugefügt  

---

## 📑 2. DoR & DoD Checklisten

### ✅ Definition of Ready
- [ ] Problem + Beleg (Pfad/Zeile/Screenshot)  
- [ ] Messziel (Zahl, Schwelle, Datei)  
- [ ] Prompt ausgewählt  
- [ ] Testidee notiert (Playwright/Vitest)  
- [ ] Rollback-Plan (60 s) beschrieben  

### ✅ Definition of Done
- [ ] Metriken erfüllt (Artefakte verlinkt)  
- [ ] Tests grün (min. 60 % Statements im Scope)  
- [ ] Feature-Flag existiert (wenn Feature)  
- [ ] Docs & QA-Checklist aktualisiert  
- [ ] Changelog-Eintrag + `Closes #N`  
- [ ] Rollback-Schritte verfügbar  

---

## 🧰 3. Arbeits- und Ablagestruktur

| Ordner | Zweck |
|:--|:--|
| `docs/work/` | Arbeitspläne, Screenshots, Audit-Reports |
| `docs/QA_Mobile_Checklist.md` | Mobile-QA Flows & Viewports |
| `docs/RELEASE_PLAYBOOK.md` | Rollback-Anleitung (60 s) |
| `.audit/` | Temporäre Reports (SME, rg-Ausgaben) |
| `.github/workflows/ci.yml` | Lint + Test + Build + Size-Budget + E2E |

---

## 🧩 4. Issue-Kommentar-Template

```md
### Kurzplan
- **Problem:** <kurze Beschreibung>
- **Ansatz:** <konkrete Schritte, Dateien, Risiken>
- **Messziel:** <z. B. Entry ≤ 300 KB>

### Kontext
- Relevante Dateien: <pfade>
- Messung/Audit: <Ergebnisse oder Artefakte>
- Screens/Links: <optional>

### Beschlossen
- [x] Plan freigegeben, Umsetzung startet.
```

Nach der Umsetzung:

```md
### Umsetzung
- Änderungen: <Stichpunkte>
- Tests/Checks: <Nachweis>
- Ergebnis: <harte Zahlen, Screens>

### Fertig
- [x] Akzeptanzkriterien erfüllt
```

---

## 🔀 5. Branch-, Commit- & PR-Regeln

**Branch:**  
`feature/<issue-nr>-kurzthema` oder `fix/<issue-nr>-kurzthema`  
→ Beispiel: `feature/12-lazy-highlighter`

**Commit-Format:**  
`type(scope): kurze beschreibung`

Types: `feat`, `fix`, `perf`, `refactor`, `chore`, `docs`, `test`  
Body erklärt *Warum* und *Wie*.  
Footer enthält `Closes #<issue>`.

**PR-Checkliste:**
- [ ] Plan kommentiert + beschlossen  
- [ ] Lint/Build grün  
- [ ] Akzeptanzkriterien erfüllt  
- [ ] Mobile-QA geprüft (360–768 px)  
- [ ] Regressionen ausgeschlossen  

---

## 🧱 6. CI/CD Pflichten

Jobs: `typecheck`, `lint`, `test`, `build`, `size-limit`, `lighthouse-mobile`, `playwright-mobile`  
Matrix: Node 20 & 22  
Artefakte: `dist/`, `sme.html`, `lighthouse.json`, `playwright-report/`  
Branch-Protection: Mind. 2 grüne Checks (PERF + E2E)

---

## 🚦 7. Feature-Flags (leichtes System)

`src/config/flags.ts`
```ts
export const featureFlags = {
  discussionMode: false,
  newDrawer: false,
  analyticsOptIn: false
};
```
- Flags standardmäßig `false`  
- Aktivierbar per `.env.local` oder Query `?ff=flagname`  
- Dev-UI zeigt aktive Flags

---

## 🧪 8. Mobile-E2E Flows (Playwright Mini-Suite)

| ID | Flow | Viewports |
|:--|:--|:--|
| 1 | App starten → erste Nachricht → Antwort < 3 s (Mock) | 360×800 / 390×844 |
| 2 | Modell wechseln → Persistenz nach Reload | 390×844 |
| 3 | Settings Toggle (NSFW/Mem) → Persistenz nach Reload | 414×896 |
| 4 | Drawer Edge-Swipe öffnet Menü (Back-Gesture bleibt) | 768×1024 |

---

## 🧰 9. Prompt-Hygiene (verbesserte Schablone)

```
Kontext:
- Repo: Disa_Ai (React + Vite + TS)
- Ziel: <konkret und messbar>
- Grenzen: Keine Secrets, kein README, nur messbare Fixes.

Aufgabe:
1) Analysiere Dateien <Pfadliste>
2) Zeige Belege (Pfad:Zeile oder Artefakt)
3) Entwirf Kurzplan mit Risiken
4) Erstelle Patch (minimalinvasiv, ggf. Feature-Flag)
5) Generiere Tests (Vitest/Playwright)
6) Messe und logge Ergebnis (Pfad Artefakt)

Akzeptanz:
- <Budget/Schwelle/Verhalten>

Rollback:
- <1–2 Schritte zum Revert>

Output:
- DIFF/PR-Text + Liste geänderter Dateien
```

---

## 🪓 10. Rollback-Playbook (60 Sekunden)

1. **Cloudflare Pages**: Vorherigen Build re-aktivieren.  
2. **Feature-Flag off** im `flags.ts`.  
3. Hotfix-Branch mit Revert oder Patch.  
4. Regression testen, neu deployen.  

---

## ♿ 11. Accessibility & UX-Grundsätze

- Tap-Ziele ≥ 44 px, Fokus-Ringe sichtbar  
- Kontrast ≥ 4.5:1  
- Modals mit `aria-modal` und Escape-Close  
- Spinner immer mit Timeout/Fehlertext  
- Kein „Click-thru“ durch Overlays  

---

## 📊 12. Issue-Prompts (20 Stück)

### 🔹 Sprint 1
1. Initial-Bundle zu groß  
2. Tote Routen  
3. Leere Event-Handler  
7. Icon-Bloat  
8. Lazy-Loading Highlighter/Markdown  
9. Daten-Fetch beim App-Start  
15. Settings-Karten reparieren  
17. CI-Guard fürs Bundle  
19. Chat-Stream Error-Handling

### 🔹 Sprint 2
4. Unsaubere Mobile-Erkennung  
5. Edge-Swipe Integration  
6. Doppeltes Designsystem  
10. Safe-Area Padding  
11. 100vh-Problem  
12. Bildergröße & Lazy-Loading  
13. Unbenutzte Komponenten  
16. Navigation vereinheitlichen

### 🔹 Sprint 3
14. Structured Discussion Mode  
18. Analytics-Kapselung  
20. QA-Checkliste erstellen

---

## 13. Vollständige Prompts (Copy/Paste für deinen Agent)

### 1) Initial-Bundle zu groß
Analysiere das Projekt. Ermittle Top-Contributors zur Bundle-Größe (Rollup/Vite outputs).\
Schlage route-basiertes Code-Splitting für große Views vor und setze es um\
(router.tsx/Routes, React.lazy+Suspense). Highlighter/Editor/Icons nur on-demand laden.\
Zielgröße: Entry ≤ 300 KB. Erstelle PR mit Messwerten vor/nach der Änderung.

### 2) Tote Routen
Durchsuche in `src` nach `<Route/path:>` und nach Verlinkungen (`Link`, `navigate()`).\
Liste Routen, die nie verlinkt sind. Entferne sie ODER verknüpfe mit bestehendem Menü.\
Liefere diff und bestätige, dass `.audit/never_linked_routes.txt` leer ist.

### 3) Leere Event-Handler
Finde leere `onClick/onSubmit/onChange`-Handler. Zeige Datei+Zeile.\
Implementiere sinnvolle Aktionen oder entferne tote UI-Elemente.\
Sichere UX-Flows: keine No-Ops. Erstelle PR mit kurzer Doku.

### 4) Fragile Mobile-Erkennung
Öffne `src/hooks/useIsMobile.ts`. Ersetze UA-Erkennung/feste 768px durch\
`matchMedia('(pointer:coarse)')` oder zuverlässige Media-Queries.\
Sorge für konsistentes Verhalten auf Tablets. Liefere Tests/Manu-Checks.

### 5) Edge-Swipe für Drawer
Prüfe `src/hooks/useEdgeSwipe.ts`. Integriere global: rechter Rand-Swipe öffnet Haupt-Drawer\
nur auf Geräten mit pointer:coarse. Verhindere Konflikte mit Browser-Back-Gesture.\
Dokumentiere Optionen (edgeWidth, minDX). PR inkl. GIF/Screenshot.

### 6) Doppeltes Designsystem
Finde ThemeProvider, cva, Tailwind-Configs, doppelte Token. Führe sie in ein System zusammen\
(ein Provider, zentrale Token-Datei). Entferne redundante Layer. Dokumentiere Strukturänderung.

### 7) Icon-Bloat
Identifiziere Icon-Libraries mit Wildcard-Import. Ersetze durch Einzel-Imports.\
Optional: lokales Icon-Subset erzeugen. Belege Reduktion im SME-Report (vor/nach).

### 8) Highlighter/Markdown nur „on demand“
Suche Stellen mit Syntax-Highlighter/Markdown-Viewer. Ersetze Direkt-Importe\
durch `dynamic import()`. Prüfe, dass der Code nicht im Initial-Chunk landet.\
PR mit Lazy-Load-Beispiel und Build-Diff.

### 9) Daten-Fetch beim App-Start drosseln
Analysiere App-Start. Verlege Laden von Rollen/Modellen/Tools hinter\
`onTabChange/onVisible`. Implementiere ein `useDeferredFetch` (`requestIdleCallback`).\
Beweise: Netzwerk-Timeline ohne kritische Calls vor erster Interaktion.

### 10) Safe-Area & Viewport
Ergänze `viewport-fit=cover` in `index.html`. Füge CSS `padding` mit\
`env(safe-area-inset-bottom)` für Bottom-Nav/Footers/Modals hinzu.\
Bestätige saubere Darstellung auf Geräten mit Notch/Gesten.

### 11) 100vh-Problem
Finde CSS mit `height:100vh` und ersetze durch `min-height:100svh/100dvh`.\
Überprüfe Scroll-Container und Tastatur-Einblendungen. Kein Jumping mehr.

### 12) Überdimensionierte Bilder
Suche alle Bilder/Hintergründe. Erzeuge AVIF/WebP-Varianten und `sizes/srcset`.\
Begrenze BG-Assets auf max 1440w. Lazy-Load Offscreen. Ziel: kein Bild > 200 KB.

### 13) Unbenutzte Komponenten/Exports
Liste Exports ohne Imports. Entferne sie oder markiere bewusst als `deprecated` (Kommentar).\
Erstelle Tabelle Datei/Symbol/Aktion. PR mit Cleaning-Commits.

### 14) Structured Discussion Mode verdrahten
Analysiere `src/prompts/discussion/*` und `src/features/discussion/shape.ts`.\
Füge im Chat-View einen Toggle „Strukturierte Diskussion“ hinzu, der die Shape-Regeln aktiv schaltet.\
Validiere, dass Antworten Satzgrenzen/Summary-Regeln befolgen.

### 15) Settings-Karten funktionsfähig
Durchprüfe `SettingsOverview/SettingsView`. Jede Karte muss eine messbare Aktion auslösen:\
API-Key Persistenz, Memory Clear, Filter Toggle. Implementiere fehlende Hooks/Stores.\
Teste Persistenz über Reload.

### 16) Mobile-Navigation vereinheitlichen
Wähle EIN Muster (z. B. Drawer + Edge-Swipe). Entferne doppelte Wege (z. B. redundante Buttons).\
Sorge dafür, dass alle Hauptpfade in ≤2 Interaktionen erreichbar sind.

### 17) CI-Guard fürs Bundle-Budget
Ergänze GitHub Action (size-limit oder source-map-explorer) mit hartem Fail > 350 KB Entry.\
Füge baseline/thresholds hinzu. Zeige Beispiel-Fail in Test-PR.

### 18) Discussion-Analytics sauber kapseln
Öffne `src/analytics/discussion.ts`. Füge Opt-In, Privacy-Hinweis und Export-Button (JSON) hinzu.\
Kein Main-Thread-Block. Dokumentiere Latenz/Größe (localStorage).

### 19) Chat-Stream Error-Handling
Analysiere `src/api/chat.ts` und `src/api/openrouter.ts`. Implementiere Timeout, Retry-Backoff\
und sichtbare Fehlermeldungen bei leeren Streams. Simuliere API-Timeouts.

### 20) QA-Checkliste erstellen
Lege `docs/QA_Mobile_Checklist.md` an. Liste Tests für LCP, TTI, Scroll, Safe-Area,\
Tastaturverhalten und Breakpoints (360/390/414/768 px). CI soll Datei als Artefakt anhängen.

---

## 🧠 14. Fazit

Das Disa AI-Workflow-System ist jetzt:
- **Planbar:** Jeder Task hat Prompt, Plan, Messziel.  
- **Messbar:** Jede Änderung muss Artefakte liefern.  
- **Sicher:** Flags, Rollback und Budget-Gates sichern jeden Release.  
- **Automatisierbar:** CI/CD überwacht Performance & QA.  

Wenn jeder Mitwirkende diesen Ablauf befolgt, bleibt die PWA technisch sauber, mobile-schnell und leicht erweiterbar.

