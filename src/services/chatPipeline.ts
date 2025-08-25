/* Chat-Pipeline: baut Messages und ruft OpenRouter (Streaming optional).
 * - Strikt typisiert, kompatibel mit exactOptionalPropertyTypes.
 * - sendChat liefert IMMER { content: string } (auch bei Stream).
 * - Optionaler onToken-Callback für Live-UI-Updates.
 */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface BuildArgs {
  systemText?: string;
  memory?: string;          // z. B. Kurzkontext
  history?: ChatMessage[];  // bisherige Unterhaltung (ohne userInput)
  userInput?: string;       // aktuelle Eingabe (falls nicht in history)
}

export function buildMessages(args: BuildArgs): ChatMessage[] {
  const out: ChatMessage[] = [];

  if (args.systemText && args.systemText.trim().length > 0) {
    out.push({ role: "system", content: args.systemText });
  }
  if (args.memory && args.memory.trim().length > 0) {
    out.push({ role: "system", content: \`Kontext: \${args.memory}\` });
  }

  if (Array.isArray(args.history) && args.history.length > 0) {
    for (const m of args.history) {
      if (m && (m.role === "system" || m.role === "user" || m.role === "assistant")) {
        out.push({ role: m.role, content: m.content ?? "" });
      }
    }
  }

  if (args.userInput && args.userInput.trim().length > 0) {
    out.push({ role: "user", content: args.userInput });
  }

  return out;
}

export interface SendArgs {
  apiKey: string;
  model: string;
  systemText?: string;
  memory?: string;
  history?: ChatMessage[];
  userInput?: string;

  stream?: boolean;
  abortSignal?: AbortSignal | null;
  temperature?: number;
  maxTokens?: number;
  referer?: string;
  title?: string;

  onToken?: (delta: string) => void; // Streaming-Callback (optional)
}

export interface ChatResponse {
  content: string;
}

function makeHeaders(apiKey: string, referer?: string, title?: string): Headers {
  const h = new Headers();
  h.set("Content-Type", "application/json");
  h.set("Authorization", \`Bearer \${apiKey}\`);
  if (referer) h.set("HTTP-Referer", referer);
  if (title) h.set("X-Title", title);
  return h;
}

export async function sendChat(args: SendArgs): Promise<ChatResponse> {
  const {
    apiKey, model, systemText, memory, history, userInput,
    stream, abortSignal, temperature, maxTokens, referer, title, onToken,
  } = args;

  // exactOptionalPropertyTypes: optionale Felder nur setzen, wenn vorhanden
  const mArgs: BuildArgs = {};
  if (typeof systemText === "string") mArgs.systemText = systemText;
  if (typeof memory === "string") mArgs.memory = memory;
  if (Array.isArray(history)) mArgs.history = history;
  if (typeof userInput === "string") mArgs.userInput = userInput;

  const messages = buildMessages(mArgs);

  // Body nur mit definierten Feldern befüllen
  const body: Record<string, unknown> = { model, messages };
  if (stream === true) body.stream = true;
  if (typeof temperature === "number") body.temperature = temperature;
  if (typeof maxTokens === "number") body.max_tokens = maxTokens;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: makeHeaders(apiKey, referer, title),
    body: JSON.stringify(body),
    signal: abortSignal ?? null, // DOM erwartet AbortSignal | null
  });

  if (!res.ok) {
    let msg = \`HTTP \${res.status}\`;
    try {
      const e = await res.json();
      if (e?.error?.message) msg = e.error.message as string;
    } catch {
      // ignore JSON parse
    }
    throw new Error(\`OpenRouter-Fehler: \${msg}\`);
  }

  // Streaming-Pfad
  if (stream === true) {
    const reader = res.body?.getReader();
    if (!reader) {
      // Fallback: falls Server kein stream liefert
      const j = await res.json();
      const text =
        (j?.choices?.[0]?.message?.content as string | undefined) ??
        (j?.choices?.[0]?.delta?.content as string | undefined) ??
        "";
      return { content: text };
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // text/event-stream → Blöcke über \n\n
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? ""; // unvollständigen Rest behalten

        for (const chunk of parts) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;

          try {
            const json = JSON.parse(payload) as {
              choices?: Array<{
                delta?: { content?: string };
                message?: { content?: string };
              }>;
            };
            const delta =
              json.choices?.[0]?.delta?.content ??
              json.choices?.[0]?.message?.content ??
              "";

            if (delta && delta.length > 0) {
              full += delta;
              if (onToken) onToken(delta);
            }
          } catch {
            // Ignoriere fehlerhafte Fragmente
          }
        }
      }
    } finally {
      try { await reader.cancel(); } catch { /* noop */ }
    }

    return { content: full };
  }

  // Non-Streaming
  const j = await res.json();
  const text =
    (j?.choices?.[0]?.message?.content as string | undefined) ??
    (j?.choices?.[0]?.delta?.content as string | undefined) ??
    "";
  return { content: text };
}
