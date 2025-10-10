type Hsl = { h: number; s: number; l: number };

export type GlassTint = { from: string; to: string };

// Recommended opacity range: 0.12-0.22 for optimal glass effect
export const DEFAULT_GLASS_VARIANTS = [
  "linear-gradient(135deg, rgba(110,72,255,0.18) 0%, rgba(13,148,255,0.15) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(245,158,11,0.15) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(59,130,246,0.15) 100%)",
  "linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(244,114,182,0.15) 100%)",
];

// Friendly warm color palette - unified as primary palette
export const FRIENDLY_GLASS_VARIANTS = [
  "linear-gradient(135deg, rgba(192,132,252,0.20) 0%, rgba(14,165,233,0.15) 100%)", // Lavender to Sky
  "linear-gradient(135deg, rgba(244,114,182,0.20) 0%, rgba(251,191,36,0.15) 100%)", // Blossom Peach
  "linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(110,231,183,0.12) 100%)", // Mint Meadow
  "linear-gradient(135deg, rgba(251,191,36,0.20) 0%, rgba(249,115,22,0.15) 100%)", // Golden Honey
  "linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.15) 100%)", // Fuchsia Glow
  "linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(129,140,248,0.15) 100%)", // Sky Evening
];

// Deprecated - Use FRIENDLY_GLASS_VARIANTS instead
export const GOLDEN_GLASS_VARIANTS = [
  "linear-gradient(135deg, rgba(255,223,120,0.25) 0%, rgba(255,179,71,0.18) 100%)",
  "linear-gradient(135deg, rgba(255,215,141,0.22) 0%, rgba(255,190,92,0.16) 100%)",
  "linear-gradient(135deg, rgba(255,240,190,0.20) 0%, rgba(255,203,122,0.15) 100%)",
  "linear-gradient(135deg, rgba(255,230,160,0.22) 0%, rgba(255,192,100,0.16) 100%)",
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
    alphaStart = 0.22,
    alphaEnd = 0.15,
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
      from: "hsla(32, 96%, 67%, 0.20)",
      to: "hsla(20, 92%, 54%, 0.15)",
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
    from: toHsla(start, 0.2),
    to: toHsla(end, 0.15),
  };
}

export function gradientToTint(gradient: string): GlassTint | null {
  const match = gradient.match(/linear-gradient\([^,]+,\s*(.*?)\s+0%,\s*(.*?)\s+100%\)/i);
  if (!match) return null;
  const [, from, to] = match;
  if (!from || !to) return null;
  return { from: from.trim(), to: to.trim() };
}

// Friendly tint combinations - reduced opacity for subtlety
export const FRIENDLY_TINTS: GlassTint[] = [
  {
    from: "hsla(262, 82%, 74%, 0.20)", // Lavender
    to: "hsla(200, 87%, 68%, 0.15)", // Soft Sky
  },
  {
    from: "hsla(335, 86%, 72%, 0.20)", // Blossom Pink
    to: "hsla(24, 92%, 67%, 0.15)", // Peach Glow
  },
  {
    from: "hsla(160, 82%, 66%, 0.18)", // Mint
    to: "hsla(188, 84%, 62%, 0.12)", // Aqua
  },
  {
    from: "hsla(42, 92%, 70%, 0.20)", // Golden Light
    to: "hsla(16, 86%, 64%, 0.15)", // Amber Coral
  },
  {
    from: "hsla(280, 88%, 74%, 0.18)", // Orchid
    to: "hsla(312, 84%, 68%, 0.15)", // Fuchsia Mist
  },
  {
    from: "hsla(202, 86%, 70%, 0.18)", // Daybreak Blue
    to: "hsla(186, 88%, 64%, 0.15)", // Lagoon
  },
];

// Hilfsfunktion um einen zufälligen freundlichen Tint zu erhalten
export function getRandomFriendlyTint(): GlassTint {
  return FRIENDLY_TINTS[Math.floor(Math.random() * FRIENDLY_TINTS.length)] ?? FRIENDLY_TINTS[0]!;
}
