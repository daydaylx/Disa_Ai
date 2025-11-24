# Verschwörungstheorien-Kategorie – Implementierungsdokumentation

**Datum**: 2025-11-24
**Kontext**: Neue Kategorie für kritische Diskussionen zu kuratierten Verschwörungstheorien
**Basierend auf**: `Verschwörungstheorien.md` (Root-Level Plan)

---

## Übersicht

Diese Implementierung fügt eine neue Kategorie "Verschwörungstheorien" zum Diskussionssystem hinzu. Die KI agiert als sokratischer Moderator, der Behauptungen kritisch prüft, ohne Falschinformationen zu bestätigen oder durch Wiederholung zu verstärken.

**Ziel**: Nutzer sollen lernen, evidenzbasiert zu denken und Verschwörungstheorien kritisch zu hinterfragen – nicht durch Predigen, sondern durch gemeinsames Prüfen und Stresstest von Behauptungen.

---

## Geänderte Dateien

### 1. `/src/components/chat/QuickstartGrid.tsx`

**Letzte Änderung**: 2025-11-24 (UI-Struktur: Separate Section)

**Änderungen**:

#### a) Neue Kategorie `verschwörungstheorien` hinzugefügt

- **Zeilen 5–10**: Type `QuickstartCategory` erweitert um `"verschwörungstheorien"`
- **Zeilen 28–31**: `CATEGORY_LABELS` erweitert mit:
  ```typescript
  verschwörungstheorien: {
    label: "Verschwörungstheorien",
    color: "bg-red-500/10 text-red-600 border border-red-500/20",
  }
  ```
- **Begründung**: Roter Farbcode signalisiert "Vorsicht, kritisches Thema". Border hebt die Kategorie visuell ab.

#### b) Spezieller Diskussionsmodus implementiert

- **Zeilen 34–79**: Konstante `CONSPIRACY_DISCUSSION_MODE` definiert
- **Struktur**: 7-Schritte-Prozess basierend auf dem Plan:
  - **A. Rephrase & Verständnischeck**: Neutral paraphrasieren, kein Urteil
  - **B. Steelman (max 4–5 Sätze)**: Theorie als Behauptung formulieren, mit Warn-Marker
  - **C. Warum überzeugt das Menschen?**: Psychologie/Soziologie erklären, ohne zu legitimieren
  - **D. Typische Claims sammeln**: 3–5 Behauptungen listen, explizit als solche kennzeichnen
  - **E. Evidenz sortieren + Labels**: Pro Claim Label vergeben (gut belegt / unklar / widerlegt / Spekulation) + Alternative Erklärung
  - **F. Sokratischer Stresstest**: 2–3 Rückfragen zur Falsifizierbarkeit, Widersprüchen, Alternativen
  - **G. Gemeinsames Fazit**: Evidenzlage zusammenfassen, Nutzer zu weiteren Fragen einladen

- **Leitplanken**:
  - Trenne IMMER sichtbar: Behauptung ≠ Beleg
  - Vermeide unnötige Wiederholung der falschen Behauptung (Illusory-Truth-Effekt)
  - Keine Quellen erfinden, keine dramatische Ausschmückung
  - Evidenz-Labeling Pflicht
  - Sokratisch statt predigend
  - Keine Both-Sides-Gleichwertigkeit bei klarer Evidenzlage

- **Begründung**: Dieser Template-Prompt stellt sicher, dass die KI strukturiert und kritisch vorgeht, ohne zu predigen oder Falschinformationen zu verstärken.

#### c) 10 kuratierte Verschwörungstheorien-Themen hinzugefügt

- **Zeilen 251–354**: 10 neue Quickstart-Objekte im `QUICKSTARTS`-Array
- **Liste der Themen**:
  1. **Flache Erde** (`conspiracy-flat-earth`)
  2. **Reptiloiden** (`conspiracy-reptilians`)
  3. **Mondlandung gefälscht** (`conspiracy-moon-landing`)
  4. **Chemtrails** (`conspiracy-chemtrails`)
  5. **Bermuda-Dreieck** (`conspiracy-bermuda-triangle`)
  6. **Ancient Aliens / Pyramiden** (`conspiracy-ancient-aliens`)
  7. **Area 51 / UFO-Vertuschung** (`conspiracy-area51`)
  8. **Denver Airport / Geheimanlage** (`conspiracy-denver-airport`)
  9. **MK-Ultra** (`conspiracy-mkultra`)
  10. **Simulation-Hypothese** (`conspiracy-simulation`)

