import "./index.css"; // Tailwind base/components/utilities
import "./styles/design-tokens.css"; // Design tokens (CSS variables)
import "./styles/overlay-tokens.css"; // WCAG AA compliant overlay & menu tokens
import "./styles/mobile-fixes.css"; // Mobile viewport and scaling fixes
import "./styles/bottomsheet.css"; // Bottom sheet specific styles
import "./ui/base.css"; // Reset & base styles
import "./styles/a11y-improvements.css"; // A11y improvements
import "./styles/mobile-enhanced.css"; // Mobile-enhanced styles
import "./styles/mobile-layout.css"; // Mobile layout styles

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { MobileOnlyGate } from "./components/layout/MobileOnlyGate";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";

export default function App() {
  // Initialize viewport height with optimized throttling for scroll performance
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const applyViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    applyViewportHeight();
    window.addEventListener("resize", applyViewportHeight, { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(applyViewportHeight, 100);
    });

    return () => {
      window.removeEventListener("resize", applyViewportHeight);
      window.removeEventListener("orientationchange", applyViewportHeight);
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
