/**
 * Favorites Manager Hook
 *
 * Performance-First favorites system with localStorage persistence
 * Optimized for Material-Design Alternative B (Dense Information)
 */

import { useCallback, useEffect, useState } from "react";

import type {
  EnhancedModel,
  EnhancedRole,
  FavoritesState,
  UsageAnalytics,
} from "../types/enhanced-interfaces";

const STORAGE_KEYS = {
  FAVORITES: "disa-favorites-v2",
  USAGE_ANALYTICS: "disa-usage-analytics-v2",
} as const;

const MAX_FAVORITES = {
  ROLES: 6, // Top 6 visible in Material-Design header
  MODELS: 8, // Top 8 for quick access
} as const;

export interface FavoritesManagerState {
  // Core favorites data
  favorites: FavoritesState;
  usage: UsageAnalytics;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  toggleRoleFavorite: (roleId: string) => void;
  toggleModelFavorite: (modelId: string) => void;
  clearRoleFavorites: () => void;
  clearModelFavorites: () => void;

  // Usage tracking
  trackRoleUsage: (roleId: string, sessionLength?: number) => void;
  trackModelUsage: (modelId: string, tokensUsed?: number, cost?: number) => void;

  // Query helpers (performance optimized)
  isRoleFavorite: (roleId: string) => boolean;
  isModelFavorite: (modelId: string) => boolean;
  getFavoriteRoles: (allRoles: EnhancedRole[]) => EnhancedRole[];
  getFavoriteModels: (allModels: EnhancedModel[]) => EnhancedModel[];
  getMostUsedRoles: (allRoles: EnhancedRole[], limit?: number) => EnhancedRole[];
  getMostUsedModels: (allModels: EnhancedModel[], limit?: number) => EnhancedModel[];

  // Performance metrics
  getPerformanceMetrics: () => {
    totalRoleUsage: number;
    totalModelUsage: number;
    favoriteUsageRate: number;
    averageSessionLength: number;
  };
}

/**
 * Main Favorites Manager Hook
 * Provides complete favorites and usage tracking functionality
 */
