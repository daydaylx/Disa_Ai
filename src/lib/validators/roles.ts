export type SafetyLevel = "any" | "moderate" | "strict" | "loose";

export interface Role {
  id: string;
  name: string;
  system?: string;
  allow?: string[];
  policy?: SafetyLevel;
  styleOverlay?: string;
  tags?: string[];
}

const SAFETY_LEVELS = new Set<SafetyLevel>(["any", "moderate", "strict", "loose"]);

function isTrimmedString(value: unknown, min: number, max: number): value is string {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function normalizeStringArray(value: unknown, maxLength: number): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .filter((item) => item.length <= maxLength);
  return normalized.length > 0 ? normalized : undefined;
}

function coerceRole(entry: unknown): Role | null {
  if (typeof entry !== "object" || entry === null) return null;
  const candidate = entry as Record<string, unknown>;

  if (!isTrimmedString(candidate.id, 1, 64) || !isTrimmedString(candidate.name, 1, 128)) {
    return null;
  }

  const role: Role = {
    id: candidate.id.trim(),
    name: candidate.name.trim(),
  };

  if (isTrimmedString(candidate.system, 1, 4000)) {
    role.system = candidate.system.trim();
  }
  const allow = normalizeStringArray(candidate.allow, 64);
  if (allow) {
    role.allow = allow;
  }
  if (typeof candidate.policy === "string" && SAFETY_LEVELS.has(candidate.policy as SafetyLevel)) {
    role.policy = candidate.policy as SafetyLevel;
  }
  if (isTrimmedString(candidate.styleOverlay, 1, 128)) {
    role.styleOverlay = candidate.styleOverlay.trim();
  }
  const tags = normalizeStringArray(candidate.tags, 32);
  if (tags) {
    role.tags = tags;
  }

  return role;
}

export function parseRolesStrict(raw: unknown): Role[] | null {
  if (!Array.isArray(raw)) return null;
  const roles: Role[] = [];
  for (const entry of raw) {
    const parsed = coerceRole(entry);
    if (!parsed) {
      return null;
    }
    roles.push(parsed);
  }
  return roles;
}

export function parseRoles(raw: unknown): Role[] {
  const strict = parseRolesStrict(raw);
  if (strict) {
    return strict;
  }
  if (!Array.isArray(raw)) return [];
  const roles: Role[] = [];
  for (const entry of raw) {
    const parsed = coerceRole(entry);
    if (parsed) roles.push(parsed);
  }
  return roles;
}
