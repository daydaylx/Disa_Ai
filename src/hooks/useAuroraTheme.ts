import { useCallback, useEffect, useState } from "react";

export type AuroraTheme = "cyber" | "warm" | "cool" | "monochrome" | "forest" | "sunset" | "ocean";

export type AuroraPerformance = "high" | "low" | "minimal";

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

interface AuroraThemeState {
  theme: AuroraTheme;
  performance: AuroraPerformance;
  timeBasedEnabled: boolean;
  currentTimeTheme: TimeOfDay;
}

const STORAGE_KEY = "disa-aurora-theme";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

function detectPerformanceLevel(): AuroraPerformance {
  // Detect if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "minimal";
  }

  // Simple performance detection based on available features
  // Fallback for test environments (jsdom) where CSS.supports is not available
  const hasWillChange =
    typeof CSS !== "undefined" && CSS.supports ? CSS.supports("will-change", "transform") : true;
  const hasBackdropFilter =
    typeof CSS !== "undefined" && CSS.supports
      ? CSS.supports("backdrop-filter", "blur(10px)")
      : true;

  if (!hasWillChange || !hasBackdropFilter) {
    return "low";
  }

  // Check for potential low-end device indicators
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;
  const deviceMemory = (navigator as any).deviceMemory || 1;

  if (hardwareConcurrency <= 2 || deviceMemory <= 2) {
    return "low";
  }

  return "high";
}

function loadThemeState(): AuroraThemeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        theme: parsed.theme || "cyber",
        performance: parsed.performance || detectPerformanceLevel(),
        timeBasedEnabled: parsed.timeBasedEnabled ?? false,
        currentTimeTheme: getTimeOfDay(),
      };
    }
  } catch {
    // Error handling for loading aurora theme state - using defaults if loading fails
  }

  return {
    theme: "cyber",
    performance: detectPerformanceLevel(),
    timeBasedEnabled: false,
    currentTimeTheme: getTimeOfDay(),
  };
}

function saveThemeState(state: AuroraThemeState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: state.theme,
        performance: state.performance,
        timeBasedEnabled: state.timeBasedEnabled,
      }),
    );
  } catch {
    // Error handling for saving aurora theme state - silently fail to avoid disrupting UX
  }
}

function applyThemeToDocument(state: AuroraThemeState) {
  const { theme, performance, timeBasedEnabled, currentTimeTheme } = state;

  // Apply aurora theme
  const effectiveTheme = timeBasedEnabled ? currentTimeTheme : theme;
  document.documentElement.setAttribute("data-aurora-theme", effectiveTheme);

  // Apply performance mode
  document.documentElement.setAttribute("data-aurora-performance", performance);

  // Add time-based class if enabled
  if (timeBasedEnabled) {
    document.documentElement.classList.add("aurora-time-based", `aurora-time-${currentTimeTheme}`);
  } else {
    document.documentElement.classList.remove(
      "aurora-time-based",
      "aurora-time-dawn",
      "aurora-time-day",
      "aurora-time-dusk",
      "aurora-time-night",
    );
  }

  // Add theme transition class for smooth changes
  document.documentElement.classList.add("aurora-theme-transition");
}

export function useAuroraTheme() {
  const [state, setState] = useState<AuroraThemeState>(loadThemeState);

  // Update time-based theme every minute
  useEffect(() => {
    if (!state.timeBasedEnabled) return;

    const updateTimeTheme = () => {
      const newTimeTheme = getTimeOfDay();
      if (newTimeTheme !== state.currentTimeTheme) {
        setState((prev) => ({ ...prev, currentTimeTheme: newTimeTheme }));
      }
    };

    // Check every minute
    const interval = setInterval(updateTimeTheme, 60000);

    // Also check when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTimeTheme();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [state.timeBasedEnabled, state.currentTimeTheme]);

  // Apply theme to document whenever state changes
  useEffect(() => {
    applyThemeToDocument(state);
    saveThemeState(state);
  }, [state]);

  // Listen for performance changes (e.g., battery level)
  useEffect(() => {
    const updatePerformanceMode = () => {
      const newPerformance = detectPerformanceLevel();
      if (newPerformance !== state.performance) {
        setState((prev) => ({ ...prev, performance: newPerformance }));
      }
    };

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => updatePerformanceMode();

    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionChange);
    } else {
      mediaQuery.addEventListener("change", handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMotionChange);
      } else {
        mediaQuery.removeEventListener("change", handleMotionChange);
      }
    };
  }, [state.performance]);

  const setTheme = useCallback((theme: AuroraTheme) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const setPerformance = useCallback((performance: AuroraPerformance) => {
    setState((prev) => ({ ...prev, performance }));
  }, []);

  const setTimeBasedEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      timeBasedEnabled: enabled,
      currentTimeTheme: enabled ? getTimeOfDay() : prev.currentTimeTheme,
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setState({
      theme: "cyber",
      performance: detectPerformanceLevel(),
      timeBasedEnabled: false,
      currentTimeTheme: getTimeOfDay(),
    });
  }, []);

  return {
    theme: state.theme,
    performance: state.performance,
    timeBasedEnabled: state.timeBasedEnabled,
    currentTimeTheme: state.currentTimeTheme,
    effectiveTheme: state.timeBasedEnabled ? state.currentTimeTheme : state.theme,
    setTheme,
    setPerformance,
    setTimeBasedEnabled,
    resetToDefaults,
    availableThemes: ["cyber", "warm", "cool", "monochrome", "forest", "sunset", "ocean"] as const,
    availablePerformanceModes: ["high", "low", "minimal"] as const,
  };
}
