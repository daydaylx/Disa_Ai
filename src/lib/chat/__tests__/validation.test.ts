import { describe, expect, it } from "vitest";

import { MAX_PROMPT_LENGTH, sanitizePrompt, validatePrompt } from "../validation";

describe("sanitizePrompt", () => {
  it("trims surrounding whitespace and normalises line endings", () => {
    const result = sanitizePrompt("\n  Hello\r\nWorld  \t");
    expect(result).toBe("Hello\nWorld");
  });

  it("removes control characters but keeps newlines", () => {
    const result = sanitizePrompt("Hi\u0007 there\nnext line");
    expect(result).toBe("Hi there\nnext line");
  });
});

describe("validatePrompt", () => {
  it("returns invalid for empty input", () => {
    expect(validatePrompt("   \n\t ")).toEqual({ valid: false, sanitized: "", reason: "empty" });
  });

  it("rejects overly long prompts and provides a truncated value", () => {
    const longInput = "a".repeat(MAX_PROMPT_LENGTH + 10);
    const result = validatePrompt(longInput);
    expect(result.valid).toBe(false);
    if (result.valid) {
      throw new Error("Expected result to be invalid");
    }
    expect(result.reason).toBe("too_long");
    expect(result.sanitized.length).toBe(MAX_PROMPT_LENGTH);
  });

  it("marks valid prompts correctly", () => {
    const value = "Fragestellung für Disa";
    expect(validatePrompt(value)).toEqual({ valid: true, sanitized: value });
  });
});
