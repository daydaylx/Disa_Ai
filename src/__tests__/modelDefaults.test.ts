import { describe, expect, it } from "vitest";

import modelsMetadata from "../../public/models_metadata.json";
import { DEFAULT_MODEL_ID, isAllowedModelId } from "../config/modelDefaults";

describe("model defaults", () => {
  const curatedIds = Object.keys(modelsMetadata);
  const knownCuratedId = curatedIds[0];

  it("exposes a default model id that is validated against the catalog", () => {
    if (DEFAULT_MODEL_ID) {
      expect(isAllowedModelId(DEFAULT_MODEL_ID)).toBe(true);
    } else {
      expect(DEFAULT_MODEL_ID).toBe("");
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
