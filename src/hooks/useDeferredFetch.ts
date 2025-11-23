/**
 * Deferred Data Fetching Hook
 *
 * Issue-Prompt #9: Daten-Fetch beim App-Start drosseln
 * Feature-Flag: deferredDataFetch
 *
 * Verzögert Daten-Laden mit requestIdleCallback für bessere App-Start-Performance.
 * Lädt nur wenn Browser idle ist oder User interagiert.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { isFeatureEnabled } from "../config/flags";

interface DeferredFetchOptions<T> {
  /** Fetch-Funktion, die das Promise zurückgibt */
  fetchFn: () => Promise<T>;

  /** Sofort laden wenn bereits cached (default: true) */
  immediate?: boolean;

  /** Maximale Verzögerung in ms (default: 5000ms) */
  maxDelay?: number;

  /** Trigger-Events die sofortiges Laden auslösen */
  triggerEvents?: ("focus" | "click" | "scroll" | "visibility")[];

  /** Abhängigkeits-Array für Re-Fetch */
  deps?: React.DependencyList;
}

interface DeferredFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  triggered: boolean;
}

type IdleCallbackHandle = number;

const hasWindow = typeof window !== "undefined";

const requestIdle =
  hasWindow && typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback.bind(window)
    : (cb: IdleRequestCallback, options?: IdleRequestOptions) =>
        setTimeout(cb, options?.timeout ?? 200);

const cancelIdle =
  hasWindow && typeof window.cancelIdleCallback === "function"
    ? window.cancelIdleCallback.bind(window)
    : (id: IdleCallbackHandle) => clearTimeout(id);

