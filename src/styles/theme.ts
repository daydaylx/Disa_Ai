type ThemePreference = "light" | "dark" | "system";
type ColorMode = "light" | "dark";

type ThemeState = {
  preference: ThemePreference;
  mode: ColorMode;
};

type ThemeListener = (state: ThemeState) => void;

const STORAGE_KEY = "disaai.ui.theme";
const DEFAULT_PREFERENCE: ThemePreference = "dark";
const DEFAULT_MODE: ColorMode = "dark";

function resolveMode(preference: ThemePreference): ColorMode {
  if (preference === "system") {
    if (typeof window === "undefined") return DEFAULT_MODE;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return preference;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_PREFERENCE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (error) {
    console.warn("Failed to read theme preference from storage", error);
  }

  return DEFAULT_PREFERENCE;
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

  // Apply both light and dark classes based on actual mode
  if (state.mode === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
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

    // Set up system change listener for "system" preference
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.mediaQuery.addEventListener("change", this.handleSystemChange);
    }

    // Listen to storage changes from other tabs
    window.addEventListener("storage", this.handleStorage);

    applyDocumentTheme(this.state);
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

    if (this.state.preference === nextState.preference && this.state.mode === nextState.mode) {
      return;
    }

    this.state = nextState;
    persistPreference(preference);
    applyDocumentTheme(this.state);
    this.notify();
  }

  toggle() {
    const currentMode = this.state.mode;
    const nextPreference: ThemePreference = currentMode === "dark" ? "light" : "dark";
    this.setPreference(nextPreference);
  }

  subscribe(listener: ThemeListener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private handleSystemChange = () => {
    // Only update if current preference is "system"
    if (this.state.preference === "system") {
      const newMode = resolveMode("system");
      if (this.state.mode !== newMode) {
        this.state = { ...this.state, mode: newMode };
        applyDocumentTheme(this.state);
        this.notify();
      }
    }
  };

  private handleStorage = (event: StorageEvent) => {
    // Handle theme preference changes from other tabs
    if (event.key === STORAGE_KEY && event.newValue) {
      const newPreference = event.newValue as ThemePreference;
      if (newPreference === "light" || newPreference === "dark" || newPreference === "system") {
        this.setPreference(newPreference);
      }
    }
  };

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const themeController = new ThemeController();

export type { ColorMode, ThemePreference, ThemeState };
