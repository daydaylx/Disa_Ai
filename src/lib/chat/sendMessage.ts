import { TokenBucket } from "../net/rateLimit";
import { fetchWithRetry } from "../net/retry";
import { CHAT_ENDPOINT, getApiKey } from "./config";
import { RateLimitError } from "./types";

export interface SendOptions {
  apiKey?: string;
  modelId: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  signal?: AbortSignal;
}

const bucket = new TokenBucket(3, 1);

export async function sendMessage(opts: SendOptions): Promise<{ content: string }> {
  if (!bucket.tryTake(1)) {
    const ms = bucket.timeToNextMs();
    throw new RateLimitError(ms);
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
          reject(new DOMException("Aborted", "AbortError"));
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

  const init: any = {
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

  const retryOpts: {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    retryOn: (r: Response) => boolean;
    abortSignal?: AbortSignal;
  } = {
    maxRetries: 4,
    baseDelayMs: 300,
    maxDelayMs: 7000,
    retryOn: (r) => r.status === 429 || (r.status >= 500 && r.status < 600),
  };
  if (opts.signal) retryOpts.abortSignal = opts.signal;

  const res = await fetchWithRetry(url, init, retryOpts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  const json = await res.json().catch(() => null);
  const content = json?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Leere Antwort vom Server");
  return { content };
}
