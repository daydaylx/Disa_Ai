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
      <div className="text-center py-8">
        <SettingsIcon className="h-16 w-16 text-brand mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">DisaAI Einstellungen</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Personalisiere deine KI-Erfahrung. Wähle einen Tab oben, um spezifische Einstellungen zu
          konfigurieren.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
        {TABS.slice(1).map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.id} className="p-4 rounded-xl bg-surface-2 border border-surface-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-md bg-brand/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <h3 className="font-semibold text-text-primary">{tab.label}</h3>
              </div>
              <p className="text-sm text-text-secondary">{tab.description}</p>
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
    <div className="flex flex-col h-full text-text-primary">
      {/* Tab Navigation */}
      <div className="border-b border-surface-2 bg-surface-1/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Tabs */}
          <div className="hidden md:flex overflow-x-auto px-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                    isActive
                      ? "border-brand text-brand bg-brand/5"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:border-surface-1",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-brand" : "text-text-tertiary")} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Tab Slider */}
          <div className="md:hidden px-4 py-3">
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar snap-x">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-shrink-0 snap-start flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all min-w-[72px]",
                      isActive
                        ? "bg-brand text-white shadow-brandGlow"
                        : "bg-surface-2 text-text-secondary hover:bg-surface-3",
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4", isActive ? "text-white" : "text-text-tertiary")}
                    />
                    <span className="text-[11px] leading-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">{renderContent()}</div>
      </div>
    </div>
  );
}
