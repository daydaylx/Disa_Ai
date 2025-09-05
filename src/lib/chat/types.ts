export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageLike {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  modelId: string;
  messages: ChatMessageLike[];
}

export interface ChatResponse {
  content: string;
}

export class OfflineError extends Error {
  constructor(msg = "Offline") {
    super(msg);
    this.name = "OfflineError";
  }
}
export class TimeoutError extends Error {
  constructor(msg = "Timeout") {
    super(msg);
    this.name = "TimeoutError";
  }
}
export class CircuitOpenError extends Error {
  constructor(msg = "Circuit open") {
    super(msg);
    this.name = "CircuitOpenError";
  }
}
export class RateLimitError extends Error {
  retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super(`Rate limited – retry in ${Math.ceil(retryAfterMs / 1000)}s`);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}
