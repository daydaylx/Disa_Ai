/**
 * HTTP wrapper with timeout, retries (exponential backoff + jitter), and cancellation
 *
 * Example usage with navigation cancellation:
 * ```ts
 * const controller = new AbortController();
 *
 * // Cancel on navigation
 * const cleanup = () => controller.abort();
 * window.addEventListener('beforeunload', cleanup);
 *
 * try {
 *   const data = await fetchJson('/api/data', {
 *     signal: controller.signal,
 *     timeoutMs: 5000
 *   });
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     console.log('Request cancelled');
 *   }
 * } finally {
 *   window.removeEventListener('beforeunload', cleanup);
 * }
 * ```
 */

export interface HttpError extends Error {
  name: string;
  message: string;
  status?: number;
  retriable?: boolean;
  cause?: any;
}

export interface FetchJsonOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
  retries?: number;
  retryOn?: number[];
  signal?: AbortSignal;
}

function createHttpError(
  name: string,
  message: string,
  status?: number,
  retriable = false,
  cause?: any,
): HttpError {
  const error = new Error(message) as HttpError;
  error.name = name;
  error.status = status;
  error.retriable = retriable;
  error.cause = cause;
  return error;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createHttpError("AbortError", "Request was aborted"));
      return;
    }

    const timeoutId = setTimeout(resolve, ms);

    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(createHttpError("AbortError", "Request was aborted"));
      });
    }
  });
}

function calculateRetryDelay(attempt: number, baseDelay = 300): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);

  // Add jitter: ±20%
  const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5) * 2;

  return Math.max(0, exponentialDelay + jitter);
}

export async function fetchJson<T = any>(url: string, opts: FetchJsonOptions = {}): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    timeoutMs = 10000,
    retries = 2,
    retryOn = [408, 429, 500, 502, 503, 504],
    signal,
  } = opts;

  // Create combined abort controller for timeout and external cancellation
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestHeaders: Record<string, string> = { ...headers };

  // Auto-set Content-Type for JSON body
  if (body && typeof body === "object" && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const requestBody = body && typeof body === "object" ? JSON.stringify(body) : body;

  let lastError: HttpError | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (signal?.aborted) {
        throw createHttpError("AbortError", "Request was aborted");
      }

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const isRetriable = retryOn.includes(response.status);
        const error = createHttpError(
          "HttpError",
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          isRetriable,
        );

        if (!isRetriable || attempt === retries) {
          throw error;
        }

        lastError = error;
      } else {
        // Success - parse response
        const contentType = response.headers.get("Content-Type") || "";

        if (contentType.includes("application/json")) {
          return await response.json();
        } else {
          const text = await response.text();
          return text ? JSON.parse(text) : ({} as T);
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          const abortError = signal?.aborted
            ? createHttpError("AbortError", "Request was cancelled")
            : createHttpError("TimeoutError", `Request timeout after ${timeoutMs}ms`);
          throw abortError;
        }

        // Network errors (fetch throws TypeError for network issues)
        if (error.name === "TypeError") {
          const networkError = createHttpError(
            "NetworkError",
            "Network request failed",
            undefined,
            true,
            error,
          );

          if (attempt === retries) {
            throw networkError;
          }

          lastError = networkError;
        } else if (error.name === "HttpError" && (error as HttpError).retriable) {
          lastError = error as HttpError;
        } else {
          // Non-retriable error
          throw error;
        }
      } else {
        throw createHttpError("UnknownError", "Unknown error occurred", undefined, false, error);
      }
    }

    // Wait before retry (except on last attempt)
    if (attempt < retries) {
      const delay = calculateRetryDelay(attempt);
      await sleep(delay, signal);
    }
  }

  // All retries exhausted
  throw lastError || createHttpError("RetryError", "All retries exhausted");
}
