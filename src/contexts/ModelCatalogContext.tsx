import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import type { ModelEntry } from "@/config/models";
import { loadModelCatalog } from "@/config/models";

interface ModelCatalogContextValue {
  models: ModelEntry[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ModelCatalogContext = createContext<ModelCatalogContextValue | undefined>(undefined);

export function ModelCatalogProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<ModelEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRequestedRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    hasRequestedRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const catalog = await loadModelCatalog();
      if (!isMountedRef.current) return;
      setModels(catalog);
      if (!catalog.length) setError("Modelle konnten nicht geladen werden.");
    } catch (err) {
      console.error("Model catalog loading failed", err);
      if (!isMountedRef.current) return;
      setError("Modelle konnten nicht geladen werden.");
    } finally {
      isRefreshingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const isTestEnv = typeof (globalThis as any).vitest !== "undefined";
    if (isTestEnv) {
      setLoading(false);
      return;
    }

    void refresh();
    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  const value: ModelCatalogContextValue = {
    models,
    loading,
    error,
    refresh,
  };

  return <ModelCatalogContext.Provider value={value}>{children}</ModelCatalogContext.Provider>;
}

export function useModelCatalog() {
  const context = useContext(ModelCatalogContext);
  if (context === undefined) {
    throw new Error("useModelCatalog must be used within a ModelCatalogProvider");
  }
  return context;
}
