# Motion-Spezifikation Disa AI

- Easing global: `cubic-bezier(.23,1,.32,1)` (`--motion-ease-base`).
- Dauer-Tokens:
  - `--motion-duration-quick`: 120ms (Chips, Hover, kleine UI-States)
  - `--motion-duration-base`: 180ms (Modals, Bottom-Sheets, Overlays)
  - `--motion-duration-slow`: 240ms (Page-Transitions, große Layoutwechsel)
- Anwendung (Auszug):
  - Chips/Model-Picker: 120ms, subtle scale/opacity, nur ein Accent-Fokus.
  - Dialoge/Bottombars: 180ms, translateY + Fade, kein Overshoot.
  - Navigation/Layout: 240ms, nur Opacity/Position, keine komplexen Parallax-Effekte.
- A11y:
  - `prefers-reduced-motion: reduce` respektieren: Animationen auf Fade/Instant reduzieren.
  - Keine endlosen Spinner; Skeletons mit 120ms Fade-In statt aggressiver Puls-Animation.
