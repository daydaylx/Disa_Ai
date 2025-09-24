import type { ChatMessage } from "../../types/chat";
import { mapError, RateLimitError } from "../errors";
import { fetchWithTimeoutAndRetry } from "../net/fetchTimeout";
import { TokenBucket } from "../net/rateLimit";
import { CHAT_ENDPOINT, getApiKey } from "./config";

export interface SendOptions {
  apiKey?: string;
  modelId: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

const bucket = new TokenBucket(3, 1);

export async function sendMessage(opts: SendOptions): Promise<{ content: string }> {
  if (!bucket.tryTake(1)) {
    // This is a client-side rate limit, so we create the error manually.
    throw new RateLimitError("Client-side rate limit exceeded", 429, "Too Many Requests");
  }

  const key = opts.apiKey || getApiKey();
  const url = CHAT_ENDPOINT;
  const body = { model: opts.modelId, messages: opts.messages };

  if (!key) {
    await new Promise<void>((resolve, reject) => {
      const id = setTimeout(resolve, 600);
      if (opts.signal) {
        const onAbort = () => {
          clearTimeout(id);
          reject(mapError(new DOMException("Aborted", "AbortError")));
        };
        if (opts.signal.aborted) onAbort();
        opts.signal.addEventListener("abort", onAbort, { once: true });
      }
    });
    const last = opts.messages[opts.messages.length - 1]?.content || "";
    const wantsCode = /\bcode\b/i.test(last) || /```/.test(last);
    if (wantsCode) {
      const demo = ["Hier ein Beispiel:", "```js", "console.log('Hallo, Welt!');", "```"].join(
        "\n",
      );
      return { content: demo };
    }
    return { content: "Demo-Antwort (kein API-Key)." };
  }

  const init: Omit<RequestInit, "signal"> & { signal?: AbortSignal } = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": location.origin,
      "X-Title": "Disa_Ai",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    referrerPolicy: "no-referrer",
  };
  if (opts.signal) {
    init.signal = opts.signal;
  }

  try {
    const res = await fetchWithTimeoutAndRetry(url, init);
    if (!res.ok) {
      throw mapError(res);
    }
    const json = await res.json().catch(() => null);
    const content = json?.choices?.[0]?.message?.content ?? "";
    if (!content) throw mapError(new Error("Leere Antwort vom Server"));
    return { content };
  } catch (error) {
    throw mapError(error);
  }
}
