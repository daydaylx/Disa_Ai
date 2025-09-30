import "./styles/layers.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { registerSW } from "./lib/pwa/registerSW";

const el = document.getElementById("app");
if (!el) throw new Error("#app not found");
createRoot(el).render(<App />);

// PWA Service Worker für Offline-Funktionalität registrieren
registerSW();
