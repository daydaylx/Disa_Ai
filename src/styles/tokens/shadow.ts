import type { ThemeMode } from "./color";

/**
 * Elevation shadows for Glassmorphism 2.0.
 * Simplified 2-level shadow system: Elevation-1 (surface) and Elevation-2 (floating).
 * Removed Neumorphism dual-shadows for cleaner, more performant design.
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
  "glow-brand-subtle": string;
  "glow-brand-strong": string;
  "glow-success": string;
  "glow-success-subtle": string;
  "glow-warning": string;
  "glow-warning-subtle": string;
  "glow-error": string;
  "glow-error-subtle": string;
  "glow-neutral-subtle": string;
};

export const shadowTokens: Record<ThemeMode, ShadowTokens> = {
  light: {
    surface: "0 6px 18px rgba(15, 23, 36, 0.12)",
    raised: "0 10px 28px rgba(15, 23, 36, 0.16)",
    overlay: "0 16px 36px rgba(15, 23, 36, 0.24)",
    popover: "0 16px 36px rgba(15, 23, 36, 0.24)",
    focus: "0 0 0 2px rgba(139, 92, 246, 0.38), 0 8px 24px rgba(15, 23, 36, 0.18)",
    "surface-subtle": "0 6px 18px rgba(15, 23, 36, 0.12)",
    "surface-prominent": "0 10px 28px rgba(15, 23, 36, 0.16)",
    "surface-hover": "0 8px 22px rgba(15, 23, 36, 0.14)",
    "surface-active": "inset 0 2px 6px rgba(15, 23, 36, 0.16)",
    "glow-brand": "0 0 18px rgba(139, 92, 246, 0.28)",
    "glow-brand-subtle": "0 0 10px rgba(139, 92, 246, 0.16)",
    "glow-brand-strong": "0 0 26px rgba(139, 92, 246, 0.42)",
    "glow-success": "0 0 18px rgba(13, 143, 98, 0.3)",
    "glow-success-subtle": "0 0 10px rgba(13, 143, 98, 0.18)",
    "glow-warning": "0 0 18px rgba(178, 106, 0, 0.3)",
    "glow-warning-subtle": "0 0 10px rgba(178, 106, 0, 0.2)",
    "glow-error": "0 0 18px rgba(193, 58, 50, 0.32)",
    "glow-error-subtle": "0 0 10px rgba(193, 58, 50, 0.22)",
    "glow-neutral-subtle": "0 0 8px rgba(15, 23, 42, 0.14)",
  },
  dark: {
    surface: "0 6px 18px rgba(0, 0, 0, 0.32)",
    raised: "0 10px 28px rgba(0, 0, 0, 0.4)",
    overlay: "0 16px 36px rgba(0, 0, 0, 0.52)",
    popover: "0 16px 36px rgba(0, 0, 0, 0.52)",
    focus: "0 0 0 2px rgba(139, 92, 246, 0.4), 0 10px 26px rgba(0, 0, 0, 0.45)",
    "surface-subtle": "0 6px 18px rgba(0, 0, 0, 0.32)",
    "surface-prominent": "0 10px 28px rgba(0, 0, 0, 0.4)",
    "surface-hover": "0 8px 22px rgba(0, 0, 0, 0.38)",
    "surface-active": "inset 0 2px 6px rgba(0, 0, 0, 0.45)",
    "glow-brand": "0 0 18px rgba(139, 92, 246, 0.32)",
    "glow-brand-subtle": "0 0 10px rgba(139, 92, 246, 0.22)",
    "glow-brand-strong": "0 0 26px rgba(139, 92, 246, 0.45)",
    "glow-success": "0 0 18px rgba(49, 209, 147, 0.32)",
    "glow-success-subtle": "0 0 10px rgba(49, 209, 147, 0.24)",
    "glow-warning": "0 0 18px rgba(255, 183, 77, 0.32)",
    "glow-warning-subtle": "0 0 10px rgba(255, 183, 77, 0.26)",
    "glow-error": "0 0 18px rgba(255, 107, 107, 0.35)",
    "glow-error-subtle": "0 0 10px rgba(255, 107, 107, 0.28)",
    "glow-neutral-subtle": "0 0 8px rgba(8, 11, 22, 0.24)",
  },
} as const;

export const shadowCssVars = {
  surface: "--shadow-elevation-1",
  raised: "--shadow-elevation-1",
  overlay: "--shadow-elevation-2",
  popover: "--shadow-elevation-2",
  focus: "--shadow-focus",
  // Glassmorphism System CSS Variables
  "surface-subtle": "--shadow-elevation-1",
  "surface-prominent": "--shadow-elevation-2",
  "surface-hover": "--shadow-elevation-1",
  "surface-active": "--shadow-inset",
  "glow-brand": "--shadow-glow-brand",
  "glow-brand-subtle": "--shadow-glow-brand-subtle",
  "glow-brand-strong": "--shadow-glow-brand-strong",
  "glow-success": "--shadow-glow-success",
  "glow-success-subtle": "--shadow-glow-success-subtle",
  "glow-warning": "--shadow-glow-warning",
  "glow-warning-subtle": "--shadow-glow-warning-subtle",
  "glow-error": "--shadow-glow-error",
  "glow-error-subtle": "--shadow-glow-error-subtle",
  "glow-neutral-subtle": "--shadow-glow-neutral-subtle",
} as const;
