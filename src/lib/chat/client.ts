import { sendMessage } from "./sendMessage";
import type { ChatRequest, ChatResponse } from "./types";

export async function chat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
  const base: any = {
    modelId: req.modelId,
    messages: req.messages,
  };
  if (signal) base.signal = signal; // nur dann setzen
  const { content } = await sendMessage(base);
  return { content };
}

export { OfflineError, RateLimitError, TimeoutError, CircuitOpenError } from "./types";
