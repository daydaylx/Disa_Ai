/**
 * Settings constants and magic numbers
 */

// Preset matching tolerance
export const PRESET_MATCH_TOLERANCE = 10; // Allow ±10 points deviation for preset detection

// Creativity thresholds
export const CREATIVITY_THRESHOLD_PRECISE = 20;
export const CREATIVITY_THRESHOLD_BALANCED = 60;

// Creativity labels
export const CREATIVITY_LABELS = {
  PRECISE: "Präzise",
  BALANCED: "Ausgewogen",
  CREATIVE: "Fantasie",
} as const;

// Font size limits
export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 24;
export const FONT_SIZE_STEP = 1;

// Creativity limits
export const CREATIVITY_MIN = 0;
export const CREATIVITY_MAX = 100;

// Max sentences options
export const MAX_SENTENCES_OPTIONS = [5, 8, 12, 20] as const;

// Max sentences labels
export const MAX_SENTENCES_LABELS: Record<number, string> = {
  5: "Kurz (5)",
  8: "Standard (8)",
  12: "Lang (12)",
  20: "Max (20)",
};

// Theme options
export const THEME_OPTIONS = [
  { value: "light", label: "Hell" },
  { value: "dark", label: "Dunkel" },
  { value: "auto", label: "Auto" },
] as const;
