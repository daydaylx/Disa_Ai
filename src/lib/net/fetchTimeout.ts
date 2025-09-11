/**
 * Robust fetch wrapper with timeout and abort support
 * Handles network failures, timeouts, and request cancellation
 */

export interface FetchWithTimeoutOptions {
  /** Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
  /** Optional AbortSignal to cancel the request */
  signal?: AbortSignal;
  /** Fetch options */
  fetchOptions?: Omit<globalThis.RequestInit, 'signal'>;
}

/**
 * Fetch with automatic timeout and abort support
 * Combines user AbortSignal with internal timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const { timeoutMs = 30000, signal: userSignal, fetchOptions = {} } = options;
  
  // Create timeout controller
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, timeoutMs);

  // Combine user signal and timeout signal
  const combinedController = new AbortController();
  
  const cleanup = () => {
    clearTimeout(timeoutId);
  };

  // If either signal aborts, abort the combined controller
  const abortBoth = () => {
    cleanup();
    combinedController.abort();
  };

  if (userSignal) {
    if (userSignal.aborted) {
      cleanup();
      throw new DOMException("Request was aborted", "AbortError");
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
    
    // Convert timeout abort to timeout error
    if (error instanceof DOMException && error.name === "AbortError") {
      if (timeoutController.signal.aborted && !userSignal?.aborted) {
        throw new Error(`Request timeout after ${timeoutMs}ms`);
      }
    }
    
    throw error;
  }
}

/**
 * Fetch with retry logic and timeout
 * Automatically retries on network errors and 5xx/429 responses
 */
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

  let lastError: Error;
  let delayMs = retryDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);
      
      // If response is not ok but we shouldn't retry, return it
      if (!response.ok && !retryOn(response)) {
        return response;
      }
      
      // If response is ok or we've exhausted retries, return it
      if (response.ok || attempt === maxRetries) {
        return response;
      }
      
      // Clone response for retry logic (body can only be read once)
      response.body?.cancel();
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on user abort
      if (lastError.name === "AbortError" && fetchOptions.signal?.aborted) {
        throw lastError;
      }
      
      // If we've exhausted retries, throw the last error
      if (attempt === maxRetries) {
        throw lastError;
      }
    }

    // Wait before retry (unless user aborted)
    if (fetchOptions.signal?.aborted) {
      throw new DOMException("Request was aborted", "AbortError");
    }

    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, delayMs);
      
      if (fetchOptions.signal) {
        const onAbort = () => {
          clearTimeout(timeoutId);
          reject(new DOMException("Request was aborted", "AbortError"));
        };
        
        if (fetchOptions.signal.aborted) {
          clearTimeout(timeoutId);
          reject(new DOMException("Request was aborted", "AbortError"));
          return;
        }
        
        fetchOptions.signal.addEventListener("abort", onAbort, { once: true });
      }
    });

    delayMs *= retryBackoffMultiplier;
  }

  throw lastError!;
}