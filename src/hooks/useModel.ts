import * as React from "react";

import { DEFAULT_MODEL_ID, MODEL_KEY,MODELS } from "../config/models";

export function useModel() {
  const [model, setModel] = React.useState<string>(() => {
    try {
      const raw = localStorage.getItem(MODEL_KEY);
      return raw || DEFAULT_MODEL_ID;
    } catch {
      return DEFAULT_MODEL_ID;
    }
  });

  React.useEffect(() => {
    try { localStorage.setItem(MODEL_KEY, model); } catch { void 0; }
  }, [model]);

  const current = React.useMemo(
    () => MODELS.find(m => m.id === model) ?? MODELS[0],
    [model]
  );

  return { model, setModel, current, list: MODELS };
}
