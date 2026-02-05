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
import { analytics, setAnalyticsEnabled } from "./lib/analytics";
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

  // Apply notification preference (best-effort)
  useEffect(() => {
    if (!settings.enableNotifications) return;
    if (typeof window === "undefined" || typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, [settings.enableNotifications]);

  // Track route-level page view when analytics enabled
  useEffect(() => {
    if (typeof window !== "undefined" && settings.enableAnalytics) {
      analytics.trackPageView(window.location.pathname);
    }
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
