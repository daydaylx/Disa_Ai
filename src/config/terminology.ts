/**
 * Unified Terminology & System Feedback
 * Implements Issue #110 - Terminologie & System-Feedback vereinheitlichen
 */

// Consistent terminology across the application
export const TERMINOLOGY = {
  // AI/Model related terms
  model: "Modell",
  models: "Modelle",
  assistant: "Assistent",
  ai: "KI",
  chat: "Chat",
  conversation: "Unterhaltung",
  message: "Nachricht",
  messages: "Nachrichten",

  // Actions
  send: "Senden",
  retry: "Wiederholen",
  copy: "Kopieren",
  delete: "Löschen",
  edit: "Bearbeiten",
  save: "Speichern",
  cancel: "Abbrechen",
  continue: "Fortfahren",
  back: "Zurück",
  next: "Weiter",

  // States
  loading: "Lädt...",
  error: "Fehler",
  success: "Erfolgreich",
  warning: "Warnung",
  info: "Information",

  // Quickstarts
  quickstart: "Schnellstart",
  quickstarts: "Schnellstarts",
  templates: "Vorlagen",

  // Settings
  settings: "Einstellungen",
  preferences: "Einstellungen",
  configuration: "Konfiguration",

  // Accessibility
  accessibility: "Barrierefreiheit",
  keyboard: "Tastatur",
  screenReader: "Screenreader",

  // Performance
  performance: "Leistung",
  loading_time: "Ladezeit",
  optimization: "Optimierung",
} as const;

// Standardized feedback messages
export const FEEDBACK_MESSAGES = {
  // Success messages
  success: {
    modelSelected: "Modell erfolgreich ausgewählt",
    messageCopied: "Nachricht in die Zwischenablage kopiert",
    settingsSaved: "Einstellungen gespeichert",
    quickstartCompleted: "Schnellstart erfolgreich abgeschlossen",
    chatStarted: "Neuer Chat gestartet",
  },

  // Error messages
  error: {
    modelLoadFailed: "Modell konnte nicht geladen werden",
    networkError: "Netzwerkfehler - Bitte versuchen Sie es erneut",
    unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
    noModelSelected: "Bitte wählen Sie ein Modell aus",
    messageEmpty: "Nachricht darf nicht leer sein",
    copyFailed: "Kopieren fehlgeschlagen",
    saveFailed: "Speichern fehlgeschlagen",
  },

  // Warning messages
  warning: {
    unsavedChanges: "Sie haben ungespeicherte Änderungen",
    modelNotResponding: "Modell antwortet nicht - versuchen Sie es erneut",
    slowConnection: "Langsame Verbindung erkannt",
    oldBrowser: "Ihr Browser wird möglicherweise nicht vollständig unterstützt",
  },

  // Info messages
  info: {
    firstVisit:
      "Willkommen bei Disa AI! Wählen Sie einen Schnellstart oder stellen Sie eine Frage.",
    newFeature: "Neue Funktionen verfügbar - erkunden Sie die Einstellungen",
    tipOfDay: "Tipp: Verwenden Sie Strg+Enter zum schnellen Senden",
    modelSwitched: "Modell gewechselt",
  },

  // Loading states
  loading: {
    models: "Modelle werden geladen...",
    response: "Antwort wird generiert...",
    saving: "Wird gespeichert...",
    processing: "Wird verarbeitet...",
  },
} as const;

// Toast notification configurations
export const TOAST_CONFIGS = {
  success: {
    duration: 3000,
    position: "bottom" as const,
    style: {
      background: "var(--ok)",
      color: "white",
    },
  },
  error: {
    duration: 5000,
    position: "bottom" as const,
    style: {
      background: "var(--err)",
      color: "white",
    },
  },
  warning: {
    duration: 4000,
    position: "bottom" as const,
    style: {
      background: "var(--warn)",
      color: "white",
    },
  },
  info: {
    duration: 3000,
    position: "bottom" as const,
    style: {
      background: "var(--info)",
      color: "white",
    },
  },
} as const;

