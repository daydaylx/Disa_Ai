import { defaultRolesData } from "./roles.dataset";

export interface Role {
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

let cachedDefaultRoles: Role[] = [...defaultRolesData];
let cachedCombinedRoles: Role[] = [...defaultRolesData];

// Helper functions
export async function loadRoles(): Promise<Role[]> {
  // Lade externe Rollen aus roleStore (persona.json)
  const { fetchRoleTemplates } = await import("../config/roleStore");
  const externalRoles = await fetchRoleTemplates();

  // Konvertiere externe Rollen zu Role-Format
  const externalRolesFormatted: Role[] = externalRoles.map((role) => ({
    id: role.id,
    name: role.name,
    systemPrompt: role.system || "",
    allowedModels: role.allow,
    tags: role.tags,
    category: categorizeRole(role),
    styleHints: {
      typographyScale: 1.0,
      borderRadius: 0.5,
      accentColor: getAccentColorForRole(role),
    },
  }));

  const baseRoles = [...cachedDefaultRoles];
  const merged = new Map<string, Role>();
  for (const role of baseRoles) {
    merged.set(role.id, role);
  }
  for (const role of externalRolesFormatted) {
    if (!merged.has(role.id)) {
      merged.set(role.id, role);
    }
  }
  cachedCombinedRoles = Array.from(merged.values());
  return cachedCombinedRoles;
}

export function getRoles(): Role[] {
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

export function getRoleById(id: string): Role | undefined {
  return cachedCombinedRoles.find((p) => p.id === id);
}

export function getRolesByCategory(category: string): Role[] {
  return cachedCombinedRoles.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(
    cachedCombinedRoles.map((p) => p.category).filter((c): c is string => Boolean(c)),
  );
  return Array.from(categories);
}
