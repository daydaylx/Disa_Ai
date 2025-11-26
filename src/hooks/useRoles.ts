import { useFavorites } from "../contexts/FavoritesContext";
import { useRoles as useContextRoles } from "../contexts/RolesContext";

/**
 * Unified hook for accessing role data.
 * Now delegates to RolesContext to ensure single source of truth.
 */
export function useRoles() {
  const {
    roles,
    rolesLoading,
    roleLoadError,
    refreshRoles,
    activeRole,
    setActiveRole,
    // Re-export UI styling helpers if needed by consumers
    typographyScale,
    borderRadius,
    accentColor,
  } = useContextRoles();

  const { trackRoleUsage } = useFavorites();

  const activateRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setActiveRole(role);
      void trackRoleUsage(roleId);
    }
  };

  return {
    roles,
    activeRole,
    activateRole,
    setActiveRole,
    loading: rolesLoading,
    error: roleLoadError,
    refreshRoles,
    // Expose style hints if needed
    style: {
      typographyScale,
      borderRadius,
      accentColor,
    },
  };
}
