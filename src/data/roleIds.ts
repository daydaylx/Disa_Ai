export const ROLE_IDS = {
  LEGAL_GENERALIST: "legal_generalist",
  THERAPIST_EXPERT: "therapist_expert",
  EMAIL_PROFESSIONAL: "email_professional",
  UNCENSORED_EXPERT: "uncensored_expert",
  NSFW_ROLEPLAY: "nsfw_roleplay",
  EROTIC_CREATIVE_AUTHOR: "erotic_creative_author",
  SARCASTIC_DIRECT: "sarcastic_direct",
} as const;

export type RoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS];

const ROLE_ID_SET = new Set<string>(Object.values(ROLE_IDS));

export function isKnownRoleId(value: string | null | undefined): value is RoleId {
  if (!value) return false;
  return ROLE_ID_SET.has(value);
}
