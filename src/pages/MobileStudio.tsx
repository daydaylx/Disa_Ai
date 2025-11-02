import { lazy, Suspense } from "react";

import { MobilePageShell } from "../components/layout/MobilePageShell";

const EnhancedRolesInterface = lazy(() =>
  import("../components/roles/EnhancedRolesInterface").then((module) => ({
    default: module.EnhancedRolesInterface,
  })),
);

/**
 * MobileStudio Page - Enhanced Mobile Roles Selection Interface
 *
 * This page provides the new Material-Design Alternative B interface for browsing
 * and selecting AI roles with favorites, category navigation, and usage analytics.
 */
export default function MobileStudio() {
  return (
    <MobilePageShell contentClassName="flex min-h-0 flex-1 flex-col">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-text-muted">
            Rollen werden geladen…
          </div>
        }
      >
        <EnhancedRolesInterface />
      </Suspense>
    </MobilePageShell>
  );
}
