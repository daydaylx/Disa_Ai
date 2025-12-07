import type { ModelEntry } from "./models";

export type LegacyModelOption = {
  id: string;
  label: string;
  description?: string;
  isFree?: boolean;
  isPremium?: boolean;
};

export const DEFAULT_MODEL_ID = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

const LEGACY_MODEL_ORDER = [
  DEFAULT_MODEL_ID,
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "google/gemini-2.0-flash-exp:free",
  "deepseek/deepseek-r1:free",
  "openai/gpt-4o",
  "anthropic/claude-3.5-sonnet",
];

const LEGACY_MODEL_PRESET_MAP: Record<string, Omit<LegacyModelOption, "id">> = {
  [DEFAULT_MODEL_ID]: {
    label: "Llama 3.3 70B Instruct",
    description: "Open-Source Standard, zuverlässig und kostenlos.",
    isFree: true,
  },
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free": {
    label: "Dolphin Mistral 24B",
    description: "Kreativ, dialogstark und frei nutzbar.",
    isFree: true,
  },
  "google/gemini-2.0-flash-exp:free": {
    label: "Gemini 2.0 Flash",
    description: "Experimentelles High-Speed Modell von Google.",
    isFree: true,
  },
  "deepseek/deepseek-r1:free": {
    label: "DeepSeek R1 (Reasoning)",
    description: "Kostenloses Reasoning-Flaggschiff mit starkem Logik-Fokus.",
    isFree: true,
  },
  "openai/gpt-4o": {
    label: "GPT-4o",
    description: "OpenAI, leistungsstark und vielseitig.",
    isPremium: true,
  },
  "anthropic/claude-3.5-sonnet": {
    label: "Claude 3.5 Sonnet",
    description: "Anthropic, präzise und sicherheitsfokussiert.",
    isPremium: true,
  },
};

export const LEGACY_MODEL_PRESETS: LegacyModelOption[] = LEGACY_MODEL_ORDER.map((id) => ({
  id,
  label: LEGACY_MODEL_PRESET_MAP[id]?.label ?? id,
  description: LEGACY_MODEL_PRESET_MAP[id]?.description,
  isFree: LEGACY_MODEL_PRESET_MAP[id]?.isFree,
  isPremium: LEGACY_MODEL_PRESET_MAP[id]?.isPremium,
}));

export function buildLegacyModelOptions(catalog?: ModelEntry[] | null): LegacyModelOption[] {
  if (!catalog?.length) return LEGACY_MODEL_PRESETS;

  const catalogById = new Map(catalog.map((entry) => [entry.id, entry]));

  return LEGACY_MODEL_ORDER.map((id) => {
    const preset = LEGACY_MODEL_PRESET_MAP[id];
    const catalogEntry = catalogById.get(id);

    if (!catalogEntry) {
      const fallback = LEGACY_MODEL_PRESETS.find((model) => model.id === id);
      return (
        fallback ?? {
          id,
          label: preset?.label ?? id,
          description: preset?.description,
          isFree: preset?.isFree,
          isPremium: preset?.isPremium,
        }
      );
    }

    const isFree = catalogEntry.tags.includes("free");
    const isPremium =
      catalogEntry.tags.includes("premium") || (!isFree && !catalogEntry.tags.includes("free"));

    return {
      id: catalogEntry.id,
      label: catalogEntry.label ?? preset?.label ?? catalogEntry.id,
      description: catalogEntry.description ?? preset?.description,
      isFree: isFree || preset?.isFree,
      isPremium: isPremium || preset?.isPremium,
    };
  });
}
