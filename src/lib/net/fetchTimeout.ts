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

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

  const combinedController = new AbortController();
  const cleanup = () => clearTimeout(timeoutId);

  const abortBoth = () => {
    cleanup();
    combinedController.abort();
  };

  if (userSignal) {
    if (userSignal.aborted) {
      cleanup();
      throw new AbortError();
    }
    userSignal.addEventListener("abort", abortBoth, { once: true });
  }

  timeoutController.signal.addEventListener("abort", abortBoth, { once: true });

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: combinedController.signal,
    });
    cleanup();
    return response;
  } catch (error) {
    cleanup();
    if (error instanceof DOMException && error.name === "AbortError") {
      if (timeoutController.signal.aborted && !userSignal?.aborted) {
        throw new TimeoutError(`Request timeout after ${timeoutMs}ms`, { cause: error });
      }
      if (userSignal?.aborted) {
        throw new AbortError();
      }
    }
    // Für andere Fehler (z.B. TypeError bei Netzwerkproblemen) den Mapper verwenden
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

      if (!response.ok && !retryOn(response)) {
        return response;
      }

      if (response.ok || attempt === maxRetries) {
        return response;
      }

      response.body?.cancel();
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
