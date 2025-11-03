import { describe, expect, test } from "vitest";

import { categorizeModelFromTags } from "../EnhancedModelsInterface";

describe("categorizeModelFromTags", () => {
  test("should categorize free fast models as quick-free", () => {
    expect(categorizeModelFromTags(["fast"], true)).toBe("quick-free");
  });

  test("should categorize other free models as strong-free", () => {
    expect(categorizeModelFromTags(["other"], true)).toBe("strong-free");
    expect(categorizeModelFromTags([], true)).toBe("strong-free");
  });

  test("should categorize multimodal models as multimodal", () => {
    expect(categorizeModelFromTags(["multimodal"], false)).toBe("multimodal");
  });

  test("should categorize creative models as creative-uncensored", () => {
    expect(categorizeModelFromTags(["creative"], false)).toBe("creative-uncensored");
  });

  test("should categorize budget models as budget-specialist", () => {
    expect(categorizeModelFromTags(["budget"], false)).toBe("budget-specialist");
  });

  test("should categorize premium models as premium-models", () => {
    expect(categorizeModelFromTags(["premium"], false)).toBe("premium-models");
  });

  test("should categorize unmatched models as chat-allrounder", () => {
    expect(categorizeModelFromTags(["unmatched"], false)).toBe("chat-allrounder");
    expect(categorizeModelFromTags([], false)).toBe("chat-allrounder");
  });
});
