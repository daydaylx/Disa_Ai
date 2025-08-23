/**
 * Optional: knapper Filter, um Styles an bestimmte Modelle zu binden.
 * Returnt null = keine Einschränkung.
 */
export function ruleForStyle(styleId: string | null): { allow?: string[]; deny?: string[] } | null {
  if (!styleId) return null;
  // Beispiel: "kritisch" nur mit bestimmten IDs
  if (styleId === "kritisch") {
    return { allow: ["openrouter/auto", "mistralai/mistral-small", "meta-llama/llama-3.1-8b-instruct"] };
  }
  return null;
}

export function isModelAllowed(rule: { allow?: string[]; deny?: string[] } | null, modelId: string): boolean {
  if (!rule) return true;
  if (rule.deny && rule.deny.includes(modelId)) return false;
  if (rule.allow && !rule.allow.includes(modelId)) return false;
  return true;
}
