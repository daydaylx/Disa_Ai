/**
 * Edge Swipe Hook für globale Navigation
 *
 * Implementiert rechten Rand-Swipe für Haupt-Drawer
 * - Nur aktiv auf touch devices (pointer:coarse)
 * - Verhindert Browser-Back-Gesture-Konflikt
 * - Konfigurierbar via edgeWidth, minDX
 * - Feature-Flag: edgeSwipeNavigation
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { isFeatureEnabled } from "../config/flags";
import { TouchGestureHandler } from "../lib/touch/gestures";

export interface EdgeSwipeOptions {
  edgeWidth?: number; // Rand-Breite für Aktivierung (default: 20px)
  minDX?: number; // Min. horizontale Bewegung (default: 50px)
  maxDY?: number; // Max. vertikale Bewegung (default: 100px)
  delay?: number; // Verzögerung vor Aktivierung (default: 0ms)
}

export interface EdgeSwipeState {
  isActive: boolean;
  isSwiping: boolean;
  swipeProgress: number; // 0-1 für Animation
  startX: number;
  currentX: number;
}

const DEFAULT_OPTIONS: Required<EdgeSwipeOptions> = {
  edgeWidth: 20,
  minDX: 50,
  maxDY: 100,
  delay: 0,
};

export function useEdgeSwipe(
  onSwipeStart: () => void,
  onSwipeProgress: (progress: number) => void,
  onSwipeComplete: () => void,
  options: EdgeSwipeOptions = {},
): EdgeSwipeState {
  const [state, setState] = useState<EdgeSwipeState>({
    isActive: false,
    isSwiping: false,
    swipeProgress: 0,
    startX: 0,
    currentX: 0,
  });

  const gestureHandlerRef = useRef<TouchGestureHandler | null>(null);
  const optionsWithDefaults = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const isTouchDeviceRef = useRef(false);

  useEffect(() => {
    // Feature-Flag Check - Exit early wenn deaktiviert
    if (!isFeatureEnabled("edgeSwipeNavigation")) {
      setState({
        isActive: false,
        isSwiping: false,
        swipeProgress: 0,
        startX: 0,
        currentX: 0,
      });
      return;
    }

    // Prüfe ob Touch-Device
    const checkTouchDevice = () => {
      isTouchDeviceRef.current = window.matchMedia("(pointer: coarse) and (hover: none)").matches;
    };

    checkTouchDevice();

    // Prüfe bei Resize/Media-Query-Änderungen
    const mediaQuery = window.matchMedia("(pointer: coarse) and (hover: none)");
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      isTouchDeviceRef.current = e.matches;
      if (!e.matches) {
        // Deaktiviere bei Desktop
        setState({
          isActive: false,
          isSwiping: false,
          swipeProgress: 0,
          startX: 0,
          currentX: 0,
        });
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    if (!isTouchDeviceRef.current) {
      return () => {
        mediaQuery.removeEventListener("change", handleMediaQueryChange);
      };
    }

    // Setup global edge swipe detection
    const setupEdgeSwipe = () => {
      // Global container für edge-swipe
      const globalContainer = document.body;
      const cleanupFns: Array<() => void> = [];

      if (gestureHandlerRef.current) {
        gestureHandlerRef.current.destroy();
      }

      gestureHandlerRef.current = new TouchGestureHandler(globalContainer, {
        swipeThreshold: optionsWithDefaults.minDX,
        preventDefaultSwipe: false, // Erlaube Browser-Gesten als Fallback
      });

      // Edge-swipe detection
      let isInEdgeZone = false;
      let swipeStartX = 0;
      let swipeStartY = 0;
      let swipeTimeout: number | null = null;

      gestureHandlerRef.current.onSwipeGesture((event) => {
        if (!isInEdgeZone) return;

        const { direction, deltaX, deltaY } = event;

        // Nur nach rechts swipen vom rechten Rand
        if (direction !== "right" || Math.abs(deltaY) > optionsWithDefaults.maxDY) {
          // Reset state
          setState((prev) => ({ ...prev, isSwiping: false, swipeProgress: 0 }));
          return;
        }

        // Progress berechnen (0-1)
        const progress = Math.min(Math.max(deltaX / 300, 0), 1);

        setState({
          isActive: true,
          isSwiping: true,
          swipeProgress: progress,
          startX: swipeStartX,
          currentX: swipeStartX + deltaX,
        });

        onSwipeProgress(progress);

        // Swipe abgeschlossen?
        if (deltaX >= optionsWithDefaults.minDX) {
          onSwipeStart();
          onSwipeComplete();

          setState({
            isActive: false,
            isSwiping: false,
            swipeProgress: 0,
            startX: 0,
            currentX: 0,
          });
        }
      });

      // Touch start - prüfe ob am rechten Rand
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0]!;
        const screenWidth = window.innerWidth;

        // Am rechten Rand? (mit edgeWidth tolerancia)
        if (touch.clientX >= screenWidth - optionsWithDefaults.edgeWidth) {
          isInEdgeZone = true;
          swipeStartX = touch.clientX;
          swipeStartY = touch.clientY;

          // Verzögerung falls konfiguriert
          if (optionsWithDefaults.delay > 0) {
            swipeTimeout = window.setTimeout(() => {
              if (isInEdgeZone) {
                setState((prev) => ({ ...prev, isActive: true }));
              }
            }, optionsWithDefaults.delay);
          } else {
            setState((prev) => ({ ...prev, isActive: true }));
          }
        }
      };

      globalContainer.addEventListener("touchstart", handleTouchStart);
      cleanupFns.push(() => globalContainer.removeEventListener("touchstart", handleTouchStart));

      // Touch move - tracking
      const handleTouchMove = (e: TouchEvent) => {
        if (!isInEdgeZone || e.touches.length !== 1) return;

        const touch = e.touches[0]!;
        const deltaY = Math.abs(touch.clientY - swipeStartY);

        // Zu viel vertikale Bewegung = kein Edge-Swipe
        if (deltaY > optionsWithDefaults.maxDY) {
          isInEdgeZone = false;
          if (swipeTimeout !== null) {
            window.clearTimeout(swipeTimeout);
            swipeTimeout = null;
          }
          setState((prev) => ({ ...prev, isActive: false, isSwiping: false }));
        }
      };

      globalContainer.addEventListener("touchmove", handleTouchMove);
      cleanupFns.push(() => globalContainer.removeEventListener("touchmove", handleTouchMove));

      // Touch end - cleanup
      const handleTouchEnd = () => {
        isInEdgeZone = false;
        if (swipeTimeout !== null) {
          window.clearTimeout(swipeTimeout);
          swipeTimeout = null;
        }
        setState((prev) => ({ ...prev, isActive: false, isSwiping: false, swipeProgress: 0 }));
      };

      globalContainer.addEventListener("touchend", handleTouchEnd);
      globalContainer.addEventListener("touchcancel", handleTouchEnd);
      cleanupFns.push(() => globalContainer.removeEventListener("touchend", handleTouchEnd));
      cleanupFns.push(() => globalContainer.removeEventListener("touchcancel", handleTouchEnd));
      return () => {
        cleanupFns.forEach((cleanup) => {
          try {
            cleanup();
          } catch {
            // ignore cleanup errors
          }
        });
      };
    };

    const cleanupEdgeSwipe = setupEdgeSwipe();

    return () => {
      if (gestureHandlerRef.current) {
        gestureHandlerRef.current.destroy();
        gestureHandlerRef.current = null;
      }
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
      cleanupEdgeSwipe?.();
    };
  }, [onSwipeStart, onSwipeProgress, onSwipeComplete, optionsWithDefaults]);

  return state;
}

/**
 * Convenience Hook für einfache Drawer-Integration
 */
export function useEdgeSwipeDrawer(
  isDrawerOpen: boolean,
  onOpenDrawer: () => void,
  options: EdgeSwipeOptions = {},
) {
  const handleSwipeStart = useCallback(() => {
    if (!isDrawerOpen) {
      onOpenDrawer();
    }
  }, [isDrawerOpen, onOpenDrawer]);

  const handleSwipeProgress = useCallback((_progress: number) => {
    // Drawer-Animation würde hier passieren
    // Progress: 0 = geschlossen, 1 = offen
  }, []);

  const handleSwipeComplete = useCallback(() => {
    // Swipe abgeschlossen - nothing to do, drawer ist bereits geöffnet
  }, []);

  return useEdgeSwipe(handleSwipeStart, handleSwipeProgress, handleSwipeComplete, options);
}
