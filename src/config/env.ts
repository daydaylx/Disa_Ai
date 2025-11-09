/// <reference types="vite/client" />
import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // OpenRouter API Configuration
  VITE_OPENROUTER_BASE_URL: z
    .string()
    .url()
    .default("https://openrouter.ai/api/v1")
    .describe("OpenRouter API base URL"),

  // Analytics & Tracking
  VITE_ENABLE_ANALYTICS: z
    .string()
    .default("false")
    .transform((val) => val.toLowerCase() === "true")
    .describe("Enable analytics tracking"),

  // Build Information (auto-generated)
  VITE_BUILD_ID: z.string().optional().describe("Build identifier"),

  VITE_BUILD_TIME: z.string().optional().describe("Build timestamp"),

  VITE_GIT_SHA: z.string().optional().describe("Git commit SHA"),

  VITE_GIT_BRANCH: z.string().optional().describe("Git branch name"),

  VITE_VERSION: z.string().optional().describe("Application version"),

  // Deployment Configuration
  VITE_BASE_URL: z.string().default("/").describe("Application base URL"),

  // Feature Flags
  VITE_ENABLE_DEBUG: z
    .string()
    .default("false")
    .transform((val) => val.toLowerCase() === "true")
    .describe("Enable debug mode"),

  VITE_ENABLE_PWA: z
    .string()
    .default("true")
    .transform((val) => val.toLowerCase() === "true")
    .describe("Enable PWA features"),
});

export type EnvConfig = z.infer<typeof envSchema>;

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
function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

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

  // Note: VITE_OPENROUTER_BASE_URL warning removed - defaults are acceptable

  try {
    const config = envSchema.parse(envVars);

    return {
      success: true,
      config,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`));
    } else {
      errors.push("Unknown validation error");
    }

    return {
      success: false,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
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
