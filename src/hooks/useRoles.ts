import { useEffect, useState } from "react";

import { useFavorites } from "../contexts/FavoritesContext";
import { getRoles, type Role } from "../data/roles";
import type { EnhancedRole } from "../types/enhanced-interfaces";

// Convert a Role to EnhancedRole
function enhanceRole(role: Role): EnhancedRole {
  return {
    ...role,
    isFavorite: false, // Will be updated by favorites context
    lastUsed: null,
    usage: {
      count: 0,
      lastAccess: null,
      averageSessionLength: 0,
    },
    performance: {
      priority: "medium",
      estimatedLoadTime: 100,
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: "1.0.0",
      author: "system",
      isBuiltIn: true,
    },
  };
}

export function useRoles() {
  const [roles, setRoles] = useState<EnhancedRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isRoleFavorite, trackRoleUsage } = useFavorites();

  useEffect(() => {
    function loadRoles() {
      try {
        setLoading(true);
        // Get base roles from the data layer
        const baseRoles = getRoles();
        // Convert to EnhancedRole format
        const enhancedRoles = baseRoles.map(enhanceRole);
        setRoles(enhancedRoles);
        setError(null);
      } catch (err) {
        console.error("Failed to load roles:", err);
        setError(err instanceof Error ? err.message : "Roles konnten nicht geladen werden");
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  // Update favorite status based on favorites context
  useEffect(() => {
    if (roles.length > 0) {
      const updatedRoles = roles.map((role) => ({
        ...role,
        isFavorite: isRoleFavorite(role.id),
      }));
      setRoles(updatedRoles);
    }
  }, [isRoleFavorite, roles]);

  const activeRole = roles.find((role) => role.isFavorite); // Assuming one favorite role is active

  const activateRole = (roleId: string) => {
    // In a full implementation, this would call favorites context to set the role as favorite
    // and track usage, but for now we just track the usage
    trackRoleUsage(roleId);
  };

  return {
    roles,
    activeRole,
    activateRole,
    loading,
    error,
  };
}