// Button text standardization
export const BUTTON_TEXTS = {
  // Primary actions
  send: TERMINOLOGY.send,
  save: TERMINOLOGY.save,
  continue: TERMINOLOGY.continue,

  // Secondary actions
  cancel: TERMINOLOGY.cancel,
  back: TERMINOLOGY.back,
  retry: TERMINOLOGY.retry,

  // Utility actions
  copy: TERMINOLOGY.copy,
  edit: TERMINOLOGY.edit,
  delete: TERMINOLOGY.delete,

  // Navigation
  next: TERMINOLOGY.next,
  previous: "Vorherige",
  close: "Schließen",
  open: "Öffnen",

  // Model actions
  selectModel: "Modell auswählen",
  changeModel: "Modell wechseln",

  // Chat actions
  startChat: "Chat starten",
  newChat: "Neuer Chat",
  clearChat: "Chat löschen",

  // Settings
  openSettings: "Einstellungen öffnen",
  resetSettings: "Einstellungen zurücksetzen",
  exportSettings: "Einstellungen exportieren",
  importSettings: "Einstellungen importieren",
} as const;

// ARIA labels for accessibility
export const ARIA_LABELS = {
  // Navigation
  mainNavigation: "Hauptnavigation",
  breadcrumb: "Brotkrümelnavigation",

  // Chat interface
  chatHistory: "Chat-Verlauf",
  messageInput: "Nachricht eingeben",
  sendButton: "Nachricht senden",
  retryButton: "Antwort wiederholen",
  copyButton: "Nachricht kopieren",

  // Model selection
  modelList: "Liste der verfügbaren Modelle",
  selectedModel: "Ausgewähltes Modell",
  modelSelector: "Modell-Auswahl",

  // Settings
  settingsPanel: "Einstellungen-Panel",
  settingsForm: "Einstellungsformular",

  // Loading states
  loading: "Inhalt wird geladen",
  processingRequest: "Anfrage wird verarbeitet",

  // Status indicators
  online: "Online-Status",
  offline: "Offline-Status",
  error: "Fehlerstatus",
  success: "Erfolgsstatus",
} as const;

// Helper functions for consistent messaging
export function getSuccessMessage(key: keyof typeof FEEDBACK_MESSAGES.success): string {
  return FEEDBACK_MESSAGES.success[key];
}

export function getErrorMessage(key: keyof typeof FEEDBACK_MESSAGES.error): string {
  return FEEDBACK_MESSAGES.error[key];
}

export function getWarningMessage(key: keyof typeof FEEDBACK_MESSAGES.warning): string {
  return FEEDBACK_MESSAGES.warning[key];
}

export function getInfoMessage(key: keyof typeof FEEDBACK_MESSAGES.info): string {
  return FEEDBACK_MESSAGES.info[key];
}

export function getLoadingMessage(key: keyof typeof FEEDBACK_MESSAGES.loading): string {
  return FEEDBACK_MESSAGES.loading[key];
}

export function getButtonText(key: keyof typeof BUTTON_TEXTS): string {
  return BUTTON_TEXTS[key];
}

export function getAriaLabel(key: keyof typeof ARIA_LABELS): string {
  return ARIA_LABELS[key];
}

export function getTerm(key: keyof typeof TERMINOLOGY): string {
  return TERMINOLOGY[key];
}

// Centralized toast creation helper
export function createToast(
  type: keyof typeof TOAST_CONFIGS,
  messageKey: string,
  customMessage?: string,
) {
  const config = TOAST_CONFIGS[type];
  const message = customMessage || messageKey;

  return {
    kind: type,
    title:
      type === "success"
        ? "Erfolgreich"
        : type === "error"
          ? "Fehler"
          : type === "warning"
            ? "Warnung"
            : "Information",
    message,
    ...config,
  };
}

// Type exports for better TypeScript support
export type TerminologyKey = keyof typeof TERMINOLOGY;
export type FeedbackMessageKey = keyof typeof FEEDBACK_MESSAGES;
export type ButtonTextKey = keyof typeof BUTTON_TEXTS;
export type AriaLabelKey = keyof typeof ARIA_LABELS;
export type ToastType = keyof typeof TOAST_CONFIGS;
