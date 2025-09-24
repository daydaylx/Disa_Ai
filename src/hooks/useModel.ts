import * as React from "react";

/* eslint-disable react-hooks/exhaustive-deps */
import {
  chooseDefaultModel,
  labelForModel,
  loadModelCatalog,
  type ModelEntry,
} from "../config/models";

export type Category = "general" | "vision" | "coding" | "long";
export type LoadOptions = { allow?: string[]; preferFree?: boolean };

export function useModel(opts?: LoadOptions) {
  const [list, setList] = React.useState<ModelEntry[]>([]);
  const [busy, setBusy] = React.useState(true);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      setBusy(true);
      try {
        const models = await loadModelCatalog(false);
        if (!alive) return;
        const filtered =
          Array.isArray(opts?.allow) && opts?.allow.length
            ? models.filter((m) => opts!.allow!.includes(m.id))
            : models;
        setList(filtered);
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [opts?.allow]);
  const defaultId = React.useMemo(
    () =>
      chooseDefaultModel(list, {
        allow: opts?.allow ?? null,
        preferFree: opts?.preferFree ?? true,
      }),
    [list, opts?.allow, opts?.preferFree],
  );
  const labelFor = React.useCallback(
    (id: string) => labelForModel(id, list.find((m) => m.id === id)?.label),
    [list],
  );
  return { busy, list, defaultId, labelFor };
}
