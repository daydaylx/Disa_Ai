// CSS-Imports in korrekter Reihenfolge (kritisch für Styling)
import "./ui/base.css"; // Reset & base styles
import "./styles/globals.css"; // Global variables & layouts
import "./styles/brand.css"; // Brand colors & aurora effects
import "./styles/theme.css"; // Design tokens & utility classes
import "./styles/chat.css"; // Component-specific styles
import "./styles/enhanced-effects.css"; // Enhanced UI effects and animations
import "./styles/premium-effects.css"; // Premium advanced effects

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
  const mod = await import("./routes/Debug");
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
