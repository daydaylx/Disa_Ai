import type { ChatMessage } from "@/lib/types";

/**
 * Baut eine kompakte Nachrichtenliste fürs Modell:
 * - optionales System-Prompt als erste Nachricht
 * - dann so viele historische Nachrichten (vom Ende), bis maxChars erreicht
 * - einfache, robuste Heuristik auf Zeichenbasis -> schnell & stabil
 */
export function buildPromptMessages(
  history: Array<Pick<ChatMessage, "role" | "content">>,
  options?: { system?: string; maxChars?: number }
): ChatMessage[] {
  const maxChars = options?.maxChars ?? 12000;

  const out: ChatMessage[] = [];
  let budget = maxChars;

  const pushSafe = (msg: Pick<ChatMessage, "role" | "content">) => {
    const estimated = (msg.content?.length ?? 0) + 32; // kleine Marge
    if (estimated <= budget) {
      out.unshift({ role: msg.role, content: msg.content });
      budget -= estimated;
      return true;
    }
    return false;
  };

  // sammle vom Ende (neueste zuerst) rückwärts
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i];
    if (!m || !m.content) continue;
    if (!pushSafe(m)) break;
  }

  // optionales System prompt vorn anfügen (falls noch Budget)
  if (options?.system) {
    const sys = { role: "system" as const, content: options.system };
    const estimated = sys.content.length + 32;
    if (estimated <= maxChars) {
      // System muss an den Anfang (Index 0)
      out.unshift(sys);
    }
  }

  return out;
}