- **Struktur pro Thema**:
  ```typescript
  {
    id: "conspiracy-[name]",
    title: "[Kurztitel, max ~5 Wörter]",
    description: "[1 Satz, diskussionsanstoßend]",
    icon: Brain,
    category: "verschwörungstheorien",
    speculative: false, // true nur bei Simulation-Hypothese
    system: CONSPIRACY_DISCUSSION_MODE,
    user: "[Einstiegsfrage]"
  }
  ```

- **Begründung**:
  - Alle nutzen denselben `CONSPIRACY_DISCUSSION_MODE` für einheitliche Diskussionsstruktur
  - Titel kurz und prägnant (mobile-first)
  - Descriptions laden zum kritischen Nachdenken ein, ohne zu dramatisieren
  - `speculative: false` bei den meisten, nur `true` bei Simulation-Hypothese (philosophisches Gedankenexperiment)
  - MK-Ultra: historisch belegt, daher mit Kontext ("wie weit ging es?")

---

## UI-Integration

### Separate Section für Verschwörungstheorien (Update 2025-11-24)

Die Verschwörungstheorien werden **nicht** als normale Unterkategorie zwischen den anderen Diskussionen angezeigt, sondern als **eigene Section unterhalb** der regulären Diskussionen.

#### Implementierung in `QuickstartGrid.tsx` (Zeilen 368–482):

**1. Daten-Filterung** (Zeilen 374–375):
```typescript
const regularDiscussions = QUICKSTARTS.filter((q) => q.category !== "verschwörungstheorien");
const conspiracyDiscussions = QUICKSTARTS.filter((q) => q.category === "verschwörungstheorien");
```
- Split der `QUICKSTARTS` in zwei Arrays
- Verhindert Duplikate: Jedes Quickstart erscheint nur einmal

**2. Helper-Function für Carousel** (Zeilen 378–435):
```typescript
const renderCarousel = (quickstarts: Quickstart[]) => (/* ... */)
```
- Extrahiert Carousel-Rendering in wiederverwendbare Function
- Vermeidet Code-Duplikation
- Nimmt Array von Quickstarts und rendert identisches Carousel wie vorher

**3. Render-Struktur**:
- **Header** (Zeilen 439–447): Wie bisher (Workflows / Diskussionen)
- **Reguläre Diskussionen** (Zeile 450): Carousel mit `regularDiscussions`
- **Verschwörungstheorien-Section** (Zeilen 453–468):
  - Conditional Rendering: Nur wenn `conspiracyDiscussions.length > 0`
  - Visuell abgetrennt: `border-t border-surface-2` + `pt-4` (Top-Border + Padding)
  - Überschrift "Verschwörungstheorien" + Badge "Kritisch prüfen" (roter Hintergrund)
  - Disclaimer: "Kritisch diskutieren, nicht bestätigen. Evidenzbasiert Behauptungen prüfen."
  - Carousel mit `conspiracyDiscussions`
- **Link-Actions** (Zeilen 470–479): Wie bisher (Modelle, Rollen, API-Key)

#### Vorteile dieser Struktur:

- **Klare Trennung**: Nutzer erkennen sofort, dass Verschwörungstheorien eine besondere Kategorie sind
- **Kein Leerraum**: Wenn `conspiracyDiscussions` leer wäre, wird die Section komplett ausgeblendet
- **Mobile-First**: Dieselben Carousel-Mechaniken, kein Layout-Chaos
- **Keine Breaking Changes**: Reguläre Diskussionen funktionieren weiterhin identisch

#### Interaktion (unverändert):

1. **Card-Klick**: `onClick={() => onStart(quickstart.system, quickstart.user)}` (Zeile 398)
2. **Prompt-Setting**: `onStart` → `startWithPreset` → `setCurrentSystemPrompt` (Chat.tsx:185–213)
3. **Kombinierter Prompt**: `safetyPrompt + discussionPrompt + activeRole?.systemPrompt` (Chat.tsx:121–125)

**Ergebnis**: Beim Klick auf eine Verschwörungstheorien-Card wird `CONSPIRACY_DISCUSSION_MODE` als System-Prompt gesetzt und die KI folgt dem 7-Schritte-Prozess.

---

## Finaler Systemprompt

Der vollständige Systemprompt für Verschwörungstheorien ist in `CONSPIRACY_DISCUSSION_MODE` definiert:

```typescript
const CONSPIRACY_DISCUSSION_MODE = `Du führst eine kritische, sokratische Diskussion zu einer Verschwörungstheorie. Ziel ist NICHT, den Nutzer zu belehren, sondern gemeinsam Behauptungen zu prüfen und evidenzbasiert zu denken.

