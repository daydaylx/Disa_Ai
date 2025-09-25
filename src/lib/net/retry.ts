/**
 * Configuration options for retry logic
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 4) */
  maxRetries?: number;
  /** Base delay in milliseconds for exponential backoff (default: 250) */
  baseDelayMs?: number;
  /** Maximum delay in milliseconds (default: 6000) */
  maxDelayMs?: number;
  /** Function to determine if a response should be retried (default: retry on 5xx and 429) */
  retryOn?: (res: Response) => boolean;
  /** AbortSignal to cancel the retry operation */
  abortSignal?: AbortSignal;
}

/**
 * Creates a Promise that resolves after a specified delay, with abort support
 *
 * @param ms - Delay in milliseconds
 * @param signal - Optional AbortSignal to cancel the sleep
 */
function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal.aborted) onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

/**
 * Parses the HTTP Retry-After header and converts it to milliseconds
 *
 * @param header - The Retry-After header value (seconds or HTTP date)
 * @returns Delay in milliseconds, or null if invalid
 */
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

/**
 * Calculates exponential backoff delay with full jitter (AWS recommendation)
 *
 * @param attempt - Current attempt number (0-based)
 * @param base - Base delay in milliseconds
 * @param cap - Maximum delay cap in milliseconds
 * @returns Random delay between 0 and calculated exponential value
 */
function backoffDelay(attempt: number, base: number, cap: number): number {
  const exp = Math.min(cap, base * 2 ** attempt);
  return Math.floor(Math.random() * exp);
}

/**
 * Performs HTTP requests with automatic retry logic and exponential backoff
 *
 * This function automatically retries failed requests using exponential backoff
 * with full jitter. It respects HTTP Retry-After headers and supports abort signals.
 *
 * @param input - The request URL or Request object
 * @param init - RequestInit options for the fetch
 * @param opts - Retry configuration options
 * @returns Promise resolving to the final Response
 *
 * @example
 * ```typescript
 * // Basic usage with default retry logic (retry on 5xx and 429)
 * const response = await fetchWithRetry('/api/data');
 *
 * // Custom retry configuration
 * const response = await fetchWithRetry('/api/data', {
 *   method: 'POST',
 *   body: JSON.stringify(data)
 * }, {
 *   maxRetries: 3,
 *   baseDelayMs: 500,
 *   retryOn: (res) => res.status >= 400
 * });
 * ```
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  opts: RetryOptions = {},
): Promise<Response> {
  const {
    maxRetries = 4,
    baseDelayMs = 250,
    maxDelayMs = 6000,
    retryOn = (res) => res.status >= 500 || res.status === 429,
    abortSignal,
  } = opts;

  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError");

    try {
      const controller = new AbortController();
      if (abortSignal) {
        const onAbort = () => controller.abort();
        if (abortSignal.aborted) onAbort();
        abortSignal.addEventListener("abort", onAbort, { once: true });
      }

      const res = await fetch(input, { ...init, signal: controller.signal });

      if (!retryOn(res)) return res;

      // Retry on 429/5xx status codes
      if (attempt < maxRetries) {
        const retryAfter = parseRetryAfter(res.headers.get("retry-after"));
        const delay = retryAfter ?? backoffDelay(attempt, baseDelayMs, maxDelayMs);
        await sleep(delay, abortSignal);
        continue;
      } else {
        return res; // Return final response even on error (caller decides how to handle)
      }
    } catch (err: any) {
      lastErr = err;
      // Network errors: only retry if we have attempts left and not aborted
      if (err?.name === "AbortError") throw err;
      if (attempt < maxRetries) {
        const delay = backoffDelay(attempt, baseDelayMs, maxDelayMs);
        await sleep(delay, abortSignal);
        continue;
      }
      throw err;
    }
  }

  // This should never be reached due to the loop logic
  throw lastErr ?? new Error("Unbekannter Fehler in fetchWithRetry");
}
