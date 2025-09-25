# UI/UX Redesign Plan: Disa AI

Dieses Dokument beschreibt den Plan für die vollständige Überarbeitung der Benutzeroberfläche (UI) und der User Experience (UX) der mobilen Android-App "Disa AI". Es dient als exakte Vorlage für die Neuentwicklung des Frontends.

## 1. Design-Philosophie und Leitprinzipien

- **Klarheit vor Dichte:** Jede Ansicht und Komponente muss aufgeräumt und leicht verständlich sein. Unnötige visuelle Elemente werden entfernt, um den Fokus auf den Inhalt und die Interaktion zu lenken.
- **Mobile-First-Interaktion:** Alle Bedienelemente und Layouts sind für die einhändige Nutzung auf mobilen Geräten optimiert. Touch-Ziele sind großzügig bemessen, und Gesten werden intuitiv eingesetzt.
- **Konsistente visuelle Sprache:** Ein einheitliches Design-System (Farben, Typografie, Spacing) sorgt für ein harmonisches und wiedererkennbares Erscheinungsbild über die gesamte App hinweg.
- **Performanz als Feature:** Die UI muss schnell und reaktionsschnell sein. Animationen und Übergänge sind subtil und dürfen die wahrgenommene Geschwindigkeit nicht beeinträchtigen.

**Anmutung:** Das Design soll **professionell, vertrauenswürdig und modern** wirken. Eine dunkle, aufgeräumte Ästhetik mit dezenten Glassmorphism-Effekten unterstreicht den technologischen Charakter der App, ohne von der Kernfunktionalität abzulenken.

## 2. Globales Layout und Navigation

### App-Struktur

- **Bottom-Tab-Navigation:** Das Hauptlayout wird durch eine Bottom-Tab-Bar mit drei zentralen Bereichen strukturiert:
  1.  **Chat (Standard):** Der primäre Interaktionsbereich.
  2.  **Verlauf:** Eine neue Ansicht, die vergangene Chats auflistet und durchsuchbar macht.
  3.  **Einstellungen:** Gebündelter Zugriff auf alle Konfigurationsoptionen.
- **Safe Area Handling:** Das gesamte Layout berücksichtigt die `safe-area-insets` auf Android und iOS, um Überlappungen mit Systemelementen (Notch, Home-Bar) zu vermeiden.

### Header

- **Kontextsensitiver Header:** Der Header ist minimalistisch und passt sich der aktuellen Ansicht an.
  - **Chat-Ansicht:** Zeigt den Namen des aktuellen KI-Modells und bietet eine Aktion zum Starten eines neuen Chats (z.B. "+"-Icon).
  - **Andere Ansichten:** Zeigt den Titel der Ansicht (z.B. "Verlauf", "Einstellungen").
- **Dynamisches Verhalten:** Der Header kann bei Scroll-Gesten leicht minimiert werden, um mehr Platz für den Inhalt zu schaffen (subtile "hide on scroll" Animation).

### Navigation

- **Übergänge:**
  - **Tab-Wechsel:** Sanftes Cross-Fading zwischen den Hauptansichten.
  - **Detailansichten:** Detail- oder Einstellungsseiten sliden von rechts ins Bild (`slide-in-right`). Dies etabliert eine klare hierarchische Navigation.

## 3. Redesign der Kernkomponenten

### Chat-Ansicht (`ChatView.tsx`)

- **Nachrichtenliste:**
  - **Layout:** KI-Nachrichten sind linksbündig, Nutzer-Nachrichten rechtsbündig.
  - **Lesbarkeit:** Chatblasen haben eine `max-width` von `80%` oder `45ch`, um lange, unleserliche Zeilen zu verhindern (Behebung des Audit-Problems).
  - **Abstände:** Einheitlicher, vergrößerter Abstand zwischen den Nachrichtenblasen zur besseren Trennung.
  - **Ladezustand:** Während die KI tippt, wird ein animierter "Tipp-Indikator" (drei pulsierende Punkte) in einer linksbündigen Chatblase angezeigt.
