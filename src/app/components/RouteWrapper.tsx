import { type ReactNode, Suspense } from "react";

import { ErrorBoundary } from "../../components/ErrorBoundary";
import { AppShell } from "../layouts/AppShell";

function SimpleLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
    </div>
  );
}

export function RouteWrapper({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ErrorBoundary>
        <Suspense fallback={<SimpleLoader />}>{children}</Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
