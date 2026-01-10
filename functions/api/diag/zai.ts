/**
 * Cloudflare Function: /api/diag/zai
 *
 * DIAGNOSTIC ENDPOINT - Safe environment variable verification.
 * This endpoint checks if Z.AI API credentials are configured without exposing sensitive data.
 *
 * SECURITY:
 * - Only shows key metadata (length, prefix), never full keys
 * - Disabled in production unless explicitly enabled via env var
 * - Does NOT make actual API calls (see /api/diag/zai-test for that)
 *
 * Environment Variables:
 * - ZAI_API_KEY: Required for vision endpoint
 * - ENABLE_DIAG_ENDPOINTS: Set to "true" to enable in production
 */

interface Env {
  ZAI_API_KEY?: string;
  ENABLE_DIAG_ENDPOINTS?: string;
}

interface DiagnosticResult {
  endpoint: string;
  timestamp: string;
  environment: string;
  checks: {
    zai_api_key: {
      configured: boolean;
      length?: number;
      prefix?: string;
      valid_format?: boolean;
    };
    base_url: {
      configured: boolean;
      value: string;
    };
    model: {
      configured: boolean;
      value: string;
    };
  };
  warnings: string[];
  production_safe: boolean;
}

// Z.AI configuration (hardcoded in vision.ts)
const ZAI_API_BASE_URL = "https://api.z.ai/api/paas/v4";
const ZAI_MODEL_ID = "glm-4.6v";

/**
 * Check if running in production environment
 */
function isProduction(request: Request): boolean {
  const host = new URL(request.url).hostname;
  return host === "disaai.de" || host === "disaai.pages.dev";
}

/**
 * Mask API key - show only prefix for debugging
 */
function maskApiKey(key: string): string {
  if (key.length < 8) return "***";
  return key.substring(0, 5) + "..." + key.substring(key.length - 3);
}

/**
 * Validate Z.AI API key format
 * Expected format: {uuid}.{secret} (e.g., "9205bf97-...-2c57532.s34WL0...")
 */
function validateZaiKeyFormat(key: string): boolean {
  // Basic format check: should contain a dot separator
  if (!key.includes(".")) return false;

  const parts = key.split(".");
  if (parts.length !== 2) return false;

  const [uuid, secret] = parts;

  // UUID part should be 32 chars (without hyphens) or similar length
  if (uuid.length < 20 || uuid.length > 40) return false;

  // Secret part should exist and be reasonably long
  if (secret.length < 10) return false;

  return true;
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // Security: Disable in production unless explicitly enabled
  const diagEnabled = env.ENABLE_DIAG_ENDPOINTS === "true";
  const isProd = isProduction(request);

  if (isProd && !diagEnabled) {
    return new Response(
      JSON.stringify({
        error: "Diagnostic endpoints disabled in production",
        hint: "Set ENABLE_DIAG_ENDPOINTS=true in environment variables to enable",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Only allow GET requests
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use GET." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const warnings: string[] = [];

  // Check ZAI_API_KEY
  const hasKey = !!env.ZAI_API_KEY;
  const keyLength = env.ZAI_API_KEY?.length;
  const keyPrefix = env.ZAI_API_KEY ? maskApiKey(env.ZAI_API_KEY) : undefined;
  const validFormat = env.ZAI_API_KEY ? validateZaiKeyFormat(env.ZAI_API_KEY) : false;

  if (!hasKey) {
    warnings.push("ZAI_API_KEY not configured - vision endpoint will fail");
  } else if (!validFormat) {
    warnings.push("ZAI_API_KEY format looks invalid - expected format: {uuid}.{secret}");
  }

  // Check base URL (hardcoded, always "configured")
  const baseUrlOk = ZAI_API_BASE_URL === "https://api.z.ai/api/paas/v4";
  if (!baseUrlOk) {
    warnings.push("Base URL mismatch - unexpected configuration");
  }

  // Build diagnostic result
  const result: DiagnosticResult = {
    endpoint: "/api/diag/zai",
    timestamp: new Date().toISOString(),
    environment: isProd ? "production" : "development",
    checks: {
      zai_api_key: {
        configured: hasKey,
        ...(hasKey && {
          length: keyLength,
          prefix: keyPrefix,
          valid_format: validFormat,
        }),
      },
      base_url: {
        configured: true,
        value: ZAI_API_BASE_URL,
      },
      model: {
        configured: true,
        value: ZAI_MODEL_ID,
      },
    },
    warnings,
    production_safe: isProd ? diagEnabled : true,
  };

  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
