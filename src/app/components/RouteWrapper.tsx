import { type ReactNode, Suspense } from "react";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { FullPageLoader } from "../../components/FullPageLoader";
import { AppShell } from "../layouts/AppShell";

export function RouteWrapper({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader message="Seite wird geladen" />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
