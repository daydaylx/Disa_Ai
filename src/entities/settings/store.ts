import { create } from "zustand";

export type SettingsState = {
  modelId: string | null;
  personaId: string | null;
  setModelId: (id: string | null) => void;
  setPersonaId: (id: string | null) => void;
  reset: () => void;
};

const KEY_MODEL = "settings:modelId";
const KEY_STYLE = "settings:personaId";

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, v: string | null) {
  try {
    if (!v) localStorage.removeItem(key);
    else localStorage.setItem(key, v);
  } catch {}
}

export const useSettings = create<SettingsState>((set, get) => ({
  modelId: read(KEY_MODEL),
  personaId: read(KEY_STYLE) ?? "neutral",
  setModelId: (id) => { write(KEY_MODEL, id); set({ modelId: id }); },
  setPersonaId: (id) => { write(KEY_STYLE, id); set({ personaId: id }); },
  reset: () => {
    write(KEY_MODEL, null);
    write(KEY_STYLE, null);
    set({ modelId: null, personaId: null });
  }
}));
