import { AbortError, mapError, TimeoutError } from "../errors";

export interface FetchOptions {
  timeoutMs?: number;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitterBackoff?: boolean;
  retryOn?: (response: Response) => boolean;
  signal?: AbortSignal;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => resolve(), ms);

    if (signal) {
      const onAbort = () => {
        clearTimeout(timeoutId);
        reject(new AbortError());
      };

      if (signal.aborted) {
        onAbort();
        return;
      }

      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;

  const asInt = parseInt(header, 10);
  if (Number.isFinite(asInt)) return Math.max(0, asInt) * 1000;

  const asDate = Date.parse(header);
  if (Number.isFinite(asDate)) {
    const diff = asDate - Date.now();
    return diff > 0 ? diff : 0;
  }

  return null;
}

function calculateBackoffDelay(
  attempt: number,
  baseMs: number,
  maxMs: number,
  useJitter: boolean,
): number {
  const exponential = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  return useJitter ? Math.floor(Math.random() * exponential) : exponential;
}

export async function fetchWithTimeoutAndRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: FetchOptions = {},
): Promise<Response> {
  const {
    timeoutMs = 30000,
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    jitterBackoff = true,
    retryOn = (res) => res.status === 429 || (res.status >= 500 && res.status < 600),
    signal: userSignal,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (userSignal?.aborted) {
      throw new AbortError();
    }

    // Timeout-Controller für diese Anfrage
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

    // Kombinierter Controller für User-Signal und Timeout
    const combinedController = new AbortController();

    const cleanup = () => {
      clearTimeout(timeoutId);
    };

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
      const response = await fetch(input, {
        ...init,
        signal: combinedController.signal,
      });

      cleanup();

      // Erfolgreich oder nicht retry-fähig
      if (response.ok || !retryOn(response) || attempt === maxRetries) {
        return response;
      }

      // Bei 429: Retry-After Header beachten
      if (response.status === 429) {
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        if (retryAfter !== null) {
          // Response body canceln für nächsten Versuch
          void response.body?.cancel();

          if (attempt < maxRetries) {
            if (userSignal?.aborted) {
              throw new AbortError();
            }
            await sleep(retryAfter, userSignal);
          }
          continue;
        }
      }

      // Response body canceln für nächsten Versuch
      void response.body?.cancel();
    } catch (error) {
      cleanup();
      lastError = error;

      // AbortError immer sofort werfen
      if (error instanceof DOMException && error.name === "AbortError") {
        if (timeoutController.signal.aborted && !userSignal?.aborted) {
          throw new TimeoutError(`Request timeout after ${timeoutMs}ms`, { cause: error });
        }
        if (userSignal?.aborted) {
          throw new AbortError();
        }
      }

      // Beim letzten Versuch: Fehler werfen
      if (attempt === maxRetries) {
        throw mapError(error);
      }
    }

    // Delay vor nächstem Versuch
    if (attempt < maxRetries) {
      if (userSignal?.aborted) {
        throw new AbortError();
      }

      let delayMs: number;

      delayMs = calculateBackoffDelay(attempt, baseDelayMs, maxDelayMs, jitterBackoff);

      await sleep(delayMs, userSignal);
    }
  }

  throw mapError(lastError);
}
