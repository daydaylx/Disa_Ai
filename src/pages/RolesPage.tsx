import { lazy, Suspense } from "react";

const EnhancedRolesInterface = lazy(() =>
  import("../components/roles/EnhancedRolesInterface").then((module) => ({
    default: module.EnhancedRolesInterface,
  })),
);

/**
 * RolesPage - Material Design Roles Browser
 *
 * Uses the enhanced Material-Design roles interface with:
 * - Real roles from persona.json (via StudioContext)
 * - Favorites & usage tracking
 * - Category navigation
 * - Material depth system (raised/inset)
 */
export default function RolesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-text-muted">
            Rollen werden geladen…
          </div>
        }
      >
        <EnhancedRolesInterface />
      </Suspense>
    </div>
  );
}
