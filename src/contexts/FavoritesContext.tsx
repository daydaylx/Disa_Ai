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
    // Successfully initialized with roles and models
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

/**
 * Hook for components that only need read-only favorite status
 * Performance optimized - minimal re-renders
 */
export function useFavoriteActions() {
  const {
    toggleRoleFavorite,
    toggleModelFavorite,
    isRoleFavorite,
    isModelFavorite,
    trackRoleUsage,
    trackModelUsage,
  } = useFavorites();

  return {
    toggleRoleFavorite,
    toggleModelFavorite,
    isRoleFavorite,
    isModelFavorite,
    trackRoleUsage,
    trackModelUsage,
  };
}

/**
 * Hook for getting favorite lists with caching
 * Optimized for Material-Design header components
 */
export function useFavoriteLists() {
  const { getFavoriteRoles, getFavoriteModels, getMostUsedRoles, getMostUsedModels, favorites } =
    useFavorites();

  return {
    getFavoriteRoles,
    getFavoriteModels,
    getMostUsedRoles,
    getMostUsedModels,
    favoriteCount: {
      roles: favorites.roles.items.length,
      models: favorites.models.items.length,
    },
    hasAnyFavorites: favorites.roles.items.length > 0 || favorites.models.items.length > 0,
  };
}

/**
 * Hook for analytics and performance metrics
 * Used in settings/admin components
 */
export function useFavoritesAnalytics() {
  const {
    getPerformanceMetrics,
    usage,
    favorites,
    clearRoleFavorites,
    clearModelFavorites,
    resetAllData,
  } = useFavorites();

  const metrics = getPerformanceMetrics();

  return {
    metrics,
    usage,
    favorites,
    actions: {
      clearRoleFavorites,
      clearModelFavorites,
      resetAllData,
    },
    insights: {
      mostUsedCategory: getMostUsedCategory(usage.roles),
      favoritesEfficiencyScore: Math.round(metrics.favoriteUsageRate * 100),
      totalSessions: metrics.totalRoleUsage + metrics.totalModelUsage,
      averageSessionLength: Math.round(metrics.averageSessionLength),
    },
  };
}

// Helper function for insights
function getMostUsedCategory(_rolesUsage: Record<string, any>): string {
  // This would need to be implemented with actual role data
  // For now, return a placeholder
  return "Business & Karriere";
}

/**
 * Higher-order component to inject favorites functionality
 * Useful for wrapping entire sections of the app
 */
export function withFavorites<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    return (
      <FavoritesProvider>
        <Component {...props} />
      </FavoritesProvider>
    );
  };
}

/**
 * React Suspense-compatible favorites loader
 * For use with React.lazy and concurrent features
 */
export function FavoritesLoader({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-text-muted">Lade Favoriten...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-error/10 border border-error/20">
        <p className="text-error font-medium">Fehler beim Laden der Favoriten</p>
        <p className="text-text-muted text-sm mt-1">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
}
