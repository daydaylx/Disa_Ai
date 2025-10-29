import { MobilePageShell } from "../components/layout/MobilePageShell";
import { SettingsView } from "../features/settings/SettingsView";

export default function SettingsMemoryPage() {
  return (
    <MobilePageShell contentClassName="flex min-h-0 flex-1 flex-col">
      <SettingsView section="memory" />
    </MobilePageShell>
  );
}
