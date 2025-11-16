import { useEffect, useState } from "react";

import { useFavorites } from "../contexts/FavoritesContext";
import type { EnhancedRole } from "../types/enhanced-interfaces";
type Role = {
  id: string;
  name: string;
  systemPrompt: string;
  allowedModels: string[];
  tags: string[];
  category: string;
  styleHints: {
    typographyScale: number;
    borderRadius: number;
    accentColor: string;
  };
};

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
    async function loadRoles() {
      try {
        setLoading(true);
        // Fetch roles from public JSON
        void (await fetch('/data/roles.json'));
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const baseRoles: Role[] = await response.json();
        // Convert to EnhancedRole format
        const enhancedRoles = baseRoles.map(enhanceRole);

        // Update favorite status immediately after loading
        const rolesWithFavoriteStatus = enhancedRoles.map((role) => ({
          ...role,
          isFavorite: isRoleFavorite(role.id),
        }));

        setRoles(rolesWithFavoriteStatus);
        setError(null);
      } catch (err) {
        console.error("Failed to load roles:", err);
        setError(err instanceof Error ? err.message : "Roles konnten nicht geladen werden");
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, [isRoleFavorite]); // Add isRoleFavorite to dependency array so favorites are updated when they change

  const activeRole = roles.find((role) => role.isFavorite); // Assuming one favorite role is active

  const activateRole = (roleId: string) => {
    // In a full implementation, this would call favorites context to set the role as favorite
    // and track usage, but for now we just track the usage
    void trackRoleUsage(roleId);
  };

  return {
    roles,
    activeRole,
    activateRole,
    loading,
    error,
  };
}
