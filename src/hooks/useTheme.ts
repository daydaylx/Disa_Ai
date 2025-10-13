import { useCallback, useEffect, useState } from "react";

import { colors } from "../styles/design-tokens";

const DATA_ATTRIBUTE = "data-ui-theme";
const CUSTOM_THEME_STORAGE_KEY = "customTheme";
const THEME_KEYS = ["primary", "secondary", "accent", "background", "foreground"] as const;

export type ThemeMode = "dark-glass";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: colors.corporate.accent.primary,
  secondary: colors.corporate.text.muted,
  accent: colors.semantic.warning,
  background: colors.neutral[50],
  foreground: colors.corporate.text.onLight,
};

const CSS_VARIABLES: Record<keyof ThemeColors, string> = {
  primary: "--ui-theme-primary",
  secondary: "--ui-theme-secondary",
  accent: "--ui-theme-accent",
  background: "--ui-theme-background",
  foreground: "--ui-theme-foreground",
};

function applyModeTheme(mode: ThemeMode = "dark-glass") {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.setAttribute(DATA_ATTRIBUTE, mode);
  root.classList.add("dark");
  root.classList.remove("light");
}

function applyCustomTheme(theme: ThemeColors | null) {
  if (typeof document === "undefined") {
    return;
  }

  const rootStyle = document.documentElement.style;

  THEME_KEYS.forEach((key) => {
    const variable = CSS_VARIABLES[key];
    if (!variable) return;

    if (theme) {
      rootStyle.setProperty(variable, theme[key]);
    } else {
      rootStyle.removeProperty(variable);
    }
  });
}

function readStoredCustomTheme(): ThemeColors | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ThemeColors> | null;
    if (
      parsed &&
      typeof parsed === "object" &&
      THEME_KEYS.every((key) => typeof parsed[key] === "string")
    ) {
      return parsed as ThemeColors;
    }
  } catch {
    // Ignore invalid JSON
  }

  return null;
}

export function useTheme() {
  const [customTheme, setCustomThemeState] = useState<ThemeColors | null>(() =>
    readStoredCustomTheme(),
  );

  useEffect(() => {
    applyModeTheme();
  }, []);

  useEffect(() => {
    applyCustomTheme(customTheme);
  }, [customTheme]);

  const setCustomTheme = useCallback((next: ThemeColors) => {
    setCustomThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const resetCustomTheme = useCallback(() => {
    setCustomThemeState(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY);
    }
  }, []);

  return {
    mode: "dark-glass" as const,
    effectiveMode: "dark-glass" as const,
    theme: customTheme ?? DEFAULT_THEME_COLORS,
    customTheme,
    setCustomTheme,
    resetCustomTheme,
  };
}
