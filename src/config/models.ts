export type ModelOption = {
  id: string;
  label: string;
  vendor?: string;
  price?: string;
  open?: boolean;
  free?: boolean;
};

export const MODELS: ModelOption[] = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (free)", vendor: "Meta",   open: true, free: true,  price: "günstig" },
  { id: "qwen/qwen-2.5-72b-instruct:free",        label: "Qwen 2.5 72B (free)",   vendor: "Alibaba",open: true, free: true,  price: "günstig" },
  { id: "mistralai/mistral-nemo:free",            label: "Mistral Nemo (free)",    vendor: "Mistral",open: true, free: true,  price: "günstig" },

  // sehr günstige Ergänzungen
  { id: "qwen/qwen-2.5-7b-instruct:free",         label: "Qwen 2.5 7B (free)",     vendor: "Alibaba",open: true, free: true,  price: "sehr günstig" },
  { id: "google/gemma-2-9b-it:free",              label: "Gemma 2 9B IT (free)",   vendor: "Google", open: true, free: true,  price: "sehr günstig" },
  { id: "openchat/openchat-3.5-1210",             label: "OpenChat 3.5 1210",      vendor: "OpenChat",open:true, free:false, price: "sehr günstig" }
];

export const DEFAULT_MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";
