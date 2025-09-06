export async function fetchWithTimeout(
  input: any,
  init: any = {},
  timeoutMs = 60000,
  abortSignal?: AbortSignal,
): Promise<Response> {
  const ctrl = new AbortController();
  if (abortSignal) {
    const onAbort = () => ctrl.abort(abortSignal.reason as any);
    if (abortSignal.aborted) onAbort();
    abortSignal.addEventListener("abort", onAbort, { once: true });
  }
  const timer = setTimeout(() => ctrl.abort(new DOMException("Aborted", "AbortError") as any), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}
