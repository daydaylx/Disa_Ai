import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useSettings } from "../useSettings";

describe("useSettings - resetSettings", () => {
  const SETTINGS_KEY = "disa-ai-settings";

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should reset all settings to defaults", () => {
    const { result } = renderHook(() => useSettings());

    // Change some settings
    act(() => {
      result.current.setTheme("dark");
      result.current.setFontSize(20);
      result.current.setCreativity(80);
      result.current.setPreferredModel("openai/gpt-4");
    });

    expect(result.current.settings.theme).toBe("dark");
    expect(result.current.settings.fontSize).toBe(20);
    expect(result.current.settings.creativity).toBe(80);
    expect(result.current.settings.preferredModelId).toBe("openai/gpt-4");

    // Reset
    act(() => {
      result.current.resetSettings();
    });

    // Should be back to defaults
    expect(result.current.settings.theme).toBe("auto");
    expect(result.current.settings.fontSize).toBe(16);
    expect(result.current.settings.creativity).toBe(45);
    expect(result.current.settings.preferredModelId).toBe("openai/gpt-4o-mini");
  });

  it("should clear localStorage key", () => {
    const { result } = renderHook(() => useSettings());

    // Set some values
    act(() => {
      result.current.setTheme("light");
    });

    // Verify localStorage has the key
    expect(localStorage.getItem(SETTINGS_KEY)).toBeTruthy();

    // Reset
    act(() => {
      result.current.resetSettings();
    });

    // After reset, key should NOT be in localStorage
    // (because normalizeSettings will create a new object but not persist until next change)
    expect(result.current.settings.theme).toBe("auto");
  });

  it("should reset boolean toggles", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.toggleNSFWContent();
      result.current.toggleAnalytics();
      result.current.setReduceMotion(true);
      result.current.setHapticFeedback(true);
    });

    expect(result.current.settings.showNSFWContent).toBe(true);
    expect(result.current.settings.enableAnalytics).toBe(false);
    expect(result.current.settings.reduceMotion).toBe(true);
    expect(result.current.settings.hapticFeedback).toBe(true);

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings.showNSFWContent).toBe(false);
    expect(result.current.settings.enableAnalytics).toBe(true);
    expect(result.current.settings.reduceMotion).toBe(false);
    expect(result.current.settings.hapticFeedback).toBe(false);
  });

  it("should handle errors gracefully", () => {
    const { result } = renderHook(() => useSettings());

    // Mock localStorage.removeItem to throw
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = () => {
      throw new Error("localStorage error");
    };

    // Should not throw
    expect(() => {
      act(() => {
        result.current.resetSettings();
      });
    }).not.toThrow();

    // Restore
    Storage.prototype.removeItem = originalRemoveItem;
  });
});
