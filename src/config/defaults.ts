/**
 * Central configuration constants for Disa AI
 *
 * This file contains all repeated constants used throughout the application
 * to ensure consistency and make maintenance easier.
 */

// Storage Keys
export const STORAGE_KEYS = {
  /** API Key storage keys (in priority order for migration) */
  API_KEYS: ["disa_api_key", "openrouter_key", "OPENROUTER_API_KEY"] as const,

  /** Application data storage keys */
  APP_DATA: {
    /** Current chat session data */
    SESSION: "disa_session_v1",
    /** User settings and preferences */
    SETTINGS: "disa_settings_v1",
    /** Selected model identifier */
    MODEL: "disa_model",
    /** Legacy model key for migration */
    LEGACY_MODEL: "disa_model",
    /** User's selected style/persona */
    STYLE: "disa_style_id",
  } as const,

  /** Legacy settings key for backward compatibility */
  LEGACY_SETTINGS: {
    key: "openrouter_key",
  } as const,
} as const;

// Request Configuration
export const REQUEST_CONFIG = {
  /** Default timeout for API requests in milliseconds */
  DEFAULT_TIMEOUT: 30000,
  /** Maximum retries for failed requests */
  MAX_RETRIES: 3,
  /** Base delay for exponential backoff in milliseconds */
  RETRY_BASE_DELAY: 1000,
} as const;

// Application Constants
export const APP_CONFIG = {
  /** Current application version for storage schema */
  STORAGE_VERSION: "v1",
  /** Session storage prefix */
  SESSION_PREFIX: "disa_",
} as const;
