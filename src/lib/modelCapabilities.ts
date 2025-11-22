import type { ModelEntry } from "../config/models";

/**
 * Extracts capability flags for sampling parameters.
 * Falls back to heuristic based on provider if capabilities are absent.
 */
export function getSamplingCapabilities(
  modelId: string | undefined,
  catalog: ModelEntry[] | null,
): { temperature: boolean; top_p: boolean; presence_penalty: boolean } {
  const entry = catalog?.find((m) => m.id === modelId);
  if (entry?.capabilities) {
    return {
      temperature: entry.capabilities.temperature ?? true,
      top_p: entry.capabilities.top_p ?? true,
      presence_penalty: entry.capabilities.presence_penalty ?? false,
    };
  }

  // Heuristic: most modern chat models support temperature/top_p; presence_penalty limited.
  const id = (modelId || "").toLowerCase();
  const supportsPenaltyProviders = ["openai", "gpt", "anthropic", "llama", "mistral", "qwen"];
  const presence_penalty = supportsPenaltyProviders.some((p) => id.includes(p));

  return {
    temperature: true,
    top_p: true,
    presence_penalty,
  };
}
