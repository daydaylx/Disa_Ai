import { describe, expect, it } from "vitest";

import { composeSystemPrompt } from "../../src/features/prompt/composeSystemPrompt";

describe("composeSystemPrompt", () => {
  it("builds prompt with style only", () => {
    const s = composeSystemPrompt({
      style: "concise" as any,
      useRoleStyle: false,
      roleId: null,
    });
    expect(s).toMatch(/sachlicher/);
  });

  it("includes role overlay when enabled", () => {
    const s = composeSystemPrompt({
      style: "minimal" as any,
      useRoleStyle: true,
      roleId: "any-role",
    });
    expect(s).toMatch(/Feintuning:/);
  });
});
