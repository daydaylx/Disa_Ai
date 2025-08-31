import type { ChatMessage } from "@/types/chat";
import { getRoleById } from "@/config/roleStore";

export type BuildOptions = {
  roleTemplateId?: string;
  systemPrefix?: string;
  history?: ChatMessage[];
  userInput?: string;
};

/** Baut einen System-Prompt aus (optional) Prefix + RoleTemplate.systemPrompt */
export async function buildSystemPrompt(opts: BuildOptions = {}): Promise<string> {
  const tpl = opts.roleTemplateId ? await getRoleById(opts.roleTemplateId) : null;
  const parts: string[] = [];
  if (opts.systemPrefix) parts.push(opts.systemPrefix);
  if (tpl?.systemPrompt) parts.push(tpl.systemPrompt);
  return parts.join("\n\n");
}
