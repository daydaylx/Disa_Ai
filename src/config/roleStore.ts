import type { PolicyFromRole } from "@/types/safety";

import { loadStyleConfig } from "./style";

export type RoleTemplate = {
  id: string; // Rollenname (Key in style.json)
  name: string; // Anzeigename (identisch mit id, sofern nicht erweitert)
  policy: PolicyFromRole;
  systemPrompt?: string;
};

/** Lädt alle Rollen aus style.json und mappt sie auf RoleTemplate[] */
export async function fetchRoleTemplates(): Promise<RoleTemplate[]> {
  const cfg = await loadStyleConfig();
  const out: RoleTemplate[] = [];
  for (const [id, entry] of Object.entries(cfg.roles)) {
    out.push({
      id,
      name: id,
      policy: entry.policy,
      ...(entry.systemPrompt ? { systemPrompt: entry.systemPrompt } : {}),
    });
  }
  return out;
}

/** Alias – hält Interface zu Altcode stabil */
export async function listRoleTemplates(): Promise<RoleTemplate[]> {
  return fetchRoleTemplates();
}

/** Liefert eine Rolle per ID oder null */
export async function getRoleById(id: string): Promise<RoleTemplate | null> {
  const cfg = await loadStyleConfig();
  const entry = cfg.roles[id];
  if (!entry) return null;
  return {
    id,
    name: id,
    policy: entry.policy,
    ...(entry.systemPrompt ? { systemPrompt: entry.systemPrompt } : {}),
  };
}
