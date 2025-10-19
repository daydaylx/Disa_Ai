/**
 * German (Deutsch) translations
 */
export const de = {
  common: {
    loading: "Wird geladen...",
    error: "Fehler",
    cancel: "Abbrechen",
    save: "Speichern",
    delete: "Löschen",
    edit: "Bearbeiten",
    close: "Schließen",
    search: "Suchen",
    filter: "Filter",
    reset: "Zurücksetzen",
    confirm: "Bestätigen",
    back: "Zurück",
    next: "Weiter",
  },
  navigation: {
    chat: "Chat",
    models: "Modelle",
    roles: "Rollen",
    settings: "Einstellungen",
  },
  studio: {
    title: "Rollen-Studio",
    chip: "Studio",
    description:
      "Wähle eine Stimme für Disa AI. Nutze Suche oder Filter, um schneller passende Rollen zu entdecken.",
    activeRole: {
      label: "Aktive Rolle",
      chip: "Aktiv",
      reset: "Zurücksetzen",
      resetAria: "Aktive Rolle zurücksetzen",
    },
    search: {
      placeholder: "Rollen durchsuchen …",
      ariaLabel: "Rollen durchsuchen",
      clearAria: "Suche zurücksetzen",
    },
    filter: {
      all: "Alle",
      clearFilter: "Filter aufheben",
      visible: (count: number, total: number) => `${count} von ${total} Rollen sichtbar`,
    },
    loading: "Rollen werden geladen ...",
    noResults: "Keine Rollen gefunden.",
    noResultsHint:
      "Passe die Filter an oder lösche den Suchbegriff, um alle Rollen erneut zu sehen.",
    actions: {
      goToChat: "Zum Chat mit aktueller Rolle",
      resetRole: "Rolle zurücksetzen",
      selectRole: (name: string) => `Rolle ${name} auswählen`,
    },
  },
  games: {
    title: "Spiele",
    description: "Wähle ein Spiel aus, um eine neue Spielrunde zu starten.",
    sectionLabel: "Verfügbare Spiele",
    startGame: (title: string) => `Spiel ${title} starten`,
    list: {
      "wer-bin-ich": {
        title: "Wer bin ich?",
        description: "Errate die von mir gedachte Entität in 20 Ja/Nein-Fragen",
      },
      quiz: {
        title: "Quiz",
        description: "Teste dein Wissen mit Multiple-Choice-Fragen",
      },
      "zwei-wahrheiten-eine-lüge": {
        title: "Zwei Wahrheiten, eine Lüge",
        description: "Finde die falsche Aussage unter dreien",
      },
      "black-story": {
        title: "Black Story",
        description: "Löse mysteriöse Szenarien durch Ja/Nein-Fragen",
      },
      "film-oder-fake": {
        title: "Film oder Fake?",
        description: "Entscheide, ob Filmhandlungen echt oder erfunden sind",
      },
    },
  },
  categories: {
    Alltag: "Alltag",
    "Business & Karriere": "Business & Karriere",
    "Kreativ & Unterhaltung": "Kreativ & Unterhaltung",
    "Lernen & Bildung": "Lernen & Bildung",
    "Leben & Familie": "Leben & Familie",
    "Experten & Beratung": "Experten & Beratung",
    Erwachsene: "Erwachsene",
    Spezial: "Spezial",
  },
  footer: {
    betaLabel: "Disa AI Beta · Tooling Preview",
    version: "Version: {version}",
    mode: "Mode: {mode}",
  },
};

export type Translations = typeof de;
