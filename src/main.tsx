/* c8 ignore start */
import "./index.css"; // Consolidated CSS: unified-tokens, base, components, Tailwind
import "./lib/css-feature-detection";
import "./lib/accessibility";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { getEnvConfigSafe, initEnvironment } from "./config/env";
import mainStylesUrl from "./index.css?url";
import { initializeA11yEnforcement } from "./lib/a11y/touchTargets";
import { initializeSentry } from "./lib/monitoring/sentry";
import { reloadApp, resetApp } from "./lib/recovery/resetApp";
import { safeError, safeWarn } from "./lib/utils/production-logger";
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
} catch (error: unknown) {
  safeError("Critical environment error:", error);
}

const envConfig = getEnvConfigSafe();

function normalizeBasePath(basePath: string): string {
  if (!basePath.startsWith("/")) {
    basePath = `/${basePath}`;
  }
  return basePath.endsWith("/") ? basePath : `${basePath}/`;
}

const normalizedBasePath = normalizeBasePath(envConfig.VITE_BASE_URL || "/");

function withBasePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const sanitizedPath = path.replace(/^\/+/, "");
  return `${normalizedBasePath}${sanitizedPath}`;
}

function toAbsoluteWithBase(path: string): string {
  return new URL(withBasePath(path), window.location.origin).toString();
}

// Initialize error tracking (must be early in the process)
try {
  initializeSentry();
} catch (error) {
  safeError("Sentry initialization failed:", error);
}

// Singleton React Root to prevent memory leaks
let _appRoot: ReactDOM.Root | null = null;
let preloadOverlayRendered = false;

function removeInitialLoader(): void {
  const loader = document.getElementById("initial-loader");
  loader?.remove();
}

