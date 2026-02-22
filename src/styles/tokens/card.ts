export interface CardTokens {
  radius: string;
  background: string;
  borderWidth: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  shadow: string;
  shadowHover: string;
  shadowFocus: string;
  shadowPressed: string;

  tintAngle: string;
  tintFadeX: string;
  tintAlphaSoft: string;
  tintAlphaHero: string;
  tintAlphaStrong: string;
  tintColorDefault: string;

  roleTeal: string;
  roleMagenta: string;
}

export const cardTokens: CardTokens = {
  radius: "16px",
  background: "rgba(16, 20, 30, 0.78)",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.08)",
  borderColorHover: "rgba(255, 255, 255, 0.12)",
  borderColorFocus: "rgba(139, 92, 246, 0.30)",
  shadow: "0 6px 18px rgba(0, 0, 0, 0.32)",
  shadowHover: "0 10px 26px rgba(0, 0, 0, 0.38)",
  shadowFocus: "0 0 0 2px rgba(139, 92, 246, 0.34), 0 10px 26px rgba(0, 0, 0, 0.38)",
  shadowPressed: "0 4px 14px rgba(0, 0, 0, 0.42)",

  tintAngle: "90deg", // Horizontal gradient (left → right)
  tintFadeX: "65%", // Tint geometry: fade until 65% (was 80%)
  tintAlphaSoft: "0.08", // Global cards: soft tint
  tintAlphaHero: "0.16", // Hero cards: slightly stronger tint
  tintAlphaStrong: "0.20", // Strong tint for selected accents
  tintColorDefault: "139 92 246",

  roleTeal: "45 212 191",
  roleMagenta: "236 72 153",
};

export const cardCssVars = {
  radius: "--card-radius",
  background: "--card-bg",
  borderWidth: "--card-border-width",
  borderColor: "--card-border-color",
  borderColorHover: "--card-border-color-hover",
  borderColorFocus: "--card-border-color-focus",
  shadow: "--card-shadow",
  shadowHover: "--card-shadow-hover",
  shadowFocus: "--card-shadow-focus",
  shadowPressed: "--card-shadow-pressed",

  tintAngle: "--tint-angle",
  tintFadeX: "--tint-fade-x",
  tintAlphaSoft: "--tint-alpha-soft",
  tintAlphaHero: "--tint-alpha-hero",
  tintAlphaStrong: "--tint-alpha-strong",
  tintColorDefault: "--tint-color-rgb-default",

  roleTeal: "--role-teal-rgb",
  roleMagenta: "--role-magenta-rgb",
} as const;

export function generateCardCssVariables(): Record<string, string> {
  return {
    [cardCssVars.radius]: cardTokens.radius,
    [cardCssVars.background]: cardTokens.background,
    [cardCssVars.borderWidth]: cardTokens.borderWidth,
    [cardCssVars.borderColor]: cardTokens.borderColor,
    [cardCssVars.borderColorHover]: cardTokens.borderColorHover,
    [cardCssVars.borderColorFocus]: cardTokens.borderColorFocus,
    [cardCssVars.shadow]: cardTokens.shadow,
    [cardCssVars.shadowHover]: cardTokens.shadowHover,
    [cardCssVars.shadowFocus]: cardTokens.shadowFocus,
    [cardCssVars.shadowPressed]: cardTokens.shadowPressed,
    [cardCssVars.tintAngle]: cardTokens.tintAngle,
    [cardCssVars.tintFadeX]: cardTokens.tintFadeX,
    [cardCssVars.tintAlphaSoft]: cardTokens.tintAlphaSoft,
    [cardCssVars.tintAlphaHero]: cardTokens.tintAlphaHero,
    [cardCssVars.tintAlphaStrong]: cardTokens.tintAlphaStrong,
    [cardCssVars.tintColorDefault]: cardTokens.tintColorDefault,
    [cardCssVars.roleTeal]: cardTokens.roleTeal,
    [cardCssVars.roleMagenta]: cardTokens.roleMagenta,
  };
}
