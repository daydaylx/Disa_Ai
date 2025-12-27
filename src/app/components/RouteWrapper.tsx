import { type ReactNode, Suspense } from "react";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { FullPageLoader } from "../../components/FullPageLoader";
import { AppShell } from "../layouts/AppShell";

interface RouteWrapperProps {
  children: ReactNode;
  pageHeaderTitle?: string;
  pageHeaderActions?: ReactNode;
  layout?: "shell" | "page";
}

export function RouteWrapper({
  children,
  pageHeaderTitle,
  pageHeaderActions,
  layout,
}: RouteWrapperProps) {
  return (
    <AppShell
      pageHeaderTitle={pageHeaderTitle}
      pageHeaderActions={pageHeaderActions}
      layout={layout}
    >
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader message="Seite wird geladen" />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
