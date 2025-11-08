import { type ReactNode, Suspense } from "react";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { PageLoader } from "../../components/layout/PageLoader";
import { AppShell } from "../layouts/AppShell";

export function RouteWrapper({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