WICHTIGE LEITPLANKEN:
- Trenne IMMER sichtbar: Behauptung ≠ Beleg
- Vermeide unnötige Wiederholung der falschen Behauptung (Illusory-Truth-Effekt)
- Keine Quellen erfinden, keine dramatische Ausschmückung
- Evidenz-Labeling Pflicht: "gut belegt" / "unklar" / "widerlegt" / "Spekulation"
- Sokratisch statt predigend: Fragen stellen, Logik testen, Selbst-Denken fördern
- Keine Both-Sides-Gleichwertigkeit: Wenn Evidenz klar ist, sag das klar (aber erkläre es)

ABLAUF JEDER RUNDE (strikt einhalten):

**A. Rephrase & Verständnischeck**
Paraphrasiere neutral, was der Nutzer meint. Kein Urteil. "Du meinst X, korrekt?"

**B. Steelman (kurz, max 4–5 Sätze)**
Formuliere die Theorie als Behauptung. Nutze Warn-Marker: "Folgende Behauptung kursiert..." oder "Die Theorie behauptet..."
NICHT ausschmücken oder Details erfinden.

**C. Warum überzeugt das Menschen?**
Erkläre psychologische/soziale Mechanismen (Muster-Erkennung, Kontrollbedürfnis, Misstrauen), OHNE die Theorie zu legitimieren.

**D. Typische Claims sammeln**
Liste 3–5 zentrale Behauptungen auf. Kennzeichne sie explizit als "Behauptungen", nicht als Fakten.

**E. Evidenz sortieren + Labels**
Pro Claim:
- Label vergeben: gut belegt / unklar / widerlegt / Spekulation
- Alternative Erklärung anbieten (Debunking braucht eine Alternative, sonst bleibt ein Vakuum)
- Kurz halten, nicht wiederholen

**F. Sokratischer Stresstest**
Stelle 2–3 Rückfragen:
- "Ist das falsifizierbar? Welche Beobachtung würde die Theorie widerlegen?"
- "Gibt es innere Widersprüche?"
- "Welche alternative Erklärung ist simpler/plausibler?"

**G. Gemeinsames Fazit**
Fasse die Evidenzlage zusammen (nicht als Urteil, sondern als Ergebnis).
Lade den Nutzer ein, weitere Fragen zu stellen oder Gegenargumente zu bringen.

TONFALL: Ruhig, neugierig, respektvoll. Keine Anklage, kein Predigen. Ziel ist gemeinsames Denken.

LÄNGE: Halte dich kurz (max. 6–8 Sätze pro Schritt). Nutzer lesen keine Romane.`;
```

---

## Annahmen & Offene Punkte

### Annahmen:

1. **Disclaimer-UI implementiert** ✅ (Update 2025-11-24): Der Plan erwähnt "oben in der Kategorie ein sehr kurzes Disclaimer-Snippet". Dies ist jetzt implementiert:
   - Separate Section mit Überschrift "Verschwörungstheorien" + Badge "Kritisch prüfen"
   - Disclaimer: "Kritisch diskutieren, nicht bestätigen. Evidenzbasiert Behauptungen prüfen."
   - Visuell abgetrennt durch Border-Top + Padding
   - Mobile-First: Kurz, prägnant, nicht überladen

2. **Keine separaten Follow-up-Buttons**: Der Plan schlägt vor: "Gegenargument", "Alternative Erklärung", etc. als Buttons. Ich habe das **nicht** implementiert, weil:
   - Der Systemprompt bereits alle diese Aspekte abdeckt (Stresstest, Alternativen, etc.)
   - Der Nutzer kann jederzeit eigene Follow-ups tippen
   - Zusätzliche Buttons würden die UI komplizieren
   - **Wenn gewünscht**: Kann als Enhancement nachträglich hinzugefügt werden (z.B. Quick-Reply-Buttons unter der KI-Antwort)

3. **Keine Toggle-Option "KI als Moderator" vs. "KI als Gegenposition"**: Der Plan schlägt einen optionalen Toggle vor. Ich habe das **nicht** implementiert, weil:
   - Der Systemprompt bereits den "Moderator"-Modus fest definiert (sokratisch, prüfend)
   - Ein Toggle würde die UX komplizieren
   - Der aktuelle Ansatz ist konsistent und sicher
   - **Wenn gewünscht**: Kann als erweiterte Einstellung in den Settings hinzugefügt werden

4. **MK-Ultra-Kontextualisierung**: MK-Ultra ist historisch belegt (CIA-Dokumente freigegeben). Daher:
   - Systemprompt bleibt gleich (kritisch prüfen)
   - User-Prompt formuliert: "...wie weit gingen die Experimente?" (lädt zu Faktencheck ein)
   - KI wird zwischen belegten Fakten (Experimente fanden statt) und Spekulationen (wie weit ging es wirklich?) trennen

