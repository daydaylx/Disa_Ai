import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import type { ModelEntry } from "@/config/models";
import { loadModelCatalog } from "@/config/models";
import { useToastsOptional } from "@/ui";

interface ModelCatalogContextValue {
  models: ModelEntry[] | null;
  loading: boolean;
  error: string | null;
  refresh: (force?: boolean) => Promise<void>;
}

const ModelCatalogContext = createContext<ModelCatalogContextValue | undefined>(undefined);

export function ModelCatalogProvider({ children }: { children: React.ReactNode }) {
  const toasts = useToastsOptional();
  const [models, setModels] = useState<ModelEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRefreshingRef = useRef(false);
  const isMountedRef = useRef(true);
  const modelsRef = useRef<ModelEntry[] | null>(models);

  useEffect(() => {
    modelsRef.current = models;
  }, [models]);

  const refresh = useCallback(
    async (force = false) => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      // Only reset loading state if explicitly forced or if we don't have models yet
      if (force || !modelsRef.current) {
        setLoading(true);
      }
      setError(null);

      try {
        const catalog = await loadModelCatalog({
          forceRefresh: force,
          toasts: toasts ? { push: toasts.push } : undefined,
        });
        if (!isMountedRef.current) return;
        setModels(catalog);
        modelsRef.current = catalog;
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
    },
    [toasts],
  );

  useEffect(() => {
    // React StrictMode runs effects twice in dev; reset mount guard each time.
    isMountedRef.current = true;

    if (typeof window === "undefined") {
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
