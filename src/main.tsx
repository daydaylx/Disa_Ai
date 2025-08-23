import { PersonaProvider } from "./config/personas";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root nicht gefunden");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <PersonaProvider>
      <App />
    </PersonaProvider>
  </React.StrictMode>
);

// Einmalige Bereinigung alter Service-Worker/Caches in Produktion
if (import.meta.env.PROD && typeof window !== "undefined") {
  (async () => {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) {
          try { await r.unregister(); } catch (e) { /* noop */ void 0; }
        }
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        for (const k of keys) {
          try { await caches.delete(k); } catch (e) { /* noop */ void 0; }
        }
      }
      console.warn("[DisaAI] SW & Caches bereinigt");
    } catch (e) { /* noop */ void 0; }
  })();
}
