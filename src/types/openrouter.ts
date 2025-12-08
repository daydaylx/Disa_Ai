/**
 * Type definitions for OpenRouter API.
 * Based on OpenRouter API documentation: https://openrouter.ai/docs
 */

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterError {
  message: string;
  type?: string;
  code?: string;
}

export interface OpenRouterChoice {
  message?: {
    role: string;
    content: string;
  };
  delta?: {
    role?: string;
    content?: string;
  };
  finish_reason?: string | null;
  index: number;
}

export interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Response from OpenRouter chat completion endpoint (non-streaming)
 */
export interface OpenRouterChatResponse {
  id: string;
  model: string;
  object: "chat.completion";
  created: number;
  choices: OpenRouterChoice[];
  usage?: OpenRouterUsage;
  error?: OpenRouterError;
}

/**
 * Chunk from OpenRouter streaming response
 */
export interface OpenRouterStreamChunk {
  id: string;
  model: string;
  object: "chat.completion.chunk";
  created: number;
  choices: OpenRouterChoice[];
  error?: OpenRouterError;
}

/**
 * Model information from OpenRouter models endpoint
 */
export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
    request?: string;
    image?: string;
  };
  context_length: number;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string | null;
  };
  top_provider?: {
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
  per_request_limits?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

/**
 * Response from OpenRouter models endpoint
 */
export interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

/**
 * Request body for OpenRouter chat completion
 */
export interface OpenRouterChatRequest {
  model: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  min_p?: number;
  top_a?: number;
  seed?: number;
  max_tokens?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  response_format?: {
    type: "json_object";
  };
  stop?: string | string[];
  tools?: any[];
  tool_choice?: string | object;
  transforms?: string[];
  models?: string[];
  route?: "fallback";
  provider?: {
    order?: string[];
    allow_fallbacks?: boolean;
    require_parameters?: boolean;
    data_collection?: "deny" | "allow";
  };
}
