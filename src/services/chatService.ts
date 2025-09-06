import { chatStream } from "../api/openrouter";
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

  try {
    await chatStream(
      messages,
      (delta) => {
        if (typeof delta === "string" && delta.length > 0) onChunk(delta);
      },
      {
        model,
        ...(signal ? { signal } : {}),
        onDone: () => onDone(),
      },
    );
  } catch (err) {
    onError(err);
  }
}