5. **Simulation-Hypothese als einziges `speculative: true`**:
   - Simulation-Hypothese ist ein philosophisches Gedankenexperiment, keine wissenschaftlich testbare Theorie
   - Daher `speculative: true` + entsprechendes Badge in der UI

### Offene Punkte:

1. **Testing**: Es wurden keine automatisierten Tests hinzugefügt. Empfehlung:
   - Unit-Test: `QUICKSTARTS` enthält 10 Verschwörungstheorien-Objekte mit korrektem Schema
   - E2E-Test: Card-Klick → Systemprompt wird gesetzt → erste KI-Antwort folgt 7-Schritte-Struktur

2. **Content-Moderation**: Der bestehende `safetyPrompt` in Chat.tsx:56–62 bleibt aktiv. Falls der Nutzer dennoch versucht, gewaltverherrlichende oder hasserfüllte Inhalte zu erzwingen:
   - Der `discussionStrict`-Modus greift (Chat.tsx:76–78)
   - **Empfehlung**: Monitoring einrichten, um Missbrauchsversuche zu loggen (ohne User-Daten zu speichern)

3. **Accessibility**: Die neuen Cards sind vollständig keyboard-navigierbar (via `PremiumCard`-Komponente). Keine zusätzlichen a11y-Anpassungen nötig.

4. **Mobile UX**: Die horizontalen Scroll-Carousel-Mechanik (Zeilen 226–237) funktioniert bereits. Neue Cards fügen sich nahtlos ein.

---

## Testplan (manuell)

1. **Smoke Test**:
   - App starten
   - Zu Chat navigieren
   - Scroll durch die Diskussions-Cards
   - Verifiziere: 10 neue Cards mit rotem Badge "Verschwörungstheorien"

2. **Card-Klick Test**:
   - Klicke auf "Flache Erde"-Card
   - Erwartung: System-Prompt wird gesetzt, User-Nachricht erscheint: "Ist die Erde flach? Was spricht dafür, was dagegen?"
   - Erste KI-Antwort sollte mit Schritt A beginnen: "Du meinst..."

3. **Diskussionsfluss Test**:
   - Führe 2–3 Runden der Diskussion
   - Erwartung: KI folgt dem 7-Schritte-Prozess
   - KI nutzt Evidenz-Labels ("gut belegt", "widerlegt", etc.)
   - KI stellt sokratische Rückfragen

4. **Regression Test**:
   - Klicke auf eine nicht-Verschwörungstheorien-Card (z.B. "Gibt es Außerirdische?")
   - Erwartung: Normaler Diskussionsmodus, KEIN Verschwörungstheorien-Prompt

5. **Mobile Test**:
   - Teste auf Android-Gerät / schmaler Viewport
   - Scroll horizontal durch die Cards
   - Verifiziere: Kein Layout-Jank, Cards snap korrekt

---

## Zusammenfassung

**Implementiert**:
- ✅ Neue Kategorie "Verschwörungstheorien" mit rotem Badge
- ✅ 10 kuratierte Themen (Flache Erde, Reptiloiden, Mondlandung, Chemtrails, Bermuda-Dreieck, Ancient Aliens, Area 51, Denver Airport, MK-Ultra, Simulation)
- ✅ Spezieller Diskussionsmodus mit 7-Schritte-Prozess (A–G)
- ✅ Evidenz-Labeling im Systemprompt verankert
- ✅ Sokratische Rückfragen als fester Bestandteil
- ✅ **Separate Section unterhalb regulärer Diskussionen** (Update 2025-11-24)
  - Überschrift "Verschwörungstheorien" + Badge "Kritisch prüfen"
  - Disclaimer: "Kritisch diskutieren, nicht bestätigen. Evidenzbasiert Behauptungen prüfen."
  - Visuell abgetrennt durch Border-Top
  - Conditional Rendering (nur wenn Conspiracy-Diskussionen vorhanden)
- ✅ UI-Integration via bestehende Architektur (keine Breaking Changes)
- ✅ Mobile-first UX beibehalten (horizontal scrollbare Cards)

**Nicht implementiert** (bewusste Entscheidungen):
- ❌ Follow-up-Buttons (Systemprompt deckt alles ab, Nutzer kann frei tippen)
- ❌ Toggle "Moderator vs. Gegenposition" (würde UX komplizieren)

**Empfohlene nächste Schritte**:
1. Manuelles Testing (siehe Testplan oben)
2. User-Feedback sammeln (zu lang? zu kurz? zu technisch?)
3. Optional: Analytics hinzufügen (welche Verschwörungstheorien werden am meisten angeklickt?)
4. Optional: Automatisierte Tests schreiben

---

**Implementiert von**: Claude (Sonnet 4.5)
**Review benötigt**: Ja (insbesondere Tonfall des Systemprompts + Länge der KI-Antworten)
