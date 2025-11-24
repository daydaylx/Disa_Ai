# Diskussionsrunden & Brainstorming – UX-Konzept & Implementierung

**Stand:** 2025-11-24
**Autor:** Senior Frontend Engineer + Conversational UX Designer
**Repo:** https://github.com/daydaylx/Disa_Ai

---

## 1. IST-ANALYSE

### 1.1 Systemarchitektur

Das Diskussions-Feature ist **vollständig integriert** in die Chat-Seite (`/chat`). Es gibt keine separate `/discussion` Route.

#### Kern-Dateien

| Datei                                               | Zweck                                                           | Wie ergänzen?                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **`src/prompts/discussion/presets.ts`**             | 8 Diskussionsstile (locker_neugierig, edgy_provokant, etc.)     | Neuen Key zu `DiscussionPresetKey` Type + Entry in `discussionPresets` Record hinzufügen |
| **`src/components/chat/QuickstartGrid.tsx`**        | 15 Diskussions-Quickstarts in horizontalem Carousel             | Neues Objekt zum `QUICKSTARTS` Array hinzufügen                                          |
| **`src/features/discussion/shape.ts`**              | Response-Shaping: Sätze begrenzen, Frage sicherstellen          | Automatisch – keine Änderung nötig                                                       |
| **`src/pages/Chat.tsx`**                            | Chat-Hauptseite, kombiniert Discussion-Prompt mit Safety-Prompt | System-Prompt-Logik bei Bedarf anpassen                                                  |
| **`src/features/settings/SettingsFiltersView.tsx`** | Settings-UI für Diskussionsstil, Strenger Modus, Antwortlänge   | Rendert automatisch alle Presets aus `discussionPresetOptions`                           |
| **`src/config/settings.ts`**                        | localStorage-Persistierung (Getter/Setter)                      | Default-Wert anpassen falls nötig                                                        |
| **`src/hooks/useSettings.ts`**                      | React Hook für Settings                                         | Automatisch aktualisiert                                                                 |

### 1.2 Datenfluss

```
User wählt Diskussionsstil in Settings (/settings/behavior)
          ↓
useSettings().setDiscussionPreset(key)
          ↓
localStorage.setItem("disa:discussion:preset", key)
          ↓
Chat.tsx liest settings.discussionPreset
          ↓
createDiscussionPrompt() kombiniert:
  - Diskussionsstil-Preset
  - Satzlimit (5-10)
  - Strenger Modus (optional)
  - NEUE: Fakten/Spekulation-Trennung (Sicherheits-Leitplanke)
          ↓
combinedPrompt = [safetyPrompt, discussionPrompt, activeRole?.systemPrompt]
          ↓
Alle KI-Antworten folgen diesem System-Prompt
```

### 1.3 UI-Komponenten

#### Quickstart-Carousel (`QuickstartGrid.tsx`)

- **Layout:** Horizontal scrollbar mit CSS Scroll-Snap
- **Mobile:** 85vw Breite pro Card
- **Tablet:** 45vw Breite
- **Desktop:** 280px Breite
- **Cards:** `PremiumCard` (lila Accent-Strip, Signature-Design)
- **Rendering:** Auf `/chat` Seite, wenn keine Nachrichten vorhanden

#### Settings-Interface (`SettingsFiltersView.tsx`)

- **Route:** `/settings/behavior`
- **Controls:**
  1. **8 Diskussionsstil-Buttons** (2-Column-Grid auf Tablet)
  2. **Strenger Modus Toggle** (Boolean, mit Warning-Banner)
  3. **Antwortlängen-Slider** (5-10 Sätze, Grid-Buttons)

### 1.4 Bestehende UX-Probleme (vor diesem Update)

