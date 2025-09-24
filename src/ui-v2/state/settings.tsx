import React from "react";

type Settings = {
  apiKey: string;
  stream: boolean;
  showTokens: boolean;
  maxTokens: number;
  model: string;
  persistHistory: boolean;
};

type SettingsContextType = {
  settings: Settings;
  setApiKey: (v: string) => void;
  setStream: (v: boolean) => void;
  setShowTokens: (v: boolean) => void;
  setMaxTokens: (v: number) => void;
  setModel: (v: string) => void;
  setPersistHistory: (v: boolean) => void;
  clearKey: () => void;
};

const KEY_API = "openrouter.key";
const KEY_SETTINGS = "disaai.settings";

const DEFAULTS: Settings = {
  apiKey: "",
  stream: true,
  showTokens: false,
  maxTokens: 4096,
  model: "auto",
  persistHistory: false,
};

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn("readSession failed:", err);
    return fallback;
  }
}
function writeSession<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("writeSession failed:", err);
  }
}

const SettingsContext = React.createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = React.useState<Settings>(() => {
    const base = readSession<Settings>(KEY_SETTINGS, DEFAULTS);
    let key = "";
    try {
      key = sessionStorage.getItem(KEY_API) || "";
    } catch (err) {
      console.warn("read api key failed:", err);
    }
    return { ...DEFAULTS, ...base, apiKey: key };
  });

  React.useEffect(() => {
    const { apiKey, ...rest } = settings;
    writeSession(KEY_SETTINGS, rest);
  }, [settings]);

  const setApiKey = (v: string) => {
    const trimmed = v.trim();
    try {
      sessionStorage.setItem(KEY_API, trimmed);
    } catch (err) {
      console.warn("persist api key failed:", err);
    }
    setSettings((s) => ({ ...s, apiKey: trimmed }));
  };

  const clearKey = () => {
    try {
      sessionStorage.removeItem(KEY_API);
    } catch (err) {
      console.warn("remove api key failed:", err);
    }
    setSettings((s) => ({ ...s, apiKey: "" }));
  };

  const setStream = (v: boolean) => setSettings((s) => ({ ...s, stream: v }));
  const setShowTokens = (v: boolean) => setSettings((s) => ({ ...s, showTokens: v }));
  const setMaxTokens = (v: number) =>
    setSettings((s) => ({
      ...s,
      maxTokens: Number.isFinite(v) ? Math.max(1, Math.floor(v)) : s.maxTokens,
    }));
  const setModel = (v: string) => setSettings((s) => ({ ...s, model: v || "auto" }));
  const setPersistHistory = (v: boolean) => setSettings((s) => ({ ...s, persistHistory: v }));

  const value: SettingsContextType = {
    settings,
    setApiKey,
    setStream,
    setShowTokens,
    setMaxTokens,
    setModel,
    setPersistHistory,
    clearKey,
  };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
