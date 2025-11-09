import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React, { lazy, Suspense } from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { useEdgeSwipeDrawer } from "./hooks/useEdgeSwipe";
import { useServiceWorker } from "./hooks/useServiceWorker";

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
      <Router />
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
