// CSS-Imports - Glassmorphism 2.0 Design System
import "./styles/theme.css"; // Single theme entry point
import "./styles/aurora.css"; // Aurora background system
import "./styles/aurora-themes.css"; // Aurora theme variations
import "./styles/glass-components.css"; // Glass component library
import "./styles/interactive-effects.css"; // Interactive micro-animations
import "./styles/chat-glass.css"; // Chat-specific glass effects
import "./styles/mobile-glass.css"; // Mobile optimizations
import "./styles/visual-effects.css"; // Enhanced visual effects

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { installViewportEventThrottles } from "./lib/perf/throttle-viewport-events";
import { setupPwaInstallCapture } from "./lib/pwa/install";

// Einmalige Initialisierung
installViewportEventThrottles();
setupPwaInstallCapture();

const container = document.getElementById("root");
if (!container) {
  throw new Error("#root not found in index.html");
}
const root = createRoot(container);

function renderApp() {
  root.render(<App />);
}

async function renderDebug() {
  // Debug-Route lazy laden für bessere Bundle-Größe
  const mod = await import(/* webpackChunkName: "debug" */ "./routes/Debug");
  const Debug = mod.default;
  root.render(<Debug />);
}

function route() {
  if (location.hash === "#/debug") {
    // bewusst fire-and-forget, aber mit Fehlerbehandlung
    void renderDebug().catch(console.error);
  } else {
    renderApp();
  }
}

// Initiale Route rendern und bei Hash-Änderungen neu entscheiden
route();
window.addEventListener("hashchange", route);