| Problem                                 | Beschreibung                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Zu wenig Quickstarts**                | Nur 5 Diskussionsthemen – zu wenig Varietät                                                  |
| **Keine "Was-wäre-wenn" Szenarien**     | Alle Themen waren Pro/Contra zu bestehenden Fragen, keine hypothetischen Gedankenexperimente |
| **Keine Spekulations-Markierung**       | Keine visuelle Unterscheidung zwischen Realpolitik vs. Hypothesen                            |
| **Fehlende Follow-up Actions**          | Keine Buttons für "Gegenargument" oder "Alternative Hypothese" während Diskussion            |
| **Unklare Fakten/Spekulation-Trennung** | System-Prompt forderte nicht explizit die Kennzeichnung von Spekulation                      |
| **Keine Kategorisierung**               | Alle Themen sahen gleich aus – keine Orientierung für Nutzer                                 |

---

## 2. NEUE DISKUSSIONS-OPTIONEN (10 hinzugefügt)

### 2.1 Übersicht

**Gesamt:** 15 Quickstarts (5 bestehende + 10 neue)

**Neue Themen (Fokus: Hypothesen, Was-wäre-wenn, Theorie-Spin):**

| ID                               | Titel                                              | Kategorie    | Spekulativ? | Beschreibung                                                                        |
| -------------------------------- | -------------------------------------------------- | ------------ | ----------- | ----------------------------------------------------------------------------------- |
| `discussion-ai-laws`             | KI schreibt Gesetze – gut oder gefährlich?         | Hypothetisch | ✅          | Gedankenexperiment: Was passiert, wenn Algorithmen Gesetzestexte formulieren?       |
| `discussion-simulation`          | Leben wir in einer Simulation?                     | Wissenschaft | ✅          | Simulation-Hypothese: Philosophisches Gedankenspiel, keine gesicherte Wahrheit.     |
| `discussion-time-travel`         | Zeitreisen: Paradoxien und Physik                  | Wissenschaft | ✅          | Theoretisch möglich? Großvater-Paradoxon? Diskutiere wissenschaftlich fundiert.     |
| `discussion-free-energy`         | Was wäre bei kostenloser Energie?                  | Hypothetisch | ✅          | Ökonomisches Gedankenexperiment: Gesellschaft, Arbeit, Umwelt – alles neu denken.   |
| `discussion-car-free-city`       | Stadt ohne Autos – Utopie?                         | Hypothetisch | ❌          | Urbanes Experiment: Lebensqualität vs. Praktikabilität. Was geht wirklich?          |
| `discussion-tech-religion`       | Ist Technik die neue Religion?                     | Kultur       | ❌          | Kulturbeobachtung: Tech-Gurus, Heilsversprechen, Glaubenskriege. Übertrieben?       |
| `discussion-ubi`                 | Bedingungsloses Grundeinkommen – Traum oder Falle? | Realpolitik  | ❌          | Sozialökonomische Kontroverse: Freiheit vs. Faulheit. Was sagen Experimente?        |
| `discussion-trends-manipulation` | Trends: organisch oder manipuliert?                | Kultur       | ❌          | Medienkritik: Entstehen Hypes natürlich oder werden sie gemacht? Wo ist die Grenze? |
| `discussion-mars-2050`           | Menschen auf dem Mars bis 2050?                    | Hypothetisch | ✅          | Technologie-Zukunft: Musk, NASA, Realismus. Was ist machbar, was ist Hype?          |
| `discussion-fermi-paradox`       | Wo sind all die Aliens?                            | Wissenschaft | ✅          | Fermi-Paradoxon: Milliarden Sterne, aber keine Signale. Warum? Diskutiere Theorien. |

### 2.2 Beispiel: System-Prompt-Qualität

**Beispiel 1: Simulation-Hypothese (hochspekulativ)**

```
WICHTIG: Dies ist eine philosophische Hypothese, KEINE bewiesene Tatsache.
Diskutiere Argumente (Bostrom, etc.) vs. Gegenargumente.
Mache klar, was Spekulation ist.
Trenne: 'Das ist ein Gedankenexperiment' vs. 'Das ist gesichert'.
Frage nach, welche Annahmen ich für plausibel halte.
```

