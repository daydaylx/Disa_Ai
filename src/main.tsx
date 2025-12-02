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
void import("./lib/monitoring/sentry")
  .then((mod) => mod.initializeSentry())
  .catch((error) => safeError("Sentry initialization failed:", error));

// Singleton React Root to prevent memory leaks
let _appRoot: ReactDOM.Root | null = null;

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
      const warmDevCache = async () => {
        try {
          if (!("caches" in window)) return;
          const urls = Array.from(
            document.querySelectorAll<HTMLLinkElement | HTMLScriptElement>(
              "link[rel='stylesheet'], script[src]",
            ),
          )
            .map((el) => ("href" in el ? el.href : el.src))
            .filter(Boolean);
          urls.push(toAbsoluteWithBase("/"));
          urls.push(new URL(location.pathname, window.location.origin).toString());
          urls.push(toAbsoluteWithBase("manifest.webmanifest"));
          const cache = await caches.open("disa-dev-cache");
          await cache.addAll([...new Set(urls)]);
        } catch (err) {
          safeWarn("Warm cache failed", err);
        }
      };

      const registerInlineDevSW = async () => {
        const swCode = `
          const CACHE = 'disa-dev-cache';
          const BASE_PATH = '${normalizedBasePath}';
          self.addEventListener('install', (event) => {
            event.waitUntil(caches.open(CACHE).then(() => self.skipWaiting()));
          });
          self.addEventListener('activate', (event) => {
            event.waitUntil(self.clients.claim());
          });
          self.addEventListener('fetch', (event) => {
            if (event.request.method !== 'GET') return;
            event.respondWith(
              caches.open(CACHE).then((cache) =>
                cache.match(event.request).then((resp) => {
                  if (resp) return resp;
                  return fetch(event.request)
                    .then((networkResp) => {
                      cache.put(event.request, networkResp.clone()).catch(() => {});
                      return networkResp;
                    })
                    .catch(async () => (await cache.match(BASE_PATH)) ?? Response.error());
                }),
              ),
            );
          });
        `;
        const swUrl = URL.createObjectURL(new Blob([swCode], { type: "application/javascript" }));
        try {
          const registration = await navigator.serviceWorker.register(swUrl, {
            scope: normalizedBasePath,
          });
          return registration;
        } catch (err) {
          safeWarn("Inline SW registration failed", err);
          return null;
        }
      };

      const registerDevServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(withBasePath("dev-sw.js"), {
            scope: normalizedBasePath,
          });
          safeWarn("Dev SW registered:", registration);
          return registration;
        } catch (err) {
          safeWarn("Dev SW registration failed", err);
          return null;
        }
      };

      const registerServiceWorker = async () => {
        // Request persistent storage (fixes StorageType.persistent deprecation)
        if ("storage" in navigator && "persist" in navigator.storage) {
          const isPersistent = await navigator.storage.persist();
          safeWarn("Storage persistent:", isPersistent);
        }

        try {
          const registration = await navigator.serviceWorker.register(withBasePath("sw.js"), {
            scope: normalizedBasePath,
          });
          safeWarn("SW registered:", registration);
        } catch (registrationError) {
          console.warn("SW registration failed:", registrationError);
        }
      };

      // Try immediately (helps e2e/dev where load already fired) and also on load
      if (import.meta.env.DEV) {
        const ensureDevServiceWorker = async () => {
          const registration = (await registerDevServiceWorker()) ?? (await registerInlineDevSW());
          return registration;
        };

        void ensureDevServiceWorker().then(() => warmDevCache());
        window.addEventListener("load", () => void ensureDevServiceWorker());
      } else {
        void registerServiceWorker();
        window.addEventListener("load", () => void registerServiceWorker());
        void warmDevCache();
      }
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

void safeInitialize();
/* c8 ignore stop */
