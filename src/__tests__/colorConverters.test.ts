import { describe, expect, it } from "vitest";

import { rgbaToHsla } from "../utils/colorConverters";

describe("rgbaToHsla", () => {
  it("should convert black correctly", () => {
    expect(rgbaToHsla(0, 0, 0, 1)).toBe("hsla(0,0%,0%,1)");
  });

  it("should convert white correctly", () => {
    expect(rgbaToHsla(255, 255, 255, 1)).toBe("hsla(0,0%,100%,1)");
  });

  it("should convert red correctly", () => {
    expect(rgbaToHsla(255, 0, 0, 1)).toBe("hsla(0,100%,50%,1)");
  });

  it("should convert green correctly", () => {
    expect(rgbaToHsla(0, 255, 0, 1)).toBe("hsla(120,100%,50%,1)");
  });

  it("should convert blue correctly", () => {
    expect(rgbaToHsla(0, 0, 255, 1)).toBe("hsla(240,100%,50%,1)");
  });

  it("should handle alpha correctly", () => {
    expect(rgbaToHsla(255, 0, 0, 0.5)).toBe("hsla(0,100%,50%,0.5)");
  });
});
