/**
 * Centralized storage keys to avoid magic strings throughout the application
 */

// API & Authentication Keys
export const STORAGE_KEYS = {
  // API Keys
  API_KEY: "openrouter-key",
  API_BASE_URL: "openrouter-base-url",

  // Settings
  SETTINGS: "disa-ai-settings",

  // Conversations
  LAST_CONVERSATION: "disa:last-conversation-id",
  CONVERSATIONS: "disa:conversations",
  CONVERSATIONS_METADATA: "disa:conversations:metadata",

  // Roles & Models
  ACTIVE_ROLE: "disa:active-role",
  MODEL_FALLBACK: "disa_model",

  // User Preferences & Settings
  THEME_PREFERENCE: "disa:theme-preference",
  USER_SETTINGS: "disa:user-settings",

  // Favorites & Analytics
  FAVORITES: "disa:favorites-data",
  USAGE_ANALYTICS: "disa:usage-analytics",

  // Book Navigation
  BOOK_NAVIGATION: "disa:book-navigation-state",

  // Memory
  GLOBAL_MEMORY: "disa-ai-global-memory",
  MEMORY_ENABLED: "disa-ai-memory-enabled",

  // PWA & Service Worker
  PWA_UPDATE_SHOWN: "disa-pwa-update-shown",
  PWA_PROMPT_DISMISSED: "pwa-prompt-dismissed",

  // Analytics
  ANALYTICS_EVENTS: "disa:analytics-events",
  ANALYTICS_SESSIONS: "disa:analytics-sessions",

  // UI Settings
  UI_FONT_SIZE: "disa:ui:fontSize",
  UI_REDUCE_MOTION: "disa:ui:reduceMotion",
  UI_HAPTIC_FEEDBACK: "disa:ui:hapticFeedback",

  // Discussion Settings
  DISCUSSION_PRESET: "disa:discussion:preset",
  DISCUSSION_STRICT: "disa:discussion:strict",
  DISCUSSION_MAX_SENTENCES: "disa:discussion:maxSentences",

  // Context & UI Settings
  CONTEXT_RESERVE: "disa:ctxReserve",
  COMPOSER_OFFSET: "disa:composerOffset",

  // Models Cache
  MODELS_CACHE: "disa:or:models:v1",
  MODELS_CACHE_TIMESTAMP: "disa:or:models:ts",

  // Build/Debug Info
  SHOW_DEBUG_INFO: "show-debug-info",

  // Bookmark Animation
  BOOKMARK_ANIMATION: "disa:bookmark-animation-shown",
} as const;

// Session Storage Keys
export const SESSION_STORAGE_KEYS = {
  // PWA Update Status
  PWA_UPDATE_SHOWN: "disa-pwa-update-shown",

  // API Key (should only be in session storage)
  API_KEY: "openrouter-key",
} as const;
