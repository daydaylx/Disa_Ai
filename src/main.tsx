import "./styles/globals.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = React.lazy(() => import("./views/Home"));
const Chat = React.lazy(() => import("./views/Chat"));
const Settings = React.lazy(() => import("./views/Settings"));

const router = createBrowserRouter([
  { path: "/", element: <React.Suspense fallback={<div className="p-6">Lade…</div>}><Home /></React.Suspense> },
  { path: "/chat", element: <React.Suspense fallback={<div className="p-6">Lade…</div>}><Chat /></React.Suspense> },
  { path: "/settings", element: <React.Suspense fallback={<div className="p-6">Lade…</div>}><Settings /></React.Suspense> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  (async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) { try { await r.unregister(); } catch {} }
      if ("caches" in window) {
        const keys = await caches.keys();
        for (const k of keys) { try { await caches.delete(k); } catch {} }
      }
      console.warn("[DisaAI] SW & Caches bereinigt");
    } catch {}
  })();
}
