import { isKnownRoleId, ROLE_IDS, type RoleId } from "../data/roleIds";
import type { Safety } from "./models";
import { getRoleById } from "./promptTemplates";

const FALLBACK_POLICIES: Record<RoleId, Exclude<Safety, "any">> = {
  [ROLE_IDS.LEGAL_GENERALIST]: "strict",
  [ROLE_IDS.THERAPIST_EXPERT]: "strict",
  [ROLE_IDS.EMAIL_PROFESSIONAL]: "strict",
  [ROLE_IDS.UNCENSORED_EXPERT]: "loose",
  [ROLE_IDS.NSFW_ROLEPLAY]: "loose",
  [ROLE_IDS.EROTIC_CREATIVE_AUTHOR]: "loose",
  [ROLE_IDS.SARCASTIC_DIRECT]: "moderate",
};

export function recommendedPolicyForRole(roleId: string | null): Safety | "any" {
  const r = getRoleById(roleId);
  if (r?.policy === "strict" || r?.policy === "moderate" || r?.policy === "loose") return r.policy;

  const fallbackKey: RoleId | null = (() => {
    if (r?.id && isKnownRoleId(r.id)) return r.id;
    if (isKnownRoleId(roleId)) return roleId;
    return null;
  })();

  if (fallbackKey) {
    const policy = FALLBACK_POLICIES[fallbackKey];
    if (policy) return policy;
  }

  return "moderate";
}
