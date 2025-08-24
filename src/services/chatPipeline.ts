import type { ChatMessage } from "../types/chat";
import { buildMessages } from "../utils/buildMessages";
import { ContextManager } from "./contextManager";
import { createChatCompletion, type StreamChunk } from "./openRouterClient";
import { loadMemory, updateMemory, formatMemoryForSystem } from "./memory";

export type SendArgs = {
  apiKey: string;
  model: string;
  systemText?: string;
  history?: ChatMessage[];
  userInput?: string;
  stream?: boolean;
  modelCtx?: number;
  reservedTokens?: number;
  abortSignal?: AbortSignal;
  temperature?: number;
  maxTokens?: number;
  referer?: string;
  title?: string;
  memoryScopeId?: string;
  enableMemory?: boolean;
};

export interface ChatResponse { type: "json"; response: Response; }
export interface ChatStream { type: "stream"; stream: AsyncIterable<StreamChunk>; }

interface ChatCompletionJSON {
  choices?: Array<{ message?: { content?: string } }>;
}
function extractAssistant(json: unknown): string {
  const obj = json as ChatCompletionJSON | null | undefined;
  const content = obj?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}

/**
 * Systemprompt + Memory in **eine** System-Message, Token-Pruning, Auto-Memory-Update.
 */
export async function sendChat(args: SendArgs): Promise<ChatResponse | ChatStream> {
  const {
    apiKey, model, systemText, history, userInput,
    stream, modelCtx, reservedTokens, abortSignal, temperature, maxTokens,
    referer, title, memoryScopeId, enableMemory,
  } = args;

  const scope = (memoryScopeId && memoryScopeId.trim()) || "default";
  const memoryEnabled = enableMemory !== false;

  const memStr = memoryEnabled ? formatMemoryForSystem(loadMemory(scope)) : "";

  // mit exactOptionalPropertyTypes KEINE undefined-Properties weitergeben
  const messages = buildMessages({
    ...(systemText ? { systemText } : {}),
    ...(memStr ? { memory: memStr } : {}),
    ...(Array.isArray(history) ? { history } : {}),
    ...(userInput ? { userInput } : {}),
  });

  const cm = new ContextManager({
    maxTokens: modelCtx ?? 4000,
    reservedTokens: reservedTokens ?? 1000,
  });
  const optimized = cm.optimize(messages);

  const result = await createChatCompletion({
    apiKey,
    model,
    messages: optimized,
    ...(temperature !== undefined ? { temperature } : {}),
    ...(maxTokens !== undefined ? { maxTokens } : {}),
    stream: Boolean(stream),
    ...(abortSignal ? { abortSignal } : {}),
    ...(referer ? { referer } : {}),
    ...(title ? { title } : {}),
  });

  if (Symbol.asyncIterator in Object(result)) {
    const iter = result as AsyncIterable<StreamChunk>;
    return {
      type: "stream",
      stream: (async function* wrapped() {
        let acc = "";
        for await (const chunk of iter) {
          if (chunk.contentDelta) acc += chunk.contentDelta;
          yield chunk;
        }
        if (memoryEnabled) {
          const turns: ChatMessage[] = [
            ...(Array.isArray(history) ? history.filter(m => m.role !== "system") : []),
          ];
          if (userInput && userInput.trim()) {
            turns.push({ role: "user", content: userInput.trim() });
          }
          if (acc && acc.trim()) {
            turns.push({ role: "assistant", content: acc.trim() });
          }
          updateMemory(scope, turns);
        }
      })(),
    };
  }

  const res = result as Response;
  const json = await res.json().catch(() => null as unknown);
  const assistantText = extractAssistant(json);

  if (memoryEnabled) {
    const turns: ChatMessage[] = [
      ...(Array.isArray(history) ? history.filter(m => m.role !== "system") : []),
    ];
    if (userInput && userInput.trim()) {
      turns.push({ role: "user", content: userInput.trim() });
    }
    if (assistantText && assistantText.trim()) {
      turns.push({ role: "assistant", content: assistantText.trim() });
    }
    updateMemory(scope, turns);
  }

  const rebuilt = new Response(JSON.stringify(json), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });

  return { type: "json", response: rebuilt };
}
