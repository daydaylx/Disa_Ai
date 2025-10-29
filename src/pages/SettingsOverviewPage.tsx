import { MobilePageShell } from "../components/layout/MobilePageShell";
import { SettingsOverview } from "../features/settings/SettingsOverview";

export default function SettingsOverviewPage() {
  return (
    <MobilePageShell contentClassName="flex min-h-0 flex-1 flex-col">
      <SettingsOverview />
    </MobilePageShell>
  );
}
