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

    const applyViewportHeight = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
    };

    applyViewportHeight();
    window.addEventListener("resize", applyViewportHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", applyViewportHeight);
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
