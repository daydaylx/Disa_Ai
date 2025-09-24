import React from "react";

import { ApiError, AuthError, RateLimitError, streamChat } from "../services/openrouter";
import { useSettings } from "./settings";

// Lokale Type-Definition für bessere Kompatibilität
type ORMsg = { role: "system" | "user" | "assistant"; content: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatStatus = "idle" | "streaming" | "error";

type ChatState = {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  activeRequestId: string | null;
};

type SendOptions = {
  systemPrompt?: string;
  temperature?: number;
  top_p?: number;
};

type ChatContextType = {
  state: ChatState;
  send: (userText: string, opts?: SendOptions) => Promise<void>;
  abort: () => void;
  retry: () => Promise<void>;
  clear: () => void;
  exportJson: () => string;
  importJson: (raw: string) => boolean;
};

const ChatContext = React.createContext<ChatContextType | null>(null);

function rid(prefix = "m"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function toORHistory(list: ChatMessage[], system?: string): ORMsg[] {
  const base: ORMsg[] = [];
  if (system && system.trim().length) base.push({ role: "system", content: system.trim() });
  for (const m of list) base.push({ role: m.role, content: m.content });
  return base;
}

type Action =
  | { type: "RESET"; keep?: boolean }
  | { type: "SET"; payload: ChatMessage[] }
  | { type: "APPEND_USER"; payload: ChatMessage }
  | { type: "BEGIN_STREAM"; payload: { assistantId: string; requestId: string } }
  | { type: "DELTA"; payload: { assistantId: string; chunk: string } }
  | { type: "END_STREAM"; payload: { assistantId: string } }
  | { type: "ERROR"; payload: { message: string } };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "RESET":
      return action.keep
        ? { ...state, messages: [], status: "idle", error: null, activeRequestId: null }
        : { messages: [], status: "idle", error: null, activeRequestId: null };
    case "SET":
      return { ...state, messages: action.payload };
    case "APPEND_USER":
      return { ...state, messages: [...state.messages, action.payload], error: null };
    case "BEGIN_STREAM": {
      const { assistantId, requestId } = action.payload;
      return {
        ...state,
        status: "streaming",
        error: null,
        activeRequestId: requestId,
        messages: [...state.messages, { id: assistantId, role: "assistant", content: "" }],
      };
    }
    case "DELTA": {
      const { assistantId, chunk } = action.payload;
      const idx = state.messages.findIndex((m) => m.id === assistantId);
      if (idx < 0) return state;
      const updated = [...state.messages];
      updated[idx] = { ...updated[idx], content: updated[idx].content + chunk };
      return { ...state, messages: updated };
    }
    case "END_STREAM":
      return { ...state, status: "idle", activeRequestId: null };
    case "ERROR":
      return { ...state, status: "error", error: action.payload.message, activeRequestId: null };
    default:
      return state;
  }
}

const STORE_KEY = "disaai.history.v1";

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return arr.filter(
        (x) =>
          x &&
          typeof x.id === "string" &&
          (x.role === "user" || x.role === "assistant" || x.role === "system") &&
          typeof x.content === "string",
      );
    }
  } catch (err) {
    console.warn("loadHistory failed:", err);
  }
  return [];
}
function saveHistory(list: ChatMessage[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("saveHistory failed:", err);
  }
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [state, dispatch] = React.useReducer(reducer, {
    messages: [],
    status: "idle",
    error: null,
    activeRequestId: null,
  });

  const abortRef = React.useRef<AbortController | null>(null);
  const lastUserRef = React.useRef<ChatMessage | null>(null);
  const lastSystemRef = React.useRef<string | undefined>(undefined);

  // Laden bei Mount, wenn persistHistory aktiv ist
  React.useEffect(() => {
    if (settings.persistHistory) {
      const init = loadHistory();
      if (init.length) dispatch({ type: "SET", payload: init });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speichern bei Änderungen
  React.useEffect(() => {
    if (settings.persistHistory) saveHistory(state.messages);
  }, [settings.persistHistory, state.messages]);

  const clear = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    dispatch({ type: "RESET" });
    lastUserRef.current = null;
    lastSystemRef.current = undefined;
    if (settings.persistHistory) saveHistory([]);
  };

  const abort = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  async function doStream(requestId: string, systemPrompt?: string) {
    const controller = new AbortController();
    abortRef.current = controller;
    const msgHistory = toORHistory(state.messages, systemPrompt);
    const useModel = settings.model || "auto";

    try {
      const gen = streamChat({
        apiKey: settings.apiKey,
        model: useModel,
        messages: msgHistory,
        maxTokens: settings.maxTokens,
        signal: controller.signal,
      });
      const assistantId = rid("a");
      dispatch({ type: "BEGIN_STREAM", payload: { assistantId, requestId } });

      for await (const chunk of gen) {
        if (chunk.type === "delta" && chunk.text) {
          dispatch({ type: "DELTA", payload: { assistantId, chunk: chunk.text } });
        } else if (chunk.type === "error") {
          dispatch({ type: "ERROR", payload: { message: chunk.error || "Stream error" } });
          break;
        }
      }
      dispatch({ type: "END_STREAM", payload: { assistantId } });
    } catch (e: any) {
      if (e && e.name === "AbortError") return;
      if (e instanceof AuthError)
        dispatch({ type: "ERROR", payload: { message: "API-Key fehlt oder ist ungültig." } });
      else if (e instanceof RateLimitError)
        dispatch({
          type: "ERROR",
          payload: { message: "Rate Limit erreicht. Später erneut versuchen." },
        });
      else if (e instanceof ApiError) dispatch({ type: "ERROR", payload: { message: e.message } });
      else dispatch({ type: "ERROR", payload: { message: e?.message || "Unbekannter Fehler" } });
    } finally {
      abortRef.current = null;
    }
  }

  const send = async (userText: string, opts?: SendOptions) => {
    const text = userText?.trim();
    if (!text) return;
    if (!settings.apiKey) {
      dispatch({ type: "ERROR", payload: { message: "Kein API-Key. Bitte in Settings setzen." } });
      return;
    }
    const u: ChatMessage = { id: rid("u"), role: "user", content: text };
    dispatch({ type: "APPEND_USER", payload: u });
    lastUserRef.current = u;
    lastSystemRef.current = opts?.systemPrompt;
    const reqId = rid("req");
    await doStream(reqId, opts?.systemPrompt);
  };

  const retry = async () => {
    if (!lastUserRef.current) {
      dispatch({ type: "ERROR", payload: { message: "Nichts zu wiederholen." } });
      return;
    }
    if (!settings.apiKey) {
      dispatch({ type: "ERROR", payload: { message: "Kein API-Key. Bitte in Settings setzen." } });
      return;
    }
    const reqId = rid("req");
    await doStream(reqId, lastSystemRef.current);
  };

  const exportJson = () => {
    try {
      return JSON.stringify(state.messages, null, 2);
    } catch {
      return "[]";
    }
  };
  const importJson = (raw: string) => {
    try {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return false;
      const ok = arr.every(
        (x) =>
          x &&
          typeof x.id === "string" &&
          (x.role === "user" || x.role === "assistant" || x.role === "system") &&
          typeof x.content === "string",
      );
      if (!ok) return false;
      dispatch({ type: "SET", payload: arr });
      return true;
    } catch {
      return false;
    }
  };

  const value: ChatContextType = { state, send, abort, retry, clear, exportJson, importJson };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export function useChat() {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
