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
    surface: "8px 8px 16px rgba(9, 12, 20, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.1)",
    raised: "15px 15px 30px rgba(9, 12, 20, 0.18), -15px -15px 30px rgba(255, 255, 255, 0.12)",
    overlay: "25px 25px 50px rgba(9, 12, 20, 0.22), -25px -25px 50px rgba(255, 255, 255, 0.15)",
    popover: "35px 35px 70px rgba(9, 12, 20, 0.25), -35px -35px 70px rgba(255, 255, 255, 0.18)",
    focus:
      "inset 0 0 0 1px rgba(75, 99, 255, 1), 0 0 0 3px rgba(75, 99, 255, 0.25), inset 4px 4px 8px rgba(9, 12, 20, 0.12), inset -4px -4px 8px rgba(255, 255, 255, 0.06)",
    "surface-subtle": "8px 8px 16px rgba(9, 12, 20, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.1)",
    "surface-prominent":
      "25px 25px 50px rgba(9, 12, 20, 0.22), -25px -25px 50px rgba(255, 255, 255, 0.15)",
    "surface-hover":
      "15px 15px 30px rgba(9, 12, 20, 0.18), -15px -15px 30px rgba(255, 255, 255, 0.12)",
    "surface-active":
      "inset 4px 4px 8px rgba(9, 12, 20, 0.12), inset -4px -4px 8px rgba(255, 255, 255, 0.06)",
    "glow-brand": "0 0 0 3px rgba(75, 99, 255, 0.3), 0 8px 24px rgba(75, 99, 255, 0.12)",
    "glow-brand-subtle": "0 0 12px rgba(75, 99, 255, 0.18), 0 0 0 1px rgba(75, 99, 255, 0.28)",
    "glow-brand-strong": "0 0 24px rgba(75, 99, 255, 0.42), 0 0 0 3px rgba(75, 99, 255, 0.45)",
    "glow-success": "0 0 0 3px rgba(13, 143, 98, 0.25), 0 8px 24px rgba(13, 143, 98, 0.12)",
    "glow-success-subtle": "0 0 12px rgba(13, 143, 98, 0.2), 0 0 0 1px rgba(13, 143, 98, 0.22)",
    "glow-warning": "0 0 0 3px rgba(178, 106, 0, 0.25), 0 8px 24px rgba(178, 106, 0, 0.12)",
    "glow-warning-subtle": "0 0 12px rgba(178, 106, 0, 0.22), 0 0 0 1px rgba(178, 106, 0, 0.25)",
    "glow-error": "0 0 0 3px rgba(193, 58, 50, 0.3), 0 8px 24px rgba(193, 58, 50, 0.14)",
    "glow-error-subtle": "0 0 12px rgba(193, 58, 50, 0.25), 0 0 0 1px rgba(193, 58, 50, 0.28)",
    "glow-neutral-subtle": "0 0 10px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.12)",
  },
  dark: {
    surface: "3px 3px 6px rgba(0, 0, 0, 0.5), -3px -3px 6px rgba(255, 255, 255, 0.03)",
    raised: "6px 6px 12px rgba(0, 0, 0, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.05)",
    overlay: "10px 10px 20px rgba(0, 0, 0, 0.7), -10px -10px 20px rgba(255, 255, 255, 0.08)",
    popover: "15px 15px 30px rgba(0, 0, 0, 0.8), -15px -15px 30px rgba(255, 255, 255, 0.1)",
    focus:
      "inset 0 0 0 1px rgba(127, 150, 255, 1), 0 0 0 3px rgba(127, 150, 255, 0.2), inset 2px 2px 5px rgba(0, 0, 0, 0.4), inset -2px -2px 5px rgba(255, 255, 255, 0.03)",
    "surface-subtle": "3px 3px 6px rgba(0, 0, 0, 0.5), -3px -3px 6px rgba(255, 255, 255, 0.03)",
    "surface-prominent":
      "10px 10px 20px rgba(0, 0, 0, 0.7), -10px -10px 20px rgba(255, 255, 255, 0.08)",
    "surface-hover": "6px 6px 12px rgba(0, 0, 0, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.05)",
    "surface-active":
      "inset 2px 2px 5px rgba(0, 0, 0, 0.4), inset -2px -2px 5px rgba(255, 255, 255, 0.03)",
    "glow-brand": "0 0 0 3px rgba(127, 150, 255, 0.35), 0 8px 24px rgba(127, 150, 255, 0.2)",
    "glow-brand-subtle": "0 0 12px rgba(127, 150, 255, 0.22), 0 0 0 1px rgba(127, 150, 255, 0.3)",
    "glow-brand-strong": "0 0 24px rgba(127, 150, 255, 0.45), 0 0 0 3px rgba(127, 150, 255, 0.5)",
    "glow-success": "0 0 0 3px rgba(49, 209, 147, 0.35), 0 8px 24px rgba(49, 209, 147, 0.2)",
    "glow-success-subtle": "0 0 12px rgba(49, 209, 147, 0.25), 0 0 0 1px rgba(49, 209, 147, 0.28)",
    "glow-warning": "0 0 0 3px rgba(255, 183, 77, 0.35), 0 8px 24px rgba(255, 183, 77, 0.2)",
    "glow-warning-subtle": "0 0 12px rgba(255, 183, 77, 0.28), 0 0 0 1px rgba(255, 183, 77, 0.3)",
    "glow-error": "0 0 0 3px rgba(255, 107, 107, 0.4), 0 8px 24px rgba(255, 107, 107, 0.25)",
    "glow-error-subtle": "0 0 12px rgba(255, 107, 107, 0.3), 0 0 0 1px rgba(255, 107, 107, 0.32)",
    "glow-neutral-subtle": "0 0 10px rgba(8, 11, 22, 0.24), 0 0 0 1px rgba(231, 233, 245, 0.08)",
  },
} as const;

export const shadowCssVars = {
  surface: "--shadow-neumorphic-sm",
  raised: "--shadow-neumorphic-md",
  overlay: "--shadow-neumorphic-lg",
  popover: "--shadow-neumorphic-xl",
  focus: "--shadow-focus-neumorphic",
  // Neo-Depth System CSS Variables
  "surface-subtle": "--shadow-neumorphic-sm",
  "surface-prominent": "--shadow-neumorphic-lg",
  "surface-hover": "--shadow-neumorphic-md",
  "surface-active": "--shadow-inset-subtle",
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
