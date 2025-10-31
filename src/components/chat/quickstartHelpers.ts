import type { QuickstartAction } from "../../config/quickstarts";
import { getRoles } from "../../data/roles";

export function formatQuickstartTag(tag: string): string {
  const normalised = tag.replace(/[-_]/g, " ").trim();
  if (!normalised) {
    return "Schnellstart";
  }
  return normalised.charAt(0).toUpperCase() + normalised.slice(1);
}

export function createRoleQuickstarts(): QuickstartAction[] {
  const roles = getRoles();
  if (roles.length === 0) return [];

  return [...roles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((role) => ({
      id: `role-${role.id}`,
      title: role.name,
      subtitle: role.description ?? "Aktiviere diese Chat-Rolle und starte mit einer ersten Frage.",
      gradient: "from-brand/20 via-brand/0 to-brand/5",
      flowId: `role.${role.id}`,
      autosend: false,
      persona: role.id,
      prompt: `Starte ein Gespräch als ${role.name}.`,
      tags: role.tags,
    }));
}
