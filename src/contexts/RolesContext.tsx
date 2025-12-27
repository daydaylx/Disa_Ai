import React, { createContext, useCallback, useContext, useState } from "react";

import { STORAGE_KEYS } from "../config/storageKeys";
import type { UIRole } from "../data/roles";
import { getRoles, loadRoles, STANDARD_ROLE } from "../data/roles";
import { useDeferredFetch } from "../hooks/useDeferredFetch";

const LS_ACTIVE_ROLE_KEY = STORAGE_KEYS.ACTIVE_ROLE; // For backward compatibility

interface RolesContextType {
  roles: UIRole[];
  rolesLoading: boolean;
  roleLoadError: string | null;
  refreshRoles: () => void;
  activeRole: UIRole | null;
  setActiveRole: (role: UIRole | null) => void;
  typographyScale: number;
  setTypographyScale: (scale: number) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export const RolesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UIRole>(STANDARD_ROLE);
  const [typographyScale, setTypographyScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0.5);
  const [accentColor, setAccentColor] = useState("hsl(var(--primary))");
  const hasHydrated = React.useRef(false);

  // Load roles immediately from persona.json
  // IMPORTANT: immediate: true ensures roles are loaded on app start
  const {
    data: loadedRoles,
    loading: rolesLoading,
    error: roleLoadError,
    trigger: refreshRoles,
  } = useDeferredFetch({
    fetchFn: loadRoles,
    immediate: true, // Always load immediately
    maxDelay: 1000,
    triggerEvents: ["focus", "click"],
    deps: [],
  });

  // Use loaded roles or fall back to cached default roles
  const roles = loadedRoles || getRoles();

  // Hydrate active role from localStorage once roles are available
  // IMPORTANT: Only hydrate once to prevent resetting state on navigation
  React.useEffect(() => {
    if (!roles.length || hasHydrated.current) return;

    const stored = (() => {
      try {
        return localStorage.getItem(LS_ACTIVE_ROLE_KEY);
      } catch {
        return null;
      }
    })();

    if (stored) {
      const match = roles.find((r) => r.id === stored);
      if (match) {
        setActiveRoleState(match);
        const { typographyScale: scale, borderRadius: radius } = match.styleHints;
        setTypographyScale(scale ?? 1);
        setBorderRadius(radius ?? 0.5);
      }
    } else {
      setActiveRoleState(STANDARD_ROLE);
    }

    hasHydrated.current = true;
  }, [roles]);

  const setActiveRole = useCallback(
    (role: UIRole | null) => {
      const targetRole = role || STANDARD_ROLE;
      setActiveRoleState(targetRole);

      const { typographyScale: scale, borderRadius: radius } = targetRole.styleHints;
      setTypographyScale(scale ?? 1);
      setBorderRadius(radius ?? 0.5);

      try {
        if (targetRole.id === STANDARD_ROLE.id) {
          localStorage.removeItem(LS_ACTIVE_ROLE_KEY);
        } else {
          localStorage.setItem(LS_ACTIVE_ROLE_KEY, targetRole.id);
        }
      } catch {
        /* ignore */
      }
    },
    [setBorderRadius, setTypographyScale],
  );

  const value = {
    roles,
    rolesLoading: rolesLoading ?? false,
    roleLoadError: roleLoadError ?? null,
    refreshRoles,
    activeRole,
    setActiveRole,
    typographyScale,
    setTypographyScale,
    borderRadius,
    setBorderRadius,
    accentColor,
    setAccentColor,
  };

  return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
};

export function useRoles() {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
}
