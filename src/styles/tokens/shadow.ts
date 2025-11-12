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
    surface: "0 2px 8px rgba(0, 0, 0, 0.35)", // Elevation-1: Standard cards
    raised: "0 2px 8px rgba(0, 0, 0, 0.35)", // Same as surface
    overlay: "0 8px 24px rgba(0, 0, 0, 0.45)", // Elevation-2: Floating/elevated
    popover: "0 8px 24px rgba(0, 0, 0, 0.45)", // Same as overlay
    focus: "0 0 0 2px rgba(139, 92, 246, 1)", // Simple focus ring
    "surface-subtle": "0 2px 8px rgba(0, 0, 0, 0.35)",
    "surface-prominent": "0 8px 24px rgba(0, 0, 0, 0.45)",
    "surface-hover": "0 2px 8px rgba(0, 0, 0, 0.35)",
    "surface-active": "inset 0 2px 4px rgba(0, 0, 0, 0.15)",
    "glow-brand": "0 0 24px rgba(139, 92, 246, 0.35)", // Accent glow
    "glow-brand-subtle": "0 0 12px rgba(139, 92, 246, 0.18)",
    "glow-brand-strong": "0 0 32px rgba(139, 92, 246, 0.5)",
    "glow-success": "0 0 24px rgba(13, 143, 98, 0.35)",
    "glow-success-subtle": "0 0 12px rgba(13, 143, 98, 0.2)",
    "glow-warning": "0 0 24px rgba(178, 106, 0, 0.35)",
    "glow-warning-subtle": "0 0 12px rgba(178, 106, 0, 0.22)",
    "glow-error": "0 0 24px rgba(193, 58, 50, 0.4)",
    "glow-error-subtle": "0 0 12px rgba(193, 58, 50, 0.25)",
    "glow-neutral-subtle": "0 0 10px rgba(15, 23, 42, 0.16)",
  },
  dark: {
    surface: "0 2px 8px rgba(0, 0, 0, 0.35)", // Elevation-1: Standard cards
    raised: "0 2px 8px rgba(0, 0, 0, 0.35)", // Same as surface
    overlay: "0 8px 24px rgba(0, 0, 0, 0.45)", // Elevation-2: Floating/elevated
    popover: "0 8px 24px rgba(0, 0, 0, 0.45)", // Same as overlay
    focus: "0 0 0 2px rgba(139, 92, 246, 1)", // Simple focus ring
    "surface-subtle": "0 2px 8px rgba(0, 0, 0, 0.35)",
    "surface-prominent": "0 8px 24px rgba(0, 0, 0, 0.45)",
    "surface-hover": "0 2px 8px rgba(0, 0, 0, 0.35)",
    "surface-active": "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
    "glow-brand": "0 0 24px rgba(139, 92, 246, 0.35)", // Accent glow
    "glow-brand-subtle": "0 0 12px rgba(139, 92, 246, 0.22)",
    "glow-brand-strong": "0 0 32px rgba(139, 92, 246, 0.5)",
    "glow-success": "0 0 24px rgba(49, 209, 147, 0.35)",
    "glow-success-subtle": "0 0 12px rgba(49, 209, 147, 0.25)",
    "glow-warning": "0 0 24px rgba(255, 183, 77, 0.35)",
    "glow-warning-subtle": "0 0 12px rgba(255, 183, 77, 0.28)",
    "glow-error": "0 0 24px rgba(255, 107, 107, 0.4)",
    "glow-error-subtle": "0 0 12px rgba(255, 107, 107, 0.3)",
    "glow-neutral-subtle": "0 0 10px rgba(8, 11, 22, 0.24)",
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
