import React from "react";
import { MODELS, DEFAULT_MODEL_ID } from "../config/models";

const MODEL_KEY = "disa_model";

export function useModel() {
  const [model, setModel] = React.useState<string>(() => {
    try {
      return localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL_ID;
    } catch {
      return DEFAULT_MODEL_ID;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(MODEL_KEY, model);
    } catch {}
  }, [model]);

  const list = MODELS;
  const current = list.find((m) => m.id === model) ?? list[0];

  return { model, setModel, list, current };
}
