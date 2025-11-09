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

// Global type declarations
declare global {
  interface Window {
    __DISA_CRITICAL_ASSETS__?: string[];
  }
}

if (typeof window !== "undefined" && import.meta.env.PROD) {
  const assetList = Array.isArray(window.__DISA_CRITICAL_ASSETS__)
    ? window.__DISA_CRITICAL_ASSETS__
    : [];
  if (!assetList.includes(mainStylesUrl)) {
    assetList.push(mainStylesUrl);
  }
  window.__DISA_CRITICAL_ASSETS__ = assetList;
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

// Singleton React Root to prevent memory leaks
let _appRoot: ReactDOM.Root | null = null;

// Initialize app
function initializeApp() {
  const el = document.getElementById("app");
  if (!el) throw new Error("#app element not found");

  // Create root only once (singleton pattern)
  if (!_appRoot) {
    _appRoot = ReactDOM.createRoot(el);
  }

  return _appRoot.render(
    <React.StrictMode>
      <CustomRolesProvider>
        <App />
      </CustomRolesProvider>
    </React.StrictMode>,
  );
}

// Initialize app with error recovery
function safeInitialize() {
  // Always initialize React first (critical for app to load)
  try {
    initializeApp();
    console.warn("[INIT] React app mounted successfully");
  } catch (error) {
    console.error("[INIT] React mounting failed:", error);
    // Fallback: try basic mounting without context using same root
    const el = document.getElementById("app");
    if (el) {
      // Use singleton root for fallback too
      if (!_appRoot) {
        _appRoot = ReactDOM.createRoot(el);
      }
      _appRoot.render(<App />);
      console.warn("[INIT] Fallback React mount attempted");
    }
  }

  // Theme controller (non-critical)
  try {
    themeController.init();
    console.warn("[INIT] Theme controller initialized");
  } catch (error) {
    console.warn("[INIT] Theme controller failed:", error);
  }

  // PWA Service Worker (non-critical)
  try {
    registerSW();
    console.warn("[INIT] Service Worker registered");
  } catch (error) {
    console.warn("[INIT] Service Worker failed:", error);
  }

  // Accessibility enforcement (non-critical)
  try {
    initializeA11yEnforcement();
    console.warn("[INIT] A11y enforcement initialized");
  } catch (error) {
    console.warn("[INIT] A11y enforcement failed:", error);
  }
}

// Start the app safely
safeInitialize();
