/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { chat } from "./chat/client";
import type { ChatMessageLike } from "./chat/types";
import { readApiKey, writeApiKey } from "./openrouter/key";

export type Client = {
  send: (opts: {
    model: string;
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    signal?: AbortSignal;
    onToken?: (delta: string) => void;
  }) => Promise<void>;
};

export function useClient(): {
  client: Client;
  getSystemFor: (style: { system: string } | null) => { role: "system"; content: string };
  apiKey: string | null;
  setApiKey: (v: string | null) => void;
} {
  const client: Client = {
    async send({ model, messages, signal, onToken }) {
      const res = await chat({ modelId: model, messages: messages as ChatMessageLike[] }, signal);
      if (onToken) onToken(res.content);
    },
  };

  function getSystemFor(style: { system: string } | null) {
    return { role: "system", content: style?.system ?? "" } as const;
  }

  // simple stable identity to please hooks rules
  const [apiKey, setApiKeyState] = React.useState<string | null>(() => readApiKey());
  const setApiKey = (v: string | null) => {
    writeApiKey(v ?? "");
    setApiKeyState(readApiKey());
  };
  const value = React.useMemo(
    () => ({ client, getSystemFor, apiKey, setApiKey }),
    [apiKey, client],
  );
  return value;
}
