import { Message } from "../../ui/chat/types";

export interface ChatModel {
  id: string;
  name: string;
  context: number;
  inputPrice: number; // per 1K tokens
  outputPrice: number; // per 1K tokens
}

export interface SendMessageRequest {
  messages: Message[];
  model: string;
  signal?: AbortSignal;
}

export interface StreamChunk {
  type: "content" | "done" | "error";
  content?: string;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class ChatAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = "https://openrouter.ai/api/v1") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async *sendMessage({ messages, model, signal }: SendMessageRequest): AsyncGenerator<StreamChunk> {
    try {
      // Convert internal message format to OpenRouter format
      const openRouterMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Disa AI",
        },
        body: JSON.stringify({
          model,
          messages: openRouterMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4096,
        }),
        signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("RATE_LIMITED");
        }
        if (response.status >= 500) {
          throw new Error("SERVER_ERROR");
        }
        if (response.status === 401) {
          throw new Error("AUTHENTICATION_ERROR");
        }
        throw new Error("NETWORK_ERROR");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            yield {
              type: "done",
              usage: {
                inputTokens: totalInputTokens,
                outputTokens: totalOutputTokens,
              },
            };
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              // Handle usage data
              if (parsed.usage) {
                totalInputTokens = parsed.usage.prompt_tokens || 0;
                totalOutputTokens = parsed.usage.completion_tokens || 0;
              }

              // Handle content chunks
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield {
                  type: "content",
                  content,
                };
              }
            } catch {
              // Skip malformed JSON chunks
              console.warn("Failed to parse SSE chunk:", data);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (signal?.aborted) {
        yield { type: "error", error: "ABORTED" };
      } else if (!navigator.onLine) {
        yield { type: "error", error: "OFFLINE" };
      } else {
        const errorMessage = error instanceof Error ? error.message : "UNKNOWN_ERROR";
        yield { type: "error", error: errorMessage };
      }
    }
  }

  // Helper method to check if API key is configured
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  // Helper method to get API key from session storage
  static getApiKey(): string | null {
    return sessionStorage.getItem("openrouter-api-key");
  }

  // Helper method to set API key in session storage
  static setApiKey(key: string): void {
    sessionStorage.setItem("openrouter-api-key", key);
  }
}

// Export default instance
export const chatAdapter = new ChatAdapter(ChatAdapter.getApiKey() || "");