// Initialize app
function initializeApp() {
  const el = document.getElementById("root");
  if (!el) throw new Error("#root element not found");

  // Create root only once (singleton pattern)
  if (!_appRoot) {
    _appRoot = ReactDOM.createRoot(el);
  }

  return _appRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// Initialize app with error recovery
function safeInitialize(): void {
  removeInitialLoader();
  // Always initialize React first (critical for app to load)
  try {
    initializeApp();
    safeWarn("[INIT] React app mounted successfully");
  } catch (error: unknown) {
    safeError("[INIT] React mounting failed:", error);
    // Fallback: try basic mounting without context using same root
    const el = document.getElementById("root");
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
  } catch (error: unknown) {
    safeWarn("[INIT] Theme controller failed:", error);
  }

  // Initialize service worker + persistent storage
  if (!import.meta.env.VITE_PWA_DISABLED) {
    // Register service worker if available
    if ("serviceWorker" in navigator) {
      // Simplified Service Worker registration - ONE strategy per environment
      const registerServiceWorker = async () => {
        try {
          // Request persistent storage
          if ("storage" in navigator && "persist" in navigator.storage) {
            const isPersistent = await navigator.storage.persist();
            safeWarn("Storage persistent:", isPersistent);
          }

          // Development: Try dev-sw.js, fallback to no SW
          if (import.meta.env.DEV) {
            try {
              const registration = await navigator.serviceWorker.register(
                withBasePath("dev-sw.js"),
                {
                  scope: normalizedBasePath,
                },
              );
              safeWarn("Dev SW registered:", registration);
              return registration;
            } catch (devError) {
              safeWarn("Dev SW not available, running without service worker:", devError);
              return null;
            }
          }

          // Production: Use production SW
          const registration = await navigator.serviceWorker.register(withBasePath("sw.js"), {
            scope: normalizedBasePath,
          });
          safeWarn("Production SW registered:", registration);
          return registration;
        } catch (error) {
          console.warn("SW registration failed:", error);
          return null;
        }
      };

      // Register immediately and on load (for reliability)
      void registerServiceWorker();
      window.addEventListener("load", () => void registerServiceWorker());
    }
  }

  // Accessibility enforcement (non-critical)
  try {
    initializeA11yEnforcement();
    safeWarn("[INIT] A11y enforcement initialized");
  } catch (error: unknown) {
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
function renderPreloadErrorOverlay(error: Event | PromiseRejectionEvent): void {
  if (preloadOverlayRendered || document.getElementById("preload-error-overlay")) {
    return;
  }
  preloadOverlayRendered = true;
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
    background: linear-gradient(135deg, var(--color-surface-elevated) 0%, var(--color-surface-elevated-strong) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const container = document.createElement("div");
  container.style.cssText = `
    background: var(--color-surface);
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
    color: var(--color-text-primary);
    margin: 0 0 16px 0;
  `;
  title.textContent = "Ladefehler";

  // Description
  const description = document.createElement("p");
  description.style.cssText = `
    font-size: 16px;
    color: var(--color-text-secondary);
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
    background: var(--color-accent-primary);
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
    reloadBtn.style.opacity = "0.96";
    reloadBtn.style.transform = "translateY(-2px)";
  };
  reloadBtn.onmouseout = () => {
    reloadBtn.style.opacity = "1";
    reloadBtn.style.transform = "translateY(0)";
  };
  reloadBtn.onclick = () => {
    void reloadApp();
  };

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.style.cssText = `
    background: var(--color-accent-danger);
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
    resetBtn.style.opacity = "0.96";
    resetBtn.style.transform = "translateY(-2px)";
  };
  resetBtn.onmouseout = () => {
    resetBtn.style.opacity = "1";
    resetBtn.style.transform = "translateY(0)";
  };
  resetBtn.onclick = () => {
    void resetApp();
  };

  // Assemble the overlay
  buttonContainer.appendChild(reloadBtn);
  buttonContainer.appendChild(resetBtn);
  container.appendChild(icon);
  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(buttonContainer);
  overlay.appendChild(container);

  // Clear and render - using safer method to avoid XSS
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
  document.body.appendChild(overlay);
}

/**
 * Install global preload error handler
 * Must be installed BEFORE any dynamic imports occur
 */
function installPreloadErrorHandler(): void {
  const shouldHandlePreloadError = (
    message?: string,
    error?: unknown,
    target?: EventTarget | null,
  ): boolean => {
    const normalizedMessage = message?.toLowerCase() ?? "";
    const normalizedErrorMessage =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message ?? "").toLowerCase()
        : typeof error === "string"
          ? error.toLowerCase()
          : "";
    const errorName =
      typeof error === "object" && error && "name" in error
        ? String((error as { name?: string }).name ?? "")
        : undefined;

    const matchesChunkFailure =
      normalizedMessage.includes("failed to fetch dynamically imported module") ||
      normalizedMessage.includes("unable to preload css") ||
      normalizedMessage.includes("loading chunk") ||
      normalizedMessage.includes("chunkloaderror") ||
      normalizedErrorMessage.includes("chunkloaderror") ||
      normalizedErrorMessage.includes("failed to fetch dynamically imported module") ||
      normalizedErrorMessage.includes("loading chunk") ||
      normalizedErrorMessage.includes("unable to preload css") ||
      errorName === "ChunkLoadError" ||
      errorName === "CSS_CHUNK_LOAD_FAILED";

    const isAssetElementError =
      target instanceof HTMLScriptElement ||
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement;

    return matchesChunkFailure || isAssetElementError;
  };

  window.addEventListener("vite:preloadError", (event: Event) => {
    event.preventDefault(); // Prevent default error handling
    renderPreloadErrorOverlay(event);
  });

  // Also catch general module preload errors
  window.addEventListener("error", (event: ErrorEvent) => {
    if (shouldHandlePreloadError(event.message, event.error, event.target)) {
      event.preventDefault();
      renderPreloadErrorOverlay(event);
    }
  });

  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const message =
      typeof reason === "string"
        ? reason
        : typeof reason === "object" && reason && "message" in reason
          ? String((reason as { message?: string }).message ?? "")
          : undefined;
    if (shouldHandlePreloadError(message, reason, null)) {
      event.preventDefault();
      renderPreloadErrorOverlay(event);
    }
  });

  safeWarn("[INIT] Preload error handler installed");
}

// Install error handler FIRST (before any imports can fail)
installPreloadErrorHandler();

// Start the app safely

void safeInitialize();
/* c8 ignore stop */
