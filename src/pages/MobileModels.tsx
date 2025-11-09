import { lazy, Suspense } from "react";

const EnhancedModelsInterface = lazy(() =>
  import("../components/models/EnhancedModelsInterface").then((module) => ({
    default: module.EnhancedModelsInterface,
  })),
);

/**
 * MobileModels Page - Enhanced Mobile Model Selection Interface
 *
 * This page provides the new Material-Design Alternative B interface for browsing
 * and selecting AI models with favorites, performance bars, and dense information layout.
 */
export default function MobileModels() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-text-muted">
            Modelle werden geladen…
          </div>
        }
      >
        <EnhancedModelsInterface />
      </Suspense>
    </div>
  );
}
