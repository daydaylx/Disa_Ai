import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { MobileOnlyGate } from "./components/layout/MobileOnlyGate";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { TooltipProvider } from "./components/ui/tooltip";

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
    <TooltipProvider>
      <StudioProvider>
        <ToastsProvider>
          <MobileOnlyGate>
            <Router />
          </MobileOnlyGate>
        </ToastsProvider>
      </StudioProvider>
    </TooltipProvider>
  );
}
