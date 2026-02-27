import "./index.css"; // Consolidated CSS: tokens, base, components, Tailwind

import React, { lazy, Suspense, useEffect, useRef } from "react";

import { Button } from "@/ui/Button";
import { ToastsProvider } from "@/ui/toast";
import { TooltipProvider } from "@/ui/Tooltip";

import { Router } from "./app/router";
import { FullPageLoader } from "./components/FullPageLoader";
import { NekoLayer } from "./components/neko/NekoLayer";
import { PWAInstallModal } from "./components/pwa/PWAInstallModal";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ModelCatalogProvider } from "./contexts/ModelCatalogContext";
import { RolesProvider } from "./contexts/RolesContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { useServiceWorker } from "./hooks/useServiceWorker";
import { useSettings } from "./hooks/useSettings";
import { setAnalyticsEnabled } from "./lib/analytics";
import { syncMetadataFromConversations } from "./lib/conversation-manager-modern";
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
  const { settings } = useSettings();

  // Apply analytics opt-in/out
  useEffect(() => {
    setAnalyticsEnabled(settings.enableAnalytics);
  }, [settings.enableAnalytics]);

  // Sync metadata from conversations on startup to fix any missing metadata entries
  useEffect(() => {
    void syncMetadataFromConversations()
      .then((result) => {
        if (result.synced > 0) {
          console.warn(
            `[Storage] Synced ${result.synced} missing metadata entries (${result.alreadySynced} already synced)`,
          );
        }
        if (result.errors.length > 0) {
          console.warn("[Storage] Sync errors:", result.errors);
        }
      })
      .catch((error) => {
        console.error("[Storage] Failed to sync metadata:", error);
      });
  }, []);

  return (
    <div className="bg-app min-h-screen-mobile w-full phone-frame-wrapper">
      <div className="phone-frame-content">
        <SentryErrorBoundary
          fallback={({ error, resetError }) => (
            <div className="flex min-h-screen-mobile flex-col items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-surface-2 p-8 shadow-raiseLg">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-text-primary">Unerwarteter Fehler</h1>
                  <p className="mt-2 text-text-secondary">
                    Entschuldigung, es ist ein unerwarteter Fehler aufgetreten. Das Problem wurde
                    automatisch gemeldet.
                  </p>
                  <p className="mt-3 text-sm text-text-secondary">
                    <a
                      className="text-accent hover:underline"
                      href="#"
                      onClick={() => window.location.reload()}
                    >
                      Neu laden
                    </a>{" "}
                    oder wende dich an unseren Support unter{" "}
                    <a className="text-accent hover:underline" href="mailto:support@disa.ai">
                      support@disa.ai
                    </a>
                    , falls das Problem bestehen bleibt.
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
          <Suspense fallback={<FullPageLoader message="Inhalt wird geladen" />}>
            <Router />
          </Suspense>
          <div id="app-overlay-root" className="absolute inset-0 pointer-events-none" />
          <NekoLayer />
          <PWAInstallModal />
        </SentryErrorBoundary>
        <Suspense fallback={<FullPageLoader message="Einstellungen werden geladen" />}>
          <FeatureFlagPanel />
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  // Initialize viewport height with optimized throttling for scroll performance and fix overflow
  const prevBodyOverflowRef = useRef<string>("");
  const prevDocOverflowRef = useRef<string>("");
  const rafIdRef = useRef<number | null>(null);
  const lastHeightRef = useRef(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

    const applyViewportHeight = () => {
      const height = getViewportHeight();
      if (Math.abs(height - lastHeightRef.current) < 1) return;
      lastHeightRef.current = height;
      const vh = height * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const scheduleViewportHeight = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        applyViewportHeight();
      });
    };

    const handleOrientationChange = () => {
      setTimeout(scheduleViewportHeight, 100);
    };

    // Apply initial styles to prevent horizontal scrolling
    prevBodyOverflowRef.current = document.body.style.overflowX;
    prevDocOverflowRef.current = document.documentElement.style.overflowX;
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    window.__disaSetViewportHeight = scheduleViewportHeight;
    scheduleViewportHeight();
    window.addEventListener("resize", scheduleViewportHeight, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange);
    window.visualViewport?.addEventListener("resize", scheduleViewportHeight, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleViewportHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", scheduleViewportHeight);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.visualViewport?.removeEventListener("resize", scheduleViewportHeight);
      window.visualViewport?.removeEventListener("scroll", scheduleViewportHeight);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (window.__disaSetViewportHeight === scheduleViewportHeight) {
        delete window.__disaSetViewportHeight;
      }
      document.body.style.overflowX = prevBodyOverflowRef.current;
      document.documentElement.style.overflowX = prevDocOverflowRef.current;
    };
  }, []);

  return (
    <SettingsProvider>
      <TooltipProvider>
        <RolesProvider>
          <ModelCatalogProvider>
            <FavoritesProvider>
              <ToastsProvider>
                <AppContent />
              </ToastsProvider>
            </FavoritesProvider>
          </ModelCatalogProvider>
        </RolesProvider>
      </TooltipProvider>
    </SettingsProvider>
  );
}
