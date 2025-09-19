import "./styles/index.css"; // falls dein globales CSS woanders liegt, Pfad anpassen

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { installViewportEventThrottles } from "./lib/perf/throttle-viewport-events";

// Einmalige Initialisierung
installViewportEventThrottles();

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
