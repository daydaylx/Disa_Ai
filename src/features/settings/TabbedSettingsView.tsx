import { useMemo, useState } from "react";

import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { getCategoryStyle } from "@/lib/categoryColors";
import { cn } from "@/lib/utils";
import { Badge, Card, SettingsSkeleton } from "@/ui";

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
    label: "KI‑Verhalten",
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
  const { isEnabled: memoryEnabled } = useMemory();
  const { settings } = useSettings();
  const [isLoading] = useState(false); // For future async loading

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
    <SettingsLayout
      activeTab="overview"
      title="Einstellungen"
      description="Passe Disa an deine Bedürfnisse an."
    >
      <div className="space-y-3 pb-4xl">
        {isLoading ? (
          <SettingsSkeleton count={6} />
        ) : (
          SECTIONS.map((section) => {
            const Icon = section.icon;
            const status = statusMap[section.id as keyof typeof statusMap];
            const theme = getCategoryStyle("Settings");

            return (
              <Card
                key={section.id}
                variant="roleStrong"
                notch="none"
                padding="none"
                style={{ background: theme.roleGradient }}
                className={cn(
                  "relative transition-all duration-300 group overflow-hidden",
                  "hover:brightness-110",
                  theme.hoverBorder,
                )}
              >
                {/* Status Badge - Top Right */}
                <div className="absolute right-3 top-3 z-20">
                  <Badge
                    className={cn("text-[10px] px-2 h-5 shadow-sm", theme.badge, theme.badgeText)}
                  >
                    {status}
                  </Badge>
                </div>

                {/* Main Row - Clickable area */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer pointer-events-none"
                  aria-label={`${section.label} öffnen`}
                >
                  {/* Invisible clickable overlay */}
                  <div
                    className="absolute inset-0 cursor-pointer pointer-events-auto z-0"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.assign(section.to);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (typeof window !== "undefined") {
                          window.location.assign(section.to);
                        }
                      }
                    }}
                    aria-label={`${section.label} öffnen`}
                  />

                  {/* Icon */}
                  <div
                    className={cn(
                      "relative flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                      theme.iconBg,
                      theme.iconText,
                      theme.groupHoverIconBg,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Info */}
                  <div className="relative flex-1 min-w-0">
                    <span
                      className={cn(
                        "font-semibold text-sm truncate block",
                        "text-ink-primary group-hover:text-ink-primary",
                      )}
                    >
                      {section.label}
                    </span>
                    <p className="text-xs text-ink-secondary truncate mt-1">
                      {section.description}
                    </p>
                  </div>

                  {/* Chevron */}
                  <div className="relative z-10 pr-10">
                    <ChevronRight className="h-4 w-4 text-ink-tertiary" />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </SettingsLayout>
  );
}
