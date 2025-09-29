import { useEffect, useState } from "react";

interface ViewportState {
  height: number;
  width: number;
  offsetTop: number;
  offsetLeft: number;
  isKeyboardOpen: boolean;
}

/**
 * Hook to track Visual Viewport API for better mobile keyboard handling
 * Detects when virtual keyboard is open and adjusts accordingly
 */
export function useVisualViewport(): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return {
        height: window?.innerHeight ?? 0,
        width: window?.innerWidth ?? 0,
        offsetTop: 0,
        offsetLeft: 0,
        isKeyboardOpen: false,
      };
    }

    const vv = window.visualViewport;
    const isKeyboardOpen = vv.height < window.innerHeight * 0.8;

    return {
      height: vv.height,
      width: vv.width,
      offsetTop: vv.offsetTop,
      offsetLeft: vv.offsetLeft,
      isKeyboardOpen,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const vv = window.visualViewport;

    const updateViewport = () => {
      const isKeyboardOpen = vv.height < window.innerHeight * 0.8;

      setViewport({
        height: vv.height,
        width: vv.width,
        offsetTop: vv.offsetTop,
        offsetLeft: vv.offsetLeft,
        isKeyboardOpen,
      });

      // Update CSS custom property for components to use
      document.documentElement.style.setProperty(
        "--keyboard-offset",
        isKeyboardOpen ? `${window.innerHeight - vv.height}px` : "0px",
      );
    };

    // Initial update
    updateViewport();

    // Listen to viewport changes
    vv.addEventListener("resize", updateViewport);
    vv.addEventListener("scroll", updateViewport);

    return () => {
      vv.removeEventListener("resize", updateViewport);
      vv.removeEventListener("scroll", updateViewport);
      document.documentElement.style.removeProperty("--keyboard-offset");
    };
  }, []);

  return viewport;
}
