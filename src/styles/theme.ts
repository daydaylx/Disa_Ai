type ThemePreference = "light" | "dark" | "system";
type ColorMode = "light" | "dark";

type ThemeState = {
  preference: ThemePreference;
  mode: ColorMode;
};

type ThemeListener = (state: ThemeState) => void;

const STORAGE_KEY = "disaai.ui.theme";

function getSystemMode(): ColorMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveMode(preference: ThemePreference): ColorMode {
  return preference === "system" ? getSystemMode() : preference;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (error) {
    console.warn("Failed to read theme preference", error);
  }

  return "system";
}

function persistPreference(preference: ThemePreference) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, preference);
  } catch (error) {
    console.warn("Failed to persist theme preference", error);
  }
}

function applyDocumentTheme(state: ThemeState) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.setAttribute("data-theme", state.mode);
  root.setAttribute("data-theme-preference", state.preference);

  if (state.mode === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
}

class ThemeController {
  private state: ThemeState;
  private listeners: Set<ThemeListener> = new Set();
  private mediaQuery: MediaQueryList | null = null;
  private initialized = false;

  constructor() {
    const preference = readStoredPreference();
    this.state = {
      preference,
      mode: resolveMode(preference),
    };
  }

  init() {
    if (this.initialized || typeof window === "undefined") return;

    this.initialized = true;

    applyDocumentTheme(this.state);

    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.mediaQuery.addEventListener("change", this.handleSystemChange);
    window.addEventListener("storage", this.handleStorage);
  }

  destroy() {
    if (!this.initialized) return;

    this.mediaQuery?.removeEventListener("change", this.handleSystemChange);
    window.removeEventListener("storage", this.handleStorage);
    this.initialized = false;
  }

  getState(): ThemeState {
    return this.state;
  }

  setPreference(preference: ThemePreference) {
    const nextState: ThemeState = {
      preference,
      mode: resolveMode(preference),
    };

    if (nextState.preference === this.state.preference && nextState.mode === this.state.mode) {
      return;
    }

    this.state = nextState;
    persistPreference(preference);
    applyDocumentTheme(this.state);
    this.notify();
  }

  toggle() {
    const nextMode: ColorMode = this.state.mode === "dark" ? "light" : "dark";
    this.setPreference(nextMode);
  }

  subscribe(listener: ThemeListener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private handleSystemChange = () => {
    if (this.state.preference !== "system") return;

    const nextMode = resolveMode("system");
    if (nextMode === this.state.mode) return;

    this.state = { preference: "system", mode: nextMode };
    applyDocumentTheme(this.state);
    this.notify();
  };

  private handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || event.newValue === event.oldValue) return;

    const stored = readStoredPreference();
    this.setPreference(stored);
  };

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const themeController = new ThemeController();

export type { ColorMode, ThemePreference, ThemeState };
