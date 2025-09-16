/**
 * Haptic feedback utilities for mobile devices
 */

export interface HapticOptions {
  intensity?: "light" | "medium" | "heavy";
  duration?: number;
  fallback?: boolean;
}

export type HapticPattern = "tap" | "success" | "warning" | "error" | "selection" | "impact";

const DEFAULT_OPTIONS: Required<Omit<HapticOptions, "intensity">> & {
  intensity: HapticOptions["intensity"];
} = {
  intensity: "medium",
  duration: 10,
  fallback: true,
};

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return "vibrate" in navigator || "hapticFeedback" in navigator || "webkitVibrate" in navigator;
}

/**
 * Check if the user prefers reduced motion (affects haptic intensity)
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Trigger haptic feedback with various patterns
 */
export function triggerHaptic(pattern: HapticPattern, options: HapticOptions = {}): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Respect user's reduced motion preference
  if (prefersReducedMotion() && !opts.fallback) {
    return false;
  }

  // Check for modern Haptic API (iOS Safari)
  if ("hapticFeedback" in navigator) {
    try {
      const hapticFeedback = (navigator as any).hapticFeedback;

      switch (pattern) {
        case "tap":
        case "selection":
          hapticFeedback.impact("light");
          return true;
        case "success":
          hapticFeedback.notification("success");
          return true;
        case "warning":
          hapticFeedback.notification("warning");
          return true;
        case "error":
          hapticFeedback.notification("error");
          return true;
        case "impact":
          hapticFeedback.impact(opts.intensity || "medium");
          return true;
        default:
          return false;
      }
    } catch {
      // Haptic feedback not available
    }
  }

  // Fallback to vibration API
  if (!opts.fallback) {
    return false;
  }

  return triggerVibration(pattern, opts);
}

/**
 * Trigger vibration patterns as fallback
 */
function triggerVibration(
  pattern: HapticPattern,
  options: Required<Omit<HapticOptions, "intensity">>,
): boolean {
  if (!("vibrate" in navigator)) {
    return false;
  }

  try {
    let vibrationPattern: number | number[];

    switch (pattern) {
      case "tap":
      case "selection":
        vibrationPattern = 10;
        break;
      case "success":
        vibrationPattern = [50, 50, 100];
        break;
      case "warning":
        vibrationPattern = [100, 100, 100];
        break;
      case "error":
        vibrationPattern = [200, 100, 200];
        break;
      case "impact":
        vibrationPattern = options.duration;
        break;
      default:
        vibrationPattern = 10;
    }

    navigator.vibrate(vibrationPattern);
    return true;
  } catch {
    // Vibration not available
    return false;
  }
}

/**
 * Haptic feedback for UI interactions
 */
export const hapticFeedback = {
  /**
   * Light tap feedback for button presses
   */
  tap() {
    return triggerHaptic("tap", { intensity: "light" });
  },

  /**
   * Selection feedback for picking items
   */
  select() {
    return triggerHaptic("selection", { intensity: "light" });
  },

  /**
   * Success feedback for completed actions
   */
  success() {
    return triggerHaptic("success", { intensity: "medium" });
  },

  /**
   * Warning feedback for cautionary actions
   */
  warning() {
    return triggerHaptic("warning", { intensity: "medium" });
  },

  /**
   * Error feedback for failed actions
   */
  error() {
    return triggerHaptic("error", { intensity: "heavy" });
  },

  /**
   * Impact feedback for drag/drop or swipe actions
   */
  impact(intensity: HapticOptions["intensity"] = "medium") {
    return triggerHaptic("impact", { intensity });
  },

  /**
   * Custom vibration pattern
   */
  custom(pattern: number | number[]) {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
        return true;
      } catch {
        // Custom vibration failed
      }
    }
    return false;
  },
};

/**
 * Create a haptic-enabled event handler
 */
export function withHaptic<T extends Event>(
  handler: (event: T) => void,
  hapticType: HapticPattern = "tap",
) {
  return (event: T) => {
    triggerHaptic(hapticType);
    handler(event);
  };
}

/**
 * Add haptic feedback to an element's click events
 */
export function addHapticToElement(
  element: HTMLElement,
  hapticType: HapticPattern = "tap",
  options: HapticOptions = {},
) {
  const handleInteraction = () => {
    triggerHaptic(hapticType, options);
  };

  element.addEventListener("click", handleInteraction);
  element.addEventListener("touchstart", handleInteraction, { passive: true });

  return () => {
    element.removeEventListener("click", handleInteraction);
    element.removeEventListener("touchstart", handleInteraction);
  };
}
