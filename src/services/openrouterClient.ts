import type { ChatMessage } from "@/types/chat";

export type ChatCompletionArgs = {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
};

export async function sendChatCompletion(args: ChatCompletionArgs): Promise<string> {
  const { apiKey, model, messages, temperature = 0.7 } = args;

  const wireMsgs = messages.map(m => ({ role: m.role, content: m.content }));

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://disaai.pages.dev",
      "X-Title": "Disa_Ai"
    },
    body: JSON.stringify({
      model,
      messages: wireMsgs,
      temperature,
      stream: false
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text || res.statusText}`);
  }

  const json = await res.json() as any;
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Leere Antwort vom Modell");
  }
  return content;
}
