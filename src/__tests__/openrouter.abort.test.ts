import { describe, expect, it, vi } from "vitest";

import { chatStream } from "../api/openrouter";
import { AbortError } from "../lib/errors";

describe("openrouter chatStream abort", () => {
  it("bricht sauber mit AbortError ab", async () => {
    // @ts-expect-error stub fetch
    global.fetch = vi.fn(async (_url: string, init: RequestInit = {}) => {
      const signal = init.signal as AbortSignal | undefined;
      await new Promise((_resolve, reject) => {
        const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
        if (signal?.aborted) return onAbort();
        signal?.addEventListener("abort", onAbort, { once: true });
      });
      return new Response(); // This part is not reached
    });

    const ac = new AbortController();
    const p = chatStream([{ role: "user", content: "Ping" }], () => {}, { signal: ac.signal });
    ac.abort();
    await expect(p).rejects.toThrow(AbortError);
  });
});
