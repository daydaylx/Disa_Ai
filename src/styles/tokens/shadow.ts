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
    surface: "0 1px 2px rgba(15, 14, 13, 0.06), 0 0 0 1px rgba(15, 14, 13, 0.04)",
    raised: "0 4px 12px rgba(15, 14, 13, 0.12), 0 1px 0 rgba(15, 14, 13, 0.04)",
    overlay: "0 18px 36px rgba(15, 14, 13, 0.26), 0 0 0 1px rgba(15, 14, 13, 0.08)",
    popover: "0 22px 44px rgba(15, 14, 13, 0.32), 0 0 0 1px rgba(15, 14, 13, 0.12)",
    focus: "0 0 0 3px rgba(15, 108, 189, 0.4)",
    // Neo-Depth System - Enhanced Card Shadows
    "surface-subtle": "0 2px 6px rgba(15, 14, 13, 0.08), 0 0 0 1px rgba(15, 14, 13, 0.06)",
    "surface-prominent": "0 8px 24px rgba(15, 14, 13, 0.16), 0 2px 6px rgba(15, 14, 13, 0.12)",
    "surface-hover": "0 12px 32px rgba(15, 14, 13, 0.20), 0 4px 12px rgba(15, 14, 13, 0.16)",
    "surface-active": "0 2px 8px rgba(15, 14, 13, 0.12), 0 0 0 1px rgba(15, 14, 13, 0.08)",
    // Glow Effects for Enhanced States
    "glow-brand": "0 0 0 3px rgba(15, 107, 189, 0.15), 0 8px 24px rgba(15, 107, 189, 0.12)",
    "glow-success": "0 0 0 3px rgba(16, 124, 16, 0.15), 0 8px 24px rgba(16, 124, 16, 0.12)",
    "glow-warning": "0 0 0 3px rgba(196, 89, 17, 0.15), 0 8px 24px rgba(196, 89, 17, 0.12)",
    "glow-error": "0 0 0 3px rgba(196, 53, 53, 0.15), 0 8px 24px rgba(196, 53, 53, 0.12)",
  },
  dark: {
    surface: "0 1px 2px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    raised: "0 6px 16px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    overlay: "0 20px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
    popover: "0 26px 54px rgba(0, 0, 0, 0.78), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    focus: "0 0 0 3px rgba(58, 160, 255, 0.48)",
    // Neo-Depth System - Dark Mode Optimized
    "surface-subtle": "0 3px 8px rgba(0, 0, 0, 0.50), 0 0 0 1px rgba(255, 255, 255, 0.06)",
    "surface-prominent": "0 12px 28px rgba(0, 0, 0, 0.65), 0 3px 8px rgba(0, 0, 0, 0.45)",
    "surface-hover": "0 16px 40px rgba(0, 0, 0, 0.75), 0 6px 16px rgba(0, 0, 0, 0.55)",
    "surface-active": "0 2px 6px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)",
    // Glow Effects - Dark Mode Enhanced
    "glow-brand": "0 0 0 3px rgba(58, 160, 255, 0.25), 0 8px 24px rgba(58, 160, 255, 0.20)",
    "glow-success": "0 0 0 3px rgba(34, 197, 94, 0.25), 0 8px 24px rgba(34, 197, 94, 0.20)",
    "glow-warning": "0 0 0 3px rgba(245, 158, 11, 0.25), 0 8px 24px rgba(245, 158, 11, 0.20)",
    "glow-error": "0 0 0 3px rgba(239, 68, 68, 0.25), 0 8px 24px rgba(239, 68, 68, 0.20)",
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
