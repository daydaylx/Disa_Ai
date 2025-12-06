/**
 * UI-enhanced Role with additional styling and categorization.
 * Extends the base RoleTemplate from roleStore with UI-specific fields.
 */
export interface UIRole {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  allowedModels?: string[];
  tags?: string[];
  category?: string;
  styleHints: {
    typographyScale: number;
    borderRadius: number;
    accentColor: string;
  };
}

let cachedCombinedRoles: UIRole[] = [];

// Helper functions
export async function loadRoles(): Promise<UIRole[]> {
  // Lade Rollen nur aus roleStore (persona.json)
  const { fetchRoleTemplates, getRoleState } = await import("../config/roleStore");
  const externalRoles = await fetchRoleTemplates();
  const { state, error } = getRoleState();

  if (state !== "ok") {
    throw new Error(error ?? "Rollen konnten nicht geladen werden (public/persona.json)");
  }

  // Konvertiere externe Rollen zu UIRole-Format
  const rolesFormatted: UIRole[] = externalRoles.map((role) => {
    // Generate a description from the first sentence of the system prompt
    const systemPrompt = role.system || "";
    const firstSentence = systemPrompt.split(/[.!?]/)[0]?.trim() || "";
    const description =
      firstSentence.length > 0 && firstSentence.length <= 200 ? firstSentence : role.name;

    return {
      id: role.id,
      name: role.name,
      description,
      systemPrompt,
      allowedModels: role.allow,
      tags: role.tags,
      category: categorizeRole(role),
      styleHints: {
        typographyScale: 1.0,
        borderRadius: 0.5,
        accentColor: getAccentColorForRole(role),
      },
    };
  });

  cachedCombinedRoles = [STANDARD_ROLE, ...rolesFormatted];
  return cachedCombinedRoles;
}

export function getRoles(): UIRole[] {
  return cachedCombinedRoles;
}

// Kategorisiert externe Rollen basierend auf Tags/Namen
function categorizeRole(role: { name: string; tags?: string[] }): string {
  const tags = role.tags || [];
  const name = role.name.toLowerCase();

  // Erwachsene (18+) - höchste Priorität
  if (
    tags.includes("adult") ||
    tags.includes("nsfw") ||
    tags.includes("erotic") ||
    tags.includes("bdsm") ||
    tags.includes("kink") ||
    tags.includes("roleplay") ||
    name.includes("18+") ||
    name.includes("nsfw") ||
    name.includes("adult")
  ) {
    return "Erwachsene";
  }

  // Business & Karriere
  if (
    tags.includes("business") ||
    tags.includes("professional") ||
    tags.includes("career") ||
    tags.includes("job") ||
    tags.includes("planning")
  ) {
    return "Business & Karriere";
  }

  // Kreativ & Unterhaltung
  if (
    tags.includes("creative") ||
    tags.includes("art") ||
    tags.includes("music") ||
    tags.includes("entertainment") ||
    tags.includes("movies") ||
    tags.includes("series") ||
    tags.includes("literature") ||
    tags.includes("songwriting") ||
    tags.includes("design") ||
    tags.includes("photography") ||
    tags.includes("humor")
  ) {
    return "Kreativ & Unterhaltung";
  }

  // Lernen & Bildung
  if (
    tags.includes("education") ||
    tags.includes("learning") ||
    tags.includes("languages") ||
    tags.includes("communication") ||
    tags.includes("personality") ||
    tags.includes("softskills")
  ) {
    return "Lernen & Bildung";
  }

  // Leben & Familie
  if (
    tags.includes("lifestyle") ||
    tags.includes("family") ||
    tags.includes("kids") ||
    tags.includes("seniors") ||
    tags.includes("crisis") ||
    tags.includes("help") ||
    tags.includes("food") ||
    tags.includes("recipes") ||
    tags.includes("motivation") ||
    tags.includes("empathy") ||
    tags.includes("everyday")
  ) {
    return "Leben & Familie";
  }

  // Experten & Beratung
  if (
    tags.includes("expert") ||
    tags.includes("legal") ||
    tags.includes("therapy") ||
    tags.includes("health") ||
    tags.includes("fitness") ||
    tags.includes("sexuality")
  ) {
    return "Experten & Beratung";
  }

  // Alltag (Standard und praktische Helfer)
  if (
    tags.includes("standard") ||
    tags.includes("neutral") ||
    tags.includes("practical") ||
    tags.includes("sales") ||
    tags.includes("life")
  ) {
    return "Alltag";
  }

  return "Spezial";
}

// Bestimmt Akzentfarbe basierend auf Rolle
function getAccentColorForRole(role: { name: string; tags?: string[] }): string {
  const tags = role.tags || [];

  if (tags.includes("adult") || tags.includes("nsfw")) {
    return "var(--acc2)"; // Pink für Adult-Content
  }
  if (tags.includes("sexuality")) {
    return "var(--role-accent-kreativ-500)"; // Magenta für Sexualität
  }
  if (tags.includes("business")) {
    return "var(--role-accent-business-500)"; // Blau für Business
  }
  return "var(--acc1)"; // Default Blau
}

export const STANDARD_ROLE: UIRole = {
  id: "standard",
  name: "Standard",
  description: "Nutze Disa AI ohne spezielle Rolle oder Vorgabe.",
  systemPrompt: "",
  allowedModels: ["*"],
  tags: ["standard", "neutral"],
  category: "Allgemein",
  styleHints: {
    typographyScale: 1.0,
    borderRadius: 0.5,
    accentColor: "hsl(var(--primary))",
  },
};

export function getRoleById(id: string): UIRole | undefined {
  if (id === STANDARD_ROLE.id) return STANDARD_ROLE;
  return cachedCombinedRoles.find((p) => p.id === id);
}

export function getRolesByCategory(category: string): UIRole[] {
  return cachedCombinedRoles.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(
    cachedCombinedRoles.map((p) => p.category).filter((c): c is string => Boolean(c)),
  );
  return Array.from(categories);
}
