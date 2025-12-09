/* eslint-disable no-restricted-syntax */
// This file uses direct hex/rgba colors for inline styles, which is necessary
// for dynamic theme application that Tailwind cannot handle at build time.

export type CategoryColorTheme = {
  name: string;
  colors: {
    bg: string; // Background color value (e.g., "rgba(99, 102, 241, 0.05)")
    border: string; // Border color value
    text: string; // Text color value
    iconBg: string; // Icon background color value
    iconText: string; // Icon text color value
    badge: string; // Badge background color value
    badgeText: string; // Badge text color value
    glow: string; // Shadow glow value
  };
};

const THEMES: Record<string, CategoryColorTheme["colors"]> = {
  indigo: {
    bg: "rgba(99, 102, 241, 0.05)", // indigo-500/5
    border: "rgba(99, 102, 241, 0.2)", // indigo-500/20
    text: "#818cf8", // indigo-400
    iconBg: "rgba(99, 102, 241, 0.1)", // indigo-500/10
    iconText: "#818cf8", // indigo-400
    badge: "rgba(99, 102, 241, 0.1)", // indigo-500/10
    badgeText: "#a5b4fc", // indigo-300
    glow: "0 0 20px -10px rgba(99, 102, 241, 0.3)",
  },
  pink: {
    bg: "rgba(236, 72, 153, 0.05)", // pink-500/5
    border: "rgba(236, 72, 153, 0.2)", // pink-500/20
    text: "#f472b6", // pink-400
    iconBg: "rgba(236, 72, 153, 0.1)", // pink-500/10
    iconText: "#f472b6", // pink-400
    badge: "rgba(236, 72, 153, 0.1)", // pink-500/10
    badgeText: "#f9a8d4", // pink-300
    glow: "0 0 20px -10px rgba(236, 72, 153, 0.3)",
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.05)", // amber-500/5
    border: "rgba(245, 158, 11, 0.2)", // amber-500/20
    text: "#fbbf24", // amber-400
    iconBg: "rgba(245, 158, 11, 0.1)", // amber-500/10
    iconText: "#fbbf24", // amber-400
    badge: "rgba(245, 158, 11, 0.1)", // amber-500/10
    badgeText: "#fcd34d", // amber-300
    glow: "0 0 20px -10px rgba(245, 158, 11, 0.3)",
  },
  emerald: {
    bg: "rgba(16, 185, 129, 0.05)", // emerald-500/5
    border: "rgba(16, 185, 129, 0.2)", // emerald-500/20
    text: "#34d399", // emerald-400
    iconBg: "rgba(16, 185, 129, 0.1)", // emerald-500/10
    iconText: "#34d399", // emerald-400
    badge: "rgba(16, 185, 129, 0.1)", // emerald-500/10
    badgeText: "#6ee7b7", // emerald-300
    glow: "0 0 20px -10px rgba(16, 185, 129, 0.3)",
  },
  cyan: {
    bg: "rgba(6, 182, 212, 0.05)", // cyan-500/5
    border: "rgba(6, 182, 212, 0.2)", // cyan-500/20
    text: "#22d3ee", // cyan-400
    iconBg: "rgba(6, 182, 212, 0.1)", // cyan-500/10
    iconText: "#22d3ee", // cyan-400
    badge: "rgba(6, 182, 212, 0.1)", // cyan-500/10
    badgeText: "#67e8f9", // cyan-300
    glow: "0 0 20px -10px rgba(6, 182, 212, 0.3)",
  },
  violet: {
    bg: "rgba(139, 92, 246, 0.05)", // violet-500/5
    border: "rgba(139, 92, 246, 0.2)", // violet-500/20
    text: "#a78bfa", // violet-400
    iconBg: "rgba(139, 92, 246, 0.1)", // violet-500/10
    iconText: "#a78bfa", // violet-400
    badge: "rgba(139, 92, 246, 0.1)", // violet-500/10
    badgeText: "#c4b5fd", // violet-300
    glow: "0 0 20px -10px rgba(139, 92, 246, 0.3)",
  },
  rose: {
    bg: "rgba(244, 63, 94, 0.05)", // rose-500/5
    border: "rgba(244, 63, 94, 0.2)", // rose-500/20
    text: "#fb7185", // rose-400
    iconBg: "rgba(244, 63, 94, 0.1)", // rose-500/10
    iconText: "#fb7185", // rose-400
    badge: "rgba(244, 63, 94, 0.1)", // rose-500/10
    badgeText: "#fda4af", // rose-300
    glow: "0 0 20px -10px rgba(244, 63, 94, 0.3)",
  },
  slate: {
    bg: "rgba(100, 116, 139, 0.05)", // slate-500/5
    border: "rgba(100, 116, 139, 0.2)", // slate-500/20
    text: "#94a3b8", // slate-400
    iconBg: "rgba(100, 116, 139, 0.1)", // slate-500/10
    iconText: "#94a3b8", // slate-400
    badge: "rgba(100, 116, 139, 0.1)", // slate-500/10
    badgeText: "#cbd5e1", // slate-300
    glow: "none",
  },
};

const CATEGORY_MAPPING: Record<string, string> = {
  // Roles
  "Business & Karriere": "indigo",
  "Kreativ & Unterhaltung": "pink",
  "Lernen & Bildung": "amber",
  "Leben & Familie": "emerald",
  "Experten & Beratung": "cyan",
  Alltag: "slate",
  Erwachsene: "rose",
  Spezial: "violet",

  // Quickstarts / Topics
  business: "indigo",
  creative: "pink",
  writing: "pink",
  education: "amber",
  life: "emerald",
  expert: "cyan",
  science: "cyan",
  tech: "cyan",
  fun: "pink",
  culture: "violet",
  everyday: "slate",
  verschwörungstheorien: "violet",
};

export function getCategoryStyle(category?: string | null): CategoryColorTheme["colors"] {
  if (!category) return THEMES.slate;

  // Direct match
  if (THEMES[category]) return THEMES[category];

  // Mapped match
  const mapped = CATEGORY_MAPPING[category];
  if (mapped && THEMES[mapped]) return THEMES[mapped];

  // Fuzzy search / fallback
  const lowerCat = category.toLowerCase();
  for (const [key, themeName] of Object.entries(CATEGORY_MAPPING)) {
    if (lowerCat.includes(key.toLowerCase())) {
      return THEMES[themeName];
    }
  }

  return THEMES.slate;
}

// Helper to cycle colors for lists without categories
const COLOR_KEYS = Object.keys(THEMES).filter((k) => k !== "slate");
export function getCycleColor(index: number): CategoryColorTheme["colors"] {
  const key = COLOR_KEYS[index % COLOR_KEYS.length];
  return THEMES[key];
}
