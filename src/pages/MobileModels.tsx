import { MobilePageShell } from "../components/layout/MobilePageShell";
import { EnhancedModelsInterface } from "../components/models/EnhancedModelsInterface";

/**
 * MobileModels Page - Enhanced Mobile Model Selection Interface
 *
 * This page provides the new Material-Design Alternative B interface for browsing
 * and selecting AI models with favorites, performance bars, and dense information layout.
 */
export default function MobileModels() {
  return (
    <MobilePageShell contentClassName="flex min-h-0 flex-1 flex-col">
      <EnhancedModelsInterface />
    </MobilePageShell>
  );
}
