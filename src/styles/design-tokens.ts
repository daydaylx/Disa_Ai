import { generateCategoryTokens } from "./tokens/category-colors";
import { colorCssVars, colorTokens, type ThemeMode } from "./tokens/color";
import { motionCssVars, motionTokens } from "./tokens/motion";
import { radiusCssVars, radiusTokens } from "./tokens/radius";
import { shadowCssVars, shadowTokens } from "./tokens/shadow";
import { spacingCssVars, spacingTokens } from "./tokens/spacing";
import { typographyCssVars, typographyTokens } from "./tokens/typography";

interface CssVariableTree {
  [key: string]: string | CssVariableTree;
}

type CssVariableMap = Record<string, string>;

function assignVariables(
  target: CssVariableMap,
  mapping: CssVariableTree,
  source: Record<string, unknown>,
) {
  for (const [key, reference] of Object.entries(mapping)) {
    const value = source[key];

    if (typeof reference === "string") {
      if (typeof value === "undefined" || value === null) continue;
      target[reference] = String(value);
      continue;
    }

    if (typeof value === "object" && value !== null) {
      assignVariables(target, reference, value as Record<string, unknown>);
    }
  }
}

export function getDesignTokenVariables(mode: ThemeMode): CssVariableMap {
  const variableMap: CssVariableMap = {};

  assignVariables(variableMap, colorCssVars, colorTokens[mode] as Record<string, unknown>);
  assignVariables(variableMap, shadowCssVars, shadowTokens[mode] as Record<string, unknown>);
  assignVariables(variableMap, motionCssVars, motionTokens as unknown as Record<string, unknown>);
  assignVariables(variableMap, spacingCssVars, spacingTokens as unknown as Record<string, unknown>);
  assignVariables(variableMap, radiusCssVars, radiusTokens as unknown as Record<string, unknown>);
  assignVariables(
    variableMap,
    typographyCssVars,
    typographyTokens as unknown as Record<string, unknown>,
  );

  // Add category color tokens
  const categoryTokens = generateCategoryTokens();
  Object.assign(variableMap, categoryTokens);

  return variableMap;
}

export const designTokens = {
  color: colorTokens,
  spacings: spacingTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  motion: motionTokens,
  typography: typographyTokens,
} as const;

export type DesignTokens = typeof designTokens;
