import { sendMessage } from "./sendMessage";
import type { ChatRequest, ChatResponse } from "./types";

export async function chat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
  const { content } = await sendMessage({
    modelId: req.modelId,
    messages: req.messages,
    ...(signal ? { signal } : {}),
  });
  return { content };
}

export { CircuitOpenError, OfflineError, RateLimitError, TimeoutError } from "./types";
