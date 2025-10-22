import type { ThemeMode } from "./color";

/**
 * Elevation shadows for the Soft-Depth aesthetic.
 * Each preset blends a low opacity soft shadow with a thin outline.
 */

export type ShadowTokens = {
  surface: string;
  raised: string;
  overlay: string;
  popover: string;
  focus: string;
};

export const shadowTokens: Record<ThemeMode, ShadowTokens> = {
  light: {
    surface: "0 1px 2px rgba(15, 14, 13, 0.06), 0 0 0 1px rgba(15, 14, 13, 0.04)",
    raised: "0 4px 12px rgba(15, 14, 13, 0.12), 0 1px 0 rgba(15, 14, 13, 0.04)",
    overlay: "0 18px 36px rgba(15, 14, 13, 0.26), 0 0 0 1px rgba(15, 14, 13, 0.08)",
    popover: "0 22px 44px rgba(15, 14, 13, 0.32), 0 0 0 1px rgba(15, 14, 13, 0.12)",
    focus: "0 0 0 3px rgba(15, 108, 189, 0.4)",
  },
  dark: {
    surface: "0 1px 2px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    raised: "0 6px 16px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    overlay: "0 20px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
    popover: "0 26px 54px rgba(0, 0, 0, 0.78), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    focus: "0 0 0 3px rgba(58, 160, 255, 0.48)",
  },
} as const;

export const shadowCssVars = {
  surface: "--shadow-surface",
  raised: "--shadow-raised",
  overlay: "--shadow-overlay",
  popover: "--shadow-popover",
  focus: "--shadow-focus",
} as const;
