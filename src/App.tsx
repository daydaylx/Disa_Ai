import "./index.css"; // Tailwind base/components/utilities
import "./styles/design-tokens.css"; // Design tokens (CSS variables)
import "./styles/mobile-fixes.css"; // Mobile viewport and scaling fixes
import "./ui/base.css"; // Reset & base styles
import "./styles/a11y-improvements.css"; // A11y improvements

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { MobileOnlyGate } from "./components/layout/MobileOnlyGate";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";

export default function App() {
  // Initialize viewport height with optimized throttling for scroll performance
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let currentHeight = 0;
    let rafId: number | null = null;
    let throttleTimeout: number | null = null;

    function applyViewportHeight() {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;

      // Only update if height actually changed (prevents unnecessary DOM writes)
      if (Math.abs(height - currentHeight) > 1) {
        // 1px tolerance for rounding
        currentHeight = height;
        document.documentElement.style.setProperty("--vh", `${height}px`);
      }
    }

    // Initial application
    applyViewportHeight();

    const viewport = window.visualViewport;

    // Optimized resize handler - immediate response for critical viewport changes
    const handleResize = () => {
      if (rafId) return; // Prevent multiple RAF calls
      rafId = window.requestAnimationFrame(() => {
        applyViewportHeight();
        rafId = null;
      });
    };

    // Throttled scroll handler - only update if viewport height could have changed
    const handleScroll = () => {
      // Clear existing timeout to implement trailing edge throttling
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }

      // Throttle scroll updates to max 10fps (100ms) instead of 60-120fps
      throttleTimeout = window.setTimeout(() => {
        // Only check viewport height on scroll if we're on mobile
        // (desktop scroll doesn't typically change viewport height)
        if (viewport && "ontouchstart" in window) {
          if (rafId) return;
          rafId = window.requestAnimationFrame(() => {
            applyViewportHeight();
            rafId = null;
          });
        }
        throttleTimeout = null;
      }, 100); // 100ms throttle = max 10 updates/second instead of 60-120/second
    };

    // Resize events (immediate) - for virtual keyboard, orientation changes
    viewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    // Scroll events (throttled) - for mobile viewport changes during scroll
    viewport?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Cleanup
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }

      viewport?.removeEventListener("resize", handleResize);
      viewport?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StudioProvider>
      <ToastsProvider>
        <MobileOnlyGate>
          <Router />
        </MobileOnlyGate>
      </ToastsProvider>
    </StudioProvider>
  );
}
