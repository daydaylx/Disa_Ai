import type { ChatMessageType } from "../components/chat/ChatMessage";
import { chatStream } from "./openrouter";

export interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  model?: string;
}

export function handleChatRequest(request: ChatRequest, signal?: AbortSignal): Response {
  const { messages, model } = request;

  // Convert to internal ChatMessage format with consistent ID generation
  const formattedMessages: ChatMessageType[] = messages.map((msg) => ({
    id: `temp-${Date.now()}-${Math.random()}`,
    role: msg.role,
    content: msg.content,
    timestamp: Date.now(),
  }));

  // Generate consistent assistant message ID for client-server synchronization
  const assistantMessageId = `assistant-${Date.now()}-${Math.random()}`;

  // Create SSE stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await chatStream(
          formattedMessages,
          (delta: string) => {
            // Send SSE formatted data with message metadata for client sync
            const data = JSON.stringify({
              choices: [
                {
                  delta: {
                    content: delta,
                  },
                  message: {
                    id: assistantMessageId,
                    role: "assistant",
                    timestamp: Date.now(),
                  },
                },
              ],
            });

            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          },
          {
            model,
            signal,
            onStart: () => {
              // Send initial response with message metadata
              const initialData = JSON.stringify({
                choices: [
                  {
                    delta: { content: "" },
                    message: {
                      id: assistantMessageId,
                      role: "assistant",
                      timestamp: Date.now(),
                      model: model,
                    },
                  },
                ],
              });
              controller.enqueue(encoder.encode(`data: ${initialData}\n\n`));
            },
            onDone: () => {
              // Send completion marker with final message metadata
              const completionData = JSON.stringify({
                choices: [
                  {
                    message: {
                      id: assistantMessageId,
                      role: "assistant",
                      finish_reason: "stop",
                    },
                  },
                ],
              });
              controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            },
          },
        );
      } catch (error) {
        // Send error and close
        const errorData = JSON.stringify({
          error: {
            message: error instanceof Error ? error.message : "Unknown error",
          },
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    },
    cancel() {
      // Stream was cancelled
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Mock API endpoint for development (since we don't have a real backend)
export function createChatAPI(): {
  post: (url: string, init?: RequestInit) => Response;
} {
  return {
    post: (url: string, init?: RequestInit) => {
      if (url !== "/api/chat") {
        throw new Error(`Unsupported endpoint: ${url}`);
      }

      if (!init || init.method !== "POST") {
        throw new Error("Only POST method supported");
      }

      const body = init.body as string;
      const request: ChatRequest = JSON.parse(body);

      return handleChatRequest(request, init.signal || undefined);
    },
  };
}
