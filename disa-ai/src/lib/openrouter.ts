import type { ChatMessage } from "./types";

const LS_KEY = "openrouter_api_key";

export class OpenRouterClient {
  getApiKey(): string | null {
    try { return localStorage.getItem(LS_KEY); } catch { return null; }
  }
  setApiKey(key: string) {
    try { localStorage.setItem(LS_KEY, key); } catch {}
  }
  clearApiKey() {
    try { localStorage.removeItem(LS_KEY); } catch {}
  }

  async chat(opts: {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
  }): Promise<{ content: string }> {
    const key = this.getApiKey();
    if (!key) throw new Error("Kein OpenRouter API-Key gesetzt.");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.max_tokens ?? 1024
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenRouter Error ${res.status}: ${text || res.statusText}`);
    }

    const data = await res.json();
    const content: string =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";
    return { content };
  }
}
