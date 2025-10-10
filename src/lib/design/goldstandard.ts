/**
 * Design Goldstandard - Zentrale Konfiguration
 *
 * Diese Datei enthält alle Design-Parameter, die als Goldstandard
 * etabliert wurden. Änderungen sollten sehr sorgfältig abgewogen werden.
 *
 * @version 1.0.0
 * @date 2025-01-19
 */

import type { GlassTint } from "../theme/glass";

// ============================================================================
// HINTERGRUND-SYSTEM
// ============================================================================

/**
 * Goldstandard: Punktmuster-Hintergrund
 * Optimale Balance zwischen Sichtbarkeit und Subtilität
 */
export const DOT_PATTERN_CONFIG = {
  svg: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><circle cx='10' cy='10' r='1' fill='%23ffffff' opacity='0.15'/></svg>")`,
  size: "20px 20px",
  opacity: 0.15,
  radius: 1,
  spacing: 20,
} as const;

// ============================================================================
// GLASSMORPHISMUS-SYSTEM
// ============================================================================

/**
 * Goldstandard: Glassmorphismus-Transparenzen
 * Optimal kalibriert für Lesbarkeit und visuellen Effekt
 */
export const GLASS_TRANSPARENCY = {
  strong: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.08)",
    insetHighlight: "rgba(255, 255, 255, 0.08)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  medium: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.06)",
    insetHighlight: "rgba(255, 255, 255, 0.06)",
    shadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
  },
  soft: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "rgba(255, 255, 255, 0.05)",
    insetHighlight: "rgba(255, 255, 255, 0.04)",
    shadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  },
} as const;

/**
 * Goldstandard: Backdrop-Filter
 * Konsistente Blur-Werte für Glassmorphismus
 */
export const BACKDROP_BLUR = {
  standard: "16px",
  webkit: "16px", // Safari-Kompatibilität
} as const;

// ============================================================================
// FARBSYSTEM
// ============================================================================

/**
 * Goldstandard: Statische Kategorie-Farben
 * Verhindert ungewollte globale Farbänderungen bei Rollen-Auswahl
 */
export const STATIC_CATEGORY_TINTS: GlassTint[] = [
  {
    from: "hsla(262, 82%, 74%, 0.78)", // Lavender
    to: "hsla(200, 87%, 68%, 0.55)", // Soft Sky
  },
  {
    from: "hsla(335, 86%, 72%, 0.78)", // Blossom Pink
    to: "hsla(24, 92%, 67%, 0.55)", // Peach Glow
  },
  {
    from: "hsla(160, 82%, 66%, 0.78)", // Mint
    to: "hsla(188, 84%, 62%, 0.55)", // Aqua
  },
  {
    from: "hsla(42, 92%, 70%, 0.78)", // Golden Light
    to: "hsla(16, 86%, 64%, 0.55)", // Amber Coral
  },
  {
    from: "hsla(280, 88%, 74%, 0.78)", // Orchid
    to: "hsla(312, 84%, 68%, 0.55)", // Fuchsia Mist
  },
  {
    from: "hsla(202, 86%, 70%, 0.78)", // Daybreak Blue
    to: "hsla(186, 88%, 64%, 0.55)", // Lagoon
  },
];

// ============================================================================
// DESIGN-TOKEN
// ============================================================================

/**
 * Goldstandard: CSS Custom Properties
 * Optimierte Werte für das aktuelle Design-System
 */
export const DESIGN_TOKENS = {
  // Glassmorphismus-Hintergründe
  glassBackground: {
    subtle: "hsla(220, 25%, 95%, 0.03)",
    soft: "hsla(220, 25%, 95%, 0.05)",
    medium: "hsla(220, 20%, 90%, 0.08)",
    strong: "hsla(220, 20%, 90%, 0.12)",
  },

  // Glassmorphismus-Ränder
  glassBorder: {
    subtle: "hsla(220, 25%, 95%, 0.08)",
    soft: "hsla(220, 25%, 95%, 0.12)",
    medium: "hsla(220, 20%, 90%, 0.16)",
    strong: "hsla(220, 20%, 90%, 0.24)",
  },

  // Blur-Werte
  blur: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
  },
} as const;

// ============================================================================
// UTILITY-FUNKTIONEN
// ============================================================================

/**
 * Generiert CSS für Glassmorphismus-Komponenten
 */
export function createGlassStyle(level: keyof typeof GLASS_TRANSPARENCY) {
  const config = GLASS_TRANSPARENCY[level];

  return {
    background: config.background,
    border: `1px solid ${config.border}`,
    backdropFilter: `blur(${BACKDROP_BLUR.standard})`,
    WebkitBackdropFilter: `blur(${BACKDROP_BLUR.webkit})`,
    boxShadow: `inset 0 1px 0 ${config.insetHighlight}, ${config.shadow}`,
  };
}

/**
 * Generiert CSS für Punktmuster-Hintergrund
 */
export function createDotPatternStyle() {
  return {
    backgroundImage: DOT_PATTERN_CONFIG.svg,
    backgroundSize: DOT_PATTERN_CONFIG.size,
    position: "absolute" as const,
    inset: 0,
    pointerEvents: "none" as const,
  };
}

/**
 * Holt eine Kategorie-Farbe basierend auf dem Index
 */
export function getCategoryTint(index: number): GlassTint {
  return STATIC_CATEGORY_TINTS[index % STATIC_CATEGORY_TINTS.length] ?? STATIC_CATEGORY_TINTS[0]!;
}

// ============================================================================
// VALIDIERUNG
// ============================================================================

/**
 * Validiert, ob ein Transparenzwert im goldenen Bereich liegt
 */
export function isValidTransparency(opacity: number): boolean {
  return opacity >= 0.02 && opacity <= 0.08;
}

/**
 * Validiert, ob ein Blur-Wert im goldenen Bereich liegt
 */
export function isValidBlur(blur: string): boolean {
  const validBlurs = ["8px", "16px", "24px", "32px", "40px"];
  return validBlurs.includes(blur);
}

// ============================================================================
// EXPORT
// ============================================================================

export const GOLDSTANDARD = {
  dotPattern: DOT_PATTERN_CONFIG,
  glass: GLASS_TRANSPARENCY,
  blur: BACKDROP_BLUR,
  categoryTints: STATIC_CATEGORY_TINTS,
  tokens: DESIGN_TOKENS,
  utils: {
    createGlassStyle,
    createDotPatternStyle,
    getCategoryTint,
    isValidTransparency,
    isValidBlur,
  },
} as const;

export default GOLDSTANDARD;
