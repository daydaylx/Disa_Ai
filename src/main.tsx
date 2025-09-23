import "./ui/base.css";
import "./styles/globals.css";
import "./styles/brand.css";
import "./styles/theme.css";
import "./styles/chat.css";
import "./ui/overlap-guard";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { registerSW } from "./lib/pwa/registerSW";

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
    <App />
  </React.StrictMode>,
);

// Register service worker for PWA functionality
registerSW();
