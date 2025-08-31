export function redactApiKey(text: string): string {
  // simple Heuristik für OpenRouter-Keys (sk-or-*)
  return text.replaceAll(/sk-or-[a-z0-9_-]{8,}/gi, "sk-or-REDACTED");
}
