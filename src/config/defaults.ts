/**
 * Zentrale Konfigurationswerte für die Disa AI Anwendung.
 * Alle Magic Strings und Standardwerte werden hier definiert.
 */

// API Konfiguration
export const API_CONFIG = {
  OPENROUTER: {
    BASE_URL: "https://openrouter.ai/api/v1",
    CHAT_ENDPOINT: "https://openrouter.ai/api/v1/chat/completions",
    REFERER_HEADER: "X-Title",
    APP_NAME: "Disa AI",
  },
} as const;

// Standard-Modelle
export const DEFAULT_MODELS = {
  FREE_MODEL: "meta-llama/llama-3.3-70b-instruct:free",
  FALLBACK_MODEL: "meta-llama/llama-3.3-70b-instruct:free",
} as const;

// Storage-Schlüssel
export const STORAGE_KEYS = {
  API_KEY: "disa_api_key",
  MODEL_SELECTION: "disa_model",
  SETTINGS: "disa_settings",
  CONVERSATIONS: "disa_conversations",
} as const;

// Netzwerk-Timeouts (in Millisekunden)
export const TIMEOUTS = {
  CHAT_ONCE: 30000, // 30 Sekunden für einmalige Chat-Anfragen
  CHAT_STREAM: 45000, // 45 Sekunden für Streaming-Chat
  API_DEFAULT: 15000, // 15 Sekunden Standard-Timeout
} as const;

// Retry-Konfiguration
export const RETRY_CONFIG = {
  MAX_RETRIES: 2,
  BASE_DELAY_MS: 1000,
  MAX_DELAY_MS: 5000,
} as const;

// UI-Konstanten
export const UI_CONFIG = {
  TOAST_DURATION: 5000, // 5 Sekunden für Toast-Nachrichten
  DEBOUNCE_DELAY: 300, // 300ms für Eingabe-Debouncing
} as const;

// Feature Flags
export const FEATURES = {
  MEMORY_ENABLED: true,
  OFFLINE_MODE: true,
  PWA_ENABLED: true,
} as const;
