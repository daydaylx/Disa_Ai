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
  const [error, setError] = useState<Error | null>(null);

  // Load usage data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, QuickstartUsage>;
        setUsage(new Map(Object.entries(data)));
      }
    } catch {
      // Error handling for loading quickstart usage data - silently fail to avoid disrupting UX
    }
  }, []);

  // Save usage data to localStorage whenever it changes
  useEffect(() => {
    try {
      const data = Object.fromEntries(usage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Error handling for saving quickstart usage data - silently fail to avoid disrupting UX
    }
  }, [usage]);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let fallbackError: Error | null = null;

      const actions = await getQuickstartsWithFallback({
        onFallback: ({ reason, error }) => {
          if (reason === "empty") {
            fallbackError = new Error("Keine Schnellstarts verfügbar.");
          } else if (reason === "error") {
            fallbackError =
              error instanceof Error
                ? error
                : new Error(error ? String(error) : "Unbekannter Fehler");
          }
        },
      });

      if (fallbackError) {
        setError(fallbackError);
      } else {
        setError(null);
      }

      if (actions.length === 0) {
        setQuickstarts([]);
      } else {
        setQuickstarts(actions);
      }
    } catch (err) {
      const fallbackError =
        err instanceof Error ? err : new Error(err ? String(err) : "Unbekannter Fehler");
      setError(fallbackError);
      setQuickstarts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load quickstarts on mount
  useEffect(() => {
    void reload();
  }, [reload]);

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
    reload,
  };
}
