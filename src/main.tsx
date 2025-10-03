import "./styles/layers.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ErrorBoundary, StartupDiagnostics } from "./components/ErrorBoundary";
import { initEnvironment } from "./config/env";
import { initializeA11yEnforcement } from "./lib/a11y/touchTargets";
import { registerSW } from "./lib/pwa/registerSW";

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

// Start the app
initializeApp();

// PWA Service Worker
registerSW();

// Initialize accessibility enforcement
initializeA11yEnforcement();
