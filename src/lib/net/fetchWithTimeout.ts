export type FetchWithTimeoutOptions = globalThis.RequestInit & {
  timeoutMs?: number;
};

/**
 * fetchWithTimeout
 * - Bricht Request nach timeoutMs mittels AbortController ab
 * - Wirft bei Timeout: Error("Request timeout after <ms>ms")
 * - Sonst identisch zu fetch
 */
export async function fetchWithTimeout(
  input: globalThis.RequestInfo | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs, signal, ...init } = options;

  if (!timeoutMs || timeoutMs <= 0) {
    return fetch(input, { ...init, signal });
  }

  const ac = new AbortController();
  const onAbort = () => ac.abort();
  if (signal) {
    if ((signal as any).aborted) ac.abort();
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  const timer = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const res = await fetch(input, { ...init, signal: ac.signal });
    clearTimeout(timer);
    (signal as any)?.removeEventListener?.("abort", onAbort);
    return res;
  } catch (err: any) {
    clearTimeout(timer);
    (signal as any)?.removeEventListener?.("abort", onAbort);

    if (err && (err.name === "AbortError" || err.code === "ABORT_ERR" || err.message === "This operation was aborted")) {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw err;
  }
}