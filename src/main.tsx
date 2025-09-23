import "./ui/base.css";
import "./styles/design-tokens.css";
import "./styles/base.css";
import "./styles/theme.css";
import "./styles/glass-components.css";
import "./styles/aurora.css";
import "./styles/mobile-glass.css";
import "./styles/chat-glass.css";
import "./styles/visual-effects.css";
import "./styles/interactive-effects.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import type { ThemeMode } from "./hooks/useTheme";
import { registerSW } from "./lib/pwa/registerSW";

const THEME_STORAGE_KEY = "disa:theme:mode";

function bootstrapTheme() {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  const readStoredMode = (): ThemeMode => {
    try {
      return (window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) ?? "dark-glass";
    } catch {
      return "dark-glass";
    }
  };

  const apply = (mode: ThemeMode) => {
    const effective =
      mode === "auto"
        ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode;

    root.setAttribute("data-ui-theme", effective);
    root.classList.toggle("dark", effective === "dark" || effective === "dark-glass");
    root.classList.toggle("light", effective === "light");
  };

  const storedMode = readStoredMode();
  apply(storedMode);

  if (storedMode === "auto" && window.matchMedia) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => apply("auto");
    media.addEventListener("change", handler);
  }
}

bootstrapTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker for PWA functionality
registerSW();
