import type { Safety } from "./models"

export function recommendedPolicyForRole(roleId: string | null): Safety | "any" {
  switch (roleId) {
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
    case "productivity_helper":
    case "ebay_coach":
    case "language_teacher":
    case "fitness_nutrition_coach":
    case "neutral":
    default:
      return "moderate"
  }
}