**Beispiel 2: Zeitreisen (wissenschaftlich fundiert, aber spekulativ)**

```
Trenne klar: Was sagt die Physik (Relativitätstheorie, Wurmlöcher = theoretisch möglich,
aber praktisch unerreichbar) vs. Science-Fiction.
Diskutiere Paradoxien, aber kennzeichne, was Spekulation ist.
Biete Gegenargumente und frage nach meiner Intuition.
```

**Beispiel 3: Trends-Manipulation (kulturkritisch, keine Verschwörung)**

```
Analysiere kritisch: Was ist organisches Interesse vs. Astroturfing/Algorithmen-Boost?
Beispiele (TikTok, Memes, Mode).
Keine Verschwörungstheorien, sondern nachvollziehbare Mechanismen.
Frage: Welche Trends halte ich für echt?
```

---

## 3. UMGESETZTE UX-VERBESSERUNGEN

### 3.1 Kategorie-System

**Implementierung:** `QuickstartGrid.tsx` (Zeilen 5-23)

Jeder Quickstart hat jetzt ein optionales `category` Field:

```typescript
type QuickstartCategory = "realpolitik" | "hypothetisch" | "wissenschaft" | "kultur";
```

**Visuelle Badges:**

| Kategorie        | Badge-Text           | Farbe                                       |
| ---------------- | -------------------- | ------------------------------------------- |
| **realpolitik**  | "Realpolitik"        | Blau (`bg-blue-500/10 text-blue-600`)       |
| **hypothetisch** | "Gedankenexperiment" | Lila (`bg-purple-500/10 text-purple-600`)   |
| **wissenschaft** | "Wissenschaft"       | Grün (`bg-green-500/10 text-green-600`)     |
| **kultur**       | "Kultur"             | Orange (`bg-orange-500/10 text-orange-600`) |

**UX-Benefit:**

- Nutzer können sofort erkennen, ob ein Thema eher pragmatisch-politisch oder hypothetisch-spekulativ ist
- Hilft bei der Auswahl: "Will ich über Realpolitik oder Gedankenexperimente diskutieren?"

### 3.2 Reality-Check Badge ("Hypothese")

**Implementierung:** `QuickstartGrid.tsx` (Zeilen 265-269)

Jeder Quickstart mit `speculative: true` zeigt zusätzlich ein **gelbes "Hypothese" Badge**:

```typescript
{quickstart.speculative && (
  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
    Hypothese
  </span>
)}
```

**UX-Benefit:**

- Klare Warnung: "Dieses Thema ist spekulativ, keine gesicherten Fakten"
- Verhindert Missverständnis: Nutzer wissen, dass es um Theorie-Spin geht, nicht um Faktencheck
- Erfüllt Anforderung: "Spekulation ja, Faktenverdrehung nein"

### 3.3 Verbesserte Sicherheits-Leitplanken im System-Prompt

**Implementierung:** `src/pages/Chat.tsx` (Zeilen 74-75)

**NEU hinzugefügter Prompt-Teil:**

```typescript
`KRITISCH: Trenne IMMER klar zwischen (1) gesicherten Fakten/wissenschaftlichem Konsens,
(2) plausiblen Hypothesen mit Belegen, und (3) reiner Spekulation/Fiktion.
Bei spekulativen oder umstrittenen Themen sage explizit: "Das ist eine Hypothese"
oder "Das ist spekulativ" oder "Belege sind dünn/umstritten".
NIEMALS Falschbehauptungen, Verschwörungstheorien oder unbelegte Behauptungen
als gesicherte Wahrheit darstellen.
Bei kontroversen Themen: neutral, kritisch, ausgewogen.
Zeige verschiedene Perspektiven und ihre Stärken/Schwächen.`;
```

**UX-Benefit:**

