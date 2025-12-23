/// <reference types="vite/client" />

export interface EnvConfig {
  VITE_OPENROUTER_BASE_URL: string;
  VITE_ENABLE_ANALYTICS: boolean;
  VITE_BUILD_ID?: string;
  VITE_BUILD_TIME?: string;
  VITE_GIT_SHA?: string;
  VITE_GIT_BRANCH?: string;
  VITE_VERSION?: string;
  VITE_BASE_URL: string;
  VITE_ENABLE_DEBUG: boolean;
  VITE_ENABLE_PWA: boolean;
}

/**
 * Environment validation result
 */
interface EnvValidationResult {
  success: boolean;
  config?: EnvConfig;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validates environment variables and returns configuration
 */
const BOOLEAN_TRUE = new Set(["true", "1", "yes", "on"]);
const BOOLEAN_FALSE = new Set(["false", "0", "no", "off"]);
// No required runtime vars - all have working defaults/fallbacks
const REQUIRED_RUNTIME_ENV_VARS: Array<keyof EnvConfig> = [];

const ENV_VALIDATION_OVERLAY_ID = "env-validation-overlay";

function renderEnvironmentValidationOverlay(errors: string[]): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(ENV_VALIDATION_OVERLAY_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = ENV_VALIDATION_OVERLAY_ID;
  overlay.setAttribute("role", "alert");
  overlay.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 2147483647;
    max-width: min(420px, 90vw);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-border-strong, rgba(0,0,0,0.1));
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.24);
    border-radius: 14px;
    padding: 16px 18px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const title = document.createElement("div");
  title.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  `;
  title.innerHTML = `<span aria-hidden="true">⚠️</span><span>Konfiguration benötigt Aufmerksamkeit</span>`;

  const description = document.createElement("p");
  description.style.cssText = `
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text-secondary, #475569);
  `;
  description.textContent =
    "Mindestens eine verpflichtende Umgebungsvariable fehlt oder ist ungültig. Die App nutzt einen Fallback-Modus.";

  const list = document.createElement("ul");
  list.style.cssText = `
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 4px;
    color: var(--color-text-primary, #0f172a);
  `;

  errors.forEach((message) => {
    const item = document.createElement("li");
    item.style.cssText = "font-size: 13px; line-height: 1.5;";
    item.textContent = message;
    list.appendChild(item);
  });

  overlay.appendChild(title);
  overlay.appendChild(description);
  overlay.appendChild(list);

  document.body.appendChild(overlay);
}

function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (BOOLEAN_TRUE.has(normalized)) return true;
  if (BOOLEAN_FALSE.has(normalized)) return false;
  return fallback;
}

function validateUrl(
  value: string | undefined,
  fallback: string,
  field: string,
  errors: string[],
): string {
  if (!value) return fallback;
  try {
    const parsed = new URL(value);
    return parsed.toString();
  } catch {
    errors.push(`${field}: Invalid URL`);
    return fallback;
  }
}

function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = typeof import.meta !== "undefined" && Boolean(import.meta.env?.PROD);

  // Collect all VITE_ prefixed environment variables
  const envVars: Record<string, string> = {};

  // Get from import.meta.env (Vite's environment)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    Object.entries(import.meta.env).forEach(([key, value]) => {
      if (key.startsWith("VITE_") && typeof value === "string") {
        envVars[key] = value;
      }
    });
  }

  // Check for required runtime variables (production only to avoid noisy DX)
  if (isProduction) {
    for (const required of REQUIRED_RUNTIME_ENV_VARS) {
      if (!envVars[required] || envVars[required].trim() === "") {
        errors.push(`${required}: Missing required environment variable`);
      }
    }
  }

  // Note: VITE_OPENROUTER_BASE_URL warning removed - defaults are acceptable

  const config: EnvConfig = {
    VITE_OPENROUTER_BASE_URL: validateUrl(
      envVars.VITE_OPENROUTER_BASE_URL,
      "https://openrouter.ai/api/v1",
      "VITE_OPENROUTER_BASE_URL",
      errors,
    ),
    VITE_ENABLE_ANALYTICS: toBoolean(envVars.VITE_ENABLE_ANALYTICS, false),
    VITE_BUILD_ID: envVars.VITE_BUILD_ID || undefined,
    VITE_BUILD_TIME: envVars.VITE_BUILD_TIME || undefined,
    VITE_GIT_SHA: envVars.VITE_GIT_SHA || undefined,
    VITE_GIT_BRANCH: envVars.VITE_GIT_BRANCH || undefined,
    VITE_VERSION: envVars.VITE_VERSION || undefined,
    VITE_BASE_URL: envVars.VITE_BASE_URL?.trim() || "/",
    VITE_ENABLE_DEBUG: toBoolean(envVars.VITE_ENABLE_DEBUG, false),
    VITE_ENABLE_PWA: toBoolean(envVars.VITE_ENABLE_PWA, true),
  };

  return {
    success: errors.length === 0,
    config,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Global environment configuration
 */
let _envConfig: EnvConfig | null = null;
let _validationResult: EnvValidationResult | null = null;

/**
 * Initialize and validate environment configuration
 */
export function initEnvironment(): EnvValidationResult {
  if (_validationResult) {
    return _validationResult;
  }

  _validationResult = validateEnvironment();

  // #region agent log
  try {
    fetch("http://127.0.0.1:7242/ingest/0ae7fc31-3847-4426-952c-f3c7a5827cea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "src/config/env.ts:initEnvironment",
        message: "Env validation result",
        data: {
          success: _validationResult.success,
          errorCount: _validationResult.errors?.length ?? 0,
          warningCount: _validationResult.warnings?.length ?? 0,
          baseUrl: _validationResult.config?.VITE_BASE_URL,
          debugEnabled: _validationResult.config?.VITE_ENABLE_DEBUG,
          pwaEnabled: _validationResult.config?.VITE_ENABLE_PWA,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  } catch (error) {
    console.warn("Agent log failed in initEnvironment", error);
  }
  // #endregion

  if (_validationResult.success && _validationResult.config) {
    _envConfig = _validationResult.config;

    // Log configuration in development
    if (_envConfig.VITE_ENABLE_DEBUG) {
      console.error("🔧 Environment Configuration", _envConfig);
    }

    // Log warnings
    if (_validationResult.warnings) {
      console.error("⚠️ Environment Warnings:", _validationResult.warnings);
    }
  } else {
    // Log errors
    console.error("❌ Environment Configuration Errors:", _validationResult.errors);
    if (_validationResult.errors) {
      renderEnvironmentValidationOverlay(_validationResult.errors);
    }
  }

  return _validationResult;
}

/**
 * Get validated environment configuration
 * Throws if environment is not properly configured
 */
export function getEnvConfig(): EnvConfig {
  if (!_envConfig) {
    const result = initEnvironment();
    if (!result.success || !result.config) {
      throw new Error("Environment configuration failed validation");
    }
    _envConfig = result.config;
  }

  return _envConfig;
}

/**
 * Get environment configuration safely with fallbacks
 */
export function getEnvConfigSafe(): EnvConfig {
  try {
    return getEnvConfig();
  } catch {
    // Return minimal safe configuration
    console.error("Using fallback environment configuration");
    return {
      VITE_OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",
      VITE_ENABLE_ANALYTICS: false,
      VITE_BASE_URL: "/",
      VITE_ENABLE_DEBUG: false,
      VITE_ENABLE_PWA: true,
    };
  }
}

/**
 * Check if environment is properly configured
 */
export function isEnvironmentValid(): boolean {
  const result = initEnvironment();
  return result.success;
}

/**
 * Get environment validation errors
 */
export function getEnvironmentErrors(): string[] {
  const result = initEnvironment();
  return result.errors || [];
}

/**
 * Get environment validation warnings
 */
export function getEnvironmentWarnings(): string[] {
  const result = initEnvironment();
  return result.warnings || [];
}
