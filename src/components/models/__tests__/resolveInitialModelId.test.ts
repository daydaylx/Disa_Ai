import { describe, expect, it } from "vitest";

import type { ModelEntry } from "@/config/models";

import { resolveInitialModelId } from "../resolveInitialModelId";

const catalog: ModelEntry[] = [
  { id: "model-a", label: "Model A", tags: [], safety: "any" },
  { id: "model-b", label: "Model B", tags: [], safety: "any" },
];

describe("resolveInitialModelId", () => {
  it("returns null when catalog is missing", () => {
    expect(resolveInitialModelId("model-a", null)).toBeNull();
  });

  it("returns null for empty or whitespace-only ids", () => {
    expect(resolveInitialModelId("", catalog)).toBeNull();
    expect(resolveInitialModelId("   ", catalog)).toBeNull();
  });

  it("returns null when preferred id is not found", () => {
    expect(resolveInitialModelId("unknown", catalog)).toBeNull();
  });

  it("returns the preferred id when it exists in catalog", () => {
    expect(resolveInitialModelId("model-b", catalog)).toBe("model-b");
  });

  it("normalizes whitespace around the preferred id", () => {
    expect(resolveInitialModelId(" model-a\n", catalog)).toBe("model-a");
  });
});
