import { describe, expect, it } from "vitest";

import { FALLBACK_MODEL_ID, isAllowedModelId } from "../config/modelDefaults";
import modelsMetadata from "../config/models_metadata.json";

describe("modelDefaults", () => {
  it("should validate allowed model IDs", () => {
    expect(isAllowedModelId(FALLBACK_MODEL_ID)).toBe(true);
    expect(isAllowedModelId("invalid/model")).toBe(false);
  });
});

describe("model defaults", () => {
  const curatedIds = Object.keys(modelsMetadata);
  const knownCuratedId = curatedIds[0];

  it("exposes a default model id that is validated against the catalog", () => {
    if (FALLBACK_MODEL_ID) {
      expect(isAllowedModelId(FALLBACK_MODEL_ID)).toBe(true);
    } else {
      expect(FALLBACK_MODEL_ID).toBe("");
    }
  });

  it("accepts curated ids and rejects unknown entries", () => {
    if (knownCuratedId) {
      expect(isAllowedModelId(knownCuratedId)).toBe(true);
    }
    expect(isAllowedModelId("unknown/provider-model")).toBe(false);
  });

  it("accepts dynamically supplied models when not part of metadata", () => {
    expect(isAllowedModelId("custom/model", [{ id: "custom/model" }])).toBe(true);
  });
});
