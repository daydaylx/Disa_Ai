import { describe, it, expect } from "vitest";
import { composeSystemPrompt } from "../../src/features/prompt/composeSystemPrompt";

describe("composeSystemPrompt", () => {
  it("builds prompt with style only", () => {
    const s = composeSystemPrompt({
      style: "concise" as any,
      useRoleStyle: false,
      roleId: null,
      allowNSFW: false,
    });
    expect(s).toMatch(/sachlicher/);
    expect(s).toMatch(/Richtlinien/);
  });

  it("includes role overlay when enabled", () => {
    const s = composeSystemPrompt({
      style: "minimal" as any,
      useRoleStyle: true,
      roleId: "any-role",
      allowNSFW: true,
    });
    expect(s).toMatch(/Feintuning:/);
  });
});
