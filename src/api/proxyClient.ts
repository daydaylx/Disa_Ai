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
      // Parse error response
      try {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error || `Proxy-Fehler: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } catch {
        throw new Error(`Proxy-Fehler: ${response.status} ${response.statusText}`);
      }
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
            opts?.onDone?.(full);
            return;
          }

          if (payload.startsWith("{")) {
            try {
              const json = JSON.parse(payload);

              if (json?.error) {
                throw new Error(json.error?.message || "Unbekannter Proxy-Fehler");
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
              throw mapError(err);
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
      try {
        const errorData = await response.json();
        const errorMessage =
          errorData?.error || `Proxy-Fehler: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } catch {
        throw new Error(`Proxy-Fehler: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { text, raw: data };
  } catch (error) {
    throw mapError(error);
  }
}
