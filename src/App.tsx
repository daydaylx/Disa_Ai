import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React, { lazy, Suspense } from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { EnhancedBottomNav } from "./components/layout/EnhancedBottomNav";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import { Button } from "./components/ui/button";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { useEdgeSwipeDrawer } from "./hooks/useEdgeSwipe";
import { useFeatureFlag } from "./hooks/useFeatureFlags";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { SentryErrorBoundary } from "./lib/monitoring/sentry";

const FeatureFlagPanel = lazy(() =>
  import("./components/dev/FeatureFlagPanel").then((module) => ({
    default: module.FeatureFlagPanel,
  })),
);

// AppContent component that runs inside the providers
function AppContent() {
  useServiceWorker(); // Now safely inside ToastsProvider

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const isNewNavEnabled = useFeatureFlag("enhancedNavigation");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>;
      if (typeof customEvent.detail?.open === "boolean") {
        setIsDrawerOpen(customEvent.detail.open);
      }
    };

    window.addEventListener("disa:bottom-sheet-state", handleStateChange as EventListener);

    return () => {
      window.removeEventListener("disa:bottom-sheet-state", handleStateChange as EventListener);
    };
  }, []);

  // Edge-Swipe Navigation für BottomSheet
  const handleOpenDrawer = React.useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("disa:bottom-sheet", {
        detail: { action: "open" as const },
      }),
    );
  }, []);

  const edgeSwipeOptions = React.useMemo(
    () => ({
      edgeWidth: 30, // Etwas breiter für bessere UX
      minDX: 60, // Mindestbewegung
      maxDY: 120, // Max vertikale Bewegung
      delay: 50, // Kurze Verzögerung gegen Unfälle
    }),
    [],
  );

  // Edge-Swipe Integration - funktioniert nur auf Touch-Geräten mit Feature-Flag
  useEdgeSwipeDrawer(isDrawerOpen, handleOpenDrawer, edgeSwipeOptions);

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
                <Button onClick={resetError} variant="default" className="w-full">
                  Erneut versuchen
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
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
        <div className="pb-16">
          <Router />
        </div>
        {isNewNavEnabled ? <EnhancedBottomNav /> : <MobileBottomNav />}
      </SentryErrorBoundary>
      <Suspense fallback={null}>
        <FeatureFlagPanel />
      </Suspense>
    </>
  );
}

export default function App() {
  // Initialize viewport height with optimized throttling for scroll performance and fix overflow
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
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    applyViewportHeight();
    window.addEventListener("resize", applyViewportHeight, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", applyViewportHeight);
      window.removeEventListener("orientationchange", handleOrientationChange);
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
