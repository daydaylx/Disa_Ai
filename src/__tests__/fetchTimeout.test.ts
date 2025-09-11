import { fetchWithTimeout } from "../lib/net/fetchWithTimeout";

describe("fetchWithTimeout", () => {
  it("aborts when timeout elapses", async () => {
    const p = fetchWithTimeout("https://example.invalid/never", {
      method: "GET",
      timeoutMs: 1
    });
    await expect(p).rejects.toThrow(/Request timeout/);
  });
});