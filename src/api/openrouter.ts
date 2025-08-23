/**
 * OpenRouter Browser-Client
 * - chatStream: Streaming via SSE
 * - chatOnce: Einmal-Antwort (z. B. für Summaries)
 * - Liest API-Key aus localStorage ("disa_api_key")
 * - Liest gewähltes Modell aus localStorage ("disa_model"), wenn nicht explizit übergeben
 * - Setzt Attribution-Header (HTTP-Referer, X-Title)
 */
export type Role = "system" | "user" | "assistant" | "tool";
export interface Msg { role: Role; content: string; }

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"\;
const KEY_NAME = "disa_api_key";
const MODEL_KEY = "disa_model";

function getHeaders() {
  const apiKey = localStorage.getItem(KEY_NAME)?.replace(/^"+|"+$/g, "");
  if (!apiKey) throw new Error("NO_API_KEY");
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": location.origin,
    "X-Title": "Disa AI",
  } as Record<string, string>;
}

export function getModelFallback() {
  try { return localStorage.getItem(MODEL_KEY) || "meta-llama/llama-3.3-70b-instruct:free"; }
  catch { return "meta-llama/llama-3.3-70b-instruct:free"; }
}

export async function chatOnce(messages: Msg[], opts?: { model?: string; signal?: AbortSignal }) {
  const headers = getHeaders();
  const model = opts?.model ?? getModelFallback();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: false }),
    signal: opts?.signal,
  });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text, raw: data };
}

export async function chatStream(
  messages: Msg[],
  onToken: (t: string) => void,
  opts?: { model?: string; signal?: AbortSignal; onStart?: () => void; onDone?: (full: string) => void }
) {
  const headers = getHeaders();
  const model = opts?.model ?? getModelFallback();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: true }),
    signal: opts?.signal,
  });
  if (!res.ok || !res.body) throw new Error(`HTTP_${res.status}`);

  opts?.onStart?.();

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const evt of events) {
      const lines = evt.split("\n").filter(l => l.trim().length > 0 && !l.startsWith(":"));
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const jsonStr = line.slice(5).trim();
        if (jsonStr === "[DONE]") {
          opts?.onDone?.(full);
          return;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed?.choices?.[0]?.delta?.content
                     ?? parsed?.choices?.[0]?.message?.content
                     ?? "";
          if (delta) {
            full += delta;
            onToken(delta);
          }
        } catch {
          // ignore
        }
      }
    }
  }
  opts?.onDone?.(full);
}
