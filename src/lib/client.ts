import { useEffect, useMemo, useState } from "react";
import {
  getOpenRouterApiKey,
  setOpenRouterApiKey,
} from "@/services/openrouter";

/** Minimale Client-Facade für UI-Settings */
export function useClient() {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    setApiKeyState(getOpenRouterApiKey());
  }, []);

  const setApiKey = (k: string) => {
    setOpenRouterApiKey(k);
    setApiKeyState(k);
  };

  return useMemo(
    () => ({
      ready: true,
      apiKey,
      setApiKey,
    }),
    [apiKey]
  );
}
