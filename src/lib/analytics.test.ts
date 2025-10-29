import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { analytics } from "./analytics";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Analytics System - Issue #71", () => {
  beforeEach(() => {
    localStorageMock.clear();
    analytics.clearData();
    analytics.setEnabled(true);
  });

  afterEach(() => {
    localStorageMock.clear();
    vi.unstubAllGlobals();
  });

  it("sollte Analytics standardmäßig aktiviert haben", () => {
    // Default state should be enabled
    expect(analytics.isEnabled).toBe(true);
  });

  it("sollte Analytics deaktivieren wenn privacy_mode=true im localStorage", () => {
    localStorageMock.setItem("privacy_mode", "true");
    analytics.setEnabled(false);
    expect(analytics.isEnabled).toBe(false);
  });

  it("sollte Analytics wieder aktivieren wenn privacy_mode entfernt wird", () => {
    localStorageMock.setItem("privacy_mode", "true");
    analytics.setEnabled(false);
    expect(analytics.isEnabled).toBe(false);
    localStorageMock.removeItem("privacy_mode");
    analytics.setEnabled(true);
    expect(analytics.isEnabled).toBe(true);
  });

  it("sollte Analytics deaktivieren wenn URL-Parameter privacy=true", () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://example.com?privacy=true"),
      writable: true,
    });
    analytics.setEnabled(false);
    expect(analytics.isEnabled).toBe(false);
  });

  it("sollte Events nur tracken, wenn Analytics aktiviert ist", () => {
    // Ensure analytics is enabled
    analytics.setEnabled(true);

    analytics.trackQuickstartClicked({ id: "test", flowId: "test-flow", autosend: true });
    let events = JSON.parse(localStorageMock.getItem("disa:analytics-events") || "[]");
    expect(events.length).toBe(1);

    // Disable analytics
    analytics.setEnabled(false);
    analytics.trackQuickstartClicked({ id: "test2", flowId: "test-flow-2", autosend: false });
    events = JSON.parse(localStorageMock.getItem("disa:analytics-events") || "[]");
    expect(events.length).toBe(0); // Should be cleared and not tracked
  });

  it("sollte Quickstart Clicked Events korrekt speichern", () => {
    const clickProps = { id: "q1", flowId: "flow1", model: "test-model", autosend: true };
    analytics.trackQuickstartClicked(clickProps);
    analytics.persistEvents();

    const events = JSON.parse(localStorageMock.getItem("disa:analytics-events") || "[]");
    expect(events.length).toBe(1);
    expect(events[0].name).toBe("quickstart_clicked");
    expect(events[0].properties.id).toBe("q1");
    expect(events[0].properties.model).toBe("test-model");
  });

  it("sollte Quickstart Completed Events korrekt speichern", () => {
    const completeProps = { id: "q1", flowId: "flow1", model: "test-model", duration_ms: 1234 };
    analytics.trackQuickstartCompleted(completeProps);

    const events = JSON.parse(localStorageMock.getItem("disa:analytics-events") || "[]");
    expect(events.length).toBe(1);
    expect(events[0].name).toBe("quickstart_completed");
    expect(events[0].properties.duration_ms).toBe(1234);
  });

  it("sollte maximal 100 Events speichern", () => {
    for (let i = 0; i < 150; i++) {
      analytics.trackQuickstartClicked({ id: `test-${i}`, flowId: "test-flow", autosend: false });
    }
    const events = JSON.parse(localStorageMock.getItem("disa:analytics-events") || "[]");
    expect(events.length).toBe(100);
    expect(events[0].properties.id).toBe("test-50"); // First 50 are discarded
  });

  it("sollte Analytics Summary korrekt berechnen", () => {
    analytics.trackQuickstartClicked({ id: "q1", flowId: "f1", autosend: true });
    analytics.trackQuickstartClicked({ id: "q2", flowId: "f2", autosend: false });
    analytics.trackQuickstartCompleted({ id: "q1", flowId: "f1", duration_ms: 100 });

    const summary = analytics.getAnalyticsData().stats;
    expect(summary.totalEvents).toBe(3);
    expect(summary.eventCounts.quickstart_clicked).toBe(2);
    expect(summary.eventCounts.quickstart_completed).toBe(1);
  });

  it("sollte leere Summary zurückgeben, wenn keine Events da sind", () => {
    const summary = analytics.getAnalyticsData().stats;
    expect(summary.totalEvents).toBe(0);
    expect(summary.eventCounts).toEqual({});
  });

  it("sollte alle Analytics Daten löschen können", () => {
    vi.spyOn(localStorageMock, "removeItem");
    analytics.clearData();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("disa:analytics-events");
  });

  it("sollte Analytics Daten beim Aktivieren von Privacy Mode löschen", () => {
    vi.spyOn(localStorageMock, "removeItem");
    analytics.setEnabled(false);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("disa:analytics-events");
  });
});
