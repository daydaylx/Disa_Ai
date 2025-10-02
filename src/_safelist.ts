// Diese Datei stellt sicher, dass Tailwind dynamische Klassen im Build sieht.
// Docs: Tailwind scannt Quell-Dateien auf Klassen. (Siehe offizielle 'content' / 'detecting classes' Doku.)
// Füge hier alle dynamisch erzeugten Namen hinzu, die sonst weggepurged würden.

export const TAILWIND_SAFELIST = [
  // Kachel-/Button-/Surface-Varianten – anpassen/erweitern:
  "tile",
  "tile-lg",
  "tile-sm",
  "card",
  "card-ghost",
  "card-solid",
  "surface",
  "surface-muted",
  "bubble",
  "bubble-primary",
  "bubble-secondary",
  "btn",
  "btn-primary",
  "btn-secondary",
  "btn-ghost",
  // Falls du arbitäre Werte nutzt, hier referenzieren:
  "rounded-2xl",
  "backdrop-blur",
  "shadow-xl",
  "shadow-2xl",
];