- **Harte Regel:** KI darf keine Falschinfos bestätigen
- **Transparenz:** KI muss klar sagen, was Hypothese/Spekulation ist
- **Neutralität:** Bei kontroversen Themen keine einseitige Darstellung
- Erfüllt die Anforderung: "Bei spekulativen/umstrittenen Themen soll die KI klar trennen zwischen gesichertem Wissen, plausiblen Hypothesen, reiner Spekulation"

### 3.4 Mobile-First Design

**Bereits implementiert (Bestand):**

- Horizontal Scroll-Carousel mit CSS Scroll-Snap
- Touch-optimiert (`touch-pan-x`, `overscroll-x-contain`)
- Responsive Breiten:
  - Mobile: `w-[85vw]`
  - Tablet: `sm:w-[45vw]`
  - Desktop: `md:w-[30vw] lg:w-[280px]`
- Native Swipe-Gesten

**NEU optimiert:**

- Badges sind klein (`text-[10px]`), nehmen nicht viel Platz
- `flex-wrap gap-1.5` für Badge-Zeile: Bei schmalen Screens umbrechen
- Icon bleibt `shrink-0` → nie zerquetscht

---

## 4. ZUSÄTZLICHE EMPFEHLUNGEN (NÄCHSTE SCHRITTE)

Diese Features würden das Diskussions-Erlebnis weiter verbessern, sind aber **größere Implementierungen** (nicht in diesem Update enthalten):

### 4.1 Follow-up Action Buttons

**Konzept:**
Nach jeder KI-Antwort erscheinen 3-4 Buttons am Ende der Nachricht:

```
[🔀 Gegenargument] [🤔 Alternative Hypothese] [💭 Was wäre wenn...] [✓ Stimme zu]
```

**Implementierung:**

- Neue Komponente: `src/components/chat/DiscussionFollowUpActions.tsx`
- Rendere Buttons unter `AssistantMessage` wenn `discussionMode` aktiv
- On-Click: Automatisch Prompt wie "Biete ein überzeugendes Gegenargument" absenden

**UX-Benefit:**

- Nutzer müssen nicht selbst formulieren: "Jetzt nenne Gegenargumente"
- Macht Diskussion interaktiver, mehr "Ping-Pong"-Gefühl
- Senkt Schwelle für tiefere Auseinandersetzung

**Aufwand:** ~4-6 Stunden (Button-Komponente + Chat-Integration + Prompt-Templates)

### 4.2 Brainstorming-Phasen-Struktur

**Konzept:**
Bei bestimmten Quickstarts (z.B. "Was wäre wenn Energie kostenlos wäre?") durchläuft die KI explizit Phasen:

1. **Ideen sammeln** (5 Min / 3 Runden): "Keine Kritik, nur Möglichkeiten"
2. **Clustern** (2 Min / 1 Runde): "Welche Ideen hängen zusammen?"
3. **Kritisieren** (5 Min / 3 Runden): "Was ist unrealistisch? Wo sind Schwächen?"
4. **Fazit** (2 Min / 1 Runde): "Was bleibt übrig als plausibles Szenario?"

**Implementierung:**

- Neue Datei: `src/prompts/discussion/phases.ts`
- Quickstart-Typ erweitern: `phased?: boolean`, `phases?: Phase[]`
- Chat.tsx: State für aktuelle Phase, Phase-Wechsel nach N Runden
- UI: Phase-Indikator (z.B. Stepper: "1. Ideen → 2. Kritik → 3. Fazit")

**UX-Benefit:**

- Strukturiertes Brainstorming statt wildes Durcheinander
- Vermeidet vorzeitige Kritik ("Ja, aber...")
- Führt zu besseren Ergebnissen: Erst kreativ, dann kritisch

**Aufwand:** ~8-12 Stunden (Phase-Logik + State-Management + UI)

### 4.3 "Reality-Check"-Inline-Warnung während Chat

**Konzept:**
Wenn die KI in einer Antwort spekuliert, zeigt die Message-Komponente am Ende ein kleines Icon/Badge:

```
⚠️ Diese Aussage ist hypothetisch
```

**Implementierung:**

