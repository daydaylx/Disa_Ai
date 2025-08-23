export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type SendOptions = {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  onToken?: (delta: string) => void;
  timeoutMs?: number;
};

export async function sendChat(opts: SendOptions): Promise<string> {
  const { apiKey, model, messages, signal, onToken, timeoutMs = 60_000 } = opts;
  if (!apiKey) throw new Error("API-Key fehlt");
  if (!model) throw new Error("Modell fehlt");
  if (!messages?.length) throw new Error("Leere Messages");

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  const linked = linkSignals(signal, ac.signal);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": location.origin,
        "X-Title": "Disa AI",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        // für OpenRouter konform
      }),
      signal: linked,
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("API-Key ungültig (401)");
      if (res.status === 429) throw new Error("Zu viele Anfragen (429) – kurz warten");
      throw new Error(`HTTP ${res.status}`);
    }

    // SSE-ähnlicher Stream (data: {json})
    const reader = res.body?.getReader();
    if (!reader) throw new Error("Kein Stream verfügbar");

    const decoder = new TextDecoder("utf-8");
    let buf = "";
    let final = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      const parts = buf.split("\n\n");
      buf = parts.pop() ?? "";
      for (const chunk of parts) {
        const line = chunk.trim();
        if (!line) continue;

        // Formate: "data: [DONE]" oder "data: {json}"
        const payload = line.startsWith("data:") ? line.slice(5).trim() : line;
        if (payload === "[DONE]") continue;

        try {
          const json = JSON.parse(payload);
          const delta = json?.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            final += delta;
            onToken?.(delta);
          }
        } catch {
          // Ignorieren von Nicht-JSON-Zwischenzeilen
        }
      }
    }
    return final;
  } finally {
    clearTimeout(timer);
  }
}

function linkSignals(a?: AbortSignal, b?: AbortSignal): AbortSignal | undefined {
  if (!a && !b) return undefined;
  const ctl = new AbortController();
  const onAbort = () => ctl.abort();
  a?.addEventListener("abort", onAbort);
  b?.addEventListener("abort", onAbort);
  if (a?.aborted || b?.aborted) ctl.abort();
  return ctl.signal;
}
