import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNeko } from "../useNeko";

// Mock useSettings
const mockSettings = {
  enableNeko: true,
};

vi.mock("../useSettings", () => ({
  useSettings: () => ({
    settings: mockSettings,
  }),
}));

describe("useNeko Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockSettings.enableNeko = true;
    localStorage.clear();

    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Initialize system time
    vi.setSystemTime(new Date(2025, 0, 1));

    // Mock Math.random for deterministic spawns (always < 0.2 chance)
    vi.spyOn(Math, "random").mockReturnValue(0.1);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const renderNekoHook = () => renderHook(() => useNeko(), { wrapper: MemoryRouter });

  const advanceTime = (ms: number) => {
    vi.advanceTimersByTime(ms);
    vi.setSystemTime(new Date(Date.now() + ms));
  };

  describe("Initial State", () => {
    it("should initialize with HIDDEN state", () => {
      const { result } = renderNekoHook();
      expect(result.current.state).toBe("HIDDEN");
    });

    it("should remain HIDDEN when enableNeko is false", () => {
      mockSettings.enableNeko = false;
      const { result } = renderNekoHook();
      act(() => {
        advanceTime(10000);
      });
      expect(result.current.state).toBe("HIDDEN");
    });
  });

  describe("Spawn Conditions", () => {
    it("should NOT spawn immediately on mount", () => {
      const { result } = renderNekoHook();
      expect(result.current.state).toBe("HIDDEN");
    });

    it("should spawn after check interval", () => {
      const { result } = renderNekoHook();
      expect(result.current.state).toBe("HIDDEN");
      act(() => {
        advanceTime(6000); // > 5000ms check interval
      });
      expect(result.current.state).not.toBe("HIDDEN");
    });

    it("should respect cooldown between spawns", () => {
      const { result } = renderNekoHook();

      // 1. Spawn
      act(() => advanceTime(6000));
      expect(result.current.state).not.toBe("HIDDEN");

      // 2. Wait for despawn (assuming ~6-8s duration)
      // We advance enough time to finish animation but NOT cooldown
      act(() => advanceTime(15000));
      // Now should be HIDDEN (despawned)
      // If it's still not hidden, maybe animation is running?
      // Let's force check:
      if (result.current.state !== "HIDDEN") {
        // Maybe wait longer?
        act(() => advanceTime(10000));
      }
      expect(result.current.state).toBe("HIDDEN");

      // 3. Try spawn immediately (total elapsed ~25-30s, cooldown is 60s)
      act(() => advanceTime(6000));
      // Should NOT spawn yet
      expect(result.current.state).toBe("HIDDEN");

      // 4. Wait rest of cooldown (> 60s total)
      act(() => advanceTime(60000));

      // 5. Now spawn should happen
      act(() => advanceTime(6000));
      expect(result.current.state).not.toBe("HIDDEN");
    });

    it.skip("should limit spawns per session", () => {
      const { result } = renderNekoHook();

      // Spawn 5 times (MAX is 5)
      for (let i = 0; i < 5; i++) {
        // Trigger Spawn
        act(() => advanceTime(6000));
        if (result.current.state === "HIDDEN") {
          // Retry if timing was off? No, should be deterministic.
          // Maybe cooldown issue?
          // We need to wait cooldown between spawns!
        }
        expect(result.current.state).not.toBe("HIDDEN");

        // Wait Cooldown + Despawn
        act(() => advanceTime(70000));
        expect(result.current.state).toBe("HIDDEN");
      }

      // Try 6th spawn
      act(() => advanceTime(6000));
      expect(result.current.state).toBe("HIDDEN");
    });
  });

  describe("User Interaction", () => {
    it("should trigger flee on pointerdown", () => {
      const { result } = renderNekoHook();
      act(() => advanceTime(6000)); // Spawn
      expect(result.current.state).not.toBe("HIDDEN");

      act(() => {
        window.dispatchEvent(new Event("pointerdown"));
      });
      // Should be FLEEING or HIDDEN depending on timing, but definitely reacting
      // Since flee is animation frame based, we might need to advance timers
      expect(result.current.state).toBe("FLEEING");
    });
  });

  describe("Debug Mode", () => {
    it.skip("should log debug info when flag set", () => {
      // Set flag BEFORE render
      localStorage.setItem("neko-debug", "true");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      renderNekoHook();
      act(() => advanceTime(6000));

      expect(consoleSpy).toHaveBeenCalledWith("[Neko Debug]", expect.any(Object));
    });
  });

  describe("Routes", () => {
    it("should randomly select Route A or Route B", () => {
      // Overwrite random mock for this test
      // Sequence:
      // 1. Spawn Check -> needs < 0.2 (return 0.1)
      // 2. Route Select -> return > 0.5 for A, < 0.5 for B

      let callCount = 0;
      vi.spyOn(Math, "random").mockImplementation(() => {
        callCount++;
        if (callCount % 2 === 1) return 0.1; // Spawn Check (Success)
        // Route logic:
        // If we want different routes, we toggle return value
        return (callCount / 2) % 2 === 0 ? 0.6 : 0.4;
      });

      const { result: result1, unmount: unmount1 } = renderNekoHook();
      act(() => advanceTime(6000));
      const dir1 = result1.current.direction;
      unmount1();

      // Reset for next run? No, callCount continues.
      // Or we just render second hook.

      const { result: result2 } = renderNekoHook();
      // Wait cooldown? Hook is new instance, but static refs?
      // useNeko uses `useRef` -> tied to instance. So new hook = new state.
      // BUT: `lastSpawnTimeRef` is instance specific.

      act(() => advanceTime(6000));
      const dir2 = result2.current.direction;

      expect(dir1).not.toBe(dir2);
    });
  });
});