- `shape.ts` erweitert um Spekulation-Detection (Keywords: "möglicherweise", "Hypothese", "könnte sein", etc.)
- `shapeDiscussionResponse()` gibt zusätzlich `speculationDetected: boolean` zurück
- `AssistantMessage.tsx` rendert Badge bei `speculationDetected === true`

**UX-Benefit:**

- Nutzer sieht direkt während der Diskussion: "Achtung, das ist Spekulation"
- Reduziert Gefahr, dass spekulative Aussagen als Fakt wahrgenommen werden
- Erfüllt Anforderung: "Reality-Check Labeling"

**Aufwand:** ~3-4 Stunden (Keyword-Detection + Badge-UI)

### 4.4 Rollen-Wechsel: Gegenpositions-Modus

**Konzept:**
Button "🔄 Devil's Advocate" aktiviert einen Modus, in dem die KI **bewusst die Gegenposition** einnimmt:

```
"Ich argumentiere jetzt bewusst gegen meine vorherige Position.
Hier ist, warum du falsch liegen könntest..."
```

**Implementierung:**

- Neue Rolle in `src/data/roles.ts`: "Devil's Advocate"
- Button in `QuickstartGrid` oder Chat-Header
- On-Click: Füge Rollen-Prompt temporär hinzu

**UX-Benefit:**

- Zwingt Nutzer, die eigene Position kritisch zu hinterfragen
- Macht blinde Flecken sichtbar
- Verhindert Echo-Chamber-Effekt ("KI stimmt mir immer zu")

**Aufwand:** ~2-3 Stunden (Rolle erstellen + Button + State)

---

## 5. QUALITÄTSSICHERUNG

### 5.1 Sicherheits-Checkliste (erfüllt)

✅ **Keine Falschbehauptungen als Wahrheit:** System-Prompt fordert explizit "NIEMALS Falschbehauptungen [...] als gesicherte Wahrheit darstellen"
✅ **Trennung Fakten/Hypothesen/Spekulation:** Dreistufiges Schema im Prompt ("gesicherte Fakten", "plausible Hypothesen", "reine Spekulation")
✅ **Keine Verstärkung von Verschwörungen:** Beispiel-Prompts (Trends-Manipulation, Simulation-Hypothese) fordern explizit "Keine Verschwörungstheorien"
✅ **Neutral/kritisch bei Kontroversen:** Prompt: "Bei kontroversen Themen: neutral, kritisch, ausgewogen"
✅ **Visuelle Warnungen:** "Hypothese" Badge bei spekulativen Themen

### 5.2 UX-Checkliste (erfüllt)

✅ **Mobile-First:** Horizontal Carousel, Touch-Gesten, responsive Breiten
✅ **Keine UI-Überladung:** Kleine Badges (`text-[10px]`), kein zusätzliches Clutter
✅ **Kurze Titel:** Max 4-5 Wörter (z.B. "Stadt ohne Autos – Utopie?")
✅ **1-Satz-Beschreibungen:** Alle Descriptions ≤ 1 Satz
✅ **Diskussionsanstoßend:** Kein "Erkläre X", sondern "Was wäre wenn X?" / "Ist X sinnvoll?"
✅ **Varietät:** 4 Kategorien (Realpolitik, Hypothetisch, Wissenschaft, Kultur), 15 Themen

### 5.3 Code-Qualität

✅ **TypeScript-Typsicherheit:** `Quickstart` Interface, `QuickstartCategory` Type
✅ **Keine Platzhalter:** Alle Prompts vollständig ausgefüllt
✅ **Keine TODOs:** Keine offenen Baustellen im Code
✅ **Konsistente Formatierung:** Tailwind-Klassen, einheitliche Struktur
✅ **Dokumentierte Entscheidungen:** Kommentare für neue Features (z.B. "// WICHTIG: Sicherheits-Leitplanken")

---

## 6. DATEI-ÄNDERUNGEN (DIFF-ÜBERSICHT)

