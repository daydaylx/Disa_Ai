import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { FeatureFlagPanel } from "./components/dev/FeatureFlagPanel";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { useEdgeSwipeDrawer } from "./hooks/useEdgeSwipe";

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

  // Edge-Swipe Navigation für BottomSheet
  const handleOpenDrawer = React.useCallback(() => {
    // Dispatch das gleiche Event wie Header-Button
    window.dispatchEvent(
      new CustomEvent("disa:bottom-sheet", {
        detail: { action: "open" as const },
      }),
    );
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("disa:bottom-sheet", {
        detail: { action: "close" as const },
      }),
    );
  }, []);

  // Edge-Swipe Integration - funktioniert nur auf Touch-Geräten mit Feature-Flag
  useEdgeSwipeDrawer(
    false, // isDrawerOpen - wird vom BottomSheetButton verwaltet
    handleOpenDrawer,
    handleCloseDrawer,
    {
      edgeWidth: 30, // Etwas breiter für bessere UX
      minDX: 60, // Mindestbewegung
      maxDY: 120, // Max vertikale Bewegung
      delay: 50, // Kurze Verzögerung gegen Unfälle
    },
  );

  return (
    <TooltipProvider>
      <StudioProvider>
        <FavoritesProvider>
          <ToastsProvider>
            <Router />
            <FeatureFlagPanel />
          </ToastsProvider>
        </FavoritesProvider>
      </StudioProvider>
    </TooltipProvider>
  );
}
