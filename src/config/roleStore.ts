import { z } from "zod";

import type { Safety } from "./models";

/** Öffentliche Typen – exakt-optional-freundlich: Property weglassen statt `undefined` setzen */
export type RoleTemplate = {
  id: string;
  name: string;
  system?: string;
  allow?: string[];
  policy?: Safety;
  styleOverlay?: string;
  tags?: string[];
};

type RoleState = "idle" | "loading" | "ok" | "missing" | "error";

const SS_KEY = "disa:roles:v2";
let _roles: RoleTemplate[] = [];
let _loaded = false;
let _loading: Promise<RoleTemplate[]> | null = null;
let _state: RoleState = "idle";
let _error: string | null = null;

/* -------------------- Validation -------------------- */

const safetySchema = z.union([
  z.literal("any"),
  z.literal("moderate"),
  z.literal("strict"),
  z.literal("loose"),
]);

const roleSchema = z.object({
  id: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(128),
  system: z.string().trim().min(1).max(4000).optional(),
  allow: z.array(z.string().trim().min(1)).optional(),
  policy: safetySchema.optional(),
  styleOverlay: z.string().trim().min(1).max(128).optional(),
  tags: z.array(z.string().trim().min(1).max(32)).optional(),
});
const rolesSchema = z.array(roleSchema);

/* Entfernt `undefined`-Properties aus optionalen Feldern (für exactOptionalPropertyTypes) */
function sanitize(list: z.infer<typeof rolesSchema>): RoleTemplate[] {
  return list.map((r) => ({
    id: r.id,
    name: r.name,
    ...(r.system !== undefined ? { system: r.system } : {}),
    ...(r.allow !== undefined ? { allow: r.allow } : {}),
    ...(r.policy !== undefined ? { policy: r.policy } : {}),
    ...(r.styleOverlay !== undefined ? { styleOverlay: r.styleOverlay } : {}),
    ...(r.tags !== undefined ? { tags: r.tags } : {}),
  }));
}

/* -------------------- Cache -------------------- */

function loadCache(): RoleTemplate[] | null {
  try {
    const raw = localStorage.getItem(SS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const ok = rolesSchema.safeParse(parsed);
    return ok.success ? sanitize(ok.data) : null;
  } catch {
    return null;
  }
}
function saveCache(list: RoleTemplate[]): void {
  try {
    localStorage.setItem(SS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

/* -------------------- Fetch helpers -------------------- */

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(url, {
    cache: "no-store",
    ...(signal ? { signal } : {}),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
  return await res.json();
}

async function tryLoadRoles(signal?: AbortSignal): Promise<RoleTemplate[] | null> {
  const candidates = ["/styles.json", "/persona.json", "/roles.json"];
  for (const url of candidates) {
    try {
      const data = await fetchJson(url, signal);
      if (!data) continue;
      const arr = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>)["styles"])
          ? ((data as Record<string, unknown>)["styles"] as unknown[])
          : null;
      if (!arr) continue;
      const parsed = rolesSchema.safeParse(arr);
      if (parsed.success) return sanitize(parsed.data);
    } catch {
      // next candidate
    }
  }
  return null;
}

/* -------------------- Public API -------------------- */

export function getRoleTemplates(): RoleTemplate[] {
  return _roles;
}
export function getRoleState(): { state: RoleState; error: string | null } {
  return { state: _state, error: _error };
}
/* Kompatibilitäts-Exporte für bestehenden Code */
export function listRoleTemplates(): RoleTemplate[] {
  return getRoleTemplates();
}
export function getRoleLoadStatus(): { state: RoleState; error: string | null } {
  return getRoleState();
}

export async function fetchRoleTemplates(
  force = false,
  signal?: AbortSignal,
): Promise<RoleTemplate[]> {
  if (_loaded && !force) return _roles;
  if (_loading && !force) return _loading;

  const cached = !force ? loadCache() : null;
  if (cached) {
    _roles = cached;
    _loaded = true;
    _state = "ok";
    _error = null;
    return _roles;
  }

  _state = "loading";
  _error = null;
  _loading = (async () => {
    try {
      const list = await tryLoadRoles(signal);
      if (!list) {
        _roles = [];
        _loaded = true;
        _state = "missing";
        _error = "styles.json nicht gefunden oder ungültig (public/styles.json)";
        return _roles;
      }
      _roles = list;
      _loaded = true;
      _state = "ok";
      _error = null;
      saveCache(_roles);
      return _roles;
    } catch (e) {
      _roles = [];
      _loaded = true;
      _state = "error";
      _error = e instanceof Error ? e.message : String(e);
      return _roles;
    } finally {
      _loading = null;
    }
  })();
  return _loading;
}

export function getRoleById(id: string | null | undefined): RoleTemplate | undefined {
  const needle = (id ?? "").trim().toLowerCase();
  if (!needle) return undefined;
  return _roles.find((r) => r.id.toLowerCase() === needle);
}
