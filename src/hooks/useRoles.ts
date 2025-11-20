import { useEffect, useState } from "react";

import { useFavorites } from "../contexts/FavoritesContext";
import type { Role } from "../data/roles";
import { loadRoles as loadRolesFromJson } from "../data/roles";
import type { EnhancedRole } from "../types/enhanced-interfaces";

// Convert a Role to EnhancedRole
function enhanceRole(role: Role): EnhancedRole {
  return {
    id: role.id,
    name: role.name,
    systemPrompt: role.systemPrompt,
    allowedModels: role.allowedModels || [],
    tags: role.tags || [],
    category: role.category || "Spezial",
    styleHints: role.styleHints,
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
        // Use the correct loadRoles function from data/roles.ts
        // which loads from persona.json via roleStore
        const baseRoles: Role[] = await loadRolesFromJson();

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

    void loadRoles();
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
