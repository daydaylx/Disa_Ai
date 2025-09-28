export interface AIModel {
  id: string;
  label: string;
  context: number;
  inputPrice: number; // per 1K tokens in USD
  outputPrice: number; // per 1K tokens in USD
  tags: string[];
}

export const MODELS: AIModel[] = [
  // Anthropic Claude Models
  {
    id: "anthropic/claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet",
    context: 200000,
    inputPrice: 0.003,
    outputPrice: 0.015,
    tags: ["premium", "reasoning", "coding", "recommended"],
  },
  {
    id: "anthropic/claude-3-haiku",
    label: "Claude 3 Haiku",
    context: 200000,
    inputPrice: 0.00025,
    outputPrice: 0.00125,
    tags: ["fast", "budget", "lightweight"],
  },
  {
    id: "anthropic/claude-3-opus",
    label: "Claude 3 Opus",
    context: 200000,
    inputPrice: 0.015,
    outputPrice: 0.075,
    tags: ["premium", "creative", "advanced"],
  },

  // OpenAI GPT Models
  {
    id: "openai/gpt-4-turbo",
    label: "GPT-4 Turbo",
    context: 128000,
    inputPrice: 0.01,
    outputPrice: 0.03,
    tags: ["premium", "multimodal", "coding"],
  },
  {
    id: "openai/gpt-4",
    label: "GPT-4",
    context: 8192,
    inputPrice: 0.03,
    outputPrice: 0.06,
    tags: ["premium", "reasoning"],
  },
  {
    id: "openai/gpt-3.5-turbo",
    label: "GPT-3.5 Turbo",
    context: 16384,
    inputPrice: 0.0005,
    outputPrice: 0.0015,
    tags: ["fast", "budget", "popular"],
  },

  // Google Gemini Models
  {
    id: "google/gemini-pro",
    label: "Gemini Pro",
    context: 32768,
    inputPrice: 0.00025,
    outputPrice: 0.0005,
    tags: ["fast", "multimodal", "budget"],
  },
  {
    id: "google/gemini-pro-1.5",
    label: "Gemini Pro 1.5",
    context: 1000000,
    inputPrice: 0.00125,
    outputPrice: 0.005,
    tags: ["long-context", "multimodal", "recommended"],
  },

  // Meta Llama Models
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    label: "Llama 3.1 405B",
    context: 131072,
    inputPrice: 0.005,
    outputPrice: 0.015,
    tags: ["open-source", "large", "reasoning"],
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    label: "Llama 3.1 70B",
    context: 131072,
    inputPrice: 0.0009,
    outputPrice: 0.0009,
    tags: ["open-source", "balanced", "coding"],
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    label: "Llama 3.1 8B",
    context: 131072,
    inputPrice: 0.00006,
    outputPrice: 0.00006,
    tags: ["open-source", "fast", "budget"],
  },

  // Mistral Models
  {
    id: "mistralai/mixtral-8x7b-instruct",
    label: "Mixtral 8x7B",
    context: 32768,
    inputPrice: 0.00024,
    outputPrice: 0.00024,
    tags: ["open-source", "fast", "coding"],
  },
  {
    id: "mistralai/mistral-large",
    label: "Mistral Large",
    context: 32768,
    inputPrice: 0.004,
    outputPrice: 0.012,
    tags: ["premium", "multilingual", "reasoning"],
  },
];

export const getModelById = (id: string): AIModel | undefined => {
  return MODELS.find((model) => model.id === id);
};

export const getModelsByTag = (tag: string): AIModel[] => {
  return MODELS.filter((model) => model.tags.includes(tag));
};

export const getRecommendedModels = (): AIModel[] => {
  return getModelsByTag("recommended");
};

export const getBudgetModels = (): AIModel[] => {
  return getModelsByTag("budget");
};

export const getPremiumModels = (): AIModel[] => {
  return getModelsByTag("premium");
};

export const formatPrice = (price: number): string => {
  if (price < 0.001) {
    return `$${(price * 1000).toFixed(3)}/1K`;
  }
  return `$${price.toFixed(3)}/1K`;
};

export const formatContext = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }
  return tokens.toString();
};

export const calculateCost = (
  model: AIModel,
  inputTokens: number,
  outputTokens: number,
): number => {
  const inputCost = (inputTokens / 1000) * model.inputPrice;
  const outputCost = (outputTokens / 1000) * model.outputPrice;
  return inputCost + outputCost;
};
