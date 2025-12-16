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
  tintAlphaStrong: string;
  tintColorDefault: string;

  roleTeal: string;
  roleMagenta: string;
}

export const cardTokens: CardTokens = {
  radius: "18px",
  background: "rgba(12, 12, 18, 0.72)",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.08)",
  borderColorHover: "rgba(255, 255, 255, 0.14)",
  borderColorFocus: "rgba(139, 92, 246, 0.4)",
  shadow: "0 10px 40px rgba(0, 0, 0, 0.35)",
  shadowHover: "0 12px 48px rgba(0, 0, 0, 0.4)",
  shadowFocus: "0 8px 32px rgba(139, 92, 246, 0.18), 0 10px 40px rgba(0, 0, 0, 0.35)",
  shadowPressed: "0 6px 24px rgba(0, 0, 0, 0.45)",

  tintAngle: "115deg",
  tintFadeX: "72%",
  tintAlphaSoft: "0.08",
  tintAlphaStrong: "0.25",
  tintColorDefault: "139, 92, 246",

  roleTeal: "45, 212, 191",
  roleMagenta: "236, 72, 153",
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
    [cardCssVars.tintAlphaStrong]: cardTokens.tintAlphaStrong,
    [cardCssVars.tintColorDefault]: cardTokens.tintColorDefault,
    [cardCssVars.roleTeal]: cardTokens.roleTeal,
    [cardCssVars.roleMagenta]: cardTokens.roleMagenta,
  };
}