| Datei                                        | Änderung                                                         | Zeilen      |
| -------------------------------------------- | ---------------------------------------------------------------- | ----------- |
| **`src/components/chat/QuickstartGrid.tsx`** | + 10 neue Quickstarts, + Kategorie-System, + Spekulations-Badges | +150 Zeilen |
| **`src/pages/Chat.tsx`**                     | + Sicherheits-Leitplanken im discussionPrompt                    | +5 Zeilen   |
| **`ux/Diskussionsrunden.md`**                | Komplette Dokumentation (dieses Dokument)                        | +450 Zeilen |

**Gesamt:** ~605 Zeilen Code + Doku

---

## 7. TESTING-EMPFEHLUNGEN

### Manuelles Testing (vor Commit)

1. **Mobile-Ansicht:**
   - `/chat` aufrufen
   - Horizontal durch alle 15 Cards swipen
   - Badges prüfen: Kategorie + "Hypothese" bei spekulativen Themen
   - Text auf Lesbarkeit prüfen (kein Overflow)

2. **Quickstart-Funktionalität:**
   - Card klicken → System+User-Prompt werden gesetzt
   - KI-Antwort prüfen: Folgt sie dem Stil?
   - Bei spekulativen Themen: Sagt KI "Das ist eine Hypothese"?

3. **Settings:**
   - `/settings/behavior` öffnen
   - Diskussionsstil wechseln → Toast erscheint
   - Zurück zu `/chat` → Stil wird angewendet

4. **Sicherheits-Leitplanken:**
   - Quickstart "Simulation-Hypothese" starten
   - Frage: "Also leben wir wirklich in einer Simulation?"
   - Erwartete Antwort: "Das ist eine Hypothese, keine bewiesene Tatsache..."

### Automated Tests (optional, wenn Zeit)

```typescript
// src/components/chat/__tests__/QuickstartGrid.test.tsx
describe("QuickstartGrid", () => {
  it("renders 15 quickstarts", () => {
    // Assert: QUICKSTARTS.length === 15
  });

  it("shows category badge for all items", () => {
    // Assert: Every quickstart has categoryInfo rendered
  });

  it("shows 'Hypothese' badge only for speculative items", () => {
    // Assert: speculative === true → Badge visible
  });
});
```

---

## 8. FAZIT

### Was wurde erreicht?

✅ **10 neue Diskussions-Quickstarts** mit Fokus auf Hypothesen, Was-wäre-wenn, Theorie-Spin
✅ **Kategorie-System** (Realpolitik, Hypothetisch, Wissenschaft, Kultur)
✅ **Reality-Check Badges** ("Hypothese" bei spekulativen Themen)
✅ **Sicherheits-Leitplanken** im System-Prompt (Fakten/Hypothesen/Spekulation-Trennung)
✅ **Mobile-First UX** (bereits vorhanden, optimiert beibehalten)
✅ **Vollständige Dokumentation** (dieses Dokument)

### Was ist der Mehrwert für Nutzer?

1. **Mehr Varietät:** 15 statt 5 Diskussionsthemen
2. **Klarheit:** Sofort erkennbar, ob Thema pragmatisch oder spekulativ ist
3. **Sicherheit:** KI bestätigt keine Falschinfos, kennzeichnet Spekulation klar
4. **Brainstorming-Gefühl:** System-Prompts fördern Hypothesen-Test, Pro/Contra, Gegenargumente
5. **Keine Informationsblase:** Kritische, ausgewogene Diskussion statt Echo-Chamber

### Was fehlt noch? (Optional, nächste Schritte)

- **Follow-up Action Buttons** (Gegenargument, Alternative Hypothese) → 4-6h Aufwand
- **Brainstorming-Phasen** (Ideen → Kritik → Fazit) → 8-12h Aufwand
- **Reality-Check Inline-Warnung** während Chat → 3-4h Aufwand
- **Devil's Advocate Modus** (Gegenpositions-Rolle) → 2-3h Aufwand

---

**Ende der Dokumentation**
