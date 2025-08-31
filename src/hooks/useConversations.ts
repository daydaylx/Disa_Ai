import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, ConversationMeta } from "@/types/chat";
import {
  convIndexKey, convMetaKey, convMsgsKey,
  getJSON, setJSON, del, migrateStorage
} from "@/utils/storage";

/** Sort helper: newest first */
function sortByUpdated(a: ConversationMeta, b: ConversationMeta): number { return b.updatedAt - a.updatedAt; }
function now(): number { return Date.now(); }
function genId(): string { return globalThis.crypto?.randomUUID?.() ?? `m_${Math.random().toString(36).slice(2)}`; }

export type UseConversations = {
  items: ConversationMeta[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;

  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, "id" | "ts"> & { id?: string; ts?: number }) => void;

  createConversation: (title?: string) => string;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;

  reload: () => void;

  // Backcompat (ältere Komponenten)
  create: (title?: string) => ConversationMeta;
  getMeta: (id: string) => ConversationMeta | null;
  getMessages: (id: string) => ChatMessage[];
  append: (id: string, msg: Omit<ChatMessage, "id" | "ts"> & { id?: string; ts?: number }) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
};

function readIndex(): string[] {
  const idx = getJSON<string[]>(convIndexKey());
  return Array.isArray(idx) ? idx : [];
}
function writeIndex(ids: string[]): void { setJSON(convIndexKey(), ids); }
function readMeta(id: string): ConversationMeta | null { return getJSON<ConversationMeta>(convMetaKey(id)); }
function writeMeta(meta: ConversationMeta): void { setJSON(convMetaKey(meta.id), meta); }
function readMsgs(id: string): ChatMessage[] { const arr = getJSON<ChatMessage[]>(convMsgsKey(id)); return Array.isArray(arr) ? arr : []; }
function writeMsgs(id: string, messages: ChatMessage[]): void { setJSON(convMsgsKey(id), messages); }

export function useConversations(): UseConversations {
  const [items, setItems] = useState<ConversationMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const reload = useCallback(() => {
    migrateStorage();
    const index = readIndex();
    const metas = index.map(id => readMeta(id)).filter((m): m is ConversationMeta => !!m).sort(sortByUpdated);
    setItems(metas);
    const nextActive = (activeId && metas.find(m => m.id === activeId)) ? activeId : metas[0]?.id ?? null;
    setActiveId(nextActive);
    setMessages(nextActive ? readMsgs(nextActive) : []);
  }, [activeId]);

  useEffect(() => { reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!activeId) { setMessages([]); return; } setMessages(readMsgs(activeId)); }, [activeId]);

  const createConversation = useCallback((title?: string) => {
    const id = genId();
    const meta: ConversationMeta = { id, title: title?.trim() || "Neue Unterhaltung", createdAt: now(), updatedAt: now() };
    const index = readIndex();
    writeIndex([id, ...index]);
    writeMeta(meta);
    writeMsgs(id, []);
    setItems(prev => [meta, ...prev].sort(sortByUpdated));
    setActiveId(id);
    setMessages([]);
    return id;
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    const meta = readMeta(id); if (!meta) return;
    const next: ConversationMeta = { ...meta, title: title.trim(), updatedAt: now() };
    writeMeta(next);
    setItems(prev => prev.map(m => m.id === id ? next : m).sort(sortByUpdated));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    const rest = readIndex().filter(x => x !== id);
    writeIndex(rest);
    del(convMetaKey(id)); del(convMsgsKey(id));
    setItems(prev => prev.filter(m => m.id !== id));
    if (activeId === id) setActiveId(rest[0] ?? null);
  }, [activeId]);

  const addMessage = useCallback((msg: Omit<ChatMessage, "id" | "ts"> & { id?: string; ts?: number }) => {
    if (!activeId) return;
    const ts = typeof msg.ts === "number" ? msg.ts : now();
    const id = msg.id ?? genId();
    const full: ChatMessage = { id, role: msg.role, content: msg.content, ts, ...(msg as any).meta ? { meta: (msg as any).meta } : {} };

    const list = readMsgs(activeId); const nextList = [...list, full];
    writeMsgs(activeId, nextList); setMessages(nextList);

    const meta = readMeta(activeId);
    if (meta) {
      const updated: ConversationMeta = { ...meta, updatedAt: ts };
      writeMeta(updated);
      setItems(prev => prev.map(m => m.id === activeId ? updated : m).sort(sortByUpdated));
    }
  }, [activeId]);

  // Backcompat
  const create = useCallback((title?: string) => {
    const id = createConversation(title);
    return readMeta(id)!;
  }, [createConversation]);
  const getMeta = useCallback((id: string) => readMeta(id), []);
  const getMessages = useCallback((id: string) => readMsgs(id), []);
  const append = useCallback((id: string, msg: Omit<ChatMessage, "id" | "ts"> & { id?: string; ts?: number }) => {
    const ts = typeof msg.ts === "number" ? msg.ts : now();
    const mid = msg.id ?? genId();
    const full: ChatMessage = { id: mid, role: msg.role, content: msg.content, ts, ...(msg as any).meta ? { meta: (msg as any).meta } : {} };
    const list = readMsgs(id); const next = [...list, full]; writeMsgs(id, next);
    if (activeId === id) setMessages(next);
    const meta = readMeta(id); if (meta) {
      const upd: ConversationMeta = { ...meta, updatedAt: ts };
      writeMeta(upd);
      setItems(prev => prev.map(m => m.id === id ? upd : m).sort(sortByUpdated));
    }
  }, [activeId]);
  const rename = useCallback((id: string, title: string) => renameConversation(id, title), [renameConversation]);
  const remove = useCallback((id: string) => deleteConversation(id), [deleteConversation]);

  return useMemo(() => ({
    items, activeId, setActiveId,
    messages, addMessage,
    createConversation, renameConversation, deleteConversation,
    reload,
    create, getMeta, getMessages, append, rename, remove,
  }), [items, activeId, messages, addMessage, createConversation, renameConversation, deleteConversation, reload, create, getMeta, getMessages, append, rename, remove]);
}

// Re-export types
export type { ChatMessage, ConversationMeta } from "@/types/chat";
