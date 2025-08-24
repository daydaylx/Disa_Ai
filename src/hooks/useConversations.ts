import * as React from "react";
import type { ChatMessage } from "../types/chat";
import { sendChat, type ChatResponse, type ChatStream } from "../services/chatPipeline";

// ==== Types ====

export interface ConversationMeta {
id: string;
title: string;
model: string;
createdAt: number;
updatedAt: number;
archived: boolean;
}

export interface CreateConversationOptions {
title?: string;
model?: string;
makeActive?: boolean;
}

export interface SendOptions {
apiKey: string;
model: string;
systemText?: string;
input: string;
stream?: boolean;
modelCtx?: number;
reservedTokens?: number;
abortSignal?: AbortSignal;
temperature?: number;
maxTokens?: number;
referer?: string;
title?: string;
onDelta?: (delta: string, full: string) => void;
}

// ==== Storage Keys & Helpers ====

const LS_CONV_LIST = "disa:conv:list"; // JSON Array<ConversationMeta>
function LS_MSG_KEY(id: string): string {
return disa:conv:${id}:msgs; // JSON Array<ChatMessage>
}

function now(): number {
return Date.now ? Date.now() : new Date().getTime();
}

function uid(): string {
// Zeit-basiert + random – stabil genug für clientseitige IDs
return ${now().toString(36)}-${Math.random().toString(36).slice(2, 8)};
}

function safeGet<T>(key: string, fallback: T): T {
if (typeof window === "undefined") return fallback;
try {
const raw = window.localStorage.getItem(key);
if (!raw) return fallback;
const parsed = JSON.parse(raw) as unknown;
return (parsed as T) ?? fallback;
} catch {
return fallback;
}
}

function safeSet<T>(key: string, val: T): void {
if (typeof window === "undefined") return;
try {
window.localStorage.setItem(key, JSON.stringify(val));
} catch {
/* ignore quota */
}
}

function loadMessages(id: string): ChatMessage[] {
return safeGet<ChatMessage[]>(LS_MSG_KEY(id), []);
}

function saveMessages(id: string, msgs: ChatMessage[]): void {
safeSet(LS_MSG_KEY(id), msgs);
}

function clampArray<T>(arr: T[], max: number): T[] {
if (arr.length <= max) return arr;
return arr.slice(arr.length - max); // nur jüngste behalten
}

// ==== Hook ====

export interface UseConversations {
list: ConversationMeta[];
activeId: string | null;
active: ConversationMeta | null;
messages: ChatMessage[];

createConversation: (opts?: CreateConversationOptions) => string;
duplicateConversation: (id: string) => string;
renameConversation: (id: string, title: string) => void;
deleteConversation: (id: string) => void;
setActiveConversation: (id: string | null) => void;
clearConversation: (id: string) => void;

appendMessage: (id: string, msg: ChatMessage) => void;
updateLastAssistantMessage: (id: string, content: string) => void;

sendWithPipeline: (conversationId: string, opts: SendOptions) => Promise<void>;
}

