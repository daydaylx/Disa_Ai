/**
 * Enhanced Deferred Data Fetching Hook with improved error handling and loading states
 *
 * Provides better user experience with skeleton states and graceful error recovery
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { isFeatureEnabled } from "../config/flags";

interface EnhancedDeferredFetchOptions<T> {
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

  /** Maximale Anzahl von Retry-Versuchen bei Fehlern */
  maxRetries?: number;

  /** Zeit zwischen Retry-Versuchen in ms */
  retryDelay?: number;

  /** Zeitlimit für den Fetch-Vorgang in ms */
  timeout?: number;
}

interface EnhancedDeferredFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  triggered: boolean;
  retries: number;
  isRetryPending: boolean;
}

type IdleCallbackHandle = number;

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
 * Enhanced Deferred Fetch Hook with better error handling and loading states
 */
export function useEnhancedDeferredFetch<T>(
  options: EnhancedDeferredFetchOptions<T>,
): EnhancedDeferredFetchState<T> & {
  trigger: () => void;
  reset: () => void;
  retry: () => void;
} {
  const {
    fetchFn,
    immediate = true,
    maxDelay = 5000,
    triggerEvents = ["focus", "click"],
    deps,
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000, // 10 second default timeout
  } = options;

  const [state, setState] = useState<EnhancedDeferredFetchState<T>>({
    data: null,
    loading: false,
    error: null,
    triggered: false,
    retries: 0,
    isRetryPending: false,
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

  // Feature-Flag Check
  const isDeferredEnabled = isFeatureEnabled("deferredDataFetch");

  const executeFetch = useCallback(
    async (source: "immediate" | "idle" | "trigger" | "event" | "retry") => {
      if (hasTriggeredRef.current && source !== "retry") return;
      if (source === "retry") {
        setState((prev) => ({ ...prev, isRetryPending: true }));
      } else {
        hasTriggeredRef.current = true;
      }

      // Abort previous fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        triggered: true,
        isRetryPending: source === "retry",
      }));

      abortControllerRef.current = new AbortController();

      // Set timeout for the fetch operation
      const fetchTimeout = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort("Request timeout");
        }
      }, timeout);

      try {
        const fetchPromise = fetchFnRef.current();
        const abortSignal = abortControllerRef.current.signal;

        // Race the fetch promise against the abort signal
        const result = await Promise.race([
          fetchPromise,
          new Promise<never>((_, reject) => {
            abortSignal.addEventListener("abort", () => {
              reject(new Error("Request was aborted"));
            });
          }),
        ]);

        clearTimeout(fetchTimeout);

        if (!abortControllerRef.current.signal.aborted) {
          setState((prev) => ({
            ...prev,
            data: result,
            loading: false,
            error: null,
            retries: 0, // Reset retries on success
            isRetryPending: false,
          }));

          if (import.meta.env.DEV) {
            console.warn(`[Enhanced Deferred Fetch] ✅ Data loaded via ${source}`);
          }
        }
      } catch (error: any) {
        clearTimeout(fetchTimeout);

        if (!abortControllerRef.current.signal.aborted && error.message !== "Request was aborted") {
          const errorMessage = error?.message || "Unknown fetch error";

          // Handle retries
          setState((prev) => {
            const nextRetries = prev.retries + 1;
            const shouldRetry = nextRetries <= maxRetries && source !== "retry";

            if (shouldRetry) {
              // Schedule retry after delay
              setTimeout(() => {
                void executeFetch("retry");
              }, retryDelay);
            }

            return {
              ...prev,
              error: shouldRetry
                ? `${errorMessage} (Retry ${nextRetries}/${maxRetries})`
                : errorMessage,
              loading: shouldRetry,
              retries: nextRetries,
              isRetryPending: false,
            };
          });

          console.warn(`[Enhanced Deferred Fetch] ❌ Fetch failed via ${source}:`, error);
        } else if (error.message === "Request was aborted" && import.meta.env.DEV) {
          console.warn("[Enhanced Deferred Fetch] Request was aborted");
        }
      }
    },
    [maxRetries, retryDelay, timeout],
  );

  const trigger = useCallback(() => {
    void executeFetch("trigger");
  }, [executeFetch]);

  const retry = useCallback(() => {
    // Reset retry counter and trigger fetch
    setState((prev) => ({ ...prev, retries: 0 }));
    hasTriggeredRef.current = false;
    void executeFetch("retry");
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
    setState({
      data: null,
      loading: false,
      error: null,
      triggered: false,
      retries: 0,
      isRetryPending: false,
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
        timeoutRef.current = null;
      }
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
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
    retry,
  };
}

/**
 * Hook für einfaches deferred loading mit häufigen Defaults und verbesserten Zuständen
 */
export function useEnhancedDeferredLoad<T>(fetchFn: () => Promise<T>, deps?: React.DependencyList) {
  return useEnhancedDeferredFetch({
    fetchFn,
    immediate: false,
    maxDelay: 3000,
    triggerEvents: ["focus", "click"],
    deps,
    maxRetries: 2,
  });
}

/**
 * Hook für cached data mit sofortigem Fallback und verbesserter Fehlerbehandlung
 */
export function useEnhancedDeferredCachedFetch<T>(
  fetchFn: () => Promise<T>,
  checkCacheFn?: () => T | null,
  deps?: React.DependencyList,
) {
  const hasCachedData = checkCacheFn ? !!checkCacheFn() : false;

  return useEnhancedDeferredFetch({
    fetchFn,
    immediate: hasCachedData, // Nur sofort laden wenn Cache da ist
    maxDelay: hasCachedData ? 1000 : 5000, // Kürzere Verzögerung wenn gecacht
    triggerEvents: ["focus", "click", "scroll"],
    deps,
    maxRetries: hasCachedData ? 1 : 3, // Fewer retries if we have cached data as fallback
  });
}
