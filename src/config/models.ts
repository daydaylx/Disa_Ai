export type ModelInfo = {
  id: string;
  label: string;
  free: boolean;
  open: boolean; // "offene Richtlinien" / uncensored
};

export const MODELS: ModelInfo[] = [
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    label: "Llama 3.3 70B Instruct (free)",
    free: true,
    open: false,
  },
  {
    id: "venice/uncensored:free",
    label: "Venice Uncensored 24B (free)",
    free: true,
    open: true,
  },
  // Weitere Kandidaten kannst du später ergänzen:
  // { id: "cognitivecomputations/dolphin-mixtral-8x7b", label: "Dolphin Mixtral 8x7B", free: false, open: true },
];

export const DEFAULT_MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";
export const MODEL_KEY = "disa_model";
