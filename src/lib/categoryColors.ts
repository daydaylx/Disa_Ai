export type CategoryColorTheme = {
  name: string;
  colors: {
    bg: string; // Background tint (e.g., bg-indigo-500/10)
    border: string; // Border color (e.g., border-indigo-500/20)
    text: string; // Text color (e.g., text-indigo-400)
    iconBg: string; // Icon background (e.g., bg-indigo-500/20)
    iconText: string; // Icon text color (e.g., text-indigo-300)
    badge: string; // Badge bg (e.g., bg-indigo-500/10)
    badgeText: string; // Badge text (e.g., text-indigo-300)
    glow: string; // Shadow glow (e.g., shadow-indigo-500/20)
  };
};

const THEMES: Record<string, CategoryColorTheme["colors"]> = {
  indigo: {
    bg: "bg-indigo-500/5",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-400",
    badge: "bg-indigo-500/10",
    badgeText: "text-indigo-300",
    glow: "shadow-[0_0_20px_-10px_rgba(99,102,241,0.3)]", // indigo-500
  },
  pink: {
    bg: "bg-pink-500/5",
    border: "border-pink-500/20",
    text: "text-pink-400",
    iconBg: "bg-pink-500/10",
    iconText: "text-pink-400",
    badge: "bg-pink-500/10",
    badgeText: "text-pink-300",
    glow: "shadow-[0_0_20px_-10px_rgba(236,72,153,0.3)]", // pink-500
  },
  amber: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    text: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    badge: "bg-amber-500/10",
    badgeText: "text-amber-300",
    glow: "shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)]", // amber-500
  },
  emerald: {
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    badge: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
    glow: "shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]", // emerald-500
  },
  cyan: {
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400",
    badge: "bg-cyan-500/10",
    badgeText: "text-cyan-300",
    glow: "shadow-[0_0_20px_-10px_rgba(6,182,212,0.3)]", // cyan-500
  },
  violet: {
    bg: "bg-violet-500/5",
    border: "border-violet-500/20",
    text: "text-violet-400",
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-400",
    badge: "bg-violet-500/10",
    badgeText: "text-violet-300",
    glow: "shadow-[0_0_20px_-10px_rgba(139,92,246,0.3)]", // violet-500
  },
  rose: {
    bg: "bg-rose-500/5",
    border: "border-rose-500/20",
    text: "text-rose-400",
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-400",
    badge: "bg-rose-500/10",
    badgeText: "text-rose-300",
    glow: "shadow-[0_0_20px_-10px_rgba(244,63,94,0.3)]", // rose-500
  },
  slate: {
    bg: "bg-slate-500/5",
    border: "border-slate-500/20",
    text: "text-slate-400",
    iconBg: "bg-slate-500/10",
    iconText: "text-slate-400",
    badge: "bg-slate-500/10",
    badgeText: "text-slate-300",
    glow: "shadow-none",
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
