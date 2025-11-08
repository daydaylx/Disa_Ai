import React, { createContext, useCallback, useContext, useState } from "react";

import type { Role } from "../../data/roles";
import { getRoles, loadRoles } from "../../data/roles";
import { useDeferredCachedFetch } from "../../hooks/useDeferredFetch";

interface StudioContextType {
  roles: Role[];
  rolesLoading: boolean;
  roleLoadError: string | null;
  refreshRoles: () => void;
  activeRole: Role | null;
  setActiveRole: (role: Role | null) => void;
  typographyScale: number;
  setTypographyScale: (scale: number) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const [typographyScale, setTypographyScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0.5);
  const [accentColor, setAccentColor] = useState("hsl(var(--primary))");

  // Check if roles are cached (from default data)
  const checkCachedRoles = useCallback(() => {
    const cached = getRoles();
    return cached.length > 0 ? cached : null;
  }, []);

  // Deferred fetch for external roles with immediate loading if cached
  const {
    data: loadedRoles,
    loading: rolesLoading,
    error: roleLoadError,
    trigger: refreshRoles,
  } = useDeferredCachedFetch(loadRoles, checkCachedRoles, []);

  // Use loaded roles or fall back to cached default roles
  const roles = loadedRoles || getRoles();

  const setActiveRole = useCallback(
    (role: Role | null) => {
      setActiveRoleState(role);

      if (!role) {
        setTypographyScale(1);
        setBorderRadius(0.5);
        // Behalte accentColor bei Rolle-Zurücksetzen bei, um globale Farbänderungen zu vermeiden
        // setAccentColor("hsl(var(--primary))");
        return;
      }

      const { typographyScale: scale, borderRadius: radius } = role.styleHints;
      setTypographyScale(scale ?? 1);
      setBorderRadius(radius ?? 0.5);
      // Aktualisiere accentColor nicht automatisch bei Rollen-Auswahl, um ungewollte globale Farbänderungen zu vermeiden
      // setAccentColor(color ?? "hsl(var(--primary))");
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

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};

export function useStudio() {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
