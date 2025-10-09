type Hsl = { h: number; s: number; l: number };

export type GlassTint = { from: string; to: string };

export const DEFAULT_GLASS_VARIANTS = [
  "linear-gradient(135deg, rgba(110,72,255,0.28) 0%, rgba(13,148,255,0.24) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.28) 0%, rgba(245,158,11,0.24) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.28) 0%, rgba(59,130,246,0.22) 100%)",
  "linear-gradient(135deg, rgba(251,191,36,0.28) 0%, rgba(244,114,182,0.22) 100%)",
];

// Freundlichere, wärmere Farbpalette für bessere Glassmorphismus-Integration
export const FRIENDLY_GLASS_VARIANTS = [
  "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.20) 100%)", // Warm Purple to Blue
  "linear-gradient(135deg, rgba(236,72,153,0.25) 0%, rgba(251,146,60,0.20) 100%)", // Pink to Orange
  "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(34,197,94,0.20) 100%)", // Emerald to Green
  "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(249,115,22,0.20) 100%)", // Yellow to Orange
  "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(217,70,239,0.20) 100%)", // Purple to Fuchsia
  "linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(6,182,212,0.20) 100%)", // Sky to Cyan
];

export const GOLDEN_GLASS_VARIANTS = [
  "linear-gradient(135deg, rgba(255,223,120,0.42) 0%, rgba(255,179,71,0.32) 100%)",
  "linear-gradient(135deg, rgba(255,215,141,0.36) 0%, rgba(255,190,92,0.28) 100%)",
  "linear-gradient(135deg, rgba(255,240,190,0.34) 0%, rgba(255,203,122,0.26) 100%)",
  "linear-gradient(135deg, rgba(255,230,160,0.38) 0%, rgba(255,192,100,0.28) 100%)",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function wrapHue(hue: number) {
  const mod = hue % 360;
  return mod < 0 ? mod + 360 : mod;
}

function parseHsl(color: string): Hsl | null {
  const match = color.match(/hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%/i);
  if (!match) return null;
  const [, h, s, l] = match;
  if (h === undefined || s === undefined || l === undefined) return null;
  return {
    h: Number.parseFloat(h),
    s: Number.parseFloat(s),
    l: Number.parseFloat(l),
  };
}

function toHsla({ h, s, l }: Hsl, alpha: number) {
  return `hsla(${wrapHue(h).toFixed(2)}, ${clamp(s, 0, 100).toFixed(2)}%, ${clamp(l, 0, 100).toFixed(2)}%, ${clamp(alpha, 0, 1).toFixed(2)})`;
}

export function createGlassGradient(
  accentColor: string,
  options?: {
    hueShiftStart?: number;
    hueShiftEnd?: number;
    lightnessStart?: number;
    lightnessEnd?: number;
    alphaStart?: number;
    alphaEnd?: number;
  },
): string {
  const parsed = parseHsl(accentColor);
  if (!parsed) {
    return (
      DEFAULT_GLASS_VARIANTS[0] ??
      "linear-gradient(135deg, rgba(255,223,120,0.42) 0%, rgba(255,179,71,0.32) 100%)"
    );
  }

  const {
    hueShiftStart = 0,
    hueShiftEnd = 28,
    lightnessStart = 18,
    lightnessEnd = -8,
    alphaStart = 0.45,
    alphaEnd = 0.28,
  } = options ?? {};

  const start: Hsl = {
    h: parsed.h + hueShiftStart,
    s: parsed.s,
    l: parsed.l + lightnessStart,
  };
  const end: Hsl = {
    h: parsed.h + hueShiftEnd,
    s: parsed.s,
    l: parsed.l + lightnessEnd,
  };

  return `linear-gradient(135deg, ${toHsla(start, alphaStart)} 0%, ${toHsla(end, alphaEnd)} 100%)`;
}

export function createGlassGradientVariants(accentColor: string): string[] {
  const parsed = parseHsl(accentColor);
  if (!parsed) return DEFAULT_GLASS_VARIANTS;

  const shifts = [
    { hueShiftStart: 0, hueShiftEnd: 28 },
    { hueShiftStart: -18, hueShiftEnd: 18 },
    { hueShiftStart: 24, hueShiftEnd: -24 },
    { hueShiftStart: 12, hueShiftEnd: 42 },
  ];

  return shifts.map((shift, index) =>
    createGlassGradient(accentColor, {
      ...shift,
      lightnessStart: 20 + index * 2,
      lightnessEnd: -6 - index * 1.5,
      alphaStart: 0.5,
      alphaEnd: 0.3,
    }),
  );
}

export function createGlassBorder(accentColor: string): string {
  const parsed = parseHsl(accentColor);
  if (!parsed) return "rgba(255,255,255,0.16)";
  const start = toHsla({ h: parsed.h, s: parsed.s, l: parsed.l + 25 }, 0.55);
  const end = toHsla({ h: parsed.h + 24, s: parsed.s, l: parsed.l + 10 }, 0.18);
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
}

export function createRoleTint(accentColor?: string): GlassTint {
  const parsed = accentColor ? parseHsl(accentColor) : null;
  if (!parsed) {
    return {
      from: "hsla(32, 96%, 67%, 0.92)",
      to: "hsla(20, 92%, 54%, 0.72)",
    };
  }

  const start: Hsl = {
    h: parsed.h,
    s: clamp(parsed.s + 4, 0, 100),
    l: clamp(parsed.l + 14, 0, 100),
  };
  const end: Hsl = {
    h: parsed.h + 18,
    s: clamp(parsed.s, 0, 100),
    l: clamp(parsed.l - 8, 0, 100),
  };

  return {
    from: toHsla(start, 0.92),
    to: toHsla(end, 0.72),
  };
}

export function gradientToTint(gradient: string): GlassTint | null {
  const match = gradient.match(/linear-gradient\([^,]+,\s*(.*?)\s+0%,\s*(.*?)\s+100%\)/i);
  if (!match) return null;
  const [, from, to] = match;
  if (!from || !to) return null;
  return { from: from.trim(), to: to.trim() };
}

// Freundliche Tint-Farbkombinationen für bessere Lesbarkeit und wärmere Ausstrahlung
export const FRIENDLY_TINTS: GlassTint[] = [
  {
    from: "hsla(262, 83%, 58%, 0.85)", // Warm Purple
    to: "hsla(217, 91%, 60%, 0.65)", // Soft Blue
  },
  {
    from: "hsla(330, 81%, 60%, 0.85)", // Warm Pink
    to: "hsla(25, 95%, 53%, 0.65)", // Gentle Orange
  },
  {
    from: "hsla(160, 84%, 39%, 0.85)", // Fresh Emerald
    to: "hsla(142, 76%, 36%, 0.65)", // Deep Green
  },
  {
    from: "hsla(43, 96%, 56%, 0.85)", // Bright Yellow
    to: "hsla(20, 90%, 48%, 0.65)", // Warm Orange
  },
  {
    from: "hsla(271, 91%, 65%, 0.85)", // Light Purple
    to: "hsla(292, 84%, 61%, 0.65)", // Soft Fuchsia
  },
  {
    from: "hsla(199, 89%, 48%, 0.85)", // Sky Blue
    to: "hsla(188, 94%, 43%, 0.65)", // Cyan
  },
];

// Hilfsfunktion um einen zufälligen freundlichen Tint zu erhalten
export function getRandomFriendlyTint(): GlassTint {
  return FRIENDLY_TINTS[Math.floor(Math.random() * FRIENDLY_TINTS.length)] ?? FRIENDLY_TINTS[0]!;
}
