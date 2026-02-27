import { describe, expect, it } from "vitest";

import { getChatLogoState } from "../app/components/logoState";

describe("getChatLogoState", () => {
  it("returns error when chat has an error", () => {
    expect(
      getChatLogoState({
        hasError: true,
        isLoading: false,
        inputValue: "hello",
      }),
    ).toBe("error");
  });

  it("returns thinking while loading", () => {
    expect(
      getChatLogoState({
        hasError: false,
        isLoading: true,
        inputValue: "hello",
      }),
    ).toBe("thinking");
  });

  it("returns typing when input contains text", () => {
    expect(
      getChatLogoState({
        hasError: false,
        isLoading: false,
        inputValue: "hi there",
      }),
    ).toBe("typing");
  });

  it("returns idle for empty or whitespace input", () => {
    expect(
      getChatLogoState({
        hasError: false,
        isLoading: false,
        inputValue: "   ",
      }),
    ).toBe("idle");
  });
});
