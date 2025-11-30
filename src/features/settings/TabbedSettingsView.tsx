import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  BookOpenCheck,
  Cat,
  Database,
  Palette,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
} from "../../lib/icons";
import { SettingsApiDataView } from "./SettingsApiDataView";
import { SettingsAppearanceView } from "./SettingsAppearanceView";
import { SettingsBehaviorView } from "./SettingsBehaviorView";
import { SettingsExtrasView } from "./SettingsExtrasView";
import { SettingsMemoryView } from "./SettingsMemoryView";
import { SettingsYouthFilterView } from "./SettingsYouthFilterView";

type SettingsTab =
  | "overview"
  | "memory"
  | "behavior"
  | "appearance"
  | "youth"
  | "extras"
  | "api-data";

interface Tab {
  id: SettingsTab;
  label: string;
  icon: typeof SettingsIcon;
  description: string;
}

const TABS: Tab[] = [
  {
    id: "overview",
    label: "Übersicht",
    icon: SettingsIcon,
    description: "Einstellungen auf einen Blick",
  },
  {
    id: "memory",
    label: "Gedächtnis",
    icon: BookOpenCheck,
    description: "Profil & Verlauf",
  },
  {
    id: "behavior",
    label: "KI Verhalten",
    icon: SlidersHorizontal,
    description: "Kreativität & Stil",
  },
  {
    id: "appearance",
    label: "Darstellung",
    icon: Palette,
    description: "Theme & Optik",
  },
  {
    id: "youth",
    label: "Jugendschutz",
    icon: Shield,
    description: "Inhaltsfilter",
  },
  {
    id: "extras",
    label: "Extras",
    icon: Cat,
    description: "Spielereien",
  },
  {
    id: "api-data",
    label: "API & Daten",
    icon: Database,
    description: "Schlüssel & Export",
  },
];

// Overview content component
function OverviewContent() {
  return (
    <div className="space-y-6">
      {/* Quick intro */}
      <div className="text-center py-4">
        <SettingsIcon className="h-12 w-12 text-accent-primary mx-auto mb-3" />
        <h2 className="text-xl font-bold text-ink-primary mb-1">Einstellungen</h2>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto">
          Wähle oben einen Tab, um spezifische Optionen zu konfigurieren.
        </p>
      </div>

      {/* Settings overview grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {TABS.slice(1).map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              className="p-4 rounded-xl bg-surface-2/50 border border-border-ink/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-accent-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-ink-primary text-sm">{tab.label}</h3>
                  <p className="text-xs text-ink-secondary truncate">{tab.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TabbedSettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent />;
      case "memory":
        return <SettingsMemoryView />;
      case "behavior":
        return <SettingsBehaviorView />;
      case "appearance":
        return <SettingsAppearanceView />;
      case "youth":
        return <SettingsYouthFilterView />;
      case "extras":
        return <SettingsExtrasView />;
      case "api-data":
        return <SettingsApiDataView />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="flex flex-col h-full text-ink-primary">
      {/* Tab Navigation - Horizontal scrollable on mobile */}
      <div className="border-b border-border-ink/10 bg-bg-page sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex overflow-x-auto gap-1 px-2 py-2 no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px]",
                    isActive
                      ? "bg-accent-primary text-white"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-surface-2",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-ink-tertiary")} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">{renderContent()}</div>
      </div>
    </div>
  );
}
