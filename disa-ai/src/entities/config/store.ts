import { create } from "zustand";

export type PersonaTheme = {
  primary: string;          // HSL z.B. "263 70% 50%"
  bubbleUser?: string;      // HSL oder var()
  bubbleAssistant?: string; // HSL oder var()
};

export type Persona = {
  id: string;
  label: string;
  description: string;
  system: string;
  theme?: PersonaTheme;
};

export type ModelItem = {
  id: string;
  label: string;
  provider?: string;
};

type ConfigState = {
  personas: Persona[];
  models: ModelItem[];
  streamingEnabled: boolean;

  setPersonas: (p: Persona[]) => void;
  setModels: (m: ModelItem[]) => void;
  setStreaming: (v: boolean) => void;

  applyPersonaTheme: (persona?: Persona) => void;
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  personas: [],
  models: [],
  streamingEnabled: false,

  setPersonas: (p) => set({ personas: p }),
  setModels: (m) => set({ models: m }),
  setStreaming: (v) => set({ streamingEnabled: v }),

  applyPersonaTheme: (persona) => {
    const root = document.documentElement;
    // Fallback: nichts überschreiben, Basis bleibt aus globals.css
    if (!persona?.theme) return;
    const t = persona.theme;

    if (t.primary) root.style.setProperty("--primary", t.primary);
    // Optional: individuelle Bubble-Farben (nur wenn HSL gegeben)
    if (t.bubbleUser && t.bubbleUser.startsWith(("0" as any))) {
      // noop – wir nutzen hier HSL Strings nicht direkt, da die Basis in CSS gesetzt ist.
    }
  },
}));
