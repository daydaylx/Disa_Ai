import { useCallback, useEffect, useMemo, useState } from "react";

import type { PolicyFromRole } from "@/types/safety";
import { swrGet, swrSet } from "@/utils/swrCache";

export type RoleEntry = {
  policy: PolicyFromRole;
  systemPrompt?: string;
};

export type StyleConfig = {
  version: number;
  defaultRole: string;
  roles: Record<string, RoleEntry>;
};

const PUBLIC_STYLE_URL = "/style.json";
const STYLE_CACHE_KEY = "disa:style:cfg:v1";
const ROLE_STORAGE_KEY = "disa:role:name";
const DEFAULT_MAX_AGE_MS = 10 * 60 * 1000;

const FALLBACK_STYLE: StyleConfig = {
  version: 1,
  defaultRole: "nocensor",
  roles: {
    nocensor: { policy: "any", systemPrompt: "Be direct. Do not add moralizing prefaces." },
    balanced: { policy: "medium" },
    strict: { policy: "high" },
  },
};

async function fetchWithTimeout(url: string, timeoutMs = 8_000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "Cache-Control": "no-cache" } });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchStyleJson(timeoutMs = 8_000): Promise<StyleConfig> {
  try {
    const res = await fetchWithTimeout(PUBLIC_STYLE_URL, timeoutMs);
    if (!res.ok) throw new Error(`style.json responded ${res.status}`);
    const raw = (await res.json()) as Partial<StyleConfig>;
    const roles = raw.roles && typeof raw.roles === "object" ? raw.roles : {};
    const version = typeof raw.version === "number" ? raw.version : 1;
    const defaultRole =
      typeof raw.defaultRole === "string" && raw.defaultRole in roles
        ? raw.defaultRole
        : (Object.keys(roles)[0] ?? FALLBACK_STYLE.defaultRole);

    const merged: StyleConfig = {
      version,
      defaultRole,
      roles:
        Object.keys(roles).length > 0 ? (roles as Record<string, RoleEntry>) : FALLBACK_STYLE.roles,
    };
    return merged;
  } catch {
    return FALLBACK_STYLE;
  }
}

export async function loadStyleConfig(maxAgeMs = DEFAULT_MAX_AGE_MS): Promise<StyleConfig> {
  const cached = swrGet<StyleConfig>(STYLE_CACHE_KEY, maxAgeMs, "local");
  if (cached.fresh && cached.value) return cached.value;
  const fresh = await fetchStyleJson();
  swrSet(STYLE_CACHE_KEY, fresh, "local");
  return fresh;
}

export function getDefaultRole(cfg: StyleConfig): string {
  if (cfg.defaultRole && cfg.roles[cfg.defaultRole]) return cfg.defaultRole;
  const first = Object.keys(cfg.roles)[0];
  return first ?? FALLBACK_STYLE.defaultRole;
}

export function getPolicyForRole(
  cfg: StyleConfig,
  roleName?: string | null,
): PolicyFromRole | undefined {
  const name = roleName && cfg.roles[roleName] ? roleName : getDefaultRole(cfg);
  const entry = cfg.roles[name];
  return entry?.policy;
}

export type UseStyle = {
  style: StyleConfig;
  role: string;
  setRole: (next: string) => void;
  policyFromRole?: PolicyFromRole;
  refreshStyle: () => Promise<void>;
};

export function useStyle(maxAgeMs = DEFAULT_MAX_AGE_MS): UseStyle {
  const [style, setStyle] = useState<StyleConfig>(FALLBACK_STYLE);
  const [role, _setRole] = useState<string>(() => {
    if (typeof window === "undefined") return FALLBACK_STYLE.defaultRole;
    const saved = window.localStorage.getItem(ROLE_STORAGE_KEY);
    return saved && saved.trim() ? saved : FALLBACK_STYLE.defaultRole;
  });

  const policyFromRole = useMemo(() => getPolicyForRole(style, role), [style, role]);

  const setRole = useCallback((next: string) => {
    _setRole(next);
    if (typeof window !== "undefined") window.localStorage.setItem(ROLE_STORAGE_KEY, next);
  }, []);

  const refreshStyle = useCallback(async () => {
    const cfg = await loadStyleConfig(maxAgeMs);
    setStyle(cfg);
    if (!cfg.roles[role]) setRole(getDefaultRole(cfg));
  }, [maxAgeMs, role, setRole]);

  useEffect(() => {
    void refreshStyle(); /* on mount */
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    style,
    role,
    setRole,
    ...(policyFromRole !== undefined ? { policyFromRole } : {}),
    refreshStyle,
  };
}
