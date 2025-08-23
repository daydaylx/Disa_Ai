import * as React from "react";
import { MODELS, DEFAULT_MODEL_ID } from "../config/models";

const MODEL_KEY = "disa_model";

export function useModel(allow?: string[] | null) {
  const [model, setModel] = React.useState<string>(() => {
    try { return localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL_ID; } catch { return DEFAULT_MODEL_ID; }
  });
  const [list, setList] = React.useState<ModelEntry[]>([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const apiKeyRaw = typeof localStorage !== "undefined" ? localStorage.getItem("disa_api_key") ?? undefined : undefined;

      const opts: { allow?: string[] | null; preferFree?: boolean; apiKey?: string } = { preferFree: true };
      if (allow !== undefined) opts.allow = allow;
      if (apiKeyRaw) opts.apiKey = apiKeyRaw;

      const catalog = await loadModelCatalog(opts);
      if (!alive) return;
      setList(catalog);

      if (!catalog.find((m: ModelEntry) => m.id === model)) {
        const fallback = catalog[0]?.id ?? DEFAULT_MODEL_ID;
        setModel(fallback);
        try { localStorage.setItem(MODEL_KEY, fallback); } catch {}
      }
    })();
    return () => { alive = false; };
  }, [allow]);

  const current = list.find((m: ModelEntry) => m.id === model) ?? list[0];

  const save = React.useCallback((next: string) => {
    setModel(next);
    try { localStorage.setItem(MODEL_KEY, next); } catch {}
  }, []);

  return { model, setModel: save, list, current };
}
