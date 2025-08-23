export type Role = "system" | "user" | "assistant" | "tool";
export interface Msg { role: Role; content: string; }

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"\;
const KEY_NAME = "disa_api_key";
const MODEL_KEY = "disa_model";

function getHeaders() {
  const apiKey = localStorage.getItem(KEY_NAME)?.replace(/^"+|"+$/g, "");
  if (!apiKey) throw new Error("NO_API_KEY");
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": location.origin,
    "X-Title": "Disa AI"
  } as Record<string, string>;
}

export function getModelFallback() {
  try {
    return localStorage.getItem(MODEL_KEY) || "meta-llama/llama-3.3-70b-instruct:free";
  } catch {
    return "meta-llama/llama-3.3-70b-instruct:free";
  }
}

function mapHttpError(status: number): string {
  if (status === 401) return "API-Key fehlt oder ist ungültig (401).";
  if (status === 403) return "Zugriff verweigert/Modell blockiert (403).";
  if (status === 429) return "Rate-Limit/Quota erreicht (429).";
  if (status >= 500) return "Anbieterfehler (5xx). Bitte später erneut.";
  return `HTTP_${status}`;
}

export async function chatOnce(messages: Msg[], opts?: { model?: string; signal?: AbortSignal }) {
  const headers = getHeaders();
  const model = opts?.model ?? getModelFallback();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: false }),
    signal: opts?.signal
  });
  if (!res.ok) throw new Error(mapHttpError(res.status));
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text, raw: data };
}

export async function chatStream(
  messages: Msg[],
  onDelta: (textDelta: string) => void,
  opts?: { model?: string; signal?: AbortSignal; onStart?: () => void; onDone?: (full: string) => void }
) {
  const headers = getHeaders();
  const model = opts?.model ?? getModelFallback();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, stream: true }),
    signal: opts?.signal
  });
  if (!res.ok) throw new Error(mapHttpError(res.status));

  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";
  let started = false;
  let full = "";

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const raw of parts) {
        const frameLines = raw.split("\n").map((l) => l.trim());
        const dataLines = frameLines
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.slice(5).trim())
          .filter(Boolean);

        for (const payload of dataLines) {
          if (payload === "[DONE]") { opts?.onDone?.(full); return; }
          if (payload.startsWith("{")) {
            try {
              const json = JSON.parse(payload);
              if (json?.error) throw new Error(json.error?.message || "Unbekannter API-Fehler");
              const delta =
                json?.choices?.[0]?.delta?.content ??
                json?.choices?.[0]?.message?.content ?? "";
              if (!started) { started = true; opts?.onStart?.(); }
              if (delta) { onDelta(delta); full += delta; }
            } catch (e) {
              throw e instanceof Error ? e : new Error("Stream-Parsefehler");
            }
          } else {
            if (!started) { started = true; opts?.onStart?.(); }
            onDelta(payload);
            full += payload;
          }
        }
      }
    }
    opts?.onDone?.(full);
  } finally {
    try { reader.releaseLock(); } catch {}
    try { await res.body?.cancel(); } catch {}
  }
}
