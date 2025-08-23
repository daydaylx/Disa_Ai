import React from "react";
import { sendChat, type ChatMessage, type SendOptions } from "./openrouter";

type ClientCtx = {
  apiKey: string | null;
  setApiKey: (k: string | null) => void;
  client: { send: (o: Omit<SendOptions, "apiKey">) => Promise<string> };
  getSystemFor: (style: { system: string } | null) => ChatMessage;
};
const ClientContext = React.createContext<ClientCtx | null>(null);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = React.useState<string | null>(() => {
    try { return localStorage.getItem("settings:apiKey"); } catch { return null; }
  });

  const setKey = React.useCallback((k: string | null) => {
    try {
      if (k) localStorage.setItem("settings:apiKey", k);
      else localStorage.removeItem("settings:apiKey");
    } catch {}
    setApiKey(k);
  }, []);

  const client = React.useMemo(() => ({
    send: async (o: Omit<SendOptions,"apiKey">) => {
      if (!apiKey) throw new Error("API-Key fehlt");
      return await sendChat({ ...o, apiKey });
    }
  }), [apiKey]);

  const getSystemFor = React.useCallback((style: { system: string } | null) => {
    return { role: "system", content: style?.system ?? "Du bist hilfreich, präzise und antwortest auf Deutsch." } as const;
  }, []);

  return (
    <ClientContext.Provider value={{ apiKey, setApiKey: setKey, client, getSystemFor }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const ctx = React.useContext(ClientContext);
  if (!ctx) throw new Error("ClientContext fehlt");
  return ctx;
}
