import { MobilePageShell } from "../components/layout/MobilePageShell";
import { EnhancedRolesInterface } from "../components/roles/EnhancedRolesInterface";

/**
 * MobileStudio Page - Enhanced Mobile Roles Selection Interface
 *
 * This page provides the new Material-Design Alternative B interface for browsing
 * and selecting AI roles with favorites, category navigation, and usage analytics.
 */
export default function MobileStudio() {
  return (
    <MobilePageShell contentClassName="flex min-h-0 flex-1 flex-col">
      <EnhancedRolesInterface />
    </MobilePageShell>
  );
}
