// Kleiner Install-Manager mit Subscription API + React Hook
type Listener = () => void;

let deferred: any | null = null;
let installed = false;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((cb) => cb());
}

export function setupPwaInstallCapture() {
  // beforeinstallprompt wird auf Android/Chrome gefeuert
  window.addEventListener("beforeinstallprompt", (e: any) => {
    e.preventDefault(); // wir kontrollieren das Prompt selbst
    deferred = e;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    notify();
  });

  // SW-Registration (nur falls noch keiner läuft)
  if ("serviceWorker" in navigator) {
    const has = navigator.serviceWorker.controller;
    if (!has) {
      const { BUILD_ID } = require("./registerSW");
      navigator.serviceWorker.register(`/sw.js?build=${BUILD_ID}`).catch(() => {
        /* still ok */
      });
    }
  }
}

export function canInstall() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
  return { hasPrompt: !!deferred, installed: installed || isStandalone };
}

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  try {
    const r = await deferred.prompt();
    deferred = null;
    notify();
    return Boolean(r?.outcome ? r.outcome === "accepted" : true);
  } catch {
    deferred = null;
    notify();
    return false;
  }
}

// React-Hook optional (nutzt useSyncExternalStore, damit keine States rumhängen)
export function usePwaInstall() {
  // lazy import to avoid requiring React here
  let React: typeof import("react");
  try {
    React = require("react");
  } catch {
    throw new Error("React is required for usePwaInstall hook");
  }
  const { useSyncExternalStore, useCallback } = React;
  const subscribe = (cb: Listener) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  };
  const getSnapshot = () => canInstall();
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const install = useCallback(() => promptInstall(), []);
  return { ...state, install };
}
