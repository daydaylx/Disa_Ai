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
        "surface0": "rgba(12, 16, 23, 0.94)",
        "surface1": "rgba(17, 22, 31, 0.96)",
        "surface2": "rgba(23, 29, 41, 0.98)",
      }
    `);
  });
});
