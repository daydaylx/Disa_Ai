import { useEffect, useState } from "react";

export interface ResponsiveLayoutState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  sidepanelMode: "overlay" | "push" | "persistent";
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export function useResponsiveLayout(): ResponsiveLayoutState {
  const [state, setState] = useState<ResponsiveLayoutState>(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        sidepanelMode: "persistent" as const,
      };
    }

    const width = window.innerWidth;
    const isMobile = width < BREAKPOINTS.mobile;
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
    const isDesktop = width >= BREAKPOINTS.desktop;

    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      sidepanelMode: isMobile ? "overlay" : isTablet ? "push" : "persistent",
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
      const isDesktop = width >= BREAKPOINTS.desktop;

      setState({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        sidepanelMode: isMobile ? "overlay" : isTablet ? "push" : "persistent",
      });
    };

    // Throttled resize handler for performance
    let timeoutId: number | null = null;
    const throttledResize = () => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        handleResize();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("resize", throttledResize);

    // Initial call
    handleResize();

    return () => {
      window.removeEventListener("resize", throttledResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return state;
}
