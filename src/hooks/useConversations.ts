import * as React from "react";
import { newId } from "../utils/id";

export type Role = "system" | "user" | "assistant";
export type ChatMessage = { id: string; role: Role; content: string; createdAt: number };
export type ConversationMeta = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  modelId?: string;
};

const metaKey = (id: string) => `disa:conv:${id}:meta`;
const msgsKey = (id: string) => `disa:conv:${id}:msgs`;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function writeJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function createConversation(
  title = "Neue Unterhaltung",
  modelId?: string,
): ConversationMeta {
  const id = newId();
  const now = Date.now();
  const meta: ConversationMeta = { id, title, createdAt: now, updatedAt: now };
  if (modelId !== undefined) meta.modelId = modelId;
  writeJson(metaKey(id), meta);
  writeJson<ChatMessage[]>(msgsKey(id), []);
  return meta;
}

export function getConversationMeta(id: string): ConversationMeta | null {
  return readJson<ConversationMeta | null>(metaKey(id), null);
}
export function getConversationMessages(id: string): ChatMessage[] {
  return readJson<ChatMessage[]>(msgsKey(id), []);
}

export function appendMessage(
  id: string,
  msg: Omit<ChatMessage, "id" | "createdAt"> & { id?: string; createdAt?: number },
): ChatMessage {
  const message: ChatMessage = {
    id: msg.id ?? newId(),
    createdAt: msg.createdAt ?? Date.now(),
    role: msg.role,
    content: msg.content,
  };
  const list = getConversationMessages(id);
  list.push(message);
  writeJson(msgsKey(id), list);
  const meta = getConversationMeta(id);
  if (meta) {
    meta.updatedAt = message.createdAt;
    writeJson(metaKey(id), meta);
  }
  return message;
}

export function setConversationTitle(id: string, title: string) {
  const meta = getConversationMeta(id);
  if (meta) {
    meta.title = title;
    meta.updatedAt = Date.now();
    writeJson(metaKey(id), meta);
  }
}

export function deleteConversation(id: string) {
  try {
    localStorage.removeItem(metaKey(id));
    localStorage.removeItem(msgsKey(id));
  } catch {}
}

export function listConversations(): ConversationMeta[] {
  const list: ConversationMeta[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("disa:conv:") && k.endsWith(":meta")) {
        const meta = readJson<ConversationMeta | null>(k, null);
        if (meta) list.push(meta);
      }
    }
  } catch {}
  return list.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function useConversations() {
  const [items, setItems] = React.useState<ConversationMeta[]>(() => listConversations());
  React.useEffect(() => {
    function onStorage(ev: StorageEvent) {
      if (!ev.key) return;
      if (ev.key.startsWith("disa:conv:")) setItems(listConversations());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const api = React.useMemo(
    () => ({
      refresh: () => setItems(listConversations()),
      create: (title?: string, modelId?: string) => {
        const meta = createConversation(title, modelId);
        setItems(listConversations());
        return meta;
      },
      rename: (id: string, title: string) => {
        setConversationTitle(id, title);
        setItems(listConversations());
      },
      remove: (id: string) => {
        deleteConversation(id);
        setItems(listConversations());
      },
      append: appendMessage,
      getMessages: getConversationMessages,
      getMeta: getConversationMeta,
    }),
    [],
  );
  return { items, ...api };
}

export type UseConversations = ReturnType<typeof useConversations>;