- **Nachrichtenblase (`MessageBubble`):**
  - **Design:** Modernes, abgerundetes Rechteck. Der Glassmorphism-Effekt wird dezent eingesetzt (höherer Kontrast als bisher).
  - **Aktionen:** Bei einem langen Druck auf eine Nachricht erscheint ein kontextuelles Menü (Bottom-Sheet) mit Aktionen wie "Kopieren", "Teilen", "Bearbeiten" (nur für Nutzernachrichten) und "Erneut generieren" (nur für KI-Nachrichten).
  - **Codeblöcke (`CodeBlock.tsx`):** Erhalten ein eigenes, dunkleres Theme mit klarer Syntaxhervorhebung und einer "Kopieren"-Schaltfläche in der oberen rechten Ecke.
- **Composer (`Composer.tsx`):**
  - **Layout:** Das Eingabefeld ist einzeilig und wächst bei mehrzeiliger Eingabe vertikal (bis zu einer maximalen Höhe von 6 Zeilen).
  - **Senden-Button:**
    - **Inaktiv:** Ausgegraut, wenn das Eingabefeld leer ist.
    - **Aktiv:** Farblich hervorgehoben (Primärfarbe), sobald Text eingegeben wird.
    - **Streaming:** Während die KI antwortet, verwandelt sich der Senden-Button in einen "Stop"-Button, um die Generierung abzubrechen.

### Einstellungsansicht (`SettingsView.tsx`)

- **Struktur:** Die Einstellungen werden in logische, einklappbare Sektionen unterteilt, die mit einer `Accordion`-Komponente umgesetzt werden.
  - **Sektionen:**
    1.  **API-Konfiguration:** Eingabefeld für den API-Schlüssel. Der Schlüssel wird bei der Eingabe maskiert.
    2.  **Modell-Einstellungen:** Direkter Link zur neuen `ModelPickerView`.
    3.  **Persona & Stil:** Einstellungen für System-Prompt (Rolle) und Kreativität (Style).
    4.  **Erscheinungsbild:** Theme-Auswahl (Hell/Dunkel/System), Schriftgröße.
    5.  **App-Informationen:** Versionsnummer, Links zu Datenschutz und Quellcode.
- **UI-Elemente:** Alle Eingabefelder, Schalter und Buttons folgen dem neuen, einheitlichen Design-System.

### Modellauswahl-Ansicht (`ModelPickerView.tsx`)

- **Layout:** Eine bildschirmfüllende Ansicht, die über die Einstellungen erreicht wird.
- **Filterung:** Prominente Filter-Chips am oberen Rand zur schnellen Selektion: "Favoriten", "Kostenlos", "Code-optimiert".
- **Detail-Filter:** Ein ausklappbarer Bereich bietet erweiterte Filteroptionen:
  - **Anbieter:** Dropdown-Menü.
  - **Kontextlänge:** Slider oder vordefinierte Bereiche.
  - **Kosten:** Slider oder Kategorien (z.B. "frei", "günstig", "mittel", "teuer").
- **Modell-Liste:** Die Modelle werden als Karten dargestellt, die klar die wichtigsten Informationen anzeigen: Name, Anbieter, Kontextgröße und Preis. Ein Stern-Icon ermöglicht das Hinzufügen zu den Favoriten.

## 4. Design System & Tokens

- **Farbpalette:**
  - **Primär:** Ein kräftiger, moderner Blauton für interaktive Elemente (`#4A90E2`).
  - **Sekundär/Akzent:** Ein leuchtendes Violett für Hervorhebungen (`#7B42F6`).
  - **Neutrale Töne:** Eine Palette von Grautönen für Hintergründe, Text und Ränder (von `#121212` für den dunkelsten Hintergrund bis `#FFFFFF` für reinen Text).
  - **Semantische Farben:**
    - **Erfolg:** Grün (`#34C759`).
    - **Fehler:** Rot (`#FF3B30`).
    - **Warnung:** Gelb (`#FFCC00`).
  - **Kontrast:** Alle Farbkombinationen müssen ein WCAG-AA-konformes Kontrastverhältnis von mindestens 4.5:1 aufweisen.
- **Typografie:**
  - **Schriftart:** System-UI-Schriftart (Roboto auf Android).
  - **Skala:**
    - **Überschrift 1 (H1):** 24px, Bold
    - **Überschrift 2 (H2):** 20px, SemiBold
    - **Textkörper (Body):** 16px, Regular
    - **Beschriftung (Caption):** 14px, Regular
    - **Button-Text:** 16px, Medium
  - **Zeilenhöhe:** `1.5` für alle Textkörper zur Verbesserung der Lesbarkeit.
