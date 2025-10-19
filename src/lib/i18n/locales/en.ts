/**
 * English translations
 */
import type { Translations } from "./de";

export const en: Translations = {
  common: {
    loading: "Loading...",
    error: "Error",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    search: "Search",
    filter: "Filter",
    reset: "Reset",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
  },
  navigation: {
    chat: "Chat",
    models: "Models",
    roles: "Roles",
    settings: "Settings",
  },
  studio: {
    title: "Role Studio",
    chip: "Studio",
    description:
      "Choose a voice for Disa AI. Use search or filters to quickly discover suitable roles.",
    activeRole: {
      label: "Active Role",
      chip: "Active",
      reset: "Reset",
      resetAria: "Reset active role",
    },
    search: {
      placeholder: "Search roles …",
      ariaLabel: "Search roles",
      clearAria: "Clear search",
    },
    filter: {
      all: "All",
      clearFilter: "Clear filter",
      visible: (count: number, total: number) => `${count} of ${total} roles visible`,
    },
    loading: "Loading roles ...",
    noResults: "No roles found.",
    noResultsHint: "Adjust the filters or clear the search term to see all roles again.",
    actions: {
      goToChat: "Go to chat with current role",
      resetRole: "Reset role",
      selectRole: (name: string) => `Select role ${name}`,
    },
  },
  games: {
    title: "Games",
    description: "Choose a game to start a new game session.",
    sectionLabel: "Available Games",
    startGame: (title: string) => `Start game ${title}`,
    list: {
      "wer-bin-ich": {
        title: "Who am I?",
        description: "Guess the entity I'm thinking of in 20 yes/no questions",
      },
      quiz: {
        title: "Quiz",
        description: "Test your knowledge with multiple-choice questions",
      },
      "zwei-wahrheiten-eine-lüge": {
        title: "Two Truths, One Lie",
        description: "Find the false statement among three",
      },
      "black-story": {
        title: "Black Story",
        description: "Solve mysterious scenarios through yes/no questions",
      },
      "film-oder-fake": {
        title: "Movie or Fake?",
        description: "Decide whether movie plots are real or invented",
      },
    },
  },
  categories: {
    Alltag: "Everyday",
    "Business & Karriere": "Business & Career",
    "Kreativ & Unterhaltung": "Creative & Entertainment",
    "Lernen & Bildung": "Learning & Education",
    "Leben & Familie": "Life & Family",
    "Experten & Beratung": "Experts & Consulting",
    Erwachsene: "Adults",
    Spezial: "Special",
  },
  footer: {
    betaLabel: "Disa AI Beta · Tooling Preview",
    version: "Version: {version}",
    mode: "Mode: {mode}",
  },
};
