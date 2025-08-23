import * as React from "react";

export type ChatMsg = { role: "user" | "assistant"; text: string; ts: number };
export type ChatSession = { id: string; createdAt: number; messages: ChatMsg[]; memory: string };

const KEY = "disa_session_v1";

function load(): ChatSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ChatSession;
  } catch { /* ignore */ }
  return { id: `s-${Date.now()}`, createdAt: Date.now(), messages: [], memory: "" };
}

function save(s: ChatSession) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function useChatSession() {
  const [session, setSession] = React.useState<ChatSession>(() => load());
  const [dirty, setDirty] = React.useState(0);

  // Persist bei Änderungen (leicht gedrosselt)
  React.useEffect(() => {
    const t = setTimeout(() => save(session), 120);
    return () => clearTimeout(t);
  }, [session, dirty]);

  function append(role: "user" | "assistant", text: string) {
    setSession(s => ({
      ...s,
      messages: [...s.messages, { role, text, ts: Date.now() }]
    }));
  }

  function appendAssistantPlaceholder() {
    setSession(s => ({
      ...s,
      messages: [...s.messages, { role: "assistant", text: "", ts: Date.now() }]
    }));
  }

  function appendAssistantDelta(delta: string) {
    setSession(s => {
      const c = { ...s, messages: [...s.messages] };
      if (!c.messages.length) return c;
      const i = c.messages.length - 1;
      if (c.messages[i].role !== "assistant") return c;
      c.messages[i] = { ...c.messages[i], text: c.messages[i].text + delta };
      return c;
    });
    setDirty(x => x + 1);
  }

  function setMemory(mem: string) {
    setSession(s => ({ ...s, memory: mem }));
  }

  function reset() {
    const fresh: ChatSession = { id: `s-${Date.now()}`, createdAt: Date.now(), messages: [], memory: "" };
    setSession(fresh);
    save(fresh);
  }

  // Util: begrenze Verlauf für Kontext (z. B. letzte 24 Nachrichten)
  function lastWindow(n = 24) {
    const msgs = session.messages;
    return msgs.slice(Math.max(0, msgs.length - n));
  }

  return { session, append, appendAssistantPlaceholder, appendAssistantDelta, setMemory, reset, lastWindow };
}
