import type { ChatMessage } from "../types/chat";

/**
 * Baut ein gültiges messages-Array für OpenRouter/OpenAI:
 * - exakt **eine** System-Nachricht am Anfang (falls vorhanden)
 * - optionalen Memory-Block in die System-Nachricht integriert
 * - keine weiteren system-Nachrichten aus dem Verlauf
 * - leere Inhalte werden entfernt
 */
export function buildMessages(args: {
  systemText?: string;
  memory?: string;
  history?: ChatMessage[]; // ohne system
  userInput?: string;
}): ChatMessage[] {
  const out: ChatMessage[] = [];

  const sysBase = (args.systemText ?? "").trim();
  const mem = (args.memory ?? "").trim();
  const sysParts: string[] = [];
  if (sysBase.length > 0) sysParts.push(sysBase);
  if (mem.length > 0) sysParts.push(`### Gesprächs-Kontext\n${mem}`);
  if (sysParts.length > 0) out.push({ role: "system", content: sysParts.join("\n\n") });

  const hist = Array.isArray(args.history) ? args.history : [];
  for (const m of hist) {
    if (!m || !m.content || !m.content.trim()) continue;
    if (m.role === "system") continue;
    out.push({ role: m.role, content: m.content });
  }

  if (args.userInput && args.userInput.trim()) {
    out.push({ role: "user", content: args.userInput.trim() });
  }

  return out;
}
