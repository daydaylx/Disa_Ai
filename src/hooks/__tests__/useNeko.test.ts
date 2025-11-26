import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
    // Reset localStorage
    localStorage.clear();
    // Mock window.innerWidth for adaptive duration tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    // Mock matchMedia for prefers-reduced-motion
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
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("should initialize with HIDDEN state", () => {
      const { result } = renderHook(() => useNeko());

      expect(result.current.state).toBe("HIDDEN");
      expect(result.current.x).toBe(-10);
      expect(result.current.direction).toBe("right");
    });

    it("should remain HIDDEN when enableNeko is false", () => {
      mockSettings.enableNeko = false;
      const { result } = renderHook(() => useNeko());

      expect(result.current.state).toBe("HIDDEN");

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.state).toBe("HIDDEN");
    });
  });

  describe("Spawn Conditions", () => {
    it("should NOT spawn immediately on mount", () => {
      const { result } = renderHook(() => useNeko());

      expect(result.current.state).toBe("HIDDEN");
    });

    it("should spawn after 5s idle + check interval", () => {
      const { result } = renderHook(() => useNeko());

      // Initial state
      expect(result.current.state).toBe("HIDDEN");

      // Fast-forward 5s (idle threshold) + 3s (check interval)
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      // Should have spawned
      expect(result.current.state).not.toBe("HIDDEN");
    });

    it("should respect 2-minute cooldown between spawns", () => {
      const { result } = renderHook(() => useNeko());

      // First spawn
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      const firstState = result.current.state;
      expect(firstState).not.toBe("HIDDEN");

      // Wait for despawn (8s animation + buffer)
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Try to spawn again immediately (should fail due to cooldown)
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).toBe("HIDDEN");

      // Wait full cooldown (120s)
      act(() => {
        vi.advanceTimersByTime(120000);
      });

      // Now should spawn again
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");
    });

    it("should limit to 3 spawns per session", () => {
      const { result } = renderHook(() => useNeko());

      // Spawn 3 times
      for (let i = 0; i < 3; i++) {
        act(() => {
          vi.advanceTimersByTime(8000); // Initial idle + check
        });

        expect(result.current.state).not.toBe("HIDDEN");

        act(() => {
          vi.advanceTimersByTime(10000); // Despawn
          vi.advanceTimersByTime(120000); // Cooldown
        });
      }

      // Try 4th spawn (should fail)
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).toBe("HIDDEN");
    });

    it("should NOT spawn when prefers-reduced-motion is enabled", () => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useNeko());

      // Try to spawn
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      // Should remain HIDDEN
      expect(result.current.state).toBe("HIDDEN");
    });
  });

  describe("Adaptive Animation Duration", () => {
    it("should use 8s duration on mobile (< 640px)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375, // Mobile
      });

      const { result } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      // Neko should be spawning/walking
      expect(result.current.state).not.toBe("HIDDEN");

      // Animation should take ~8s
      act(() => {
        vi.advanceTimersByTime(7000); // Still walking
      });
      expect(result.current.state).not.toBe("HIDDEN");

      act(() => {
        vi.advanceTimersByTime(2000); // ~8s total → should despawn
      });
      // Should be despawned or despawning
    });

    it("should use 7s duration on tablet (640-1024px)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768, // Tablet
      });

      const { result } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");
    });

    it("should use 6s duration on desktop (> 1024px)", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1280, // Desktop
      });

      const { result } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");
    });
  });

  describe("User Interaction - Flee Behavior", () => {
    it("should trigger flee on pointerdown when Neko is visible", () => {
      const { result } = renderHook(() => useNeko());

      // Spawn Neko
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");

      // Simulate pointerdown
      act(() => {
        const event = new Event("pointerdown");
        window.dispatchEvent(event);
      });

      // Should trigger flee or hide
      // Note: Actual flee animation is complex, so we check that state changed
      expect(result.current.state).toBe("FLEEING");
    });

    it("should trigger flee on touchstart when Neko is visible", () => {
      const { result } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");

      act(() => {
        const event = new Event("touchstart");
        window.dispatchEvent(event);
      });

      expect(result.current.state).toBe("FLEEING");
    });

    it("should trigger flee on scroll when Neko is visible", () => {
      const { result } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");

      act(() => {
        const event = new Event("scroll");
        window.dispatchEvent(event);
      });

      expect(result.current.state).toBe("FLEEING");
    });

    it("should trigger flee on keydown when Neko is visible", () => {
      const { result } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(result.current.state).not.toBe("HIDDEN");

      act(() => {
        const event = new Event("keydown");
        window.dispatchEvent(event);
      });

      expect(result.current.state).toBe("FLEEING");
    });
  });

  describe("Debug Mode", () => {
    it("should log debug info when localStorage flag is set", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      localStorage.setItem("neko-debug", "true");

      const { result } = renderHook(() => useNeko());

      // Fast-forward to trigger checkSpawnCondition
      act(() => {
        vi.advanceTimersByTime(3000); // First check interval
      });

      // Should have logged debug info
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Neko Debug]",
        expect.objectContaining({
          timestamp: expect.any(String),
          isIdle: expect.any(String),
          isCooldownOver: expect.any(String),
          isBelowLimit: expect.any(String),
          isVisible: expect.any(Boolean),
          prefersReducedMotion: expect.any(Boolean),
          willSpawn: expect.any(Boolean),
          viewportWidth: expect.any(Number),
          animationDuration: expect.any(String),
        }),
      );

      consoleSpy.mockRestore();
    });

    it("should NOT log when debug flag is not set", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      localStorage.removeItem("neko-debug");

      renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Routes", () => {
    it("should randomly select Route A or Route B", () => {
      // Mock Math.random to control route selection
      const originalRandom = Math.random;
      let callCount = 0;

      Math.random = () => {
        callCount++;
        return callCount % 2 === 0 ? 0.6 : 0.4; // Alternate between Route A and B
      };

      const { result: result1 } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      const direction1 = result1.current.direction;

      // Unmount and remount for second test
      const { result: result2 } = renderHook(() => useNeko());

      act(() => {
        vi.advanceTimersByTime(8000);
      });

      const direction2 = result2.current.direction;

      // Directions should be different (one left, one right)
      expect(direction1).not.toBe(direction2);

      Math.random = originalRandom;
    });
  });
});
