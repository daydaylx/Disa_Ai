import type { ChatRequestOptions } from "../types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Piecewise mapping from a 0-100 creativity slider to sampling params.
 * Implements temperature, top_p and presence_penalty (when supported).
 */
export function mapCreativityToParams(
  sliderValue: number,
  modelId?: string,
): Pick<ChatRequestOptions, "temperature" | "top_p" | "presence_penalty"> {
  const c = clamp(sliderValue, 0, 100) / 100;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  let temperature: number;
  if (c <= 0.2) {
    temperature = lerp(0.1, 0.3, c / 0.2);
  } else if (c <= 0.6) {
    temperature = lerp(0.3, 0.8, (c - 0.2) / 0.4);
  } else {
    temperature = lerp(0.8, 1.2, (c - 0.6) / 0.4);
  }
  temperature = clamp(temperature, 0.1, 1.2);

  let top_p: number;
  if (c <= 0.2) {
    top_p = lerp(0.75, 0.85, c / 0.2);
  } else if (c <= 0.6) {
    top_p = lerp(0.85, 0.95, (c - 0.2) / 0.4);
  } else {
    top_p = lerp(0.95, 1.0, (c - 0.6) / 0.4);
  }
  top_p = clamp(top_p, 0.75, 1.0);

  let presence_penalty: number;
  if (c <= 0.2) {
    presence_penalty = lerp(0.0, 0.1, c / 0.2);
  } else if (c <= 0.6) {
    presence_penalty = lerp(0.1, 0.2, (c - 0.2) / 0.4);
  } else {
    presence_penalty = lerp(0.2, 0.4, (c - 0.6) / 0.4);
  }
  presence_penalty = clamp(presence_penalty, 0.0, 0.4);

  const supportsPresencePenalty = modelSupportsPresencePenalty(modelId);

  return {
    temperature,
    top_p,
    presence_penalty: supportsPresencePenalty ? presence_penalty : undefined,
  };
}

/**
 * Very small heuristic: presence_penalty tends to be supported by OpenAI/compatible and Llama/Mistral/Qwen.
 * If uncertain, we omit to avoid provider errors.
 */
function modelSupportsPresencePenalty(modelId?: string): boolean {
  if (!modelId) return false;
  const id = modelId.toLowerCase();
  const providers = ["openai", "gpt", "llama", "mistral", "qwen", "dolphin", "anthropic"];
  return providers.some((p) => id.includes(p));
}
