import { describe, it, expect, vi } from "vitest";
import { TokenBucket } from "../../src/lib/net/rateLimit";

describe("TokenBucket", () => {
  it("nimmt Tokens bis Kapazität und blockt dann", () => {
    const b = new TokenBucket(2, 1);
    expect(b.tryTake()).toBe(true);
    expect(b.tryTake()).toBe(true);
    expect(b.tryTake()).toBe(false);
    const ttn = b.timeToNextMs();
    expect(ttn).toBeGreaterThan(0);
    expect(ttn).toBeLessThanOrEqual(1100); // ~1s, leichtes Polster
  });

  it("refillt über Zeit korrekt", async () => {
    vi.useFakeTimers();
    const b = new TokenBucket(1, 2); // 2 Tokens/Sekunde
    expect(b.tryTake()).toBe(true);
    expect(b.tryTake()).toBe(false);
    vi.advanceTimersByTime(600); // ~1.2 Tokens refill
    expect(b.tryTake()).toBe(true);
    vi.useRealTimers();
  });
});
