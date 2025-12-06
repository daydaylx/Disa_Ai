import { type ReactNode, Suspense } from "react";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { FullPageLoader } from "../../components/FullPageLoader";
import { AppShell } from "../layouts/AppShell";

interface RouteWrapperProps {
  children: ReactNode;
  pageHeaderTitle?: string;
  pageHeaderActions?: ReactNode;
}

export function RouteWrapper({ children, pageHeaderTitle, pageHeaderActions }: RouteWrapperProps) {
  return (
    <AppShell pageHeaderTitle={pageHeaderTitle} pageHeaderActions={pageHeaderActions}>
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader message="Seite wird geladen" />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
