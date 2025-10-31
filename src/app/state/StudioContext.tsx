import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import type { Role } from "../../data/roles";
import { getRoles, loadRoles } from "../../data/roles";

interface StudioContextType {
  roles: Role[];
  rolesLoading: boolean;
  roleLoadError: string | null;
  refreshRoles: () => Promise<void>;
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
  const [roles, setRoles] = useState<Role[]>(() => getRoles());
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleLoadError, setRoleLoadError] = useState<string | null>(null);
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const [typographyScale, setTypographyScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(0.5);
  const [accentColor, setAccentColor] = useState("hsl(var(--primary))");

  const refreshRoles = useCallback(async () => {
    setRolesLoading(true);
    setRoleLoadError(null);
    try {
      const loadedRoles = await loadRoles();
      setRoles(loadedRoles);
    } catch (error) {
      console.error("Rollen konnten nicht geladen werden.", error);
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler beim Laden der Rollen.";
      setRoleLoadError(message);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshRoles();
  }, [refreshRoles]);

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
    rolesLoading,
    roleLoadError,
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
