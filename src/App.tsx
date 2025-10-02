import "./index.css"; // Tailwind base/components/utilities
import "./styles/design-tokens.css"; // Design tokens (CSS variables)
import "./ui/base.css"; // Reset & base styles
import "./styles/a11y-improvements.css"; // A11y improvements

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { useServiceWorker } from "./hooks/useServiceWorker";

export default function App() {
  useServiceWorker();

  // Initialize viewport height after React mounts to avoid loading race conditions
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    function applyViewportHeight() {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${height}px`);
    }

    applyViewportHeight();

    const viewport = window.visualViewport;
    const handleResize = () => {
      window.requestAnimationFrame(applyViewportHeight);
    };

    viewport?.addEventListener("resize", handleResize);
    viewport?.addEventListener("scroll", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      viewport?.removeEventListener("resize", handleResize);
      viewport?.removeEventListener("scroll", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StudioProvider>
      <ToastsProvider>
        <Router />
      </ToastsProvider>
    </StudioProvider>
  );
}