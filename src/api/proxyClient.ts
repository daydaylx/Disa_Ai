import { mapError } from "../lib/errors";
import type { ChatMessage } from "../types/chat";

// Proxy configuration
const PROXY_CONFIG = {
  endpoint: "/api/chat",
  timeoutMs: 60000,
  maxRetries: 3,
} as const;

// Client identifier for proxy
const PROXY_CLIENT_ID = "disa-ai-app";

/**
 * Generate HMAC signature for proxy authentication
 *
 * @param body - Request body string
 * @param timestamp - Unix timestamp (seconds)
 * @param secret - Shared secret for HMAC
 * @returns HMAC signature
 */
async function generateProxySignature(
  body: string,
  timestamp: number,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const message = encoder.encode(`${body}:${timestamp}`);

  const keyData = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", keyData, message);

  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Get proxy shared secret from environment or fallback
 * In production, this should be set via VITE_PROXY_SHARED_SECRET env var
 */
function getProxySharedSecret(): string {
  // Priority: env var > development fallback
  if (import.meta.env.VITE_PROXY_SHARED_SECRET) {
    return import.meta.env.VITE_PROXY_SHARED_SECRET;
  }

  // Development fallback (never use in production!)
  if (import.meta.env.DEV) {
    console.warn("⚠️ Using development proxy secret. Set VITE_PROXY_SHARED_SECRET for production!");
    return "dev-secret-do-not-use-in-production";
  }

  throw new Error(
    "Proxy shared secret not configured. Set VITE_PROXY_SHARED_SECRET environment variable.",
  );
}

/**
 * Chat via server-side proxy at /api/chat with HMAC authentication
 *
 * @param messages - Chat messages
 * @param onDelta - Callback for streaming text deltas
 * @param opts - Options (model, params, signal, callbacks)
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
    const secret = getProxySharedSecret();
    const timestamp = Math.floor(Date.now() / 1000);

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

    const bodyString = JSON.stringify(payload);
    const signature = await generateProxySignature(bodyString, timestamp, secret);

    const response = await fetch(PROXY_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "X-Proxy-Secret": signature,
        "X-Proxy-Timestamp": timestamp.toString(),
        "X-Proxy-Client": PROXY_CLIENT_ID,
      },
      body: bodyString,
      signal: opts?.signal,
    });

    // Handle proxy-specific errors
    if (!response.ok) {
      const errorBody = await handleProxyError(response);
      throw new Error(errorBody.message);
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
        // Read with timeout (already 60s on server, this is extra safety)
        const readPromise = reader.read();
        const timeoutPromise = new Promise<ReadableStreamReadResult<Uint8Array>>((_, reject) => {
          setTimeout(() => reject(new Error("CLIENT_TIMEOUT")), 70000); // 70s total timeout
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

          // Filter out OpenRouter keep-alive or internal markers
          if (payload === "[DONE]") {
            opts?.onDone?.(full);
            return;
          }

          // Try parsing JSON
          if (payload.startsWith("{")) {
            try {
              const json = JSON.parse(payload);

              // Handle embedded errors in stream
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
              // Ignore JSON parse errors in streaming, but throw real errors
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
 * Handle proxy-specific error responses
 */
async function handleProxyError(response: Response): Promise<{ message: string; status: number }> {
  let errorMessage = `Proxy-Fehler: ${response.status} ${response.statusText}`;
  let status = response.status;

  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();

      if (response.status === 401) {
        errorMessage =
          "Authentifizierungsfehler: Proxy-Signatur ungültig. Bitte aktualisiere die App.";
      } else if (response.status === 403) {
        errorMessage =
          "Zugriffsfehler: Unzulässiger Ursprung oder Referer. Bitte nutze die offizielle App.";
      } else if (response.status === 429) {
        const retryAfter = errorData?.retryAfter || 60;
        errorMessage = `Zu viele Anfragen. Bitte warte ${retryAfter} Sekunden, bevor du erneut versuchst.`;
      } else if (errorData?.error) {
        errorMessage =
          typeof errorData.error === "string" ? errorData.error : errorData.error.message;
      }
    } else {
      const text = await response.text();
      if (text) errorMessage = text;
    }
  } catch {
    errorMessage =
      "Verbindungsfehler: Der Chat-Server ist vorübergehend nicht erreichbar. Bitte versuche es in einigen Sekunden erneut.";
  }

  return { message: errorMessage, status };
}

/**
 * One-shot chat via server-side proxy with HMAC authentication
 */
export async function chatOnceViaProxy(
  messages: ChatMessage[],
  opts?: { model?: string; signal?: AbortSignal },
): Promise<{ text: string; raw: any }> {
  try {
    const secret = getProxySharedSecret();
    const timestamp = Math.floor(Date.now() / 1000);

    const payload = {
      messages,
      model: opts?.model || "meta-llama/llama-3.3-70b-instruct:free",
      stream: false,
    };

    const bodyString = JSON.stringify(payload);
    const signature = await generateProxySignature(bodyString, timestamp, secret);

    const response = await fetch(PROXY_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": signature,
        "X-Proxy-Timestamp": timestamp.toString(),
        "X-Proxy-Client": PROXY_CLIENT_ID,
      },
      body: bodyString,
      signal: opts?.signal,
    });

    if (!response.ok) {
      const errorBody = await handleProxyError(response);
      throw new Error(errorBody.message);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { text, raw: data };
  } catch (error) {
    throw mapError(error);
  }
}

/**
 * Check if proxy is available (has shared secret configured)
 */
export function isProxyAvailable(): boolean {
  try {
    getProxySharedSecret();
    return true;
  } catch {
    return false;
  }
}
