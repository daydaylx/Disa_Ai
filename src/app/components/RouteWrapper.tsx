import { Suspense, type ReactNode } from "react";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { AppShell } from "../layouts/AppShell";

export function RouteWrapper({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="h-4 w-24 animate-pulse rounded bg-gray-300" aria-label="Laden..."></div>
          }
        >
          {children}
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
