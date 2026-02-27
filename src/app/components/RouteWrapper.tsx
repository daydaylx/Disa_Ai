import { type ReactNode, Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { FullPageLoader } from "../../components/FullPageLoader";
import { useSettings } from "../../hooks/useSettings";
import { analytics } from "../../lib/analytics";
import { AppShell } from "../layouts/AppShell";

interface RouteWrapperProps {
  children: ReactNode;
  pageHeaderTitle?: string;
  pageHeaderActions?: ReactNode;
}

export function RouteWrapper({ children, pageHeaderTitle, pageHeaderActions }: RouteWrapperProps) {
  const location = useLocation();
  const { settings } = useSettings();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!settings.enableAnalytics) {
      return;
    }

    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    if (lastTrackedPathRef.current === fullPath) {
      return;
    }

    analytics.trackPageView(fullPath);
    lastTrackedPathRef.current = fullPath;
  }, [settings.enableAnalytics, location.pathname, location.search, location.hash]);

  return (
    <AppShell pageHeaderTitle={pageHeaderTitle} pageHeaderActions={pageHeaderActions}>
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader message="Seite wird geladen" />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
