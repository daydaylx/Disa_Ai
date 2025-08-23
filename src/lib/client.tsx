import React from "react";
import type { ChatMessage } from "./openrouter";
import { sendChat } from "./openrouter";
import type { PersonaStyle } from "@/entities/persona/types";

type ClientCtx = {
  apiKey: string | null;
  setApiKey: (k: string | null) => void;
  client: { send: (o: Omit<Parameters<typeof sendChat>[0], "apiKey">) => Promise<string> };
  getSystemFor: (style: PersonaStyle | null) => ChatMessage;
};

const KEY = "openrouter:apiKey";
const C = React.createContext<ClientCtx | null>(null);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = React.useState<string | null>(() => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  });

  const setApiKey = React.useCallback((k: string | null) => {
    try {
      if (!k) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, k);
    } catch {}
    setApiKeyState(k);
  }, []);

  const client = React.useMemo(() => ({
    send: async (o: Omit<Parameters<typeof sendChat>[0], "apiKey">) => {
      if (!apiKey) throw new Error("API-Key fehlt");
      return await sendChat({ apiKey, ...o });
    }
  }), [apiKey]);

  const getSystemFor = React.useCallback((style: PersonaStyle | null): ChatMessage => {
    return { role: "system", content: style?.system ?? "Antworte kurz, präzise, auf Deutsch." };
  }, []);

  return (
    <C.Provider value={{ apiKey, setApiKey, client, getSystemFor }}>
      {children}
    </C.Provider>
  );
}

export function useClient() {
  const ctx = React.useContext(C);
  if (!ctx) throw new Error("ClientProvider fehlt");
  return ctx;
}
