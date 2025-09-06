import { describe, expect, it } from "vitest";

import { fetchWithTimeout } from "../lib/net/fetchTimeout";

describe("fetchWithTimeout", () => {
  it("aborts when timeout elapses", async () => {
    const p = fetchWithTimeout("https://example.invalid/never", { method: "GET" }, 1);
    await expect(p).rejects.toMatchObject({ name: "AbortError" });
  });
});
 
