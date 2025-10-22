import { useCallback, useEffect, useState } from "react";

import type { QuickstartAction } from "../config/quickstarts";
import { getQuickstartsWithFallback } from "../config/quickstarts";

interface QuickstartUsage {
  id: string;
  lastUsed: number;
  useCount: number;
  pinned: boolean;
}

const STORAGE_KEY = "disa-quickstart-usage";

/**
 * Manages quickstart tiles including:
 * - Usage tracking (last used, count)
 * - Pinning favorites
 * - Sorting by usage/pinned status
 *
 * Implements Issue #105 - Startkacheln funktional machen
 */
export function useQuickstartManager() {
  const [quickstarts, setQuickstarts] = useState<QuickstartAction[]>([]);
  const [usage, setUsage] = useState<Map<string, QuickstartUsage>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load usage data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, QuickstartUsage>;
        setUsage(new Map(Object.entries(data)));
      }
    } catch (_err) {
      // Error handling for loading quickstart usage data - silently fail to avoid disrupting UX
    }
  }, []);

  // Save usage data to localStorage whenever it changes
  useEffect(() => {
    try {
      const data = Object.fromEntries(usage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_err) {
      // Error handling for saving quickstart usage data - silently fail to avoid disrupting UX
    }
  }, [usage]);

  // Load quickstarts on mount
  useEffect(() => {
    const loadQuickstarts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const actions = await getQuickstartsWithFallback();

        if (actions.length === 0) {
          setError("Keine Schnellstarts verfügbar");
        } else {
          setQuickstarts(actions);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
        setError(`Fehler beim Laden: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadQuickstarts();
  }, []);

  // Track quickstart usage
  const trackUsage = useCallback((id: string) => {
    setUsage((prev) => {
      const current = prev.get(id) || {
        id,
        lastUsed: 0,
        useCount: 0,
        pinned: false,
      };

      const updated = new Map(prev);
      updated.set(id, {
        ...current,
        lastUsed: Date.now(),
        useCount: current.useCount + 1,
      });

      return updated;
    });
  }, []);

  // Toggle pin status
  const togglePin = useCallback((id: string) => {
    setUsage((prev) => {
      const current = prev.get(id) || {
        id,
        lastUsed: 0,
        useCount: 0,
        pinned: false,
      };

      const updated = new Map(prev);
      updated.set(id, {
        ...current,
        pinned: !current.pinned,
      });

      return updated;
    });
  }, []);

  // Get sorted quickstarts (pinned first, then by last used)
  const getSortedQuickstarts = useCallback((): QuickstartAction[] => {
    return [...quickstarts].sort((a, b) => {
      const usageA = usage.get(a.id);
      const usageB = usage.get(b.id);

      // Pinned items first
      if (usageA?.pinned && !usageB?.pinned) return -1;
      if (!usageA?.pinned && usageB?.pinned) return 1;

      // Then by last used
      const lastUsedA = usageA?.lastUsed || 0;
      const lastUsedB = usageB?.lastUsed || 0;

      return lastUsedB - lastUsedA;
    });
  }, [quickstarts, usage]);

  // Check if a quickstart is pinned
  const isPinned = useCallback(
    (id: string): boolean => {
      return usage.get(id)?.pinned || false;
    },
    [usage],
  );

  // Get usage stats for a quickstart
  const getUsageStats = useCallback(
    (id: string) => {
      return usage.get(id);
    },
    [usage],
  );

  return {
    quickstarts: getSortedQuickstarts(),
    isLoading,
    error,
    trackUsage,
    togglePin,
    isPinned,
    getUsageStats,
  };
}