- **Spacing & Raster:**
  - **Basis-Einheit:** `8px`. Alle Abstände und Größen basieren auf Vielfachen dieser Einheit (8, 16, 24, 32px...).
- **Komponenten-Stile:**
  - **Buttons:** Abgerundete Ecken (`12px`), klare `default`, `hover`, `pressed`, `disabled` Zustände.
  - **Eingabefelder:** Einheitliche Höhe, dezenter Rand und eine farbliche Hervorhebung im Fokus-Zustand.
  - **Karten:** Leicht abgerundete Ecken (`16px`), dezenter `background-blur` für den Glassmorphism-Effekt, aber mit einem soliden, leicht transparenten Hintergrund zur Gewährleistung des Kontrasts.

## 5. Interaktion & Animation

- **Mikrointeraktionen:**
  - **Button-Klick:** Subtile Skalierungsanimation (`scale: 0.98`) und haptisches Feedback.
  - **Element-Einblendung:** Sanftes `fade-in` und `slide-up` für neu erscheinende Listenelemente.
- **Ladezustände:**
  - **Listen:** Skeleton-Screens, die die Form der zu ladenden Inhalte nachahmen.
  - **Aktionen:** Ein kleiner, zentrierter Spinner im Button oder über dem betroffenen Bereich.
- **Haptisches Feedback (Android):**
  - **Sinnvolle Einsatzorte:**
    - Klick auf wichtige Buttons (Senden, Neuer Chat).
    - Erfolgreiche Aktionen (z.B. Text kopiert).
    - Betätigung von Schaltern (Switches).
    - Langer Druck zur Aktivierung des Kontextmenüs.

## 6. Barrierefreiheit (Accessibility)

- **Fokus-Management:**
  - **Fokus-Ringe:** Alle interaktiven Elemente erhalten einen klar sichtbaren Fokus-Ring (`focus-visible`), der dem neuen Farbschema entspricht.
  - **Modale Dialoge:** Der Fokus wird beim Öffnen in den Dialog "gefangen" und beim Schließen an das auslösende Element zurückgegeben.
- **Kontrast:** Die neue Farbpalette wird durchgehend auf die Einhaltung der WCAG-AA-Richtlinien geprüft.
- **Screenreader-Unterstützung:**
  - **Semantisches HTML:** Konsequente Verwendung von `<nav>`, `<main>`, `<button>`, etc.
  - **ARIA-Attribute:** Einsatz von `aria-label`, `aria-describedby` und `role`, wo semantisches HTML nicht ausreicht (z.B. für benutzerdefinierte Komponenten wie den `ModelPicker`).
  - **Dynamische Inhalte:** `aria-live` wird verwendet, um Screenreader über dynamische Änderungen wie neue Chat-Nachrichten oder Ladezustände zu informieren.

## 7. Implementierung als Living Design System (Storybook)

Um die konsistente und effiziente Umsetzung dieses Plans zu gewährleisten, wird das Redesign als "Living Design System" mithilfe von **Storybook** realisiert.

- **Zweck:** Storybook dient als interaktive Werkstatt und Dokumentation für alle UI-Komponenten. Jede Komponente aus diesem Plan (z.B. `MessageBubble`, `Button`, `ModelCard`) wird als eigenständige "Story" entwickelt.
- **Vorteile:**
  - **Konsistenz:** Stellt sicher, dass alle Komponenten exakt nach den Spezifikationen des Design-Systems gebaut und verwendet werden.
  - **Isolierte Entwicklung:** Ermöglicht die Entwicklung und das Testen von Komponenten in einer kontrollierten Umgebung, unabhängig von der Anwendungslogik.
  - **Dokumentation:** Dient als zentrale Anlaufstelle für Entwickler, um verfügbare Komponenten und deren Verwendungsmöglichkeiten (Props) zu entdecken.
- **Prozess:** Die in diesem Dokument entworfenen Komponenten werden schrittweise in Storybook implementiert und bilden so die neue, wiederverwendbare Komponentenbibliothek der App.
