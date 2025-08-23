export const features = {
  chat: true,
  settings: true,
  changelog: false,      // war Fake -> raus
  restart: false,        // kein Hook -> raus
  quickActions: false,   // Chips ohne Funktion -> raus
  quickStartPanel: false // "Schnellstart"-Karten -> raus
} as const;
