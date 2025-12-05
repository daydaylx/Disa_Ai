/**
 * Privacy-First Analytics System
 *
 * Implements local analytics without external tracking
 */

const MAX_STORED_EVENTS = 100;

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface AnalyticsSession {
  id: string;
  startTime: number;
  endTime?: number;
  events: AnalyticsEvent[];
  userAgent: string;
  viewport: { width: number; height: number };
  referrer?: string;
}

class LocalAnalytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private session: AnalyticsSession;
  public isEnabled = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.createSession();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private createSession(): AnalyticsSession {
    return {
      id: this.sessionId,
      startTime: Date.now(),
      events: [],
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      referrer: document.referrer || undefined,
    };
  }

  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.track("page_hidden");
      } else {
        this.track("page_visible");
      }
    });

    // Track session end
    window.addEventListener("beforeunload", () => {
      this.endSession();
    });

    // Track viewport changes
    window.addEventListener("resize", () => {
      this.track("viewport_change", {
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }

  /**
   * Track an analytics event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.session.events.push(event);

    if (this.events.length > MAX_STORED_EVENTS) {
      this.events = this.events.slice(-MAX_STORED_EVENTS);
    }
    if (this.session.events.length > MAX_STORED_EVENTS) {
      this.session.events = this.session.events.slice(-MAX_STORED_EVENTS);
    }

    // Store in localStorage for persistence
    this.persistEvents();

    // Log for development
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("Analytics Event:", event);
    }
  }

  /**
   * Track page views
   */
  trackPageView(path: string, title?: string): void {
    this.track("page_view", {
      path,
      title: title || document.title,
      timestamp: Date.now(),
    });
  }

  /**
   * Track user interactions
   */
  trackInteraction(type: string, target: string, properties?: Record<string, any>): void {
    this.track("user_interaction", {
      type,
      target,
      ...properties,
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: string): void {
    this.track("error", {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit = "ms"): void {
    this.track("performance", {
      metric,
      value,
      unit,
      timestamp: Date.now(),
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, action: string, properties?: Record<string, any>): void {
    this.track("feature_usage", {
      feature,
      action,
      ...properties,
    });
  }

  /**
   * End current session
   */
  endSession(): void {
    this.session.endTime = Date.now();
    this.track("session_end", {
      duration: this.session.endTime - this.session.startTime,
    });
    this.persistSession();
  }

  /**
   * Get analytics data
   */
  getAnalyticsData(): {
    currentSession: AnalyticsSession;
    allEvents: AnalyticsEvent[];
    stats: AnalyticsStats;
  } {
    return {
      currentSession: this.session,
      allEvents: this.events,
      stats: this.calculateStats(),
    };
  }

  /**
   * Export analytics data
   */
  exportData(): string {
    const data = {
      version: "1.0",
      exportDate: Date.now(),
      session: this.session,
      events: this.events,
      stats: this.calculateStats(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    this.events = [];
    this.session.events = [];
    localStorage.removeItem("disa:analytics-events");
    localStorage.removeItem("disa:analytics-sessions");
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.clearData();
    }
  }

  public persistEvents(): void {
    try {
      localStorage.setItem("disa:analytics-events", JSON.stringify(this.events));
    } catch (error) {
      console.warn("Failed to persist analytics events:", error);
    }
  }

  private persistSession(): void {
    try {
      const sessions = this.getSavedSessions();
      sessions.push(this.session);

      // Keep only last 10 sessions
      const recentSessions = sessions.slice(-10);
      localStorage.setItem("disa:analytics-sessions", JSON.stringify(recentSessions));
    } catch (error) {
      console.warn("Failed to persist analytics session:", error);
    }
  }

  private getSavedSessions(): AnalyticsSession[] {
    try {
      const saved = localStorage.getItem("disa:analytics-sessions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private calculateStats(): AnalyticsStats {
    const eventCounts = this.events.reduce(
      (acc, event) => {
        acc[event.name] = (acc[event.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const featureUsage = this.events
      .filter((e) => e.name === "feature_usage")
      .reduce(
        (acc, event) => {
          const feature = event.properties?.feature;
          if (feature) {
            acc[feature] = (acc[feature] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

    return {
      totalEvents: this.events.length,
      sessionDuration: Date.now() - this.session.startTime,
      eventCounts,
      featureUsage,
      errorCount: eventCounts["error"] || 0,
      pageViews: eventCounts["page_view"] || 0,
    };
  }

  trackQuickstartClicked(properties: {
    id: string;
    flowId: string;
    model?: string;
    autosend: boolean;
  }): void {
    this.track("quickstart_clicked", properties);
  }

  trackQuickstartCompleted(properties: {
    id: string;
    flowId: string;
    model?: string;
    duration_ms: number;
  }): void {
    this.track("quickstart_completed", properties);
  }

  /**
   * Track Time to First Answer
   */
  trackTTFA(durationMs: number, model: string): void {
    this.trackPerformance("ttfa", durationMs, "ms");
    this.track("metric_ttfa", { durationMs, model });
  }

  /**
   * Track API Error specifically for metrics
   */
  trackApiError(errorType: string, model: string): void {
    this.track("metric_api_error", { errorType, model });
  }
}

export interface AnalyticsStats {
  totalEvents: number;
  sessionDuration: number;
  eventCounts: Record<string, number>;
  featureUsage: Record<string, number>;
  errorCount: number;
  pageViews: number;
}

// Create singleton instance
export const analytics = new LocalAnalytics();

export function setAnalyticsEnabled(enabled: boolean): void {
  analytics.setEnabled(enabled);
}

// Auto-track page loads
if (typeof window !== "undefined") {
  analytics.trackPageView(window.location.pathname);

  // Track unhandled errors
  window.addEventListener("error", (event) => {
    analytics.trackError(new Error(event.message), "unhandled_error");
  });

  // Track unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    analytics.trackError(new Error(event.reason), "unhandled_promise_rejection");
  });
}
