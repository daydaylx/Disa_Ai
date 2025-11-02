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
  void preference;
  return DEFAULT_MODE;
}

function readStoredPreference(): ThemePreference {
  return DEFAULT_PREFERENCE;
}

function persistPreference(preference: ThemePreference) {
  void preference;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, DEFAULT_PREFERENCE);
  } catch (error) {
    console.warn("Failed to persist theme preference", error);
  }
}

function applyDocumentTheme(state: ThemeState) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.setAttribute("data-theme", state.mode);
  root.setAttribute("data-theme-preference", state.preference);

  root.classList.add("dark");
  root.classList.remove("light");
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
    void preference;
    const nextState: ThemeState = {
      preference: DEFAULT_PREFERENCE,
      mode: DEFAULT_MODE,
    };

    if (this.state.preference === nextState.preference && this.state.mode === nextState.mode) {
      return;
    }

    this.state = nextState;
    persistPreference(DEFAULT_PREFERENCE);
    applyDocumentTheme(this.state);
    this.notify();
  }

  toggle() {
    this.setPreference(DEFAULT_PREFERENCE);
  }

  subscribe(listener: ThemeListener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private handleSystemChange = () => {
    // No-op; dark mode is enforced.
  };

  private handleStorage = () => {
    // No-op; external changes cannot override dark mode.
  };

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const themeController = new ThemeController();

export type { ColorMode, ThemePreference, ThemeState };
