import { mapError } from "../lib/errors/mapper";

export interface FetchJsonOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
  retries?: number;
  retryOn?: number[];
  signal?: AbortSignal;
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

  const requestHeaders: Record<string, string> = { ...headers };

  if (body && typeof body === "object" && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const requestBody = body && typeof body === "object" ? JSON.stringify(body) : body;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const abortForwarder = () => controller.abort();

    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeoutId);
        throw mapError(new DOMException("Aborted", "AbortError"));
      }
      signal.addEventListener("abort", abortForwarder, { once: true });
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (signal) {
        signal.removeEventListener("abort", abortForwarder);
      }

      if (!response.ok) {
        if (attempt === retries || !retryOn.includes(response.status)) {
          throw mapError(response);
        }
      } else {
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
      if (signal) {
        signal.removeEventListener("abort", abortForwarder);
      }
      if (attempt === retries) {
        throw mapError(error);
      }
    }

    if (attempt < retries) {
      const delay = calculateRetryDelay(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw mapError(new Error("All retries exhausted"));
}

function calculateRetryDelay(attempt: number, baseDelay = 300): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5) * 2;
  return Math.max(0, exponentialDelay + jitter);
}
