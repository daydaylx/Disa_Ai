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
  // Neo-Depth System Extensions
  "surface-subtle": string;
  "surface-prominent": string;
  "surface-hover": string;
  "surface-active": string;
  "glow-brand": string;
  "glow-success": string;
  "glow-warning": string;
  "glow-error": string;
};

export const shadowTokens: Record<ThemeMode, ShadowTokens> = {
  light: {
    surface: "0 1px 2px rgba(9, 12, 20, 0.08), 0 0 0 1px rgba(9, 12, 20, 0.04)",
    raised: "0 3px 8px rgba(9, 12, 20, 0.12), 0 1px 1px rgba(9, 12, 20, 0.06)",
    overlay: "0 8px 20px rgba(9, 12, 20, 0.16), 0 2px 6px rgba(9, 12, 20, 0.08)",
    popover: "0 16px 40px rgba(9, 12, 20, 0.2), 0 4px 12px rgba(9, 12, 20, 0.12)",
    focus: "0 0 0 3px rgba(75, 99, 255, 0.35)",
    "surface-subtle": "0 1px 3px rgba(9, 12, 20, 0.1), 0 0 0 1px rgba(9, 12, 20, 0.04)",
    "surface-prominent": "0 8px 20px rgba(9, 12, 20, 0.16), 0 2px 6px rgba(9, 12, 20, 0.08)",
    "surface-hover": "0 4px 12px rgba(9, 12, 20, 0.14), 0 2px 3px rgba(9, 12, 20, 0.06)",
    "surface-active": "0 1px 2px rgba(9, 12, 20, 0.1), 0 0 0 1px rgba(9, 12, 20, 0.06)",
    "glow-brand": "0 0 0 3px rgba(75, 99, 255, 0.3), 0 8px 24px rgba(75, 99, 255, 0.12)",
    "glow-success": "0 0 0 3px rgba(13, 143, 98, 0.25), 0 8px 24px rgba(13, 143, 98, 0.12)",
    "glow-warning": "0 0 0 3px rgba(178, 106, 0, 0.25), 0 8px 24px rgba(178, 106, 0, 0.12)",
    "glow-error": "0 0 0 3px rgba(193, 58, 50, 0.3), 0 8px 24px rgba(193, 58, 50, 0.14)",
  },
  dark: {
    surface: "0 1px 2px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.04)",
    raised: "0 4px 10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    overlay: "0 10px 26px rgba(0, 0, 0, 0.65), 0 3px 8px rgba(0, 0, 0, 0.55)",
    popover: "0 20px 48px rgba(0, 0, 0, 0.75), 0 6px 12px rgba(0, 0, 0, 0.6)",
    focus: "0 0 0 3px rgba(127, 150, 255, 0.4)",
    "surface-subtle": "0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    "surface-prominent": "0 12px 28px rgba(0, 0, 0, 0.65), 0 3px 8px rgba(0, 0, 0, 0.5)",
    "surface-hover": "0 8px 20px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.45)",
    "surface-active": "0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    "glow-brand": "0 0 0 3px rgba(127, 150, 255, 0.35), 0 8px 24px rgba(127, 150, 255, 0.2)",
    "glow-success": "0 0 0 3px rgba(49, 209, 147, 0.35), 0 8px 24px rgba(49, 209, 147, 0.2)",
    "glow-warning": "0 0 0 3px rgba(255, 183, 77, 0.35), 0 8px 24px rgba(255, 183, 77, 0.2)",
    "glow-error": "0 0 0 3px rgba(255, 107, 107, 0.4), 0 8px 24px rgba(255, 107, 107, 0.25)",
  },
} as const;

export const shadowCssVars = {
  surface: "--shadow-surface",
  raised: "--shadow-raised",
  overlay: "--shadow-overlay",
  popover: "--shadow-popover",
  focus: "--shadow-focus",
  // Neo-Depth System CSS Variables
  "surface-subtle": "--shadow-surface-subtle",
  "surface-prominent": "--shadow-surface-prominent",
  "surface-hover": "--shadow-surface-hover",
  "surface-active": "--shadow-surface-active",
  "glow-brand": "--shadow-glow-brand",
  "glow-success": "--shadow-glow-success",
  "glow-warning": "--shadow-glow-warning",
  "glow-error": "--shadow-glow-error",
} as const;
