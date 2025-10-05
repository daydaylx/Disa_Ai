/**
 * Analytics System für Issue #71
 * Lightweight Event-Tracking für Schnellstarts mit Privacy-Schutz
 */

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  properties: Record<string, any>;
}

interface QuickstartClickedEvent extends AnalyticsEvent {
  event: "quickstart_clicked";
  properties: {
    id: string;
    flowId: string;
    model?: string;
    autosend: boolean;
    ts: number;
  };
}

interface QuickstartCompletedEvent extends AnalyticsEvent {
  event: "quickstart_completed";
  properties: {
    id: string;
    flowId: string;
    model?: string;
    duration_ms: number;
    ts: number;
  };
}

type SupportedEvent = QuickstartClickedEvent | QuickstartCompletedEvent;

// Privacy-Mode Check
function isPrivacyModeEnabled(): boolean {
  // Check environment variable
  const envPrivacyMode = (import.meta as any)?.env?.VITE_PRIVACY_MODE;
  if (envPrivacyMode === "true" || envPrivacyMode === true) {
    return true;
  }

  // Check localStorage setting
  try {
    const localPrivacy = localStorage.getItem("privacy_mode");
    if (localPrivacy === "true") {
      return true;
    }
  } catch {
    // localStorage not available, continue
  }

  // Check URL parameter for debugging
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("privacy") === "true") {
    return true;
  }

  return false;
}

// Event Storage (localStorage-based für offline support)
class EventStore {
  private readonly storageKey = "disa_analytics_events";
  private readonly maxEvents = 100; // Limit stored events

  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      const events = JSON.parse(stored);
      return Array.isArray(events) ? events : [];
    } catch {
      return [];
    }
  }

  private saveEvents(events: AnalyticsEvent[]): void {
    try {
      // Keep only recent events to prevent storage bloat
      const recentEvents = events.slice(-this.maxEvents);
      localStorage.setItem(this.storageKey, JSON.stringify(recentEvents));
    } catch (error) {
      console.warn("[Analytics] Failed to save events:", error);
    }
  }

  addEvent(event: AnalyticsEvent): void {
    if (isPrivacyModeEnabled()) {
      // Privacy mode enabled, skipping event tracking
      return;
    }

    const events = this.getStoredEvents();
    events.push(event);
    this.saveEvents(events);

    // Event tracked successfully
  }

  getEvents(): AnalyticsEvent[] {
    return this.getStoredEvents();
  }

  clearEvents(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Ignore errors
    }
  }

  // Get analytics summary for debugging
  getSummary(): { total: number; byEvent: Record<string, number> } {
    const events = this.getStoredEvents();
    const byEvent: Record<string, number> = {};

    events.forEach((event) => {
      byEvent[event.event] = (byEvent[event.event] || 0) + 1;
    });

    return {
      total: events.length,
      byEvent,
    };
  }
}

// Global event store instance
const eventStore = new EventStore();

// Core Analytics Functions
export function trackQuickstartClicked(properties: {
  id: string;
  flowId: string;
  model?: string;
  autosend: boolean;
}): void {
  const event: QuickstartClickedEvent = {
    event: "quickstart_clicked",
    timestamp: Date.now(),
    properties: {
      ...properties,
      ts: Date.now(),
    },
  };

  eventStore.addEvent(event);
}

export function trackQuickstartCompleted(properties: {
  id: string;
  flowId: string;
  model?: string;
  duration_ms: number;
}): void {
  const event: QuickstartCompletedEvent = {
    event: "quickstart_completed",
    timestamp: Date.now(),
    properties: {
      ...properties,
      ts: Date.now(),
    },
  };

  eventStore.addEvent(event);
}

// Utility functions
export function getAnalyticsSummary() {
  return eventStore.getSummary();
}

export function clearAnalyticsData() {
  eventStore.clearEvents();
  // Analytics data cleared
}

export function isAnalyticsEnabled(): boolean {
  return !isPrivacyModeEnabled();
}

// Privacy controls
export function enablePrivacyMode(): void {
  try {
    localStorage.setItem("privacy_mode", "true");
    eventStore.clearEvents();
    // Privacy mode enabled, data cleared
  } catch (error) {
    console.warn("[Analytics] Failed to enable privacy mode:", error);
  }
}

export function disablePrivacyMode(): void {
  try {
    localStorage.removeItem("privacy_mode");
    // Privacy mode disabled
  } catch (error) {
    console.warn("[Analytics] Failed to disable privacy mode:", error);
  }
}

// Export types for use in components
export type { QuickstartClickedEvent, QuickstartCompletedEvent, SupportedEvent };
