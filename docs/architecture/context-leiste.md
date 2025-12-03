# Design-Dokument: Kontextleiste (Chat Context Bar)

## 1. Überblick & Ziel

Die **Kontextleiste** ist ein neues UI-Element auf der Chat-Seite, das alle relevanten Konfigurationen für die aktuelle Unterhaltung zentralisiert. Sie befindet sich **direkt über dem Eingabefeld (Composer)** im unteren Bildschirmdrittel (Thumb Zone).

**Ziel:** Der Nutzer soll Rolle, Schreibstil, Gedächtnis-Funktionen und das KI-Modell ändern können, ohne die Chat-Ansicht zu verlassen. Die Interaktion erfolgt über kompakte **Dropdown-Menüs**, die den Kontext wahren und schnelle Wechsel ermöglichen.

## 2. Positionierung & Layout

Die Leiste wird als horizontaler Container direkt **oberhalb** der `ChatComposer`-Komponente (dem Eingabefeld) platziert. Sie ist Teil des `sticky bottom-0` Containers, scrollt also nicht mit den Nachrichten weg.

### Visueller Aufbau (Mockup-Schema)

```text
[ Rolle: Berufsberater ▾ ]   [ 🧠 ] [ 🖋️ ] [ ⚙️ ]   [ GPT-4o ▾ ]
──────────────────────────────────────────────────────────────
[ Eingabefeld ..................................... [ Senden ] ]
```

*   **Links:** Aktive Rolle / Persona (Pill-Shape).
*   **Mitte:** Schnellzugriff-Icons (Memory, Stil, Quick-Settings).
*   **Rechts:** Aktives Modell (Pill-Shape).
*   **Darunter:** Das bestehende Eingabefeld.

## 3. UI-Elemente & Interaktionen

Alle Interaktionen öffnen **Dropdown-Menüs (Popovers)**, die direkt am jeweiligen Auslöser verankert sind. Dies wirkt wie eine aufklappbare Papier-Notiz.

### A. Linker Bereich: Rolle / Persona
*   **Darstellung:** Pill-Button mit Icon (optional Avatar) und Name der Rolle.
    *   *Default:* "Standard" oder "Assistent".
    *   *Status:* Dezent hervorgehoben, wenn eine spezielle Rolle aktiv ist.
*   **Interaktion:** Klick/Tap öffnet **Dropdown-Menü**.
    *   Liste der zuletzt genutzten Rollen.
    *   Option "Alle Rollen anzeigen" (navigiert zur Bibliothek).
*   **Jugendschutz:** Rollen, die durch den Jugendschutz-Filter fallen, werden hier nicht angeboten.

### B. Mittlerer Bereich: Quick Toggles
Hier befinden sich Icons (ca. 24x24px Touch-Target mind. 44px) für schnelle Einstellungen.

1.  **Gedächtnis (Memory) [ 🧠 ]**
    *   **Status:** Ausgefüllt/Farbig = Aktiv für diesen Chat. Outline/Grau = Inaktiv.
    *   **Interaktion:** Toggle (Direktklick) oder Rechtsklick/Long-Press für Dropdown mit "Gedächtnis leeren".
2.  **Stil (Style) [ 🖋️ ]**
    *   **Darstellung:** Feder- oder Paletten-Icon.
    *   **Interaktion:** Öffnet **Dropdown-Menü**.
    *   **Optionen:** "Kreativ", "Ausgewogen", "Präzise", "Kurz", "Ausführlich".
3.  **Quick Settings [ ⚙️ ]**
    *   **Interaktion:** Öffnet ein **Dropdown-Menü** mit weiteren Optionen (z.B. Schriftgröße, Streaming-Optionen).

### C. Rechter Bereich: Modell
*   **Darstellung:** Pill-Button mit Modell-Name (z.B. "Flash 2.0").
*   **Interaktion:** Öffnet **Dropdown-Menü**.
    *   Liste der verfügbaren Modelle.
    *   Kompakte Darstellung (Name + ggf. Provider-Icon).
*   **Jugendschutz:** Modelle ohne ausreichende Content-Filter sind ausgegraut oder ausgeblendet.

## 4. Design-Stil (Ink on Paper)

Das Design folgt strikt dem "Tinte auf Papier"-Konzept des Projekts:

*   **Keine** Glassmorphism-Effekte.
*   **Dropdowns:** Wirken wie ein Stück Papier, das auf das bestehende Blatt gelegt wird (`bg-surface-floating`, leichter `shadow-floating`).
*   **Hintergrund der Leiste:** `bg-surface-2` oder `bg-bg-page`.
*   **Rahmen:** Feiner 1px Border (`border-ink-border`).
*   **Typografie:** Serifenlose, klare Schrift.
*   **Formen:** Pill-Buttons (`rounded-full` oder `rounded-lg`) signalisieren Klickbarkeit.

## 5. Technische Integration

### Datei-Struktur Vorschlag
*   `src/components/chat/ContextBar/index.tsx`: Hauptkomponente.
*   `src/components/chat/ContextBar/RoleDropdown.tsx`: Dropdown für Rollen.
*   `src/components/chat/ContextBar/ModelDropdown.tsx`: Dropdown für Modelle.
*   `src/components/chat/ContextBar/StyleDropdown.tsx`: Dropdown für Stile.

### Verwendete Komponenten
Nutzung von **Radix UI Primitives** (z.B. `@radix-ui/react-dropdown-menu`) für zugängliche, robuste Menüs, gestylt mit Tailwind CSS passend zum Ink-Theme.

### Einbindung in `Chat.tsx`
Die `ContextBar` wird innerhalb des `sticky bottom-0`-Containers in `src/pages/Chat.tsx` gerendert, *vor* dem `ChatComposer`.

```tsx
// Pseudocode in Chat.tsx
<div className="sticky bottom-0 ...">
  <ContextBar 
    activeRole={activeRole}
    activeModel={settings.preferredModelId}
    memoryEnabled={memoryEnabled}
    onRoleChange={...}
    onModelChange={...}
    onStyleChange={...}
  />
  <ChatComposer ... />
</div>
```
