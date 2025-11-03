import type { ModelSafety } from "./models";

type EmergencyModelConfig = {
  id: string;
  label: string;
  description: string;
  provider: string;
  tags: string[];
  safety: ModelSafety;
};

const PERFORMANCE_PROFILES = {
  free: {
    speed: 75,
    reliability: 90,
    quality: 80,
    efficiency: 95,
  },
  paid: {
    speed: 85,
    reliability: 90,
    quality: 90,
    efficiency: 80,
  },
} as const;

const PRICE_THRESHOLDS = {
  budget: 0.001,
  premium: 0.01,
} as const;

export const MODEL_POLICY = {
  recommendedModelIds: [
    "cognitivecomputations/dolphin3.0-mistral-24b",
    "cognitivecomputations/dolphin3.0-mistral-24b:free",
    "cognitivecomputations/dolphin3.0-r1-mistral-24b",
    "venice/uncensored:free",
    "teknium/openhermes-2.5-mistral-7b",
    "huggingfaceh4/zephyr-7b-beta",
    "undi95/toppy-m-7b",
    "pygmalionai/mythalion-13b",
    "gryphe/mythomax-l2-13b",
    "gryphe/mythomist-7b",
    "nousresearch/nous-capybara-7b",
    "jondurbin/airoboros-l2-70b",
    "undi95/remm-slerp-l2-13b",
    "sao10k/l3.3-euryale-70b",
    "sao10k/l3.1-euryale-70b",
  ] as const,
  fallback: {
    stylesTimeoutMs: 8000,
    apiCacheTtlMs: 5000,
    maxFreeFallback: 10,
    emergencyModels: [
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        label: "Llama 3.3 70B (Free)",
        description:
          "Freies 70B-Flaggschiff von Meta mit großer Kontexttiefe und stabiler Performance für alle Aufgaben.",
        provider: "meta-llama",
        tags: ["free", "large"],
        safety: "free",
      },
      {
        id: "mistralai/mistral-nemo:free",
        label: "Mistral Nemo (Free)",
        description:
          "Robustes Long-Context-Modell von Mistral AI. Kostenlos und zuverlässig für Standardaufgaben.",
        provider: "mistralai",
        tags: ["free", "medium"],
        safety: "free",
      },
    ] satisfies EmergencyModelConfig[],
  },
  heuristics: {
    defaultContextTokens: 4096,
    performance: PERFORMANCE_PROFILES,
    priceTiers: PRICE_THRESHOLDS,
    effectiveContextRatio: 0.8,
  },
} as const;

export type ModelPolicy = typeof MODEL_POLICY;
