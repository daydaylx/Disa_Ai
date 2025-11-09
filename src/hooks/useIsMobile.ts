/**
 * Reliable Mobile Detection Hook
 *
 * Replaces fragile UA detection and hardcoded breakpoints with:
 * - matchMedia('pointer:coarse') for touch devices
 * - Proper viewport-based detection
 * - Consistent behavior across all devices including tablets
 */

import { useEffect, useState } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Reliable mobile detection based on actual device capabilities
    const checkIsMobile = () => {
      // Primary detection: touch-capable coarse pointer (most reliable)
      const hasCoarsePointer = window.matchMedia("(pointer: coarse) and (hover: none)").matches;

      // Fallback 1: Small viewport AND touch capability
      const isSmallViewport = window.innerWidth <= 768;
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      // Fallback 2: Modern viewport queries
      const isMobileViewport = window.matchMedia(
        "(max-width: 768px) and (orientation: portrait)",
      ).matches;

      // Consider as mobile if:
      // 1. Has coarse pointer (most reliable), OR
      // 2. Small viewport with touch (laptops with touch), OR
      // 3. Mobile viewport (portrait mobile/tablet)
      setIsMobile(hasCoarsePointer || (isSmallViewport && hasTouch) || isMobileViewport);
    };

    // Check on mount
    checkIsMobile();

    // Listen for media query changes
    const mqls = [
      window.matchMedia("(pointer: coarse) and (hover: none)"),
      window.matchMedia("(max-width: 768px) and (orientation: portrait)"),
      window.matchMedia("(max-width: 768px)"),
    ];

    mqls.forEach((mql) => {
      mql.addEventListener("change", checkIsMobile);
    });

    return () => {
      mqls.forEach((mql) => {
        mql.removeEventListener("change", checkIsMobile);
      });
    };
  }, []);

  return isMobile;
}

/**
 * Enhanced hook for tablet detection
 * Useful for distinguishing between phones and tablets
 */
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkIsTablet = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse) and (hover: none)").matches;

      const viewportWidth = window.innerWidth;

      // Tablets typically have:
      // - Touch capability
      // - Medium viewport (typically 768px-1024px)
      // - Can be in portrait or landscape
      const isMediumViewport = viewportWidth >= 768 && viewportWidth <= 1024;
      const isTabletLike = hasCoarsePointer && isMediumViewport;

      setIsTablet(isTabletLike);
    };

    checkIsTablet();

    const mqls = [
      window.matchMedia("(pointer: coarse) and (hover: none)"),
      window.matchMedia("(min-width: 768px) and (max-width: 1024px)"),
    ];

    mqls.forEach((mql) => {
      mql.addEventListener("change", checkIsTablet);
    });

    return () => {
      mqls.forEach((mql) => {
        mql.removeEventListener("change", checkIsTablet);
      });
    };
  }, []);

  return isTablet;
}

/**
 * Hook for responsive design breakpoints
 * More granular than just mobile/tablet
 */
export function useViewport() {
  const [viewport, setViewport] = useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
  }>({ isMobile: false, isTablet: false, isDesktop: true, width: 0 });

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;

      // Use our enhanced detection
      const hasCoarsePointer = window.matchMedia("(pointer: coarse) and (hover: none)").matches;

      const isMobileViewport = width < 768;
      const isTabletViewport = width >= 768 && width <= 1024;
      const isDesktopViewport = width > 1024;

      setViewport({
        isMobile: isMobileViewport && hasCoarsePointer,
        isTablet: isTabletViewport && hasCoarsePointer,
        isDesktop: isDesktopViewport || (!hasCoarsePointer && isMobileViewport),
        width,
      });
    };

    checkViewport();

    const mqls = [
      window.matchMedia("(pointer: coarse) and (hover: none)"),
      window.matchMedia("(max-width: 767px)"),
      window.matchMedia("(min-width: 768px) and (max-width: 1024px)"),
      window.matchMedia("(min-width: 1025px)"),
    ];

    mqls.forEach((mql) => {
      mql.addEventListener("change", checkViewport);
    });

    return () => {
      mqls.forEach((mql) => {
        mql.removeEventListener("change", checkViewport);
      });
    };
  }, []);

  return viewport;
}
