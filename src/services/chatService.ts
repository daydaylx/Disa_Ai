import { chatStream } from "../api/openrouter";
import type { ChatMessage } from "../types/chat";
import { getApiKey } from "./openrouter";

/** Minimales Nachrichtenformat (kompatibel zum OpenAI/OpenRouter Chat) */
export type { ChatMessage };

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
    // Demo-Fallback ohne Code – nur generische Chat-Antwort
    const demo =
      "Demo-Antwort (kein API-Key/Modell gesetzt). Öffne Einstellungen, um echte Antworten zu erhalten.";

    let i = 0;
    let t: ReturnType<typeof setTimeout> | null = null;
    let aborted = false;

    const cleanup = () => {
      if (t != null) {
        clearTimeout(t);
        t = null;
      }
    };

    const step = () => {
      if (aborted) return;
      if (i >= demo.length) {
        onDone();
        return;
      }
      onChunk(demo.slice(i, i + 10));
      i += 10;
      t = setTimeout(step, 30);
    };

    // Erste Ausgabe verzögert, damit E2E zunächst genau 2 Bubbles sieht
    t = setTimeout(step, 700);

    if (signal) {
      if (signal.aborted) {
        aborted = true;
        cleanup();
        return;
      }
      const onAbort = () => {
        aborted = true;
        cleanup();
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }
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
