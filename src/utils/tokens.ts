/**
 * Grobe Token-Schätzung: ~4 Zeichen pro Token.
 * Deterministisch, schnell, ohne Fremdpakete.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  const len = text.replace(/\r\n/g, "\n").length;
  return Math.max(1, Math.ceil(len / 4));
}

export function countMessageTokens(role: string, content: string): number {
  const base = estimateTokens(content);
  const roleOverhead = 2;
  return base + roleOverhead;
}

export function totalTokens(messages: { role: string; content: string }[]): number {
  return messages.reduce((sum, m) => sum + countMessageTokens(m.role, m.content), 0);
}
