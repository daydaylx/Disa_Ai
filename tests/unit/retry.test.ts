import { describe, it, expect, vi } from "vitest";
import { fetchWithRetry } from "../../src/lib/net/retry";

function makeResponse(status: number, headers: Record<string,string> = {}) {
  return new Response("X", { status, headers });
}

describe("fetchWithRetry", () => {
  it("retryt bei 500 und succeedet beim zweiten Versuch", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, "fetch" as any)
      .mockResolvedValueOnce(makeResponse(500))
      .mockResolvedValueOnce(makeResponse(200));
    const p = fetchWithRetry("https://x.test", {}, { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 2 });
    await vi.advanceTimersByTimeAsync(2);
    const res = await p;
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    fetchSpy.mockRestore();
    vi.useRealTimers();
  });

  it("achtet Retry-After bei 429", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, "fetch" as any)
      .mockResolvedValueOnce(makeResponse(429, { "retry-after": "1" }))
      .mockResolvedValueOnce(makeResponse(200));
    const p = fetchWithRetry("https://x.test", {}, { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 2 });
    await vi.advanceTimersByTimeAsync(1000);
    const res = await p;
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    fetchSpy.mockRestore();
    vi.useRealTimers();
  });

  it("abbricht sauber per AbortSignal", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch" as any).mockImplementation((_input: any, init: RequestInit = {}) => {
      const signal = init.signal as AbortSignal | undefined;
      return new Promise<Response>((_resolve, reject) => {
        if (signal?.aborted) {
          return reject(new DOMException("Aborted", "AbortError"));
        }
        const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
        signal?.addEventListener("abort", onAbort, { once: true });
        // nie resolve – Test triggert abort
      });
    });

    const ac = new AbortController();
    const p = fetchWithRetry("https://x.test", {}, { abortSignal: ac.signal, maxRetries: 0 });
    ac.abort();

    await expect(p).rejects.toMatchObject({ name: "AbortError" });
    fetchSpy.mockRestore();
  });
});
