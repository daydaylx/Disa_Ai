import { buildSystemPrompt, type StyleKey } from "../config/promptStyles"
import { getRoleById } from "../config/promptTemplates"
import { generateRoleStyleText } from "../config/styleEngine"

export type OpenRouterMessage = { role: "system" | "user" | "assistant"; content: string }

export function buildSystemFromSettings(opts: { nsfw: boolean; style: StyleKey; roleTemplateId?: string | null; useRoleStyle?: boolean; locale?: "de-DE" | "de"; memory?: string | null }): string {
  const base = buildSystemPrompt({ nsfw: opts.nsfw, style: opts.style, locale: "de-DE" })
  const role = (opts.roleTemplateId ? getRoleById(opts.roleTemplateId)?.system : "") ?? ""
  const roleStyle = generateRoleStyleText(opts.roleTemplateId ?? null, opts.style, opts.useRoleStyle ?? true)
  const mem = opts.memory && opts.memory.trim().length > 0 ? `Kontext: ${opts.memory.trim()}` : ""
  return [role, base, roleStyle, mem].filter(Boolean).join("\n\n")
}

export function buildMessages(args: { userInput: string; history?: OpenRouterMessage[]; nsfw: boolean; style: StyleKey; roleTemplateId?: string | null; useRoleStyle?: boolean; locale?: "de-DE" | "de"; memory?: string | null }): OpenRouterMessage[] {
  const system = buildSystemFromSettings({
    nsfw: args.nsfw,
    style: args.style,
    roleTemplateId: args.roleTemplateId ?? null,
    useRoleStyle: args.useRoleStyle ?? true,
    locale: args.locale ?? "de-DE",
    memory: args.memory ?? null
  })
  const out: OpenRouterMessage[] = []
  out.push({ role: "system", content: system })
  if (Array.isArray(args.history) && args.history.length > 0) out.push(...args.history.filter(m => m.role !== "system"))
  out.push({ role: "user", content: args.userInput })
  return out
}
