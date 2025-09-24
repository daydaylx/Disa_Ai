import type { ChatMessage } from "../../types/chat";
import { sendMessage } from "./sendMessage";

export interface ChatRequest {
  modelId: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  content: string;
}

export async function chat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
  const { content } = await sendMessage({
    modelId: req.modelId,
    messages: req.messages,
    ...(signal ? { signal } : {}),
  });
  return { content };
}

export {
  AbortError,
  ApiClientError,
  ApiError,
  ApiServerError,
  AuthenticationError,
  HttpError,
  NetworkError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  TimeoutError,
  UnknownError,
} from "../errors";
