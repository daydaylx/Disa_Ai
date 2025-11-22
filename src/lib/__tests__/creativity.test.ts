import { describe, expect, it } from "vitest";

import { mapCreativityToParams } from "../creativity";

describe("mapCreativityToParams", () => {
  it("maps 0 to lowest bounds", () => {
    const res = mapCreativityToParams(0, "openai/gpt-4o-mini");
    expect(res.temperature).toBeCloseTo(0.1, 4);
    expect(res.top_p).toBeCloseTo(0.75, 4);
    expect(res.presence_penalty).toBeCloseTo(0.0, 4);
  });

  it("maps 20 to first breakpoint", () => {
    const res = mapCreativityToParams(20, "openai/gpt-4o-mini");
    expect(res.temperature).toBeCloseTo(0.3, 4);
    expect(res.top_p).toBeCloseTo(0.85, 4);
    expect(res.presence_penalty).toBeCloseTo(0.1, 4);
  });

  it("maps 60 to second breakpoint", () => {
    const res = mapCreativityToParams(60, "openai/gpt-4o-mini");
    expect(res.temperature).toBeCloseTo(0.8, 4);
    expect(res.top_p).toBeCloseTo(0.95, 4);
    expect(res.presence_penalty).toBeCloseTo(0.2, 4);
  });

  it("maps 100 to upper caps", () => {
    const res = mapCreativityToParams(100, "openai/gpt-4o-mini");
    expect(res.temperature).toBeCloseTo(1.2, 4);
    expect(res.top_p).toBeCloseTo(1.0, 4);
    expect(res.presence_penalty).toBeCloseTo(0.4, 4);
  });

  it("omits presence_penalty when model unknown", () => {
    const res = mapCreativityToParams(50, "provider/unknown-model");
    expect(res.presence_penalty).toBeUndefined();
  });
});
