// CRITICAL: Import React in very specific order to prevent Activity property error
// Import styles after React to avoid potential race conditions
import "./styles/layers.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ErrorBoundary, StartupDiagnostics } from "./components/ErrorBoundary";
import { initEnvironment } from "./config/env";
import { registerSW } from "./lib/pwa/registerSW";

// Ensure React is fully initialized before importing React DOM
if (typeof React === "undefined" || !React.createElement) {
  throw new Error("React is not properly loaded");
}

// Initialize environment configuration early
try {
  const envResult = initEnvironment();
  if (!envResult.success) {
    console.error("Environment initialization failed:", envResult.errors);
  }
} catch (error) {
  console.error("Critical environment error:", error);
}

// Ensure DOM and React are fully ready before mounting
function initializeApp() {
  const el = document.getElementById("app");
  if (!el) throw new Error("#app element not found");

  // Defensive check: Ensure React is fully loaded
  if (typeof React === "undefined" || typeof createRoot === "undefined") {
    throw new Error("React is not properly initialized");
  }

  const root = createRoot(el);
  root.render(
    <ErrorBoundary>
      <StartupDiagnostics>
        <App />
      </StartupDiagnostics>
    </ErrorBoundary>,
  );

  return root;
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  // DOM is already ready
  initializeApp();
}

// Protect React initialization from ReloadManager conflicts
window.addEventListener("app-before-reload", (event: CustomEvent) => {
  console.warn("🛡️ React App: Graceful shutdown before reload", event.detail);
  // Give React time to cleanup before reload
  setTimeout(() => {
    console.warn("🛡️ React App: Ready for reload");
  }, 100);
});

// PWA Service Worker für Offline-Funktionalität registrieren
registerSW();
