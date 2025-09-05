import type { AppSettings } from "./schema";
import { validateSettings } from "./schema";

const LS_SETTINGS = "disa.settings.v1";

type Listener = (s: AppSettings) => void;

let current: AppSettings = {
  theme: "system",
  language: "de",
};

const listeners = new Set<Listener>();

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) return current;
    const json = JSON.parse(raw);
    const v = validateSettings(json);
    if (v.ok) current = v.value;
  } catch {}
  return current;
}

export function saveSettings(patch: Partial<AppSettings>): AppSettings {
  const v = validateSettings({ ...current, ...patch });
  if (!v.ok) throw new Error(v.error);
  current = v.value;

  try {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(current));
  } catch {}

  try {
    if (current.openrouterKey) {
      localStorage.setItem("openrouter_key", current.openrouterKey);
      localStorage.setItem("OPENROUTER_API_KEY", current.openrouterKey);
    } else {
      localStorage.removeItem("openrouter_key");
      localStorage.removeItem("OPENROUTER_API_KEY");
    }
  } catch {}

  for (const l of Array.from(listeners)) {
    try {
      l(current);
    } catch {}
  }
  return current;
}

export function subscribeSettings(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

// Initial laden
loadSettings();
