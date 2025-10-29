import { SettingsView } from "../features/settings/SettingsView";

export default function SettingsAppearancePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SettingsView section="appearance" />
    </div>
  );
}