export function useFavoritesManager(): FavoritesManagerState {
  const [favorites, setFavorites] = useState<FavoritesState>(() => loadFavorites());
  const [usage, setUsage] = useState<UsageAnalytics>(() => loadUsageAnalytics());
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      setError(null);
    } catch (err) {
      console.error("Failed to save favorites:", err);
      setError("Favoriten konnten nicht gespeichert werden");
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USAGE_ANALYTICS, JSON.stringify(usage));
      setError(null);
    } catch (err) {
      console.error("Failed to save usage analytics:", err);
      setError("Nutzungsstatistiken konnten nicht gespeichert werden");
    }
  }, [usage]);

  // ========================================================================
  // FAVORITES MANAGEMENT
  // ========================================================================

  const toggleRoleFavorite = useCallback((roleId: string) => {
    setFavorites((prev) => {
      const items = prev.roles.items;
      const isCurrentlyFavorite = items.includes(roleId);

      let newItems: string[];
      if (isCurrentlyFavorite) {
        // Remove from favorites
        newItems = items.filter((id) => id !== roleId);
      } else {
        // Add to favorites (respect max limit)
        if (items.length >= MAX_FAVORITES.ROLES) {
          // Remove oldest favorite (FIFO)
          newItems = [...items.slice(1), roleId];
        } else {
          newItems = [...items, roleId];
        }
      }

      return {
        ...prev,
        roles: {
          ...prev.roles,
          items: newItems,
          lastUpdated: new Date(),
        },
      };
    });
  }, []);

  const toggleModelFavorite = useCallback((modelId: string) => {
    setFavorites((prev) => {
      const items = prev.models.items;
      const isCurrentlyFavorite = items.includes(modelId);

      let newItems: string[];
      if (isCurrentlyFavorite) {
        // Remove from favorites
        newItems = items.filter((id) => id !== modelId);
      } else {
        // Add to favorites (respect max limit)
        if (items.length >= MAX_FAVORITES.MODELS) {
          // Remove oldest favorite (FIFO)
          newItems = [...items.slice(1), modelId];
        } else {
          newItems = [...items, modelId];
        }
      }

      return {
        ...prev,
        models: {
          ...prev.models,
          items: newItems,
          lastUpdated: new Date(),
        },
      };
    });
  }, []);

  const clearRoleFavorites = useCallback(() => {
    setFavorites((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        items: [],
        lastUpdated: new Date(),
      },
    }));
  }, []);

  const clearModelFavorites = useCallback(() => {
    setFavorites((prev) => ({
      ...prev,
      models: {
        ...prev.models,
        items: [],
        lastUpdated: new Date(),
      },
    }));
  }, []);

  // ========================================================================
  // USAGE TRACKING
  // ========================================================================

  const trackRoleUsage = useCallback((roleId: string, sessionLength = 0) => {
    const now = new Date();

    setUsage((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [roleId]: {
          count: (prev.roles[roleId]?.count || 0) + 1,
          totalDuration: (prev.roles[roleId]?.totalDuration || 0) + sessionLength,
          lastUsed: now,
          averageSessionLength:
            sessionLength > 0
              ? ((prev.roles[roleId]?.totalDuration || 0) + sessionLength) /
                ((prev.roles[roleId]?.count || 0) + 1)
              : prev.roles[roleId]?.averageSessionLength || 0,
        },
      },
      lastSync: now,
    }));
  }, []);

  const trackModelUsage = useCallback((modelId: string, tokensUsed = 0, cost = 0) => {
    const now = new Date();

    setUsage((prev) => ({
      ...prev,
      models: {
        ...prev.models,
        [modelId]: {
          count: (prev.models[modelId]?.count || 0) + 1,
          totalTokens: (prev.models[modelId]?.totalTokens || 0) + tokensUsed,
          totalCost: (prev.models[modelId]?.totalCost || 0) + cost,
          lastUsed: now,
          averageTokensPerSession:
            tokensUsed > 0
              ? ((prev.models[modelId]?.totalTokens || 0) + tokensUsed) /
                ((prev.models[modelId]?.count || 0) + 1)
              : prev.models[modelId]?.averageTokensPerSession || 0,
        },
      },
      lastSync: now,
    }));
  }, []);

  // ========================================================================
  // QUERY HELPERS (PERFORMANCE OPTIMIZED)
  // ========================================================================

  const isRoleFavorite = useCallback(
    (roleId: string): boolean => {
      return favorites.roles.items.includes(roleId);
    },
    [favorites.roles.items],
  );

  const isModelFavorite = useCallback(
    (modelId: string): boolean => {
      return favorites.models.items.includes(modelId);
    },
    [favorites.models.items],
  );

  const getFavoriteRoles = useCallback(
    (allRoles: EnhancedRole[]): EnhancedRole[] => {
      const favoriteIds = new Set(favorites.roles.items);
      return allRoles
        .filter((role) => favoriteIds.has(role.id))
        .sort((a, b) => {
          // Sort by favorite order (newest first)
          const aIndex = favorites.roles.items.indexOf(a.id);
          const bIndex = favorites.roles.items.indexOf(b.id);
          return bIndex - aIndex;
        });
    },
    [favorites.roles.items],
  );

  const getFavoriteModels = useCallback(
    (allModels: EnhancedModel[]): EnhancedModel[] => {
      const favoriteIds = new Set(favorites.models.items);
      return allModels
        .filter((model) => favoriteIds.has(model.id))
        .sort((a, b) => {
          // Sort by favorite order (newest first)
          const aIndex = favorites.models.items.indexOf(a.id);
          const bIndex = favorites.models.items.indexOf(b.id);
          return bIndex - aIndex;
        });
    },
    [favorites.models.items],
  );

  const getMostUsedRoles = useCallback(
    (allRoles: EnhancedRole[], limit = 6): EnhancedRole[] => {
      const roleUsageMap = new Map(Object.entries(usage.roles).map(([id, data]) => [id, data]));

      return allRoles
        .filter((role) => roleUsageMap.has(role.id))
        .sort((a, b) => {
          const aUsage = roleUsageMap.get(a.id)!;
          const bUsage = roleUsageMap.get(b.id)!;

          // Primary sort by count, secondary by last used
          if (aUsage.count !== bUsage.count) {
            return bUsage.count - aUsage.count;
          }
          return bUsage.lastUsed.getTime() - aUsage.lastUsed.getTime();
        })
        .slice(0, limit);
    },
    [usage.roles],
  );

  const getMostUsedModels = useCallback(
    (allModels: EnhancedModel[], limit = 8): EnhancedModel[] => {
      const modelUsageMap = new Map(Object.entries(usage.models).map(([id, data]) => [id, data]));

      return allModels
        .filter((model) => modelUsageMap.has(model.id))
        .sort((a, b) => {
          const aUsage = modelUsageMap.get(a.id)!;
          const bUsage = modelUsageMap.get(b.id)!;

          // Primary sort by count, secondary by last used
          if (aUsage.count !== bUsage.count) {
            return bUsage.count - aUsage.count;
          }
          return bUsage.lastUsed.getTime() - aUsage.lastUsed.getTime();
        })
        .slice(0, limit);
    },
    [usage.models],
  );

  // ========================================================================
  // PERFORMANCE METRICS
  // ========================================================================

  const getPerformanceMetrics = useCallback(() => {
    const totalRoleUsage = Object.values(usage.roles).reduce((sum, role) => sum + role.count, 0);
    const totalModelUsage = Object.values(usage.models).reduce(
      (sum, model) => sum + model.count,
      0,
    );

    const favoriteRoleUsage = favorites.roles.items.reduce((sum, roleId) => {
      return sum + (usage.roles[roleId]?.count || 0);
    }, 0);

    const favoriteModelUsage = favorites.models.items.reduce((sum, modelId) => {
      return sum + (usage.models[modelId]?.count || 0);
    }, 0);

    const favoriteUsageRate =
      totalRoleUsage + totalModelUsage > 0
        ? (favoriteRoleUsage + favoriteModelUsage) / (totalRoleUsage + totalModelUsage)
        : 0;

    const averageSessionLength =
      Object.values(usage.roles).reduce((sum, role) => {
        return sum + role.averageSessionLength;
      }, 0) / Math.max(Object.keys(usage.roles).length, 1);

    return {
      totalRoleUsage,
      totalModelUsage,
      favoriteUsageRate,
      averageSessionLength,
    };
  }, [usage, favorites]);

  // ========================================================================
  // RETURN STATE
  // ========================================================================

  return {
    favorites,
    usage,
    isLoading,
    error,

    // Actions
    toggleRoleFavorite,
    toggleModelFavorite,
    clearRoleFavorites,
    clearModelFavorites,

    // Usage tracking
    trackRoleUsage,
    trackModelUsage,

    // Query helpers
    isRoleFavorite,
    isModelFavorite,
    getFavoriteRoles,
    getFavoriteModels,
    getMostUsedRoles,
    getMostUsedModels,

    // Performance metrics
    getPerformanceMetrics,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function loadFavorites(): FavoritesState {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        roles: {
          items: parsed.roles?.items || [],
          maxCount: MAX_FAVORITES.ROLES,
          lastUpdated: new Date(parsed.roles?.lastUpdated || Date.now()),
        },
        models: {
          items: parsed.models?.items || [],
          maxCount: MAX_FAVORITES.MODELS,
          lastUpdated: new Date(parsed.models?.lastUpdated || Date.now()),
        },
      };
    }
  } catch (error) {
    console.error("Failed to load favorites from localStorage:", error);
  }

  // Default state
  return {
    roles: {
      items: [],
      maxCount: MAX_FAVORITES.ROLES,
      lastUpdated: new Date(),
    },
    models: {
      items: [],
      maxCount: MAX_FAVORITES.MODELS,
      lastUpdated: new Date(),
    },
  };
}

