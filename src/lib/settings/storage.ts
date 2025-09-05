export type Theme = "system" | "dark" | "light";
export type ChatStyle = "Neutral" | "Anschaulich" | "Technisch" | "Locker";
export interface AppSettings {
  theme: Theme;
  language: "de";
  openrouterKey: string;          // wird in localStorage gespiegelt
  defaultModelId: string;         // wird in localStorage gespiegelt
  chatStyle: ChatStyle;
  chatRole: string;               // freitext
}

const KEYS = {
  settings: "disa_settings_v1",
  key: "openrouter_key",
  model: "default_model_id"
};

const DEFAULTS: AppSettings = {
  theme: "system",
  language: "de",
  openrouterKey: "",
  defaultModelId: "qwen/qwen-2.5-coder-14b-instruct",
  chatStyle: "Neutral",
  chatRole: ""
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return applySideEffects(DEFAULTS);
    const obj = JSON.parse(raw) as Partial<AppSettings>;
    const merged: AppSettings = { ...DEFAULTS, ...obj };
    return applySideEffects(merged);
  } catch {
    return applySideEffects(DEFAULTS);
  }
}

export function saveSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...loadSettings(), ...patch };
  localStorage.setItem(KEYS.settings, JSON.stringify(next));
  // Spiegel für Sender/Bestandteile
  localStorage.setItem(KEYS.key, next.openrouterKey || "");
  localStorage.setItem(KEYS.model, next.defaultModelId || "");
  return next;
}

function applySideEffects(s: AppSettings): AppSettings {
  // Spiegel beim Laden sicherstellen (falls Settings aus alter Version stammen)
  localStorage.setItem(KEYS.key, s.openrouterKey || "");
  localStorage.setItem(KEYS.model, s.defaultModelId || "");
  return s;
}
