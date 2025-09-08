type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

export async function fetchWithTimeout(
  input: FetchInput,
  init: FetchInit = {},
  timeoutMs = 60000,
  abortSignal?: AbortSignal,
): Promise<Response> {
  const ctrl = new AbortController();
  if (abortSignal) {
    const onAbort = () => ctrl.abort();
    if (abortSignal.aborted) onAbort();
    abortSignal.addEventListener("abort", onAbort, { once: true });
  }
  const timer = setTimeout(() => ctrl.abort(new DOMException("Aborted", "AbortError")), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}
