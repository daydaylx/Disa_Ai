import type { ChatMessage } from "../types/chat";
import { totalTokens } from "../utils/tokens";

/**
 * Kontextverwaltung ohne Fremdpakete:
 * - harte Token-Grenze pro Modell
 * - Antwortbudget-Reserve
 * - deterministische "Mitte"-Kompression
 */
export class ContextManager {
  private maxTokens: number;
  private reservedTokens: number;

  constructor(opts: { maxTokens?: number; reservedTokens?: number } = {}) {
    this.maxTokens = opts.maxTokens && opts.maxTokens > 0 ? opts.maxTokens : 4000;
    this.reservedTokens = Math.max(256, opts.reservedTokens ?? 1000);
  }

  setLimits(maxTokens: number, reservedTokens = this.reservedTokens): void {
    if (maxTokens > 0) this.maxTokens = maxTokens;
    this.reservedTokens = Math.max(128, reservedTokens);
  }

  optimize(messages: ChatMessage[]): ChatMessage[] {
    if (messages.length === 0) return messages;
    const budget = this.maxTokens - this.reservedTokens;
    if (budget <= 0) return messages.slice(-6);

    const first = messages[0]?.role === "system" ? [messages[0]] : [];
    const rest = messages[0]?.role === "system" ? messages.slice(1) : messages.slice();

    if (totalTokens(messages) <= budget) return messages;

    if (rest.length <= 10) {
      return this.trimTail(first, rest, budget);
    }

    const keepStart = rest.slice(0, 3);
    const keepEnd = rest.slice(-5);
    const middle = rest.slice(3, -5);
    const summary = this.compressDeterministic(middle);

    const candidate: ChatMessage[] = [...first, ...keepStart, summary, ...keepEnd];

    let guard = 0;
    while (totalTokens(candidate) > budget && guard < 10) {
      if (keepStart.length > 0) keepStart.pop();
      else if (keepEnd.length > 0) keepEnd.shift();
      else break;
      const next = [...first, ...keepStart, summary, ...keepEnd];
      candidate.splice(0, candidate.length, ...next);
      guard++;
    }

    return this.enforceBudget(candidate, budget);
  }

  private trimTail(first: ChatMessage[], rest: ChatMessage[], budget: number): ChatMessage[] {
    const out = [...first, ...rest];
    while (out.length > 1 && totalTokens(out) > budget) {
      const idx = first.length;
      out.splice(idx, 1);
    }
    return out;
  }

  private enforceBudget(msgs: ChatMessage[], budget: number): ChatMessage[] {
    const out = [...msgs];
    while (out.length > 1 && totalTokens(out) > budget) {
      const hasSystem = out[0]?.role === "system";
      const idx = hasSystem ? 1 : 0;
      out.splice(idx, 1);
    }
    return out;
  }

  private compressDeterministic(middle: ChatMessage[]): ChatMessage {
    const joined = middle
      .map((m) => `${m.role}: ${m.content.replace(/\s+/g, " ").trim()}`)
      .join("\n");
    const cap = 1200;
    const text = joined.length > cap ? `${joined.slice(0, cap)} …` : joined;
    const summary = `Zusammenfassung bisheriger Nachrichten:\n${text}`;
    return { role: "system", content: summary };
  }
}
