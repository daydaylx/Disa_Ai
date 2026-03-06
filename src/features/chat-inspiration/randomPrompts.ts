import randomPromptsJson from "./randomPrompts.json";

export type RandomPromptCategory = "alltag" | "wissen" | "kurios" | "spicy18";

export interface RandomPromptItem {
  id: string;
  category: RandomPromptCategory;
  text: string;
}

interface RandomPromptItemRaw {
  id: string;
  category: string;
  text: string;
}

function isRandomPromptCategory(value: string): value is RandomPromptCategory {
  return value === "alltag" || value === "wissen" || value === "kurios" || value === "spicy18";
}

function normalizeRandomPrompts(items: RandomPromptItemRaw[]): RandomPromptItem[] {
  return items.map((item) => {
    if (!isRandomPromptCategory(item.category)) {
      throw new Error(`Invalid random prompt category: ${item.category}`);
    }

    return {
      id: item.id,
      category: item.category,
      text: item.text,
    };
  });
}

const rawPrompts = randomPromptsJson as RandomPromptItemRaw[];

export const RANDOM_PROMPTS: RandomPromptItem[] = normalizeRandomPrompts(rawPrompts);

export const RANDOM_PROMPT_TOTAL = RANDOM_PROMPTS.length;
