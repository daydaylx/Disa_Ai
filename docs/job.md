from pathlib import Path

# Recreate the complete document file after environment reset
doc = """# 📘 Disa AI – Developer Workflow & Best Practices  
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
Nach der Umsetzung:

md
Details immer anzeigen

Code kopieren
### Umsetzung
- Änderungen: <Stichpunkte>
- Tests/Checks: <Nachweis>
- Ergebnis: <harte Zahlen, Screens>

### Fertig
- [x] Akzeptanzkriterien erfüllt
🔀 5. Branch-, Commit- & PR-Regeln
Branch:
feature/<issue-nr>-kurzthema oder fix/<issue-nr>-kurzthema
→ Beispiel: feature/12-lazy-highlighter

Commit-Format:
type(scope): kurze beschreibung

Types: feat, fix, perf, refactor, chore, docs, test
Body erklärt Warum und Wie.
Footer enthält Closes #<issue>.

PR-Checkliste:

 Plan kommentiert + beschlossen

 Lint/Build grün

 Akzeptanzkriterien erfüllt

 Mobile-QA geprüft (360–768 px)

 Regressionen ausgeschlossen

🧱 6. CI/CD Pflichten
Jobs: typecheck, lint, test, build, size-limit, lighthouse-mobile, playwright-mobile
Matrix: Node 20 & 22
Artefakte: dist/, sme.html, lighthouse.json, playwright-report/
Branch-Protection: Mind. 2 grüne Checks (PERF + E2E)

🚦 7. Feature-Flags (leichtes System)
src/config/flags.ts

ts
Details immer anzeigen

Code kopieren
export const featureFlags = {
  discussionMode: false,
  newDrawer: false,
  analyticsOptIn: false
};
Flags standardmäßig false

Aktivierbar per .env.local oder Query ?ff=flagname

Dev-UI zeigt aktive Flags

🧪 8. Mobile-E2E Flows (Playwright Mini-Suite)
ID	Flow	Viewports
1	App starten → erste Nachricht → Antwort < 3 s (Mock)	360×800 / 390×844
2	Modell wechseln → Persistenz nach Reload	390×844
3	Settings Toggle (NSFW/Mem) → Persistenz nach Reload	414×896
4	Drawer Edge-Swipe öffnet Menü (Back-Gesture bleibt)	768×1024

🧰 9. Prompt-Hygiene (verbesserte Schablone)
yaml
Details immer anzeigen

Code kopieren
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
🪓 10. Rollback-Playbook (60 Sekunden)
Cloudflare Pages: Vorherigen Build re-aktivieren.

Feature-Flag off im flags.ts.

Hotfix-Branch mit Revert oder Patch.

Regression testen, neu deployen.

♿ 11. Accessibility & UX-Grundsätze
Tap-Ziele ≥ 44 px, Fokus-Ringe sichtbar

Kontrast ≥ 4.5:1

Modals mit aria-modal und Escape-Close

Spinner immer mit Timeout/Fehlertext

Kein „Click-thru“ durch Overlays

📊 12. Issue-Prompts & Issues
Alle 20 Issues + Prompts bleiben exakt wie festgelegt.
(Siehe Abschnitt 12.1 im Dokument oder die einzelne Prompt-Datei)

🧠 13. Fazit
Das Disa AI-Workflow-System ist jetzt:

Planbar: Jeder Task hat Prompt, Plan, Messziel.

Messbar: Jede Änderung muss Artefakte liefern.

Sicher: Flags, Rollback und Budget-Gates sichern jeden Release.

Automatisierbar: CI/CD überwacht Performance & QA.

Wenn jeder Mitwirkende diesen Ablauf befolgt, bleibt die PWA technisch sauber, mobile-schnell und leicht erweiterbar.
"""

path = Path("/mnt/data/DEV_WORKFLOW_AND_PRACTICES.md")
path.write_text(doc, encoding="utf-8")
path.as_posix()

Details immer anzeigen

Code kopieren
Ergebnis
'/mnt/data/DEV_WORKFLOW_AND_PRACTICES.md'
