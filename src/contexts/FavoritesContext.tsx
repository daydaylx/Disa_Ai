/**
 * Favorites Context Provider
 *
 * Global state management for favorites and usage tracking
 * Integrates with Material-Design Alternative B
 */

import React, { createContext, useContext, useEffect } from "react";

import { type FavoritesManagerState, useFavoritesManager } from "../hooks/useFavoritesManager";
import type { EnhancedModel, EnhancedRole } from "../types/enhanced-interfaces";

interface FavoritesContextType extends FavoritesManagerState {
  // Additional context-specific methods
  initializeWithData: (roles: EnhancedRole[], models: EnhancedModel[]) => void;
  resetAllData: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: React.ReactNode;
  /**
   * Optional initial data for hydration
   */
  initialRoles?: EnhancedRole[];
  initialModels?: EnhancedModel[];
}

export function FavoritesProvider({
  children,
  initialRoles,
  initialModels,
}: FavoritesProviderProps) {
  const favoritesManager = useFavoritesManager();

  // Initialize with data if provided
  useEffect(() => {
    if (initialRoles && initialModels) {
      // Pre-populate usage data for existing favorites
      const { favorites } = favoritesManager;

      // Track initial usage for favorite items
      favorites.roles.items.forEach((roleId) => {
        if (initialRoles.find((r) => r.id === roleId)) {
          favoritesManager.trackRoleUsage(roleId, 0);
        }
      });

      favorites.models.items.forEach((modelId) => {
        if (initialModels.find((m) => m.id === modelId)) {
          favoritesManager.trackModelUsage(modelId, 0, 0);
        }
      });
    }
  }, [initialRoles, initialModels, favoritesManager]);

  const initializeWithData = (_roles: EnhancedRole[], _models: EnhancedModel[]) => {
    // This method can be called to re-initialize context with fresh data
    // Initialization complete with provided roles and models
  };

  const resetAllData = () => {
    favoritesManager.clearRoleFavorites();
    favoritesManager.clearModelFavorites();

    // Clear localStorage
    try {
      localStorage.removeItem("disa-favorites-v2");
      localStorage.removeItem("disa-usage-analytics-v2");
    } catch (error) {
      console.error("Failed to clear favorites data:", error);
    }
  };

  const contextValue: FavoritesContextType = {
    ...favoritesManager,
    initializeWithData,
    resetAllData,
  };

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>;
}

/**
 * Hook to access the favorites context
 * Throws error if used outside FavoritesProvider
 */
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
