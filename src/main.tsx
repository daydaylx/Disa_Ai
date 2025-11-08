import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { initEnvironment } from "./config/env";
import { CustomRolesProvider } from "./contexts/CustomRolesContext";
import mainStylesUrl from "./index.css?url";
import { initializeA11yEnforcement } from "./lib/a11y/touchTargets";
// PWA Installation Prompt
import { registerSW } from "./lib/pwa/registerSW";
import { themeController } from "./styles/theme";

if (typeof window !== "undefined" && import.meta.env.PROD) {
  const assetList = Array.isArray((window as any).__DISA_CRITICAL_ASSETS__)
    ? (window as any).__DISA_CRITICAL_ASSETS__
    : [];
  if (!assetList.includes(mainStylesUrl)) {
    assetList.push(mainStylesUrl);
  }
  (window as any).__DISA_CRITICAL_ASSETS__ = assetList;
}

// Initialize environment configuration
try {
  const envResult = initEnvironment();
  if (!envResult.success) {
    console.error("Environment initialization failed:", envResult.errors);
  }
} catch (error) {
  console.error("Critical environment error:", error);
}

// Initialize app
function initializeApp() {
  const el = document.getElementById("app");
  if (!el) throw new Error("#app element not found");

  const root = ReactDOM.createRoot(el);
  return root.render(
    <React.StrictMode>
      <CustomRolesProvider>
        <App />
      </CustomRolesProvider>
    </React.StrictMode>,
  );
}

// Start the app
themeController.init();
initializeApp();

// PWA Service Worker
registerSW();

// Initialize accessibility enforcement
initializeA11yEnforcement();
