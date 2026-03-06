import { describe, expect, it } from "vitest";

import { buildPromptPool, countPromptCategories, pickRandomPrompt } from "../randomPromptPicker";
import { RANDOM_PROMPT_TOTAL, RANDOM_PROMPTS } from "../randomPrompts";

describe("randomPromptPicker", () => {
  it("exposes exactly 100 prompt entries", () => {
    expect(RANDOM_PROMPT_TOTAL).toBe(100);
    expect(RANDOM_PROMPTS).toHaveLength(100);
  });

  it("keeps configured category distribution", () => {
    const counts = countPromptCategories(RANDOM_PROMPTS);

    expect(counts.alltag).toBe(10);
    expect(counts.wissen).toBe(10);
    expect(counts.kurios).toBe(30);
    expect(counts.spicy18).toBe(50);
  });

  it("uses sequential q-style ids from q001 to q100", () => {
    const ids = RANDOM_PROMPTS.map((item) => item.id);

    expect(ids[0]).toBe("q001");
    expect(ids.at(-1)).toBe("q100");
    expect(new Set(ids).size).toBe(100);
    expect(ids.every((id) => /^q\d{3}$/.test(id))).toBe(true);
  });

  it("excludes spicy18 prompts when local spicy toggle is off", () => {
    const pool = buildPromptPool({ includeSpicy18: false, nsfwAllowed: true });

    expect(pool).toHaveLength(50);
    expect(pool.some((item) => item.category === "spicy18")).toBe(false);
  });

  it("excludes spicy18 prompts when global NSFW setting is off", () => {
    const pool = buildPromptPool({ includeSpicy18: true, nsfwAllowed: false });

    expect(pool).toHaveLength(50);
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
