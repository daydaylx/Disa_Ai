import { useEffect, useState } from "react";

import { getUIVersion, logABTestEvent, type UIVersion } from "../lib/ab-testing";

/**
 * Hook to manage UI version state and A/B testing
 */
export function useUIVersion() {
  const [uiVersion] = useState<UIVersion>(() => getUIVersion());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log that UI version was initialized
    logABTestEvent("ui_version_initialized", { version: uiVersion });
    setIsLoading(false);

    // Track performance metrics for comparison
    const startTime = performance.now();

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          logABTestEvent("page_load_performance", {
            version: uiVersion,
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            domContentLoaded:
              navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            firstPaint: navEntry.loadEventEnd - startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ["navigation"] });

    return () => {
      observer.disconnect();
    };
  }, [uiVersion]);

  /**
   * Track user interactions for A/B comparison
   */
  const trackInteraction = (action: string, details?: Record<string, any>) => {
    logABTestEvent(`user_interaction_${action}`, {
      version: uiVersion,
      ...details,
    });
  };

  /**
   * Track feature usage for comparison
   */
  const trackFeatureUsage = (feature: string, details?: Record<string, any>) => {
    logABTestEvent(`feature_usage_${feature}`, {
      version: uiVersion,
      ...details,
    });
  };

  /**
   * Track errors for comparison
   */
  const trackError = (error: string, details?: Record<string, any>) => {
    logABTestEvent(`error_${error}`, {
      version: uiVersion,
      ...details,
    });
  };

  return {
    uiVersion,
    isLoading,
    isV2: uiVersion === "v2",
    trackInteraction,
    trackFeatureUsage,
    trackError,
  };
}
