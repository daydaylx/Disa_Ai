import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React, { lazy, Suspense, useRef } from "react";

import { Button } from "@/ui/Button";
import { ToastsProvider } from "@/ui/toast";
import { TooltipProvider } from "@/ui/Tooltip";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { SentryErrorBoundary } from "./lib/monitoring/sentry";

declare global {
  interface Window {
    __disaSetViewportHeight?: () => void;
  }
}

const FeatureFlagPanel = lazy(() =>
  import("./components/dev/FeatureFlagPanel").then((module) => ({
    default: module.FeatureFlagPanel,
  })),
);

// AppContent component that runs inside the providers
function AppContent() {
  useServiceWorker(); // Now safely inside ToastsProvider

  return (
    <>
      <SentryErrorBoundary
        fallback={({ error, resetError }) => (
          <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-line bg-surface-card/80 p-8 shadow-overlay backdrop-blur-lg">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-text-primary">Unerwarteter Fehler</h1>
                <p className="mt-2 text-text-secondary">
                  Entschuldigung, es ist ein unerwarteter Fehler aufgetreten. Das Problem wurde
                  automatisch gemeldet.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button onClick={resetError} variant="primary" className="w-full">
                  Erneut versuchen
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="secondary"
                  className="w-full"
                >
                  Zur Startseite
                </Button>
              </div>
              {import.meta.env.DEV && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-text-tertiary">
                    Fehlerdetails (nur in Entwicklung)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded-md bg-surface-muted p-3 text-xs text-text-subtle">
                    {error instanceof Error ? error.stack : String(error)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
        showDialog={false}
      >
        <Router />
      </SentryErrorBoundary>
      <Suspense fallback={null}>
        <FeatureFlagPanel />
      </Suspense>
    </>
  );
}

export default function App() {
  // Initialize viewport height with optimized throttling for scroll performance and fix overflow
  const prevBodyOverflowRef = useRef<string>("");
  const prevDocOverflowRef = useRef<string>("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const applyViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const handleOrientationChange = () => {
      setTimeout(applyViewportHeight, 100);
    };

    // Apply initial styles to prevent horizontal scrolling
    prevBodyOverflowRef.current = document.body.style.overflowX;
    prevDocOverflowRef.current = document.documentElement.style.overflowX;
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    window.__disaSetViewportHeight = applyViewportHeight;
    applyViewportHeight();
    window.addEventListener("resize", applyViewportHeight, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", applyViewportHeight);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (window.__disaSetViewportHeight === applyViewportHeight) {
        delete window.__disaSetViewportHeight;
      }
      document.body.style.overflowX = prevBodyOverflowRef.current;
      document.documentElement.style.overflowX = prevDocOverflowRef.current;
    };
  }, []);

  return (
    <TooltipProvider>
      <StudioProvider>
        <FavoritesProvider>
          <ToastsProvider>
            <AppContent />
          </ToastsProvider>
        </FavoritesProvider>
      </StudioProvider>
    </TooltipProvider>
  );
}
