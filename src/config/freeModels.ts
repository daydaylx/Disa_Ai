/**
 * Free Model Allowlist for DisaAI Proxy
 *
 * This file defines the allowlist of free models that can be used
 * through the server-side proxy without requiring an API key.
 * Only models with ":free" suffix or zero pricing are allowed.
 */

export const FREE_MODEL_ALLOWLIST = [
  // Meta Llama 3.3 Free
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.3-8b-instruct:free",

  // Meta Llama 3.2 Free
  "meta-llama/llama-3.2-90b-vision-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct:free",

  // Mistral Free Models
  "mistralai/mistral-7b-instruct:free",
  "mistralai/mistral-tiny:free",

  // Google Free Models
  "google/gemma-2-27b-it:free",
  "google/gemma-2-9b-it:free",

  // Microsoft Free Models
  "microsoft/phi-3.5-mini-128k-instruct:free",

  // Other Free Models
  "openrouter/cinematika-7b:free",
  "gryphe/mythomist-7b:free",
  "nousresearch/hermes-3-llama-3.1-8b:free",
  "undi95/remm-slerp-l2-13b:free",
  "jondurbin/bagel-34b-v0.2:free",
  "cohere/command-r-08-2024:free",
  "databricks/dbrx-instruct:free",
  "allenai/olmo-7b-instruct:free",
  "sao10k/fimbulvetr-11b-v2:free",
  "huggingfaceh4/zephyr-7b-beta:free",
  "teknium/openhermes-2.5-mistral-7b:free",
  "openchat/openchat-7b:free",
  "thedrummer/rocinante-12b:free",
];

/**
 * Default free model to use when client requests an invalid model
 */
export const DEFAULT_FREE_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

/**
 * Check if a model is in the free allowlist
 * @param modelId - The model ID to check
 * @returns boolean - True if model is allowed
 */
export function isFreeModelAllowed(modelId: string): boolean {
  return FREE_MODEL_ALLOWLIST.includes(modelId);
}

/**
 * Get a safe model ID - if the requested model is not allowed,
 * return the default free model
 * @param modelId - The requested model ID
 * @returns string - Allowed model ID
 */
export function getSafeModelId(modelId: string): string {
  return isFreeModelAllowed(modelId) ? modelId : DEFAULT_FREE_MODEL;
}

/**
 * Hard caps for model parameters
 */
export const MODEL_PARAM_CAPS = {
  max_tokens: {
    min: 800,
    max: 1200,
    default: 1024,
  },
  temperature: {
    min: 0.0,
    max: 1.2,
    default: 0.7,
  },
};

/**
 * Clamp model parameters to safe ranges
 * @param params - The model parameters
 * @returns Clamped parameters
 */
export function clampModelParams(params: { max_tokens?: number; temperature?: number }): {
  max_tokens: number;
  temperature: number;
} {
  const { max_tokens, temperature } = params;

  return {
    max_tokens: Math.min(
      Math.max(max_tokens ?? MODEL_PARAM_CAPS.max_tokens.default, MODEL_PARAM_CAPS.max_tokens.min),
      MODEL_PARAM_CAPS.max_tokens.max,
    ),
    temperature: Math.min(
      Math.max(
        temperature ?? MODEL_PARAM_CAPS.temperature.default,
        MODEL_PARAM_CAPS.temperature.min,
      ),
      MODEL_PARAM_CAPS.temperature.max,
    ),
  };
}
