import React from "react";
import {
  DEFAULT_MODEL_ID,
  loadModelCatalog,
  type ModelEntry,
  labelForModel as baseLabelForModel,
} from "../config/models";

const STORAGE_KEY = "disa.model";

type UseModelOpts = {
  apiKey?: string;
  allow?: string[] | null;
  preferFree?: boolean;
};

export function useModel(opts?: UseModelOpts) {
  const [list, setList] = React.useState<ModelEntry[]>([]);
  const [model, setModel] = React.useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MODEL_ID;
    } catch {
      return DEFAULT_MODEL_ID;
    }
  });

  // Katalog laden + Model-Fallback erzwingen
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const catalog = await loadModelCatalog(opts ?? {});
      if (cancelled) return;
      setList(catalog);

      if (!catalog.find((m) => m.id === model)) {
        const fallback = catalog[0]?.id ?? DEFAULT_MODEL_ID;
        setModel(fallback);
        try {
          localStorage.setItem(STORAGE_KEY, fallback);
        } catch { /* noop */ }
      }
    })();

    return () => {
      cancelled = true;
    };
    // opts serialisieren, damit das Effect stabil bleibt
  }, [model, JSON.stringify(opts)]);

  // Persistenz des aktuellen Models
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, model);
    } catch { /* noop */ }
  }, [model]);

  function labelForModel(id: string) {
    return baseLabelForModel(id, list);
  }

  return { model, setModel, list, labelForModel };
}
