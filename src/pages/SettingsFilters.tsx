import { SettingsView } from "../features/settings/SettingsView";

export default function SettingsFiltersPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-1 flex-col bg-surface-bg text-text-primary">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        <SettingsView section="filters" />
      </main>
    </div>
  );
}
