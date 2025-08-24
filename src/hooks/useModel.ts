import * as React from "react";
import {
  type ModelEntry,
  DEFAULT_MODEL_ID,
  loadModelCatalog,
  labelForModel as labelForModelRaw,
  chooseDefaultModel,
  getCatalogCache,
  type LoadOptions,
} from "../config/models";

export interface UseModelOptions extends Omit<LoadOptions, "allow"> {
  allow?: string[];
}

export interface UseModelState {
  model: string;
  setModel: (id: string) => void;
  list: ModelEntry[];
  /** label resolver, nutzt automatisch die geladene Liste */
  labelFor: (id: string) => string;
}

const STORAGE_KEY = "disa:model";

function getStoredModel(): string {
  if (typeof window === "undefined") return DEFAULT_MODEL_ID;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v && v.length > 0 ? v : DEFAULT_MODEL_ID;
}

function storeModel(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // noop
  }
}

export function useModel(opts: UseModelOptions = {}): UseModelState {
  const { apiKey, allow, preferFree } = opts;

  const [list, setList] = React.useState<ModelEntry[]>(() => getCatalogCache());
  const [model, setModelState] = React.useState<string>(() => {
    const stored = getStoredModel();
    return stored ?? DEFAULT_MODEL_ID;
  });

  const setModel = React.useCallback((id: string) => {
    setModelState(id);
    storeModel(id);
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const req: LoadOptions = {};
      if (apiKey) req.apiKey = apiKey;
      if (allow && allow.length > 0) req.allow = allow;
      if (preferFree !== undefined) req.preferFree = preferFree;

      const newList = await loadModelCatalog(req);
      if (!alive) return;

      setList(newList);

      // Modell validieren, ggf. Default wählen
      const exists = newList.some((m) => m.id === model);
      if (!exists) {
        const chooseReq: LoadOptions & { list: ModelEntry[] } = { list: newList };
        if (allow && allow.length > 0) chooseReq.allow = allow;
        if (preferFree !== undefined) chooseReq.preferFree = preferFree;

        const next = chooseDefaultModel(chooseReq);
        setModel(next);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, Array.isArray(allow) ? allow.join("|") : "", preferFree]);

  const labelFor = React.useCallback(
    (id: string) => labelForModelRaw(id, list),
    [list]
  );

  return { model, setModel, list, labelFor };
}
