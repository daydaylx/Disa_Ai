# Guide: Customizing the Chat Hero Core (The Orb)

Das `ChatHeroCore`-Element (auch "The Orb" genannt) ist das zentrale visuelle Element auf der leeren Chat-Seite. Es visualisiert den Status der KI (`idle`, `thinking`, `streaming`, `error`) durch ein animiertes, mehrschichtiges Auge.

## 1. Architektur & Datei-Struktur

Die Komponente befindet sich in:
`src/components/chat/ChatHeroCore.tsx`

Sie ist strikt getrennt in **Logik** (Zustandsverwaltung) und **Konfiguration** (Visuelles Styling).

### Zustände (`CoreStatus`)
Der Orb reagiert auf vier definierte Zustände:

| Status | Bedeutung | Visuelles Verhalten |
|--------|-----------|---------------------|
| `idle` | Wartet auf Eingabe | Langsame Rotation, sanftes "Atmen", Pupille ruhig. |
| `thinking` | Request gesendet, wartet auf Server | Mittlere Rotation, Fokus-Pupille, leicht erhöhter Glow. |
| `streaming` | Empfängt Antwort-Tokens | "Wellen"-Effekt nach außen, schnellere Modulation. |
| `error` | Fehler aufgetreten | Roter Glow, "Shake"-Animation, Iris stoppt. |

## 2. Visuelle Konfiguration (`ORB_VISUAL_CONFIG`)

Das Aussehen für jeden Status wird zentral im `ORB_VISUAL_CONFIG`-Objekt in `ChatHeroCore.tsx` gesteuert. Du musst nicht das JSX ändern, um Farben oder Geschwindigkeiten anzupassen.

Beispiel-Konfiguration:

```typescript
const ORB_VISUAL_CONFIG: Record<CoreStatus, OrbVisualConfig> = {
  idle: {
    irisRotationClass: "animate-orb-rotate-slow",       // Geschwindigkeit der Iris
    glowColorClass: "bg-brand-primary/20",              // Farbe des äußeren Glows
    pupilAnimationClass: "animate-orb-pupil-idle",      // Verhalten der Pupille
    waveEnabled: false,                                 // Wellen-Effekt an/aus
    irisColorClass: "from-brand-primary to-brand-secondary", // Farbverlauf der Iris
  },
  // ... andere Zustände
};
```

### Anpassungsmöglichkeiten

#### Farben ändern
Ändere einfach die Tailwind-Klassen in `irisColorClass` oder `glowColorClass`.
*   **Iris:** Nutzt `conic-gradient` via Tailwind (`from-...`, `via-...`, `to-...`).
*   **Glow:** Nutzt Background-Colors mit Opacity (z.B. `bg-brand-primary/20`).

#### Geschwindigkeit ändern
Die Animationsgeschwindigkeiten sind in `irisRotationClass` definiert. Diese Klassen mappen auf Konfigurationen in der `tailwind.config.ts`.

Verfügbare Rotations-Klassen:
*   `animate-orb-rotate-slow` (40s)
*   `animate-orb-rotate-medium` (15s)
*   `animate-orb-rotate-fast` (3s)

## 3. Aufbau der Layer (JSX)

Der Orb besteht aus 5 visuellen Schichten (von hinten nach vorne), die im JSX übereinander gestapelt sind:

1.  **Outer Glow Ring**: Ein `div` hinter dem Auge für den atmosphärischen Schein.
2.  **Streaming Wave**: Ein optionaler Ring (`waveEnabled`), der bei Aktivität nach außen pulsiert.
3.  **Sclera (Augapfel)**: Der dunkle Hauptkörper (`bg-surface-inset`), maskiert den Inhalt (`overflow-hidden`).
4.  **Iris**: Ein rotierender Container mit `conic-gradient` und Overlay-Textur.
5.  **Pupil**: Der schwarze Kern, der unabhängig animiert wird (Pulsieren).
6.  **Glare/Highlights**: Statische Lichtreflexe oben drüber (reines CSS/Tailwind), um den "Glas/Feucht"-Look zu erzeugen.

## 4. Animationen anpassen (`tailwind.config.ts`)

Wenn du das Timing ("Atmen", "Pulsieren") ändern willst, bearbeite die `extend.animation` und `extend.keyframes` Sektion in `tailwind.config.ts`.

Wichtige Keyframes:
*   `orbScale`: Das Atmen des gesamten Auges.
*   `orbPupilPulse`: Das Fokus-Verhalten der Pupille (Größenänderung).
*   `orbWave`: Die Schockwelle im `streaming`-Modus.

## 5. Neuen Status hinzufügen

Möchtest du einen Status wie `busy` oder `listening` ergänzen:

1.  **TypeScript**: Erweitere den Type `CoreStatus` in `ChatHeroCore.tsx`:
    ```typescript
    export type CoreStatus = "idle" | "thinking" | "streaming" | "error" | "listening";
    ```
2.  **Config**: Füge einen Eintrag in `ORB_VISUAL_CONFIG` hinzu:
    ```typescript
    listening: {
      irisRotationClass: "animate-orb-rotate-fast",
      glowColorClass: "bg-emerald-500/30",
      // ...
    }
    ```
3.  **Logik**: Stelle sicher, dass die Eltern-Komponente (`Chat.tsx`) den neuen Status auch übergibt (z.B. basierend auf WebSpeech API Events).
