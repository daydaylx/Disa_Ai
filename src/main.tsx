import "./styles/globals.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { PersonaProvider } from "./config/personas";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersonaProvider>
      <App />
    </PersonaProvider>
  </React.StrictMode>,
);

if (import.meta?.env?.PROD && "serviceWorker" in navigator) {
  // SW-Bereinigung (nur wenn du mal PWA aktiv hast)
  (async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) await r.unregister();
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // eslint-disable-next-line no-empty
    } catch {}
  })();
}
