/**
 * Mobile accessibility hook for managing touch, keyboard, and screen reader interactions
 */

import { useCallback, useEffect, useRef } from "react";

import { TouchGestureHandler } from "../lib/touch/gestures";
import { hapticFeedback } from "../lib/touch/haptics";

export interface MobileAccessibilityOptions {
  enableHaptics?: boolean;
  enableGestures?: boolean;
  announceMessages?: boolean;
  keyboardTimeout?: number;
}

const DEFAULT_OPTIONS: Required<MobileAccessibilityOptions> = {
  enableHaptics: true,
  enableGestures: true,
  announceMessages: true,
  keyboardTimeout: 300,
};

export function useMobileAccessibility(options: MobileAccessibilityOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const gestureHandlers = useRef<Map<HTMLElement, TouchGestureHandler>>(new Map());
  const keyboardTimer = useRef<number | null>(null);

  /**
   * Announce message to screen readers
   */
  const announceMessage = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (!opts.announceMessages) return;

      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", priority);
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    [opts.announceMessages],
  );

  /**
   * Add swipe gesture to element
   */
  const addSwipeGesture = useCallback(
    (element: HTMLElement, onSwipe: (direction: "left" | "right" | "up" | "down") => void) => {
      if (!opts.enableGestures) return () => {};

      const handler = new TouchGestureHandler(element).onSwipeGesture(({ direction }) => {
        if (opts.enableHaptics) {
          hapticFeedback.impact("light");
        }
        onSwipe(direction);
      });

      gestureHandlers.current.set(element, handler);

      return () => {
        handler.destroy();
        gestureHandlers.current.delete(element);
      };
    },
    [opts.enableGestures, opts.enableHaptics],
  );

  /**
   * Add long press gesture to element
   */
  const addLongPressGesture = useCallback(
    (element: HTMLElement, onLongPress: () => void) => {
      if (!opts.enableGestures) return () => {};

      const handler = new TouchGestureHandler(element).onLongPressGesture(() => {
        if (opts.enableHaptics) {
          hapticFeedback.impact("medium");
        }
        onLongPress();
      });

      gestureHandlers.current.set(element, handler);

      return () => {
        handler.destroy();
        gestureHandlers.current.delete(element);
      };
    },
    [opts.enableGestures, opts.enableHaptics],
  );

  /**
   * Enhanced focus management for mobile
   */
  const focusElement = useCallback(
    (
      element: HTMLElement,
      options?: {
        scroll?: boolean;
        announce?: string;
      },
    ) => {
      element.focus();

      if (options?.scroll) {
        // Delay scroll for virtual keyboard
        if (keyboardTimer.current) {
          clearTimeout(keyboardTimer.current);
        }

        keyboardTimer.current = window.setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }, opts.keyboardTimeout);
      }

      if (options?.announce) {
        announceMessage(options.announce);
      }

      if (opts.enableHaptics) {
        hapticFeedback.select();
      }
    },
    [announceMessage, opts.enableHaptics, opts.keyboardTimeout],
  );

  /**
   * Handle orientation changes
   */
  useEffect(() => {
    const handleOrientationChange = () => {
      // Clear keyboard timer on orientation change
      if (keyboardTimer.current) {
        clearTimeout(keyboardTimer.current);
        keyboardTimer.current = null;
      }

      // Announce orientation change
      const orientation = window.screen.orientation?.type || "unknown";
      announceMessage(
        `Bildschirm rotiert zu ${orientation.includes("landscape") ? "Querformat" : "Hochformat"}`,
      );
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    return () => window.removeEventListener("orientationchange", handleOrientationChange);
  }, [announceMessage]);

  /**
   * Handle network status changes
   */
  useEffect(() => {
    const handleOnline = () => {
      announceMessage("Internetverbindung wiederhergestellt", "assertive");
      if (opts.enableHaptics) {
        hapticFeedback.success();
      }
    };

    const handleOffline = () => {
      announceMessage("Internetverbindung verloren", "assertive");
      if (opts.enableHaptics) {
        hapticFeedback.warning();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [announceMessage, opts.enableHaptics]);

  /**
   * Cleanup function
   */
  useEffect(() => {
    const handlers = gestureHandlers.current;
    const timer = keyboardTimer.current;

    return () => {
      // Clear keyboard timer
      if (timer) {
        clearTimeout(timer);
      }

      // Cleanup gesture handlers
      handlers.forEach((handler) => handler.destroy());
      handlers.clear();
    };
  }, []);

  return {
    announceMessage,
    addSwipeGesture,
    addLongPressGesture,
    focusElement,
    hapticFeedback: opts.enableHaptics ? hapticFeedback : null,
  };
}

/**
 * Simple hook for haptic feedback only
 */
export function useHapticFeedback(enabled = true) {
  return enabled ? hapticFeedback : null;
}

/**
 * Hook for keyboard handling on mobile
 */
export function useMobileKeyboard() {
  const isKeyboardOpen = useRef(false);

  useEffect(() => {
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      const wasOpen = isKeyboardOpen.current;

      isKeyboardOpen.current = heightDiff > 150;

      // Dispatch custom events for keyboard state changes
      if (isKeyboardOpen.current && !wasOpen) {
        window.dispatchEvent(
          new CustomEvent("mobile-keyboard-open", {
            detail: { keyboardHeight: heightDiff },
          }),
        );
      } else if (!isKeyboardOpen.current && wasOpen) {
        window.dispatchEvent(new CustomEvent("mobile-keyboard-close"));
      }
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        initialViewportHeight = window.visualViewport?.height || window.innerHeight;
      }, 100);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
    } else {
      window.addEventListener("resize", handleViewportChange);
    }

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
      } else {
        window.removeEventListener("resize", handleViewportChange);
      }
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return {
    isKeyboardOpen: isKeyboardOpen.current,
  };
}
