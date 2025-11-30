import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";

import {
  BookOpenCheck,
  Cat,
  Database,
  Palette,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
} from "../../lib/icons";
import { SettingsLayout } from "./SettingsLayout";

const SECTIONS = [
  {
    id: "memory",
    label: "Gedächtnis",
    description: "Verlauf speichern, Profil pflegen, automatische Wiederherstellung steuern.",
    icon: BookOpenCheck,
    to: "/settings/memory",
  },
  {
    id: "behavior",
    label: "KI Verhalten",
    description: "Kreativität, Stil und Systemprompt anpassen.",
    icon: SlidersHorizontal,
    to: "/settings/behavior",
  },
  {
    id: "appearance",
    label: "Darstellung",
    description: "Themes, Schrift und Lesbarkeit optimieren.",
    icon: Palette,
    to: "/settings/appearance",
  },
  {
    id: "youth",
    label: "Jugendschutz",
    description: "Inhaltsfilter und Altersfreigaben verwalten.",
    icon: Shield,
    to: "/settings/youth",
  },
  {
    id: "extras",
    label: "Experimente",
    description: "Neko, Animationen und Labs gezielt aktivieren.",
    icon: Cat,
    to: "/settings/extras",
  },
  {
    id: "api-data",
    label: "API & Daten",
    description: "Schlüssel hinterlegen, Export & Datenschutz steuern.",
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
      behavior: settings.creativity ? `${settings.creativity}% Kreativität` : "Standard",
      appearance: settings.theme ?? "System",
      youth: settings.showNSFWContent ? "NSFW erlaubt" : "Jugendschutz aktiv",
      extras: settings.enableNeko ? "Experimente an" : "Experimente aus",
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
      description="Alle Bereiche auf einen Blick."
    >
      <div className="space-y-6">
        <Card className="border border-border-ink/15" padding="sm">
          <CardHeader className="flex flex-row items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-primary">
              <SettingsIcon className="h-5 w-5" />
            </span>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg">Schnellstart</CardTitle>
              <CardDescription>
                Wähle einen Bereich, um mobil und auf Desktop dieselben Einstellungen zu erreichen.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-3 md:grid-cols-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                className="h-full cursor-pointer border border-border-ink/15 transition hover:border-accent-primary/40 hover:shadow-md"
                padding="sm"
                role="button"
                tabIndex={0}
                onClick={() => void navigate(section.to)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    void navigate(section.to);
                  }
                }}
              >
                <CardHeader className="flex flex-row items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-ink-secondary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle className="text-base">{section.label}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-auto text-[11px]">
                    {statusMap[section.id as keyof typeof statusMap]}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-xs text-ink-tertiary">
                    Tippe für Details und erweiterte Optionen.
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </SettingsLayout>
  );
}
