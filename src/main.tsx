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
try {
  initializeApp();

  // Remove loading fallback when React app successfully mounts
  setTimeout(() => {
    const fallback = document.getElementById("loading-fallback");
    if (fallback) {
      fallback.style.opacity = "0";
      fallback.style.transition = "opacity 0.3s ease";
      setTimeout(() => fallback.remove(), 300);
    }
  }, 100);
} catch (error) {
  console.error("Failed to initialize app:", error);

  // Show error in loading fallback
  const fallback = document.getElementById("loading-fallback");
  if (fallback) {
    const message = fallback.querySelector("div:last-child");
    if (message) {
      message.textContent = "Fehler beim Laden. Seite wird neu geladen...";
      setTimeout(() => window.location.reload(), 2000);
    }
  }
}

// PWA Service Worker
registerSW();

// Initialize accessibility enforcement
initializeA11yEnforcement();
