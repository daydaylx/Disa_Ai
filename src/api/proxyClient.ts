import { mapError } from "../lib/errors";
import type { ChatMessage } from "../types/chat";

/**
 * Chat via server-side proxy at /api/chat
 * Uses the server's OpenRouter API key, no client API key needed
 */
export async function chatStreamViaProxy(
  messages: ChatMessage[],
  onDelta: (
    textDelta: string,
    messageData?: { id?: string; role?: string; timestamp?: number; model?: string },
  ) => void,
  opts?: {
    model?: string;
    params?: {
      temperature?: number;
      top_p?: number;
      presence_penalty?: number;
      max_tokens?: number;
    };
    signal?: AbortSignal;
    onStart?: () => void;
    onDone?: (full: string) => void;
  },
) {
  try {
    const payload: Record<string, unknown> = {
      messages,
      model: opts?.model || "meta-llama/llama-3.3-70b-instruct:free",
      stream: true,
    };

    if (opts?.params) {
      for (const [key, value] of Object.entries(opts.params)) {
        if (value !== undefined) {
          payload[key] = value;
        }
      }
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
      signal: opts?.signal,
    });

    if (!response.ok) {
      // Try to parse detailed error from JSON, fallback to text, then status
      let errorMessage = `Proxy-Fehler: ${response.status} ${response.statusText}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage =
              typeof errorData.error === "string" ? errorData.error : errorData.error.message;
          }
        } else {
          const text = await response.text();
          if (text) errorMessage = text;
        }
      } catch (e) {
        console.error("Error parsing proxy error response:", e);
      }
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let started = false;
    let full = "";

    try {
      while (true) {
        // CRITICAL FIX: Add timeout to prevent infinite hangs
        // This prevents "KI schreibt" from staying visible forever
        const readPromise = reader.read();
        const timeoutPromise = new Promise<ReadableStreamReadResult<Uint8Array>>((_, reject) => {
          setTimeout(() => reject(new Error("STREAM_INACTIVITY_TIMEOUT")), 20000);
        });

        const { value, done } = await Promise.race([readPromise, timeoutPromise]);
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let idx: number;

        // Process complete lines only
        while ((idx = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);

          if (!line || line.startsWith(":")) continue;

          // Standard SSE format: data: { ... }
          const payload = line.startsWith("data:") ? line.slice(5).trim() : line;

          // Filter out OpenRouter keep-alive or internal markers if strictly needed
          if (payload === "[DONE]") {
            opts?.onDone?.(full);
            return;
          }

          // Try parsing JSON
          if (payload.startsWith("{")) {
            try {
              const json = JSON.parse(payload);

              // Handle embedded errors in the stream
              if (json?.error) {
                const errMsg = json.error?.message || "Stream Error";
                throw new Error(errMsg);
              }

              const delta = json?.choices?.[0]?.delta?.content ?? "";
              const messageData = json?.choices?.[0]?.message;

              if (!started) {
                started = true;
                opts?.onStart?.();
              }

              if (delta || messageData) {
                onDelta(delta, messageData);
                full += delta;
              }
            } catch (err) {
              // If we are processing a legitimate line but JSON fails, log warning but don't crash stream unless critical
              // console.warn("Failed to parse SSE payload:", payload, err);
              // However, if it's an explicit error object, we want to throw.
              if (err instanceof Error && !err.message.includes("JSON")) {
                throw mapError(err);
              }
            }
          }
        }
      }
      opts?.onDone?.(full);
    } finally {
      reader.releaseLock();
      response.body?.cancel().catch(() => {});
    }
  } catch (error) {
    throw mapError(error);
  }
}

/**
 * One-shot chat via server-side proxy
 */
export async function chatOnceViaProxy(
  messages: ChatMessage[],
  opts?: { model?: string; signal?: AbortSignal },
): Promise<{ text: string; raw: any }> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model: opts?.model || "meta-llama/llama-3.3-70b-instruct:free",
        stream: false,
      }),
      signal: opts?.signal,
    });

    if (!response.ok) {
      let errorMessage = `Proxy-Fehler: ${response.status} ${response.statusText}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage =
              typeof errorData.error === "string" ? errorData.error : errorData.error.message;
          }
        } else {
          const text = await response.text();
          if (text) errorMessage = text;
        }
      } catch {
        // Fallback to default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { text, raw: data };
  } catch (error) {
    throw mapError(error);
  }
}
