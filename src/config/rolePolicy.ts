import type { Safety } from "./models"
import { getRoleById } from "./promptTemplates"

export function recommendedPolicyForRole(roleId: string | null): Safety | "any" {
  const r = getRoleById(roleId)
  if (r?.policy === "strict" || r?.policy === "moderate" || r?.policy === "loose") return r.policy
  switch (r?.id ?? "") {
    case "legal_generalist":
    case "therapist_expert":
    case "email_professional":
      return "strict"
    case "uncensored_expert":
    case "nsfw_roleplay":
    case "erotic_creative_author":
      return "loose"
    case "sarcastic_direct":
      return "moderate"
    default:
      return "moderate"
  }
}
