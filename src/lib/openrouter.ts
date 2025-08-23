export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type SendOptions = {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  timeoutMs?: number;
  onToken?: (delta: string) => void;
};

/**
 * Streamt Antworten von OpenRouter (SSE). Liefert den vollständigen Text zurück
 * und ruft onToken bei jedem Chunk auf.
 */
export async function sendChat(opts: SendOptions): Promise<string> {
  const { apiKey, model, messages, signal, timeoutMs = 60_000, onToken } = opts;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const link = new AbortController();

  // wenn Nutzer abbricht, brich hier auch ab
  signal?.addEventListener("abort", () => link.abort(), { once: true });

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://local.app",
      "X-Title": "Disa AI"
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    }),
    signal: ctrl.signal
  });

  if (!res.ok || !res.body) {
    clearTimeout(timer);
    const text = await safeText(res);
    if (res.status === 401) throw new Error("API-Key ungültig (401).");
    if (res.status === 429) throw new Error("Rate-Limit/Überlastung (429).");
    throw new Error(`OpenRouter Fehler ${res.status}: ${text || res.statusText}`);
  }

  let out = "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      if (link.signal.aborted) { ctrl.abort(); throw new DOMException("aborted", "AbortError"); }
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        const s = line.trim();
        if (!s.startsWith("data:")) continue;
        const payload = s.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const delta: string = json?.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            out += delta;
            onToken?.(delta);
          }
        } catch {
          // ignoriere JSON-Fehler auf einzelnen SSE-Zeilen
        }
      }
    }
  } catch (e: any) {
    if (e?.name === "AbortError") throw new Error("⏹️ abgebrochen");
    throw e;
  } finally {
    clearTimeout(timer);
    try { reader.releaseLock(); } catch {}
  }

  return out;
}

async function safeText(r: Response): Promise<string> {
  try { return await r.text(); } catch { return ""; }
}
