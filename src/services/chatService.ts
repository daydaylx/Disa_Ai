import { getApiKey } from "./openrouter";

/** Minimales Nachrichtenformat (kompatibel zum OpenAI/OpenRouter Chat) */
export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

/** Streaming-Client für OpenRouter (SSE/NDJSON). Fällt auf Demo zurück, wenn kein API-Key. */
export async function sendChat(opts: {
  apiKey?: string | null;
  model: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: unknown) => void;
  signal?: AbortSignal;
}) {
  const apiKey = (opts.apiKey ?? getApiKey()) || null;
  const { model, messages, onChunk, onDone, onError, signal } = opts;

  // Fallback: Demo ohne Netz, wenn kein Key oder Model leer
  if (!apiKey || !model) {
    const demo =
      "Dies ist eine Demo-Antwort, weil kein API-Key oder Modell konfiguriert ist. Öffne Einstellungen → API-Key & Modell.";
    let i = 0;
    const step = () => {
      if (i >= demo.length) return onDone();
      onChunk(demo.slice(i, i + 10));
      i += 10;
      setTimeout(step, 30);
    };
    step();
    return;
  }

  const url = "https://openrouter.ai/api/v1/chat/completions";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model,
    stream: true,
    messages,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      ...(signal ? { signal } : {}),
    });
    if (!res.ok || !res.body) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Beide Formate unterstützen: text/event-stream (data:) und NDJSON
      let idx: number;
      while ((idx = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);

        if (!line) continue;

        // SSE: lines like "data: {...}" or "data: [DONE]"
        let payload = line;
        if (line.startsWith("data:")) {
          payload = line.slice(5).trim();
        }

        if (payload === "[DONE]") {
          onDone();
          return;
        }

        try {
          const json = JSON.parse(payload);
          // OpenRouter/OpenAI delta
          const delta =
            json.choices?.[0]?.delta?.content ??
            json.choices?.[0]?.message?.content ??
            json.choices?.[0]?.text ??
            "";

          if (typeof delta === "string" && delta.length > 0) {
            onChunk(delta);
          }
        } catch {
          // best-effort: ignorieren
        }
      }
    }

    // Falls kein [DONE] kam:
    onDone();
  } catch (err) {
    onError(err);
  }
}
