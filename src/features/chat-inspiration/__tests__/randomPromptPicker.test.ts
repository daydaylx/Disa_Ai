import { describe, expect, it } from "vitest";

import { buildPromptPool, countPromptCategories, pickRandomPrompt } from "../randomPromptPicker";
import { RANDOM_PROMPT_TOTAL, RANDOM_PROMPTS } from "../randomPrompts";

describe("randomPromptPicker", () => {
  it("exposes exactly 100 prompt entries", () => {
    expect(RANDOM_PROMPT_TOTAL).toBe(100);
    expect(RANDOM_PROMPTS).toHaveLength(100);
  });

  it("keeps category distribution balanced (25 each)", () => {
    const counts = countPromptCategories(RANDOM_PROMPTS);

    expect(counts.alltag).toBe(25);
    expect(counts.wissen).toBe(25);
    expect(counts.kurios).toBe(25);
    expect(counts.spicy18).toBe(25);
  });

  it("excludes spicy18 prompts when local spicy toggle is off", () => {
    const pool = buildPromptPool({ includeSpicy18: false, nsfwAllowed: true });

    expect(pool).toHaveLength(75);
    expect(pool.some((item) => item.category === "spicy18")).toBe(false);
  });

  it("excludes spicy18 prompts when global NSFW setting is off", () => {
    const pool = buildPromptPool({ includeSpicy18: true, nsfwAllowed: false });

    expect(pool).toHaveLength(75);
    expect(pool.some((item) => item.category === "spicy18")).toBe(false);
  });

  it("includes spicy18 prompts only when both controls allow it", () => {
    const pool = buildPromptPool({ includeSpicy18: true, nsfwAllowed: true });

    expect(pool).toHaveLength(100);
    expect(pool.some((item) => item.category === "spicy18")).toBe(true);
  });

  it("returns deterministic prompt selection using provided random source", () => {
    const first = pickRandomPrompt({ includeSpicy18: false, nsfwAllowed: true }, () => 0);
    const last = pickRandomPrompt({ includeSpicy18: true, nsfwAllowed: true }, () => 0.9999);

    expect(first.category).not.toBe("spicy18");
    expect(last.category).toBe("spicy18");
  });
});
