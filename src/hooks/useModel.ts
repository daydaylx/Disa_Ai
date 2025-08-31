import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_MODEL_ID,
  chooseDefaultModel,
  labelForModel as labelFor,
  loadModelCatalog,
  type ModelEntry,
} from "@/config/models";
import { getOpenRouterApiKey } from "@/services/openrouter";

const STORAGE_KEY = "disa:model:id";

export type UseModelOptions = {
  allow?: string[] | null;
  preferFree?: boolean;
};

export type UseModel = {
  models: ModelEntry[];
  modelId: string;
  modelLabel: string;
  setModelId: (id: string) => void;
  refreshCatalog: () => Promise<void>;
};

export function useModel(opts: UseModelOptions = {}): UseModel {
  const { allow = null, preferFree = false } = opts;

  const [models, setModels] = useState<ModelEntry[]>([]);
  const [modelId, _setModelId] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_MODEL_ID;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved && saved.trim() ? saved : DEFAULT_MODEL_ID;
  });

  const modelLabel = useMemo(() => labelFor(modelId, models), [modelId, models]);

  const setModelId = useCallback((id: string) => {
    _setModelId(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const refreshCatalog = useCallback(async () => {
    const apiKey = getOpenRouterApiKey();
    const base = { allow, preferFree } as { allow: string[] | null; preferFree: boolean } & { apiKey?: string };
    if (apiKey) (base as any).apiKey = apiKey;
    const list = await loadModelCatalog(base);
    setModels(list);

    if (!list.find((m) => m.id === modelId)) {
      const next = chooseDefaultModel(list, preferFree);
      setModelId(next);
    }
  }, [allow, preferFree, modelId, setModelId]);

  useEffect(() => { void refreshCatalog(); /* on mount */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { models, modelId, modelLabel, setModelId, refreshCatalog };
}

export type { ModelEntry } from "@/config/models";
export { DEFAULT_MODEL_ID, chooseDefaultModel } from "@/config/models";
