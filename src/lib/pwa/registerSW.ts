import { hapticFeedback } from "../touch/haptics";

const BASE_SCOPE = import.meta.env.BASE_URL ?? "/";
const RAW_BUILD_ID = (import.meta.env?.VITE_BUILD_ID ?? "").trim();

export const BUILD_ID = RAW_BUILD_ID.length > 0 ? RAW_BUILD_ID : "dev-local";

export interface ServiceWorkerState {
  offlineReady: boolean;
  needRefresh: boolean;
  registerError: Error | null;
}

type RegisterError = false | Error;

export interface RegisterResult {
  updateServiceWorker: () => Promise<void>;
  offlineReady: boolean;
  needRefresh: boolean;
  registerError: RegisterError;
}

type Listener = (state: ServiceWorkerState) => void;

const serviceWorkerState: ServiceWorkerState = {
  offlineReady: false,
  needRefresh: false,
  registerError: null,
};

const listeners = new Set<Listener>();
let cachedResult: RegisterResult | null = null;
let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;
let lastRegistration: ServiceWorkerRegistration | null = null;
let latestWaiting: ServiceWorker | null = null;

function emitState() {
  const snapshot = { ...serviceWorkerState };
  if (cachedResult) {
    cachedResult.offlineReady = snapshot.offlineReady;
    cachedResult.needRefresh = snapshot.needRefresh;
    cachedResult.registerError = snapshot.registerError ?? false;
  }
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error("[PWA] Service worker listener failed:", error);
    }
  });
}

async function ensureRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (lastRegistration) {
    return lastRegistration;
  }
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    lastRegistration = await navigator.serviceWorker.getRegistration(BASE_SCOPE);
    return lastRegistration;
  } catch (error) {
    console.error("[PWA] Failed to get service worker registration:", error);
    return null;
  }
}

export function subscribeToServiceWorker(listener: Listener) {
  listeners.add(listener);
  listener({ ...serviceWorkerState });
  return () => listeners.delete(listener);
}

export function getServiceWorkerState(): ServiceWorkerState {
  return { ...serviceWorkerState };
}

export async function activateServiceWorkerUpdate(): Promise<void> {
  const registration = await ensureRegistration();
  const waiting = registration?.waiting ?? latestWaiting;
  if (waiting) {
    waiting.postMessage({ type: "SKIP_WAITING" });
  }
}

export function registerSW(): RegisterResult {
  if (cachedResult) {
    return cachedResult;
  }

  const updateServiceWorker = async () => {
    const registration = await ensureRegistration();
    if (!registration) return;

    try {
      await registration.update();
      hapticFeedback.success();
    } catch (error) {
      console.error("[PWA] Service worker update failed:", error);
      throw error;
    }
  };

  cachedResult = {
    updateServiceWorker,
    offlineReady: serviceWorkerState.offlineReady,
    needRefresh: serviceWorkerState.needRefresh,
    registerError: serviceWorkerState.registerError ?? false,
  };

  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return cachedResult;
  }

  if (!registrationPromise) {
    const swUrl = `${BASE_SCOPE}sw.js?build=${BUILD_ID}`;

    registrationPromise = navigator.serviceWorker
      .register(swUrl, { scope: BASE_SCOPE })
      .then((registration) => {
        lastRegistration = registration;

        if (!navigator.serviceWorker.controller) {
          serviceWorkerState.offlineReady = true;
          emitState();
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state !== "installed") {
              return;
            }

            latestWaiting = registration.waiting ?? newWorker;

            if (navigator.serviceWorker.controller) {
              serviceWorkerState.needRefresh = true;
            } else {
              serviceWorkerState.offlineReady = true;
            }
            emitState();
          });
        });

        return registration;
      })
      .catch((error: Error) => {
        console.error("[PWA] Service worker registration failed:", error);
        serviceWorkerState.registerError = error;
        emitState();
        return null;
      });
  }

  return cachedResult;
}
