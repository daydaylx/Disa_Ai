import { create } from "zustand";

export type SettingsState = {
  modelId: string | null;
  personaId: string | null;
  setModelId: (id: string | null) => void;
  setPersonaId: (id: string | null) => void;
};

const KEY_MODEL = "settings:modelId";
const KEY_PERSONA = "settings:personaId";

function readLS(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeLS(key: string, v: string | null) {
  try {
    if (v == null || v === "") localStorage.removeItem(key);
    else localStorage.setItem(key, v);
  } catch {}
}

const initialModel = readLS(KEY_MODEL);
const initialPersona = readLS(KEY_PERSONA) ?? "neutral";

export const useSettings = create<SettingsState>((set, get) => ({
  modelId: initialModel ?? null,
  personaId: initialPersona,
  setModelId: (id) => {
    writeLS(KEY_MODEL, id ?? null);
    set({ ...get(), modelId: id ?? null });
  },
  setPersonaId: (id) => {
    writeLS(KEY_PERSONA, id ?? null);
    set({ ...get(), personaId: id ?? null });
  },
}));

export default useSettings;
