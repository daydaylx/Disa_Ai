import { RANDOM_PROMPTS, type RandomPromptCategory, type RandomPromptItem } from "./randomPrompts";

interface RandomPromptPickerOptions {
  includeSpicy18: boolean;
  nsfwAllowed: boolean;
}

type RandomValueSource = () => number;

export function buildPromptPool({ includeSpicy18, nsfwAllowed }: RandomPromptPickerOptions) {
  const allowSpicy18 = includeSpicy18 && nsfwAllowed;

  return RANDOM_PROMPTS.filter((item) => allowSpicy18 || item.category !== "spicy18");
}

function nonSpicyFallbackPool(): RandomPromptItem[] {
  return RANDOM_PROMPTS.filter((item) => item.category !== "spicy18");
}

function clampRandomIndex(length: number, randomSource: RandomValueSource): number {
  const randomValue = randomSource();

  if (!Number.isFinite(randomValue)) return 0;

  const normalized = Math.min(0.999999, Math.max(0, randomValue));
  return Math.floor(normalized * length);
}

export function pickRandomPrompt(
  options: RandomPromptPickerOptions,
  randomSource: RandomValueSource = Math.random,
): RandomPromptItem {
  const pool = buildPromptPool(options);
  const safePool = pool.length > 0 ? pool : nonSpicyFallbackPool();

  if (safePool.length === 0) {
    throw new Error("No prompts available for random picker.");
  }

  const index = clampRandomIndex(safePool.length, randomSource);
  return safePool[index] as RandomPromptItem;
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
