import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { initEnvironment } from "./config/env";
import { CustomRolesProvider } from "./contexts/CustomRolesContext";
import mainStylesUrl from "./index.css?url";
import { initializeA11yEnforcement } from "./lib/a11y/touchTargets";
import { initializeSentry } from "./lib/monitoring/sentry";
// PWA Installation Prompt
import { safeError, safeWarn } from "./lib/utils/production-logger";
import { reloadApp, resetApp } from "./lib/recovery/resetApp";
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
    safeError("Environment initialization failed:", envResult.errors);
  }
} catch (error) {
  safeError("Critical environment error:", error);
}

// Initialize error tracking (must be early in the process)
try {
  initializeSentry();
} catch (error) {
  safeError("Sentry initialization failed:", error);
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
    safeWarn("[INIT] React app mounted successfully");
  } catch (error) {
    safeError("[INIT] React mounting failed:", error);
    // Fallback: try basic mounting without context using same root
    const el = document.getElementById("app");
    if (el) {
      // Use singleton root for fallback too
      if (!_appRoot) {
        _appRoot = ReactDOM.createRoot(el);
      }
      _appRoot.render(<App />);
      safeWarn("[INIT] Fallback React mount attempted");
    }
  }

  // Theme controller (non-critical)
  try {
    themeController.init();
    safeWarn("[INIT] Theme controller initialized");
  } catch (error) {
    safeWarn("[INIT] Theme controller failed:", error);
  }

  // PWA Service Worker (disabled temporarily due to ES6 import issues)
  // try {
  //   registerSW();
  //   safeWarn("[INIT] Service Worker registered");
  // } catch (error) {
  //   safeWarn("[INIT] Service Worker failed:", error);
  // }

  // Accessibility enforcement (non-critical)
  try {
    initializeA11yEnforcement();
    safeWarn("[INIT] A11y enforcement initialized");
  } catch (error) {
    safeWarn("[INIT] A11y enforcement failed:", error);
  }
}

// ========================================
// Preload Error Recovery Handler
// ========================================

/**
 * Renders a fallback error overlay when critical preload errors occur
 * This function operates outside React to ensure it works even when React fails
 */
function renderPreloadErrorOverlay(error: Event): void {
  safeError("[PRELOAD ERROR] Critical asset loading failed:", error);

  // Create error overlay with inline styles (no CSS dependencies)
  const overlay = document.createElement("div");
  overlay.id = "preload-error-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const container = document.createElement("div");
  container.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 48px;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
  `;

  // Error icon
  const icon = document.createElement("div");
  icon.style.cssText = `
    font-size: 64px;
    margin-bottom: 24px;
  `;
  icon.textContent = "⚠️";

  // Title
  const title = document.createElement("h1");
  title.style.cssText = `
    font-size: 28px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 16px 0;
  `;
  title.textContent = "Ladefehler";

  // Description
  const description = document.createElement("p");
  description.style.cssText = `
    font-size: 16px;
    color: #4a5568;
    line-height: 1.6;
    margin: 0 0 32px 0;
  `;
  description.textContent =
    "Die App konnte nicht vollständig geladen werden. Dies kann an einem Update oder Netzwerkproblem liegen.";

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    gap: 12px;
    justify-content: center;
  `;

  // Reload button
  const reloadBtn = document.createElement("button");
  reloadBtn.style.cssText = `
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `;
  reloadBtn.textContent = "Neu laden";
  reloadBtn.onmouseover = () => {
    reloadBtn.style.background = "#5a67d8";
    reloadBtn.style.transform = "translateY(-2px)";
  };
  reloadBtn.onmouseout = () => {
    reloadBtn.style.background = "#667eea";
    reloadBtn.style.transform = "translateY(0)";
  };
  reloadBtn.onclick = () => {
    reloadApp();
  };

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.style.cssText = `
    background: #f56565;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `;
  resetBtn.textContent = "App zurücksetzen";
  resetBtn.onmouseover = () => {
    resetBtn.style.background = "#e53e3e";
    resetBtn.style.transform = "translateY(-2px)";
  };
  resetBtn.onmouseout = () => {
    resetBtn.style.background = "#f56565";
    resetBtn.style.transform = "translateY(0)";
  };
  resetBtn.onclick = () => {
    resetApp();
  };

  // Assemble the overlay
  buttonContainer.appendChild(reloadBtn);
  buttonContainer.appendChild(resetBtn);
  container.appendChild(icon);
  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(buttonContainer);
  overlay.appendChild(container);

  // Clear and render
  document.body.innerHTML = "";
  document.body.appendChild(overlay);
}

/**
 * Install global preload error handler
 * Must be installed BEFORE any dynamic imports occur
 */
function installPreloadErrorHandler(): void {
  window.addEventListener("vite:preloadError", (event: Event) => {
    event.preventDefault(); // Prevent default error handling
    renderPreloadErrorOverlay(event);
  });

  // Also catch general module preload errors
  window.addEventListener("error", (event: ErrorEvent) => {
    if (
      event.message.includes("Failed to fetch dynamically imported module") ||
      event.message.includes("Unable to preload CSS")
    ) {
      event.preventDefault();
      renderPreloadErrorOverlay(event);
    }
  });

  safeWarn("[INIT] Preload error handler installed");
}

// Install error handler FIRST (before any imports can fail)
installPreloadErrorHandler();

// Start the app safely
safeInitialize();