export function useConversations(initialModel: string = "mistral/mistral-7b-instruct"): UseConversations {
const [list, setList] = React.useState<ConversationMeta[]>(() => {
const l = safeGet<ConversationMeta[]>(LS_CONV_LIST, []);
if (l.length > 0) return l.sort((a, b) => b.updatedAt - a.updatedAt);
// initiale Konvo
const first: ConversationMeta = {
id: uid(),
title: "Neuer Chat",
model: initialModel,
createdAt: now(),
updatedAt: now(),
archived: false,
};
safeSet(LS_CONV_LIST, [first]);
saveMessages(first.id, []);
return [first];
});

const [activeId, setActiveId] = React.useState<string | null>(() => list[0]?.id ?? null);
const active = React.useMemo(() => (activeId ? list.find((c) => c.id === activeId) ?? null : null), [list, activeId]);
const [messages, setMessages] = React.useState<ChatMessage[]>(() => (active ? loadMessages(active.id) : []));

React.useEffect(() => {
setMessages(active ? loadMessages(active.id) : []);
}, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

function persistList(next: ConversationMeta[]): void {
const ordered = next.slice().sort((a, b) => b.updatedAt - a.updatedAt);
setList(ordered);
safeSet(LS_CONV_LIST, ordered);
}

function touch(id: string): void {
persistList(list.map((c) => (c.id === id ? { ...c, updatedAt: now() } : c)));
}

function createConversation(opts?: CreateConversationOptions): string {
const id = uid();
const meta: ConversationMeta = {
id,
title: (opts?.title ?? "Neuer Chat").trim() || "Neuer Chat",
model: (opts?.model ?? initialModel),
createdAt: now(),
updatedAt: now(),
archived: false,
};
const next = [meta, ...list];
persistList(next);
saveMessages(id, []);
if (opts?.makeActive !== false) {
setActiveId(id);
setMessages([]);
}
return id;
}

function duplicateConversation(id: string): string {
const src = list.find((c) => c.id === id);
if (!src) return createConversation();
const msgs = loadMessages(id);
const newId = uid();
const meta: ConversationMeta = {
...src,
id: newId,
title: ${src.title} (Kopie),
createdAt: now(),
updatedAt: now(),
};
persistList([meta, ...list]);
saveMessages(newId, msgs);
setActiveId(newId);
setMessages(msgs);
return newId;
}

function renameConversation(id: string, title: string): void {
const t = title.trim();
persistList(list.map((c) => (c.id === id ? { ...c, title: t.length > 0 ? t : c.title, updatedAt: now() } : c)));
}

function deleteConversation(id: string): void {
const next = list.filter((c) => c.id !== id);
persistList(next);
// kill messages
if (typeof window !== "undefined") {
try { window.localStorage.removeItem(LS_MSG_KEY(id)); } catch {}
}
if (activeId === id) {
const newActive = next[0]?.id ?? null;
setActiveId(newActive);
setMessages(newActive ? loadMessages(newActive) : []);
}
}

function setActiveConversation(id: string | null): void {
setActiveId(id);
if (id) {
touch(id);
setMessages(loadMessages(id));
} else {
setMessages([]);
}
}

function clearConversation(id: string): void {
saveMessages(id, []);
if (activeId === id) setMessages([]);
touch(id);
}

function appendMessage(id: string, msg: ChatMessage): void {
const msgs = loadMessages(id);
const next = clampArray([...msgs, { ...msg }], 2000); // harte Obergrenze
saveMessages(id, next);
if (activeId === id) setMessages(next);
touch(id);
}

function updateLastAssistantMessage(id: string, content: string): void {
const msgs = loadMessages(id);
for (let i = msgs.length - 1; i >= 0; i--) {
if (msgs[i]?.role === "assistant") {
msgs[i] = { ...msgs[i], content };
break;
}
}
saveMessages(id, msgs);
if (activeId === id) setMessages(msgs);
touch(id);
}

async function sendWithPipeline(conversationId: string, opts: SendOptions): Promise<void> {
const conv = list.find((c) => c.id === conversationId);
if (!conv) throw new Error("Conversation not found");

const history = loadMessages(conversationId).filter((m) => m.role !== "system");
const userInput = opts.input.trim();
if (!userInput) return;

// 1) user message
appendMessage(conversationId, { role: "user", content: userInput, meta: { timestamp: now(), status: "sent" } });

// 2) assistant placeholder
appendMessage(conversationId, { role: "assistant", content: "", meta: { timestamp: now(), status: "sending" } });

// 3) call pipeline
const out = await sendChat({
  apiKey: opts.apiKey,
  model: opts.model,
  systemText: opts.systemText,
  history,
  userInput,
  stream: opts.stream ?? true,
  modelCtx: opts.modelCtx,
  reservedTokens: opts.reservedTokens,
  abortSignal: opts.abortSignal,
  temperature: opts.temperature,
  maxTokens: opts.maxTokens,
  referer: opts.referer,
  title: opts.title,
  memoryScopeId: conversationId,
  enableMemory: true,
});

if (out.type === "stream") {
  let acc = "";
  for await (const chunk of out.stream) {
    if (chunk.contentDelta) {
      acc += chunk.contentDelta;
      updateLastAssistantMessage(conversationId, acc);
      if (opts.onDelta) opts.onDelta(chunk.contentDelta, acc);
    }
  }
  // mark sent
  const msgs = loadMessages(conversationId);
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]?.role === "assistant") {
      msgs[i] = { ...msgs[i], meta: { ...(msgs[i].meta ?? {}), status: "sent" } };
      break;
    }
  }
  saveMessages(conversationId, msgs);
  if (activeId === conversationId) setMessages(msgs);
  touch(conversationId);
  return;
}

// non-stream
const json = await out.response.json().catch(() => null as unknown);
const text = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return String((json as any)?.choices?.[0]?.message?.content ?? "");
  } catch {
    return "";
  }
})();
updateLastAssistantMessage(conversationId, text);
// mark sent
const msgs = loadMessages(conversationId);
for (let i = msgs.length - 1; i >= 0; i--) {
  if (msgs[i]?.role === "assistant") {
    msgs[i] = { ...msgs[i], meta: { ...(msgs[i].meta ?? {}), status: "sent" } };
    break;
  }
}
saveMessages(conversationId, msgs);
if (activeId === conversationId) setMessages(msgs);
touch(conversationId);


}

return {
list,
activeId,
active,
messages,
createConversation,
duplicateConversation,
renameConversation,
deleteConversation,
setActiveConversation,
clearConversation,
appendMessage,
updateLastAssistantMessage,
sendWithPipeline,
};
}
