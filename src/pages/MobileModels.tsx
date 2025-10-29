import { MobilePageShell } from "../components/layout/MobilePageShell";
import { MobileModelsInterface } from "../components/models/MobileModelsInterface";

/**
 * MobileModels Page - Mobile Model Selection Interface
 *
 * This page provides a mobile-optimized interface for browsing and selecting AI models.
 * It leverages the reusable MobileModelsInterface component for all functionality.
 */
export default function MobileModels() {
  return (
    <MobilePageShell contentClassName="flex min-h-0 flex-1 flex-col">
      <MobileModelsInterface />
    </MobilePageShell>
  );
}
