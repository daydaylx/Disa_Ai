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
  "linear-gradient(135deg, rgba(192,132,252,0.32) 0%, rgba(14,165,233,0.22) 100%)", // Lavender to Sky
  "linear-gradient(135deg, rgba(244,114,182,0.32) 0%, rgba(251,191,36,0.22) 100%)", // Blossom Peach
  "linear-gradient(135deg, rgba(52,211,153,0.30) 0%, rgba(110,231,183,0.20) 100%)", // Mint Meadow
  "linear-gradient(135deg, rgba(251,191,36,0.32) 0%, rgba(249,115,22,0.22) 100%)", // Golden Honey
  "linear-gradient(135deg, rgba(236,72,153,0.30) 0%, rgba(168,85,247,0.22) 100%)", // Fuchsia Glow
  "linear-gradient(135deg, rgba(56,189,248,0.30) 0%, rgba(129,140,248,0.22) 100%)", // Sky Evening
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
      from: "hsla(32, 5%, 67%, 0.92)",
      to: "hsla(20, 5%, 54%, 0.72)",
    };
  }

  const start: Hsl = {
    h: parsed.h,
    s: 5,
    l: clamp(parsed.l + 14, 0, 100),
  };
  const end: Hsl = {
    h: parsed.h + 18,
    s: 5,
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
    from: "hsla(262, 5%, 74%, 0.78)", // Lavender
    to: "hsla(200, 5%, 68%, 0.55)", // Soft Sky
  },
  {
    from: "hsla(335, 5%, 72%, 0.78)", // Blossom Pink
    to: "hsla(24, 5%, 67%, 0.55)", // Peach Glow
  },
  {
    from: "hsla(160, 5%, 66%, 0.78)", // Mint
    to: "hsla(188, 5%, 62%, 0.55)", // Aqua
  },
  {
    from: "hsla(42, 5%, 70%, 0.78)", // Golden Light
    to: "hsla(16, 5%, 64%, 0.55)", // Amber Coral
  },
  {
    from: "hsla(280, 5%, 74%, 0.78)", // Orchid
    to: "hsla(312, 5%, 68%, 0.55)", // Fuchsia Mist
  },
  {
    from: "hsla(202, 5%, 70%, 0.78)", // Daybreak Blue
    to: "hsla(186, 5%, 64%, 0.55)", // Lagoon
  },
];

// Hilfsfunktion um einen zufälligen freundlichen Tint zu erhalten
export function getRandomFriendlyTint(): GlassTint {
  return FRIENDLY_TINTS[Math.floor(Math.random() * FRIENDLY_TINTS.length)] ?? FRIENDLY_TINTS[0]!;
}
