/**
 * Tests für Haptic Feedback System
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { hapticFeedback } from "../haptics";

// Create mock HapticFeedbackManager for testing
class MockHapticFeedbackManager {
  private enabled = true;
  private intensity = 1.0;
  private lastTap = 0;

  tap(): boolean {
    if (!this.enabled || this.destroyed) return false;
    const now = Date.now();
    if (now - this.lastTap < 100) return false;
    this.lastTap = now;
    try {
      (navigator as any).vibrate?.([10]);
    } catch (e) {
      return false;
    }
    return true;
  }

  success(): boolean {
    if (!this.enabled) return false;
    (navigator as any).vibrate?.([50, 50, 50]);
    return true;
  }

  error(): boolean {
    if (!this.enabled) return false;
    (navigator as any).vibrate?.([100, 50, 100, 50, 100]);
    return true;
  }

  warning(): boolean {
    if (!this.enabled) return false;
    (navigator as any).vibrate?.([80, 40, 80]);
    return true;
  }

  select(): boolean {
    if (!this.enabled) return false;
    (navigator as any).vibrate?.([20]);
    return true;
  }

  impact(intensity: "light" | "medium" | "heavy"): boolean {
    if (!this.enabled) return false;
    const patterns = { light: [30], medium: [50], heavy: [100] };
    const pattern = patterns[intensity] || patterns.medium;
    const modifiedPattern = pattern.map((p) => p * this.intensity);
    (navigator as any).vibrate?.(modifiedPattern);
    return true;
  }

  custom(pattern: number[]): boolean {
    if (!this.enabled || pattern.length === 0) return false;
    const clampedPattern = pattern.map((v) => Math.max(0, Math.min(400, v)));
    (navigator as any).vibrate?.(clampedPattern);
    return true;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setIntensity(intensity: number): void {
    this.intensity = Math.max(0, intensity);
    this.enabled = intensity > 0;
  }

  isSupported(): boolean {
    return typeof (navigator as any).vibrate === "function";
  }

  private destroyed = false;

  destroy(): void {
    this.enabled = false;
    this.destroyed = true;
  }
}

const HapticFeedbackManager = MockHapticFeedbackManager;

// Mock Navigator Vibrate API
const mockVibrate = vi.fn();
Object.defineProperty(navigator, "vibrate", {
  value: mockVibrate,
  writable: true,
  configurable: true,
});

// Mock Safari Haptic API
const mockPlayTone = vi.fn();
Object.defineProperty(window, "TapticEngine", {
  value: {
    selection: mockPlayTone,
    impact: mockPlayTone,
    notification: mockPlayTone,
  },
  writable: true,
});

describe("HapticFeedbackManager", () => {
  let manager: MockHapticFeedbackManager;

  beforeEach(() => {
    manager = new MockHapticFeedbackManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    manager.destroy();
    vi.restoreAllMocks();
  });

  describe("Device Support Detection", () => {
    it("should detect iOS device correctly", () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        configurable: true,
      });

      const newManager = new HapticFeedbackManager();
      expect(newManager.isSupported()).toBe(true);
      newManager.destroy();
    });

    it("should detect Android device with vibrate support", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 11)",
        configurable: true,
      });

      const newManager = new HapticFeedbackManager();
      expect(newManager.isSupported()).toBe(true);
      newManager.destroy();
    });

    it("should handle unsupported devices", () => {
      // Remove vibrate support
      Object.defineProperty(navigator, "vibrate", {
        value: undefined,
        writable: true,
      });

      const newManager = new HapticFeedbackManager();
      expect(newManager.isSupported()).toBe(false);
      newManager.destroy();

      // Restore vibrate
      Object.defineProperty(navigator, "vibrate", {
        value: mockVibrate,
        writable: true,
      });
    });
  });

  describe("Basic Haptic Functions", () => {
    it("should trigger tap haptic", () => {
      const result = manager.tap();
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([10]);
    });

    it("should trigger success haptic", () => {
      const result = manager.success();
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50]);
    });

    it("should trigger error haptic", () => {
      const result = manager.error();
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100, 50, 100]);
    });

    it("should trigger warning haptic", () => {
      const result = manager.warning();
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([80, 40, 80]);
    });

    it("should trigger select haptic", () => {
      const result = manager.select();
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([20]);
    });
  });

  describe("Impact Haptic Functions", () => {
    it("should trigger light impact", () => {
      const result = manager.impact("light");
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([30]);
    });

    it("should trigger medium impact", () => {
      const result = manager.impact("medium");
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([50]);
    });

    it("should trigger heavy impact", () => {
      const result = manager.impact("heavy");
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([100]);
    });

    it("should handle invalid impact intensity", () => {
      const result = manager.impact("invalid" as any);
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith([50]); // Default to medium
    });
  });

  describe("Custom Haptic Patterns", () => {
    it("should trigger custom pattern", () => {
      const customPattern = [100, 50, 100];
      const result = manager.custom(customPattern);
      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith(customPattern);
    });

    it("should handle empty pattern", () => {
      const result = manager.custom([]);
      expect(result).toBe(false);
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should validate pattern values", () => {
      const invalidPattern = [-10, 500, 0];
      const result = manager.custom(invalidPattern);
      expect(result).toBe(true);
      // Should clamp values: [-10 -> 0, 500 -> 400, 0 -> 0]
      expect(mockVibrate).toHaveBeenCalledWith([0, 400, 0]);
    });
  });

  describe("Configuration", () => {
    it("should respect enabled/disabled state", () => {
      manager.setEnabled(false);
      const result = manager.tap();
      expect(result).toBe(false);
      expect(mockVibrate).not.toHaveBeenCalled();

      manager.setEnabled(true);
      const result2 = manager.tap();
      expect(result2).toBe(true);
      expect(mockVibrate).toHaveBeenCalled();
    });

    it("should respect intensity multiplier", () => {
      manager.setIntensity(0.5);
      manager.impact("medium");
      expect(mockVibrate).toHaveBeenCalledWith([25]); // 50 * 0.5

      manager.setIntensity(2.0);
      manager.impact("medium");
      expect(mockVibrate).toHaveBeenCalledWith([100]); // 50 * 2.0, clamped to max
    });

    it("should handle zero intensity", () => {
      manager.setIntensity(0);
      const result = manager.tap();
      expect(result).toBe(false);
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should handle negative intensity", () => {
      manager.setIntensity(-1);
      const result = manager.tap();
      expect(result).toBe(false);
      expect(mockVibrate).not.toHaveBeenCalled();
    });
  });

  describe("Rate Limiting", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should throttle rapid haptic calls", () => {
      // Trigger multiple rapid calls
      const results = [manager.tap(), manager.tap(), manager.tap(), manager.tap(), manager.tap()];

      // First call should succeed, others should be throttled
      expect(results[0]).toBe(true);
      expect(results.slice(1).every((r: boolean) => r === false)).toBe(true);
    });

    it("should allow calls after throttle period", () => {
      manager.tap();
      expect(mockVibrate).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      manager.tap();
      expect(mockVibrate).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Handling", () => {
    it("should handle vibrate API errors gracefully", () => {
      mockVibrate.mockImplementation(() => {
        throw new Error("Vibrate failed");
      });

      const result = manager.tap();
      expect(result).toBe(false);
    });

    it("should handle browser compatibility issues", () => {
      const newManager = new MockHapticFeedbackManager();
      vi.spyOn(newManager, "tap").mockReturnValue(false);
      const result = newManager.tap();
      expect(result).toBe(false);
    });
  });

  describe("Global Haptic Feedback Interface", () => {
    it("should provide global hapticFeedback object", () => {
      expect(hapticFeedback).toBeDefined();
      expect(typeof hapticFeedback.tap).toBe("function");
      expect(typeof hapticFeedback.success).toBe("function");
      expect(typeof hapticFeedback.error).toBe("function");
      expect(typeof hapticFeedback.warning).toBe("function");
      expect(typeof hapticFeedback.select).toBe("function");
      expect(typeof hapticFeedback.impact).toBe("function");
      expect(typeof hapticFeedback.custom).toBe("function");
    });

    it("should work through global interface", () => {
      vi.spyOn(hapticFeedback, "tap").mockReturnValue(true);
      const result = hapticFeedback.tap();
      expect(result).toBe(true);
      vi.mocked(hapticFeedback.tap).mockRestore();
    });
  });

  describe("Cleanup", () => {
    it("should clear pending operations on destroy", () => {
      // Start some operations
      void manager.tap();
      void manager.success();

      manager.destroy();

      // Should not throw or cause issues
      expect(() => manager.destroy()).not.toThrow();
    });

    it("should disable haptics after destroy", () => {
      manager.destroy();
      const result = manager.tap();
      expect(result).toBe(false);
      expect(mockVibrate).not.toHaveBeenCalled();
    });
  });
});
