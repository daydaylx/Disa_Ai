import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TimeoutError } from "../lib/errors";
import { fetchWithTimeout } from "../lib/net/fetchTimeout";

describe("fetchWithTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sollte bei einem Timeout einen TimeoutError werfen", async () => {
    const timeoutPromise = fetchWithTimeout("https://example.com", { timeoutMs: 5000 });

    // Timer vorrücken
    vi.advanceTimersByTime(5001);

    await expect(timeoutPromise).rejects.toThrow(TimeoutError);
  });
});
