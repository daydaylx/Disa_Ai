import { RANDOM_PROMPTS, type RandomPromptCategory, type RandomPromptItem } from "./randomPrompts";

type RandomValueSource = () => number;

export function buildPromptPool() {
  return RANDOM_PROMPTS;
}

function clampRandomIndex(length: number, randomSource: RandomValueSource): number {
  const randomValue = randomSource();

  if (!Number.isFinite(randomValue)) return 0;

  const normalized = Math.min(0.999999, Math.max(0, randomValue));
  return Math.floor(normalized * length);
}

export function pickRandomPrompt(randomSource: RandomValueSource = Math.random): RandomPromptItem {
  const pool = buildPromptPool();

  if (pool.length === 0) {
    throw new Error("No prompts available for random picker.");
  }

  const index = clampRandomIndex(pool.length, randomSource);
  return pool[index] as RandomPromptItem;
}

export function countPromptCategories(items: RandomPromptItem[]) {
  const initial: Record<RandomPromptCategory, number> = {
    alltag: 0,
    wissen: 0,
    kurios: 0,
    spicy18: 0,
  };

  return items.reduce((acc, item) => {
    acc[item.category] += 1;
    return acc;
  }, initial);
}
