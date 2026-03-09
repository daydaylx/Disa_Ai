import { describe, expect, it } from "vitest";

import { buildPromptPool, countPromptCategories, pickRandomPrompt } from "../randomPromptPicker";
import { RANDOM_PROMPT_TOTAL, RANDOM_PROMPTS } from "../randomPrompts";

describe("randomPromptPicker", () => {
  it("exposes exactly 200 prompt entries", () => {
    expect(RANDOM_PROMPT_TOTAL).toBe(200);
    expect(RANDOM_PROMPTS).toHaveLength(200);
  });

  it("keeps configured category distribution", () => {
    const counts = countPromptCategories(RANDOM_PROMPTS);

    expect(counts.alltag).toBe(20);
    expect(counts.wissen).toBe(20);
    expect(counts.kurios).toBe(60);
    expect(counts.spicy18).toBe(100);
  });

  it("uses sequential q-style ids from q001 to q200", () => {
    const ids = RANDOM_PROMPTS.map((item) => item.id);

    expect(ids[0]).toBe("q001");
    expect(ids.at(-1)).toBe("q200");
    expect(new Set(ids).size).toBe(200);
    expect(ids.every((id) => /^q\d{3}$/.test(id))).toBe(true);
  });

  it("always exposes the full prompt pool including spicy18 entries", () => {
    const pool = buildPromptPool();
    expect(pool).toHaveLength(200);
    expect(pool.some((item) => item.category === "spicy18")).toBe(true);
  });

  it("returns deterministic prompt selection using provided random source", () => {
    const first = pickRandomPrompt(() => 0);
    const last = pickRandomPrompt(() => 0.9999);

    expect(first.id).toBe("q001");
    expect(last.category).toBe("spicy18");
  });
});
