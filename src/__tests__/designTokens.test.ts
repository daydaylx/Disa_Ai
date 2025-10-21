import { describe, expect, it } from "vitest";

import { designTokens } from "../styles/design-tokens";

describe("design tokens", () => {
  it("provides a WCAG-compliant text scale", () => {
    expect(designTokens.text).toMatchInlineSnapshot(`
      {
        "muted": "rgba(204, 216, 233, 0.78)",
        "primary": "#dde6f6",
        "strong": "#f4f7ff",
        "subtle": "rgba(204, 216, 233, 0.62)",
      }
    `);
  });

  it("exposes dark-surface layers for consistent contrast", () => {
    expect({
      surface0: designTokens.colors.surface0,
      surface1: designTokens.colors.surface1,
      surface2: designTokens.colors.surface2,
    }).toMatchInlineSnapshot(`
      {
        "surface0": "rgba(13, 17, 24, 0.82)",
        "surface1": "rgba(18, 23, 32, 0.88)",
        "surface2": "rgba(24, 30, 42, 0.92)",
      }
    `);
  });
});
