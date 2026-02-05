/**
 * Haptic Feedback Utility für Mobile
 *
 * Bietet verschiedene Vibrationsmuster für taktiles Feedback.
 * Respektiert System-Einstellungen und Browser-Support.
 */

export type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "error"
  | "warning"
  | "selection";

interface HapticPattern {
  vibrate: number | number[];
}

// Vibrationsmuster für verschiedene Feedback-Typen
const HAPTIC_PATTERNS: Record<HapticFeedbackType, HapticPattern> = {
  // Leichte Interaktionen (Button hover, focus)
  light: { vibrate: 10 },

  // Mittlere Interaktionen (Button click, toggle)
  medium: { vibrate: 20 },

  // Schwere Interaktionen (wichtige Actions, Delete)
  heavy: { vibrate: 40 },

  // Erfolg (Toast success, Action completed)
  success: { vibrate: [10, 50, 10] },

  // Fehler (Validation error, Action failed)
  error: { vibrate: [20, 100, 20, 100, 20] },

  // Warnung (Warning toast)
  warning: { vibrate: [30, 50, 30] },

  // Selection (List item selected, Radio/Checkbox)
  selection: { vibrate: 5 },
};

/**
 * Prüft ob Haptic Feedback verfügbar ist
 */
export function isHapticSupported(): boolean {
  return "vibrate" in navigator;
}

/**
 * Prüft ob Haptic Feedback aktiviert ist (User-Settings)
 * TODO: Mit Settings-Hook verbinden
 */
function isHapticEnabled(): boolean {
  // Aktuell: Immer aktiviert wenn Browser unterstützt
  // Später: Aus useSettings() holen
  if (typeof window === "undefined") return false;

  try {
    const settings = localStorage.getItem("disa-settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.enableHapticFeedback !== false; // Default: true
    }
  } catch {
    // Fallback
  }

  return true;
}

/**
 * Führt Haptic Feedback aus
 *
 * @param type - Art des Feedbacks
 * @returns true wenn Vibration ausgeführt wurde, false sonst
 */
export function hapticFeedback(type: HapticFeedbackType = "medium"): boolean {
  // Check if Battery Saver is active
  if (typeof document !== "undefined") {
    const batterySaver = document.documentElement.dataset.batterySaver === "true";
    if (batterySaver) return false;
  }

  // Checks
  if (!isHapticSupported()) return false;
  if (!isHapticEnabled()) return false;

  const pattern = HAPTIC_PATTERNS[type];
  if (!pattern) return false;

  try {
    return navigator.vibrate(pattern.vibrate);
  } catch (error) {
    // Fehler beim Vibrieren (z.B. Silent Mode)
    if (import.meta.env.DEV) {
      console.warn("[Haptics] Vibration failed:", error);
    }
    return false;
  }
}

/**
 * Stoppt aktuelle Vibration
 */
export function stopHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate(0);
  }
}

/**
 * Custom Vibrationsmuster
 *
 * @param pattern - Vibrationsmuster (ms oder Array von ms)
 */
export function hapticCustom(pattern: number | number[]): boolean {
  if (!isHapticSupported() || !isHapticEnabled()) return false;

  try {
    return navigator.vibrate(pattern);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[Haptics] Custom vibration failed:", error);
    }
    return false;
  }
}

/**
 * React Hook für Haptic Feedback
 *
 * @example
 * const haptic = useHaptic();
 *
 * <button onClick={() => {
 *   haptic('medium');
 *   handleClick();
 * }}>
 *   Click me
 * </button>
 */
export function useHaptic() {
  return hapticFeedback;
}
