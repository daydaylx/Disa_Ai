# Guide: Animated Chat Hero Core (Gradient Blob)

Der Chat-Hero-Bereich nutzt jetzt einen subtil animierten Gradient-Blob statt des alten 3D-Orbs. Der Fokus liegt auf einer organischen, mobilenfreundlichen Lichtfläche direkt hinter der Headline.

## Architektur & Dateien
- React-Komponente: `src/components/chat/AnimatedCoreBackground.tsx`
- Styles/Keyframes: `src/styles/animated-core.css` (wird über `src/index.css` importiert)
- Status-Ableitung: `src/hooks/useCoreStatus.ts` liefert `CoreStatus` (`"idle" | "thinking" | "streaming" | "error"`).

## Zustände & Texte
Die sichtbaren Texte werden in `STATUS_COPY` innerhalb der Komponente gepflegt. Für den Fehlerzustand kann eine individuelle Fehlermeldung über `lastErrorMessage` angezeigt werden.

| Status | Titel | Beschreibung | Badge |
| --- | --- | --- | --- |
| `idle` | Was kann ich für dich tun? | Hinweise zu Vorschlägen/Eingabe | Bereit |
| `thinking` | Nachdenken … | Kurzer Hinweis, dass Ideen gesammelt werden | Denken |
| `streaming` | Antwort wird erstellt | Hinweis auf laufende Formulierung | Aktiv |
| `error` | Ein Fehler ist aufgetreten | Standard- oder übergebene Fehlermeldung | Fehler |

## Visuals anpassen
- **Farben**: Die Gradients nutzen CSS-Custom-Properties aus `src/index.css` (`--accent-chat`, `--accent-roles`, `--accent-models`, `--accent-settings`). Passe die Intensitäten in `animated-core.css` via `color-mix` an.
- **Animationen**: Keyframes `core-gradient-sway`, `core-rotate` und `core-pulse` sitzen ebenfalls in `animated-core.css`. Für ruhigere Bewegungen die Dauer erhöhen oder die `transform`-Werte reduzieren.
- **Badge-Farben**: Die Verlaufsklassen für das Status-Badge werden in `badgeAccent` im Component-Code definiert und können durch Tailwind-Gradients ersetzt werden.

## Motion & Accessibility
- `prefers-reduced-motion` wird in `animated-core.css` berücksichtigt und verlangsamt die Animationen automatisch.
- Das Gradient-Konstrukt ist `aria-hidden`, die Texte bleiben klar lesbar (hoher Kontrast, keine Überblendung des Headlines).

## Integration im Chat
`AnimatedCoreBackground` wird auf der leeren Chat-Ansicht oberhalb der Vorschlags-Buttons gerendert. Der Container ist so skaliert, dass er auf Mobile vollständig sichtbar bleibt, ohne den Input-Bereich aus dem Viewport zu schieben.
