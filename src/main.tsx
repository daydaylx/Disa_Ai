import "./ui/base.css";
import "./styles/design-tokens.css";
import "./styles/base.css";
import "./styles/globals.css";
import "./styles/brand.css";
import "./styles/theme.css";
import "./styles/glass-components.css";
import "./styles/aurora.css";
import "./styles/aurora-themes.css";
import "./styles/mobile-glass.css";
import "./styles/chat.css";
import "./styles/chat-glass.css";
import "./styles/visual-effects.css";
import "./styles/interactive-effects.css";
import "./ui/overlap-guard";

import React from "react";
import ReactDOM from "react-dom/client";

import { registerSW } from "./lib/pwa/registerSW";
import { Router } from "./Router";

function bootstrapTheme() {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  // Always apply dark-glass theme
  root.setAttribute("data-ui-theme", "dark-glass");
  root.classList.add("dark");
  root.classList.remove("light");
}

bootstrapTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);

// Register service worker for PWA functionality
registerSW();