function depsAreEqual(
  prev: React.DependencyList | undefined,
  next: React.DependencyList | undefined,
): boolean {
  if (prev === next) return true;
  if (!prev || !next) return !prev && !next;
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i += 1) {
    if (!Object.is(prev[i], next[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Deferred Fetch Hook mit requestIdleCallback
 */
export function useDeferredFetch<T>(options: DeferredFetchOptions<T>): DeferredFetchState<T> & {
  /** Manuell Fetch triggern */
  trigger: () => void;
  /** Daten zurücksetzen */
  reset: () => void;
} {
  const {
    fetchFn,
    immediate = true,
    maxDelay = 5000,
    triggerEvents = ["focus", "click"],
    deps,
  } = options;

  const [state, setState] = useState<DeferredFetchState<T>>({
    data: null,
    loading: false,
    error: null,
    triggered: false,
  });
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const depsRef = useRef<React.DependencyList | undefined>(deps ? [...deps] : undefined);
  const depsVersionRef = useRef(0);

  if (!depsAreEqual(depsRef.current, deps)) {
    depsVersionRef.current += 1;
    depsRef.current = deps ? [...deps] : undefined;
  }

  const depsToken = depsVersionRef.current;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<IdleCallbackHandle | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasTriggeredRef = useRef(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Feature-Flag Check
  const isDeferredEnabled = isFeatureEnabled("deferredDataFetch");

  const executeFetch = useCallback(async (source: "immediate" | "idle" | "trigger" | "event") => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Abort previous fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, loading: true, error: null, triggered: true }));
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchFnRef.current();

      if (!abortControllerRef.current.signal.aborted && isMountedRef.current) {
        setState((prev) => ({ ...prev, data: result, loading: false }));

        if (import.meta.env.DEV) {
          console.warn(`[Deferred Fetch] ✅ Data loaded via ${source}`);
        }
      }
    } catch (error: any) {
      if (!abortControllerRef.current.signal.aborted && isMountedRef.current) {
        const errorMessage = error?.message || "Unknown fetch error";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));

        console.warn(`[Deferred Fetch] ❌ Fetch failed via ${source}:`, error);
      }
    }
  }, []);

  const trigger = useCallback(() => {
    void executeFetch("trigger");
  }, [executeFetch]);

  const reset = useCallback(() => {
    // Clear all timers/callbacks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (idleCallbackRef.current) {
      cancelIdleCallback(idleCallbackRef.current);
      idleCallbackRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    hasTriggeredRef.current = false;
    if (isMountedRef.current) {
      setState({
        data: null,
        loading: false,
        error: null,
        triggered: false,
      });
    }
  }, []);

  const triggerEventsString = triggerEvents.join(",");
  useEffect(() => {
    // Reset wenn deps ändern
    reset();

    const isTestEnv = typeof (globalThis as any).vitest !== "undefined";
    const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

    // In Tests oder ohne Browser-Kontext: keine Side-Effects aufbauen
    if (!isBrowser || isTestEnv) return;

    // Exit early wenn Feature-Flag deaktiviert
    if (!isDeferredEnabled) {
      void executeFetch("immediate");
      return;
    }

    // Immediate loading wenn angefordert (z.B. Cache verfügbar)
    if (immediate) {
      void executeFetch("immediate");
      return;
    }

    // Event-Listener für Trigger-Events
    const eventHandlers: Array<{ event: string; handler: () => void }> = [];

    const eventList = triggerEventsString
      .split(",")
      .map((event) => event.trim())
      .filter((event): event is "focus" | "click" | "scroll" | "visibility" => event.length > 0);

    eventList.forEach((eventType) => {
      let handler: () => void;
      let element: EventTarget;

      switch (eventType) {
        case "focus":
          handler = () => void executeFetch("event");
          element = window;
          break;
        case "click":
          handler = () => void executeFetch("event");
          element = document.body;
          break;
        case "scroll":
          handler = () => void executeFetch("event");
          element = window;
          break;
        case "visibility":
          handler = () => {
            if (!document.hidden) {
              void executeFetch("event");
            }
          };
          element = document;
          break;
        default:
          return;
      }

      element.addEventListener(
        eventType === "visibility" ? "visibilitychange" : eventType,
        handler,
        { once: true },
      );
      eventHandlers.push({
        event: eventType === "visibility" ? "visibilitychange" : eventType,
        handler,
      });
    });

    // requestIdleCallback für deferred loading
    const scheduleIdleFetch = () => {
      idleCallbackRef.current = requestIdle(() => void executeFetch("idle"), {
        timeout: maxDelay,
      });
    };

    scheduleIdleFetch();

    // Cleanup
    return () => {
      // Clear timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (idleCallbackRef.current) {
        cancelIdle(idleCallbackRef.current);
        idleCallbackRef.current = null;
      }

      // Remove event listeners
      eventHandlers.forEach(({ event, handler }) => {
        if (event === "visibilitychange") {
          document.removeEventListener(event, handler);
        } else if (event === "focus" || event === "scroll") {
          window.removeEventListener(event, handler);
        } else {
          document.body.removeEventListener(event, handler);
        }
      });

      // Abort fetch if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [isDeferredEnabled, immediate, maxDelay, triggerEventsString, executeFetch, reset, depsToken]);

  return {
    ...state,
    trigger,
    reset,
  };
}

/**
 * Hook für einfaches deferred loading mit häufigen Defaults
 */
export function useDeferredLoad<T>(fetchFn: () => Promise<T>, deps?: React.DependencyList) {
  return useDeferredFetch({
    fetchFn,
    immediate: false,
    maxDelay: 3000,
    triggerEvents: ["focus", "click"],
    deps,
  });
}

/**
 * Hook für cached data mit sofortigem Fallback
 */
export function useDeferredCachedFetch<T>(
  fetchFn: () => Promise<T>,
  checkCacheFn?: () => T | null,
  deps?: React.DependencyList,
) {
  const hasCachedData = checkCacheFn ? !!checkCacheFn() : false;

  return useDeferredFetch({
    fetchFn,
    immediate: hasCachedData, // Nur sofort laden wenn Cache da ist
    maxDelay: hasCachedData ? 1000 : 5000, // Kürzere Verzögerung wenn gecacht
    triggerEvents: ["focus", "click", "scroll"],
    deps,
  });
}

/**
 * Status-Debugging für Development
 */
export function getDeferredFetchStatus() {
  return {
    featureFlagEnabled: isFeatureEnabled("deferredDataFetch"),
    supportsRequestIdleCallback: hasWindow && "requestIdleCallback" in window,
    timestamp: new Date().toISOString(),
  };
}
