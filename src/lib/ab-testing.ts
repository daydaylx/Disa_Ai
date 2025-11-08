/**
 * A/B Testing Framework for UI V1 vs V2
 *
 * This module provides utilities to manage A/B testing between UI versions,
 * with support for feature flags, user cohorts, and performance monitoring.
 */

export type UIVersion = "v1" | "v2";

export interface ABTestConfig {
  /** Name of the test */
  testName: string;
  /** Percentage of usersIcon to show V2 (0-100) */
  v2Percentage: number;
  /** Whether to respect user's manual override */
  allowOverride: boolean;
  /** Force specific version for testing */
  forceVersion?: UIVersion;
}

export interface ABTestMetrics {
  version: UIVersion;
  userId: string;
  sessionId: string;
  timestamp: number;
  event: string;
  data?: Record<string, any>;
}

const DEFAULT_CONFIG: ABTestConfig = {
  testName: "ui-v2-rollout",
  v2Percentage: 50, // 50% split by default
  allowOverride: true,
  forceVersion: undefined,
};

/**
 * Get current A/B test configuration from environment or defaults
 */
export function getABTestConfig(): ABTestConfig {
  const envV2Percentage = parseInt(import.meta.env.VITE_UI_V2_PERCENTAGE || "50", 10);
  const envForceVersion = import.meta.env.VITE_FORCE_UI_VERSION as UIVersion | undefined;

  return {
    ...DEFAULT_CONFIG,
    v2Percentage: Math.max(0, Math.min(100, envV2Percentage)),
    forceVersion: envForceVersion,
  };
}

/**
 * Generate stable user ID for consistent A/B assignment
 */
function getUserId(): string {
  let userId = sessionStorage.getItem("disa:ab-user-id");
  if (!userId) {
    userId = `u_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem("disa:ab-user-id", userId);
  }
  return userId;
}

/**
 * Hash function for consistent user bucketing
 */
function hashUserId(userId: string, testName: string): number {
  const str = `${userId}_${testName}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100;
}

/**
 * Determine which UI version to show for current user
 */
export function getUIVersion(): UIVersion {
  const config = getABTestConfig();

  // Check for manual override first
  if (config.allowOverride) {
    const manualOverride = sessionStorage.getItem("disa:ui-version") as UIVersion | null;
    if (manualOverride === "v1" || manualOverride === "v2") {
      logABTestEvent("override_used", { version: manualOverride, reason: "manual" });
      return manualOverride;
    }
  }

  // Check for forced version (testing/staging)
  if (config.forceVersion) {
    logABTestEvent("override_used", { version: config.forceVersion, reason: "forced" });
    return config.forceVersion;
  }

  // A/B test assignment based on user hash
  const userId = getUserId();
  const userHash = hashUserId(userId, config.testName);
  const assignedVersion: UIVersion = userHash < config.v2Percentage ? "v2" : "v1";

  logABTestEvent("version_assigned", {
    version: assignedVersion,
    userHash,
    v2Percentage: config.v2Percentage,
  });

  return assignedVersion;
}

/**
 * Manually override UI version (for testing/demos)
 */
export function setUIVersionOverride(version: UIVersion | null): void {
  if (version) {
    sessionStorage.setItem("disa:ui-version", version);
    logABTestEvent("manual_override", { version });
  } else {
    sessionStorage.removeItem("disa:ui-version");
    logABTestEvent("manual_override", { version: null, action: "cleared" });
  }

  // Reload to apply changes
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

/**
 * Log A/B test events for analysis
 */
export function logABTestEvent(event: string, data?: Record<string, any>): void {
  const metric: ABTestMetrics = {
    version: getUIVersion(),
    userId: getUserId(),
    sessionId: sessionStorage.getItem("disa:session-id") || "unknown",
    timestamp: Date.now(),
    event,
    data,
  };

  // Store locally for analysis (could be sent to analytics service)
  const events = JSON.parse(localStorage.getItem("disa:ab-events") || "[]");
  events.push(metric);

  // Keep only last 1000 events to avoid storage bloat
  if (events.length > 1000) {
    events.splice(0, events.length - 1000);
  }

  localStorage.setItem("disa:ab-events", JSON.stringify(events));

  // Console log for development
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[A/B Test] ${event}:`, metric);
  }
}

/**
 * Get A/B test metrics for analysis
 */
export function getABTestMetrics(): ABTestMetrics[] {
  return JSON.parse(localStorage.getItem("disa:ab-events") || "[]");
}

/**
 * Clear all A/B test data (for testing)
 */
export function clearABTestData(): void {
  sessionStorage.removeItem("disa:ab-user-id");
  sessionStorage.removeItem("disa:ui-version");
  localStorage.removeItem("disa:ab-events");
  logABTestEvent("data_cleared");
}

/**
 * Get A/B test status and configuration info
 */
export function getABTestStatus() {
  const config = getABTestConfig();
  const currentVersion = getUIVersion();
  const userId = getUserId();
  const manualOverride = sessionStorage.getItem("disa:ui-version");

  return {
    config,
    currentVersion,
    userId,
    manualOverride,
    totalEvents: getABTestMetrics().length,
  };
}
