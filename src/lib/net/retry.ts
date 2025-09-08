/* eslint-disable no-undef */
export interface RetryOptions {
  maxRetries?: number; // z.B. 4
  baseDelayMs?: number; // z.B. 250
  maxDelayMs?: number; // z.B. 6000
  retryOn?: (res: Response) => boolean;
  abortSignal?: AbortSignal;
}

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

/** Liest `Retry-After` als Sekunden (oder Date) und gibt Millisekunden zurück. */
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

/** Exponential-Backoff mit vollem Jitter (AWS-Empfehlung). */
function backoffDelay(attempt: number, base: number, cap: number): number {
  const exp = Math.min(cap, base * 2 ** attempt);
  return Math.floor(Math.random() * exp);
}

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

      // 429/5xx → evtl. Retry
      if (attempt < maxRetries) {
        const retryAfter = parseRetryAfter(res.headers.get("retry-after"));
        const delay = retryAfter ?? backoffDelay(attempt, baseDelayMs, maxDelayMs);
        await sleep(delay, abortSignal);
        continue;
      } else {
        return res; // letzte Antwort trotz Fehler zurückgeben (Aufrufer entscheidet)
      }
    } catch (err: any) {
      lastErr = err;
      // Netzwerkfehler: nur retryen, wenn wir noch Versuche haben und nicht abgebrochen wurde
      if (err?.name === "AbortError") throw err;
      if (attempt < maxRetries) {
        const delay = backoffDelay(attempt, baseDelayMs, maxDelayMs);
        await sleep(delay, abortSignal);
        continue;
      }
      throw err;
    }
  }

  // sollte nie erreicht werden
  throw lastErr ?? new Error("Unbekannter Fehler in fetchWithRetry");
}
