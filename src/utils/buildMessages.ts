import type { ChatMessage } from "@/types/chat";

function now() { return Date.now(); }
function newId() { return crypto.randomUUID?.() ?? `m_${Math.random().toString(36).slice(2)}`; }

export type BuildArgs = {
  system?: string | string[];
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  userInput?: string;
};

export function buildMessages(args: BuildArgs): ChatMessage[] {
  const out: ChatMessage[] = [];

  const sysParts: string[] = [];
  if (typeof args.system === "string" && args.system.trim()) sysParts.push(args.system.trim());
  else if (Array.isArray(args.system)) sysParts.push(...args.system.filter(Boolean).map(String));

  if (sysParts.length > 0) out.push({ id: newId(), ts: now(), role: "system", content: sysParts.join("\n\n") });

  if (Array.isArray(args.history)) {
    for (const m of args.history) {
      out.push({ id: newId(), ts: now(), role: m.role, content: m.content });
    }
  }

  if (args.userInput && args.userInput.trim()) {
    out.push({ id: newId(), ts: now(), role: "user", content: args.userInput.trim() });
  }

  return out;
}
