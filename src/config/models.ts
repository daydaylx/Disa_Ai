// Minimaler Katalog für Settings/ModelPicker.
// KEIN Shell-Code hier reinpacken.

export type ModelOption = {
  id: string;
  label: string;
  vendor?: string;
  price?: string;   // rein informativ
  open?: boolean;   // "offen" / OSS-ish
  free?: boolean;   // via OpenRouter als :free
};

export const MODELS: ModelOption[] = [
  // Bestehende, die du bereits nutzt/whitelistest
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (free)", vendor: "Meta", open: true, free: true, price: "günstig" },
  { id: "qwen/qwen-2.5-72b-instruct:free",        label: "Qwen 2.5 72B (free)",   vendor: "Alibaba", open: true, free: true, price: "günstig" },
  { id: "mistralai/mistral-nemo:free",            label: "Mistral Nemo (free)",    vendor: "Mistral", open: true, free: true, price: "günstig" },

  // >>> Deine angeforderten sehr günstigen Zusätze <<<
  { id: "qwen/qwen-2.5-7b-instruct:free",         label: "Qwen 2.5 7B (free)",     vendor: "Alibaba", open: true, free: true, price: "sehr günstig" },
  { id: "google/gemma-2-9b-it:free",              label: "Gemma 2 9B IT (free)",   vendor: "Google",  open: true, free: true, price: "sehr günstig" },
  { id: "openchat/openchat-3.5-1210",             label: "OpenChat 3.5 1210",      vendor: "OpenChat",open: true, free: false,price: "sehr günstig" }
];

// Optionales Default (falls UI eines braucht)
export const DEFAULT_MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";
