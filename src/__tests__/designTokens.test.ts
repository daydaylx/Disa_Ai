import { describe, expect, it } from "vitest";

import { designTokens, getDesignTokenVariables } from "../styles/design-tokens";
import { colorTokens } from "../styles/tokens/color";
import { motionTokens } from "../styles/tokens/motion";
import { typographyTokens } from "../styles/tokens/typography";

describe("design tokens", () => {
  it("exposes semantic surface layers for light mode", () => {
    expect(designTokens.color.light.surfaces).toEqual(colorTokens.light.surfaces);
  });

  it("maps dark-mode typography tokens to CSS variables", () => {
    const vars = getDesignTokenVariables("dark");

    expect(vars["--font-size-body"]).toBe(typographyTokens.textStyles.body.fontSize);
    expect(vars["--line-height-body"]).toBe(typographyTokens.textStyles.body.lineHeight);
    expect(vars["--color-text-primary"]).toBe(colorTokens.dark.text.primary);
  });

  it("keeps motion tokens within soft-depth durations", () => {
    expect(designTokens.motion.duration).toEqual(motionTokens.duration);
  });
});
