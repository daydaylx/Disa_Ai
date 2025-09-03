import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { ToastProvider } from "./components/toast/ToastProvider";

/** Migrations: vereinheitliche LocalStorage-Schlüssel, ohne Daten zu verlieren. */
function migrateStorageOnce() {
  try {
    const FLAG = "disa:migrated:keys:v1";
    if (localStorage.getItem(FLAG)) return;

    // API-Key: bevorzugt "disa:openrouter:key"
    const curKey = localStorage.getItem("disa:openrouter:key");
    const legacyA = localStorage.getItem("openrouter:apiKey");
    const legacyB = localStorage.getItem("disa_api_key");
    const nextKey = curKey || legacyA || legacyB;
    if (nextKey && !curKey) localStorage.setItem("disa:openrouter:key", nextKey);

    // Modell: bevorzugt "disa:modelId"
    const curModel = localStorage.getItem("disa:modelId");
    const legacyM1 = localStorage.getItem("disa_model");
    const legacyM2 = localStorage.getItem("disa:model");
    const nextModel = curModel || legacyM1 || legacyM2;
    if (nextModel && !curModel) localStorage.setItem("disa:modelId", nextModel);

    localStorage.setItem(FLAG, "1");
  } catch {}
}

/** Optional: alte Service-Worker einmalig abräumen, um Stale-Caches zu vermeiden. */
async function cleanupServiceWorkersOnce() {
  try {
    const FLAG = "disa:sw:cleanup:v1";
    if (localStorage.getItem(FLAG)) return;
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(()=>{})));
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    }
    localStorage.setItem(FLAG, "1");
  } catch {}
}

(async function bootstrap() {
  migrateStorageOnce();
  await cleanupServiceWorkersOnce();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ToastProvider>
        <App />
      </ToastProvider>
    </React.StrictMode>
  );
})();
