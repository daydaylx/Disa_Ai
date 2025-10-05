import "./styles/layers.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

// Mobile viewport height fix for iOS Safari
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Set initial viewport height
setViewportHeight();

// Update on resize and orientation change
window.addEventListener("resize", setViewportHeight);
window.addEventListener("orientationchange", () => {
  // Small delay for orientation change to complete
  setTimeout(setViewportHeight, 100);
});

const el = document.getElementById("app");
if (!el) throw new Error("#app not found");
createRoot(el).render(<App />);
