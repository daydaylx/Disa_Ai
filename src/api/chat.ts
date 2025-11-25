export interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  presence_penalty?: number;
}

export function handleChatRequest(request: ChatRequest, signal?: AbortSignal): Response {
  const { messages, model, temperature, max_tokens, top_p, presence_penalty } = request;

  // Generate consistent assistant message ID for client-server synchronization
  const assistantMessageId = `assistant-${Date.now()}-${Math.random()}`;

  // Create SSE stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Use the Cloudflare Worker endpoint instead of direct OpenRouter call
        const workerResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            model,
            temperature,
            max_tokens,
            top_p,
            presence_penalty,
          }),
          signal,
        });

        if (!workerResponse.ok) {
          const errorData = await workerResponse.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${workerResponse.status}: ${workerResponse.statusText}`,
          );
        }

        const reader = workerResponse.body?.getReader();
        if (!reader) {
          throw new Error("No response body from worker");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buffer.indexOf("\n")) >= 0) {
              const line = buffer.slice(0, idx).trim();
              buffer = buffer.slice(idx + 1);
              if (!line || line.startsWith(":")) continue;

              const payload = line.startsWith("data:") ? line.slice(5).trim() : line;
              if (/^OPENROUTER\b/i.test(payload)) continue;

              if (payload === "[DONE]") {
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
                return;
              }

              if (payload.startsWith("{")) {
                try {
                  const json = JSON.parse(payload);
                  if (json?.error) {
                    throw new Error(json.error?.message || "Unbekannter API-Fehler");
                  }
                  const delta = json?.choices?.[0]?.delta?.content ?? "";
                  const messageData = json?.choices?.[0]?.message;
                  if (delta || messageData) {
                    // Send SSE formatted data with message metadata for client sync
                    const data = JSON.stringify({
                      choices: [
                        {
                          delta: {
                            content: delta,
                          },
                          message: {
                            id: messageData?.id || assistantMessageId,
                            role: messageData?.role || "assistant",
                            timestamp: messageData?.timestamp || Date.now(),
                            model: messageData?.model || model,
                          },
                        },
                      ],
                    });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }
                } catch (err) {
                  console.warn("Failed to parse SSE chunk:", err);
                }
              }
            }
          }
          controller.close();
        } finally {
          reader.releaseLock();
        }
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
