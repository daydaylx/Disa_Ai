import * as React from "react";
import { sendChat, type ChatMessage as ApiMessage } from "../services/chatPipeline";

/* Lokaler Nachrichtentyp: erweitert API-Message um Meta */
export interface ChatMessage extends ApiMessage {
  meta?: {
    id?: string;
    conversationId?: string;
    timestamp?: number;
    tokenCount?: number;
    status?: "sending" | "sent" | "error";
  };
}

export interface ConversationMeta {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface UseConversations {
  list: ConversationMeta[];
  activeId: string | null;
  active: ConversationMeta | null;
  messages: ChatMessage[];

  createConversation: (opts?: { makeActive?: boolean }) => string;
  duplicateConversation: (id: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActiveConversation: (id: string | null) => void;

  sendWithPipeline: (
    conversationId: string,
    opts: {
      apiKey: string;
      model: string;
      systemText?: string;
      input: string;
      stream?: boolean;
      abortSignal?: AbortSignal;
      temperature?: number;
      maxTokens?: number;
      referer?: string;
      title?: string;
      onDelta?: (delta: string) => void;
    }
  ) => Promise<void>;
}

/* Storage-Keys */
const LS_CONV_INDEX = "disa:conv:index"; // string[] IDs (order: newest first)
const metaKey = (id: string) => \`disa:conv:\${id}:meta\`; // ConversationMeta
const msgsKey = (id: string) => \`disa:conv:\${id}:msgs\`; // ChatMessage[]

/* Helpers */
function now(): number {
  return Date.now();
}
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}
function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return safeParse<T>(v, fallback);
  } catch {
    return fallback;
  }
}
function genId(): string {
  return \`\${now().toString(36)}-\${Math.random().toString(36).slice(2, 8)}\`;
}

export function useConversations(): UseConversations {
  const [index, setIndex] = React.useState<string[]>(() =>
    read<string[]>(LS_CONV_INDEX, [])
  );

  const initialActiveId: string | null = (() => {
    const ids = read<string[]>(LS_CONV_INDEX, []);
    return ids.length > 0 ? ids[0]! : null;
  })();
  const [activeId, setActiveId] = React.useState<string | null>(initialActiveId);

  const list: ConversationMeta[] = React.useMemo(() => {
    const items: ConversationMeta[] = [];
    for (const id of index) {
      const meta = read<ConversationMeta>(metaKey(id), {
        id,
        title: "Neuer Chat",
        createdAt: now(),
        updatedAt: now(),
        model: "mistral/mistral-7b-instruct",
      });
      items.push(meta);
    }
    return items;
  }, [index]);

  const active: ConversationMeta | null = React.useMemo(() => {
    if (!activeId) return null;
    return list.find((c) => c.id === activeId) ?? null;
  }, [activeId, list]);

  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    if (!activeId) return [];
    return read<ChatMessage[]>(msgsKey(activeId), []);
  });

  // Laden der Nachrichten bei Wechsel
  React.useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    setMessages(read<ChatMessage[]>(msgsKey(activeId), []));
  }, [activeId]);

  function persistIndex(next: string[]): void {
    setIndex(next);
    write(LS_CONV_INDEX, next);
  }
  function persistMeta(meta: ConversationMeta): void {
    write(metaKey(meta.id), meta);
  }
  function persistMsgs(id: string, msgs: ChatMessage[]): void {
    write(msgsKey(id), msgs);
  }

  function createConversation(opts?: { makeActive?: boolean }): string {
    const id = genId();
    const meta: ConversationMeta = {
      id,
      title: "Neuer Chat",
      createdAt: now(),
      updatedAt: now(),
      model: "mistral/mistral-7b-instruct",
    };
    persistMeta(meta);
    const nextIndex = [id, ...index];
    persistIndex(nextIndex);
    persistMsgs(id, []);
    if (opts?.makeActive) setActiveId(id);
    return id;
  }

  function duplicateConversation(id: string): string {
    const srcMeta = read<ConversationMeta>(metaKey(id), {
      id,
      title: "Neuer Chat",
      createdAt: now(),
      updatedAt: now(),
      model: "mistral/mistral-7b-instruct",
    });
    const srcMsgs = read<ChatMessage[]>(msgsKey(id), []);
    const nid = genId();
    const meta: ConversationMeta = {
      ...srcMeta,
      id: nid,
      title: \`\${srcMeta.title} (Kopie)\`,
      createdAt: now(),
      updatedAt: now(),
    };
    persistMeta(meta);
    persistMsgs(nid, srcMsgs);
    const nextIndex = [nid, ...index];
    persistIndex(nextIndex);
    return nid;
  }

  function deleteConversation(id: string): void {
    try {
      localStorage.removeItem(metaKey(id));
      localStorage.removeItem(msgsKey(id));
    } catch {
      /* noop */
    }
    const nextIndex = index.filter((x) => x !== id);
    persistIndex(nextIndex);
    if (activeId === id) {
      setActiveId(nextIndex[0] ?? null);
    }
  }

  function renameConversation(id: string, title: string): void {
    const meta = read<ConversationMeta>(metaKey(id), {
      id,
      title: "Neuer Chat",
      createdAt: now(),
      updatedAt: now(),
      model: "mistral/mistral-7b-instruct",
    });
    const clean = title.trim();
    const next: ConversationMeta = { ...meta, title: clean.length > 0 ? clean : meta.title, updatedAt: now() };
    persistMeta(next);
    // trigger refresh
    setIndex((prev) => [...prev]);
  }

  function setActiveConversation(id: string | null): void {
    setActiveId(id);
  }

  async function sendWithPipeline(
    conversationId: string,
    opts: {
      apiKey: string;
      model: string;
      systemText?: string;
      input: string;
      stream?: boolean;
      abortSignal?: AbortSignal;
      temperature?: number;
      maxTokens?: number;
      referer?: string;
      title?: string;
      onDelta?: (delta: string) => void;
    }
  ): Promise<void> {
    const meta = read<ConversationMeta>(metaKey(conversationId), {
      id: conversationId,
      title: "Neuer Chat",
      createdAt: now(),
      updatedAt: now(),
      model: "mistral/mistral-7b-instruct",
    });
    const msgs = read<ChatMessage[]>(msgsKey(conversationId), []);

    const userMsg: ChatMessage = {
      role: "user",
      content: opts.input,
      meta: { id: genId(), conversationId, timestamp: now(), status: "sent" },
    };
    const assistantMsgId = genId();
    const assistantIdx = msgs.length + 1;

    const assistantPlaceholder: ChatMessage = {
      role: "assistant",
      content: "",
      meta: { id: assistantMsgId, conversationId, timestamp: now(), status: "sending" },
    };

    const nextMsgs = [...msgs, userMsg, assistantPlaceholder];
    persistMsgs(conversationId, nextMsgs);
    if (activeId === conversationId) {
      setMessages(nextMsgs);
    }

    // Stream-Callback: aktualisiert die Placeholder-Nachricht in localStorage + State
    const onToken = (delta: string): void => {
      if (!delta) return;
      const live = read<ChatMessage[]>(msgsKey(conversationId), []);
      const idx = assistantIdx;
      const m = live[idx];
      if (!m || m.role !== "assistant") return;
      const updated: ChatMessage = {
        ...m,
        content: (m.content ?? "") + delta,
      };
      live[idx] = updated;
      persistMsgs(conversationId, live);
      if (activeId === conversationId) {
        setMessages(live);
      }
      if (opts.onDelta) opts.onDelta(delta);
    };

    try {
      // exactOptionalPropertyTypes: optionale Felder nur setzen, wenn vorhanden
      const req: Parameters<typeof sendChat>[0] = {
        apiKey: opts.apiKey,
        model: opts.model,
        stream: true,
        abortSignal: opts.abortSignal ?? null,
        // API-Nachrichten: Meta entfernen
        history: nextMsgs.slice(0, assistantIdx).map<ApiMessage>((m) => ({
          role: m.role,
          content: m.content ?? "",
        })),
        userInput: "", // userMsg steckt bereits in history
      };
      if (typeof opts.systemText === "string") req.systemText = opts.systemText;
      if (typeof opts.temperature === "number") req.temperature = opts.temperature;
      if (typeof opts.maxTokens === "number") req.maxTokens = opts.maxTokens;
      if (opts.referer) req.referer = opts.referer;
      if (opts.title) req.title = opts.title;
      req.onToken = onToken;

      const out = await sendChat(req);

      // Abschluss: finaler Text (falls Server am Ende noch was geliefert hat)
      const finalLive = read<ChatMessage[]>(msgsKey(conversationId), []);
      const m = finalLive[assistantIdx];
      if (m && m.role === "assistant") {
        const finalText = out.content ?? "";
        finalLive[assistantIdx] = {
          ...m,
          content: finalText.length > (m.content ?? "").length ? finalText : m.content,
          meta: { ...(m.meta ?? {}), status: "sent" },
        };
        persistMsgs(conversationId, finalLive);
        if (activeId === conversationId) {
          setMessages(finalLive);
        }
      }

      // Meta updatedAt nach vorne ziehen
      const updatedMeta: ConversationMeta = { ...meta, updatedAt: now() };
      persistMeta(updatedMeta);
      const rest = index.filter((x) => x !== conversationId);
      persistIndex([conversationId, ...rest]);
    } catch (e) {
      const errLive = read<ChatMessage[]>(msgsKey(conversationId), []);
      const m = errLive[assistantIdx];
      if (m && m.role === "assistant") {
        errLive[assistantIdx] = {
          ...m,
          content: \`Fehler: \${(e as Error).message}\`,
          meta: { ...(m.meta ?? {}), status: "error" },
        };
        persistMsgs(conversationId, errLive);
        if (activeId === conversationId) {
          setMessages(errLive);
        }
      }
    }
  }

  return {
    list,
    activeId,
    active,
    messages,
    createConversation,
    duplicateConversation,
    deleteConversation,
    renameConversation,
    setActiveConversation,
    sendWithPipeline,
  };
}
