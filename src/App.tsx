import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React, { lazy, Suspense } from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { useEdgeSwipeDrawer } from "./hooks/useEdgeSwipe";
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

  // Edge-Swipe Navigation für BottomSheet
  const handleOpenDrawer = React.useCallback(() => {
    // Dispatch das gleiche Event wie Header-Button
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
  useEdgeSwipeDrawer(
    false, // isDrawerOpen - wird vom BottomSheetButton verwaltet
    handleOpenDrawer,
    edgeSwipeOptions,
  );

  return (
    <>
      <SentryErrorBoundary
        fallback={({ error, resetError }) => (
          <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-neumorphic-base)] p-8 text-center">
            <div className="max-w-md">
              <h1 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
                Unerwarteter Fehler
              </h1>
              <p className="mb-6 text-[var(--color-text-secondary)]">
                Entschuldigung, es ist ein unerwarteter Fehler aufgetreten. Das Problem wurde
                automatisch gemeldet.
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetError}
                  className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-white font-medium hover:bg-[var(--color-brand-primary-hover)] transition-colors"
                >
                  Erneut versuchen
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--surface-neumorphic-floating)] transition-colors"
                >
                  Zur Startseite
                </button>
              </div>
              {import.meta.env.DEV && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-[var(--color-text-tertiary)]">
                    Fehlerdetails (nur in Entwicklung)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                    {error.stack}
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
  // Initialize viewport height with optimized throttling for scroll performance
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const applyViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const handleOrientationChange = () => {
      setTimeout(applyViewportHeight, 100);
    };

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