function loadUsageAnalytics(): UsageAnalytics {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USAGE_ANALYTICS);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Convert date strings back to Date objects
      const roles: Record<string, any> = {};
      for (const [id, data] of Object.entries(parsed.roles || {})) {
        roles[id] = {
          ...(data as any),
          lastUsed: new Date((data as any).lastUsed),
        };
      }

      const models: Record<string, any> = {};
      for (const [id, data] of Object.entries(parsed.models || {})) {
        models[id] = {
          ...(data as any),
          lastUsed: new Date((data as any).lastUsed),
        };
      }

      return {
        roles,
        models,
        lastSync: new Date(parsed.lastSync || Date.now()),
      };
    }
  } catch (error) {
    console.error("Failed to load usage analytics from localStorage:", error);
  }

  // Default state
  return {
    roles: {},
    models: {},
    lastSync: new Date(),
  };
}

/**
 * Lightweight hook for components that only need to check favorite status
 * Performance optimized - doesn't trigger re-renders on usage changes
 */
export function useFavoriteStatus() {
  const [favorites] = useState<FavoritesState>(() => loadFavorites());

  return {
    isRoleFavorite: (roleId: string) => favorites.roles.items.includes(roleId),
    isModelFavorite: (modelId: string) => favorites.models.items.includes(modelId),
    favoriteRoles: favorites.roles.items,
    favoriteModels: favorites.models.items,
  };
}
