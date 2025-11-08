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
    deps = [],
  } = options;

  const [state, setState] = useState<DeferredFetchState<T>>({
    data: null,
    loading: false,
    error: null,
    triggered: false,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const idleCallbackRef = useRef<ReturnType<typeof requestIdleCallback>>();
  const abortControllerRef = useRef<AbortController>();
  const hasTriggeredRef = useRef(false);

  // Feature-Flag Check
  const isDeferredEnabled = isFeatureEnabled("deferredDataFetch");

  const executeFetch = useCallback(
    async (source: "immediate" | "idle" | "trigger" | "event") => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      // Abort previous fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setState((prev) => ({ ...prev, loading: true, error: null, triggered: true }));
      abortControllerRef.current = new AbortController();

      try {
        const result = await fetchFn();

        if (!abortControllerRef.current.signal.aborted) {
          setState((prev) => ({ ...prev, data: result, loading: false }));

          if (import.meta.env.DEV) {
            console.warn(`[Deferred Fetch] ✅ Data loaded via ${source}`);
          }
        }
      } catch (error: any) {
        if (!abortControllerRef.current.signal.aborted) {
          const errorMessage = error?.message || "Unknown fetch error";
          setState((prev) => ({ ...prev, error: errorMessage, loading: false }));

          console.warn(`[Deferred Fetch] ❌ Fetch failed via ${source}:`, error);
        }
      }
    },
    [fetchFn],
  );

  const trigger = useCallback(() => {
    void executeFetch("trigger");
  }, [executeFetch]);

  const reset = useCallback(() => {
    // Clear all timers/callbacks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (idleCallbackRef.current) {
      cancelIdleCallback(idleCallbackRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    hasTriggeredRef.current = false;
    setState({
      data: null,
      loading: false,
      error: null,
      triggered: false,
    });
  }, []);

  const triggerEventsString = triggerEvents.join(",");

  useEffect(() => {
    // Reset wenn deps ändern
    reset();

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

    triggerEvents.forEach((eventType) => {
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
      if ("requestIdleCallback" in window) {
        idleCallbackRef.current = requestIdleCallback(() => void executeFetch("idle"), {
          timeout: maxDelay,
        });
      } else {
        // Fallback für Browser ohne requestIdleCallback
        timeoutRef.current = setTimeout(() => void executeFetch("idle"), Math.min(maxDelay, 2000));
      }
    };

    scheduleIdleFetch();

    // Cleanup
    return () => {
      // Clear timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
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
      }
    };
  }, [
    isDeferredEnabled,
    immediate,
    maxDelay,
    triggerEventsString,
    triggerEvents,
    executeFetch,
    reset,
    deps,
  ]);

  return {
    ...state,
    trigger,
    reset,
  };
}

/**
 * Hook für einfaches deferred loading mit häufigen Defaults
 */
export function useDeferredLoad<T>(fetchFn: () => Promise<T>, deps: React.DependencyList = []) {
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
  deps: React.DependencyList = [],
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
    supportsRequestIdleCallback: "requestIdleCallback" in window,
    timestamp: new Date().toISOString(),
  };
}
