import { AbortError, mapError, TimeoutError } from "../errors";

export interface FetchWithTimeoutOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  fetchOptions?: Omit<globalThis.RequestInit, "signal">;
}

export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const { timeoutMs = 30000, signal: userSignal, fetchOptions = {} } = options;

  const combinedController = new AbortController();

  let timeoutId: NodeJS.Timeout | null = null;
  let isTimeout = false;
  let isUserAbort = false;

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const abortBoth = (reason: "timeout" | "user") => {
    cleanup();
    if (reason === "timeout") isTimeout = true;
    if (reason === "user") isUserAbort = true;
    combinedController.abort();
  };

  // Check if user signal is already aborted
  if (userSignal?.aborted) {
    cleanup();
    throw new AbortError();
  }

  // Set up timeout
  timeoutId = setTimeout(() => abortBoth("timeout"), timeoutMs);

  // Set up user signal listener
  if (userSignal) {
    userSignal.addEventListener("abort", () => abortBoth("user"), { once: true });
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: combinedController.signal,
    });
    cleanup();
    return response;
  } catch (error) {
    cleanup();

    // Handle abort errors with proper priority
    if (error instanceof DOMException && error.name === "AbortError") {
      // User abort takes priority over timeout
      if (isUserAbort) {
        throw new AbortError();
      }
      if (isTimeout) {
        throw new TimeoutError(`Request timeout after ${timeoutMs}ms`, { cause: error });
      }
      // Fallback for other abort scenarios
      throw new AbortError();
    }

    // For other errors (e.g., TypeError for network problems) use the mapper
    throw mapError(error);
  }
}

export async function fetchWithTimeoutAndRetry(
  url: string,
  options: FetchWithTimeoutOptions & {
    maxRetries?: number;
    retryDelayMs?: number;
    retryBackoffMultiplier?: number;
    retryOn?: (response: Response) => boolean;
  } = {},
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelayMs = 1000,
    retryBackoffMultiplier = 2,
    retryOn = (res) => res.status === 429 || (res.status >= 500 && res.status < 600),
    ...fetchOptions
  } = options;

  let lastError: unknown;
  let delayMs = retryDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);

      if (!response.ok) {
        if (!retryOn(response)) {
          return response;
        }

        const retryAfterMs = parseRetryAfterHeader(response.headers);
        if (retryAfterMs !== undefined) {
          delayMs = Math.max(delayMs, retryAfterMs);
        }
      }

      if (response.ok || attempt === maxRetries) {
        return response;
      }

      void response.body?.cancel();
    } catch (error) {
      lastError = error;

      if (error instanceof AbortError) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw mapError(lastError);
      }
    }

    if (fetchOptions.signal?.aborted) {
      throw new AbortError();
    }

    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, delayMs);
      const onAbort = () => {
        clearTimeout(timeoutId);
        reject(new AbortError());
      };

      if (fetchOptions.signal) {
        if (fetchOptions.signal.aborted) {
          onAbort();
          return;
        }
        fetchOptions.signal.addEventListener("abort", onAbort, { once: true });
      }
    });

    delayMs *= retryBackoffMultiplier;
  }

  throw mapError(lastError);
}

function parseRetryAfterHeader(headers: Headers): number | undefined {
  const raw = headers.get("retry-after");
  if (!raw) return undefined;

  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return Math.ceil(numeric * 1000);
  }

  const absolute = Date.parse(raw);
  if (Number.isNaN(absolute)) return undefined;

  const diff = absolute - Date.now();
  if (diff <= 0) return undefined;
  return diff;
}
