import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

import {
  BookOpenCheck,
  Cat,
  ChevronRight,
  Database,
  Palette,
  Shield,
  SlidersHorizontal,
} from "../../lib/icons";
import { SettingsLayout } from "./SettingsLayout";

const SECTIONS = [
  {
    id: "memory",
    label: "Gedächtnis",
    description: "Verlauf & Profil",
    icon: BookOpenCheck,
    to: "/settings/memory",
  },
  {
    id: "behavior",
    label: "KI Verhalten",
    description: "Kreativität & Stil",
    icon: SlidersHorizontal,
    to: "/settings/behavior",
  },
  {
    id: "appearance",
    label: "Darstellung",
    description: "Theme & Schrift",
    icon: Palette,
    to: "/settings/appearance",
  },
  {
    id: "youth",
    label: "Jugendschutz",
    description: "Filter & Sicherheit",
    icon: Shield,
    to: "/settings/youth",
  },
  {
    id: "extras",
    label: "Experimente",
    description: "Neko & Labs",
    icon: Cat,
    to: "/settings/extras",
  },
  {
    id: "api-data",
    label: "API & Daten",
    description: "Schlüssel & Export",
    icon: Database,
    to: "/settings/api-data",
  },
] as const;

export function TabbedSettingsView() {
  const navigate = useNavigate();
  const { isEnabled: memoryEnabled } = useMemory();
  const { settings } = useSettings();

  const statusMap = useMemo(
    () => ({
      memory: memoryEnabled ? "Aktiv" : "Aus",
      behavior: settings.creativity ? `${settings.creativity}%` : "Standard",
      appearance: settings.theme ?? "System",
      youth: settings.showNSFWContent ? "Offen" : "Filter aktiv",
      extras: settings.enableNeko ? "An" : "Aus",
      "api-data": settings.enableAnalytics ? "Analytics an" : "Analytics aus",
    }),
    [
      memoryEnabled,
      settings.creativity,
      settings.enableAnalytics,
      settings.enableNeko,
      settings.showNSFWContent,
      settings.theme,
    ],
  );

  return (
    <SettingsLayout activeTab="overview" description="Passe Disa an deine Bedürfnisse an.">
      <div className="space-y-2.5 pb-4xl">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const status = statusMap[section.id as keyof typeof statusMap];

          return (
            <button
              key={section.id}
              onClick={() => void navigate(section.to)}
              className={cn(
                "w-full flex items-center gap-4 p-xs rounded-2xl text-left",
                "bg-surface-1 border border-white/5 shadow-sm",
                "hover:bg-surface-2 hover:border-accent-settings-border/30 active:scale-[0.99] transition-all",
              )}
            >
              {/* Icon */}
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent-settings-dim flex items-center justify-center text-accent-settings">
                <Icon className="h-5 w-5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-primary">{section.label}</p>
                <p className="text-xs text-ink-tertiary leading-snug">{section.description}</p>
              </div>

              {/* Status */}
              <span className="text-[11px] font-medium text-ink-primary bg-surface-2 px-2xs py-3xs rounded-full border border-white/5 flex-shrink-0">
                {status}
              </span>

              {/* Chevron */}
              <ChevronRight className="h-4 w-4 text-ink-tertiary flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </SettingsLayout>
  );
}
