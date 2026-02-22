import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { Badge, BottomSheet, Button, EmptyState, ListRow, SettingsSkeleton } from "@/ui";

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

type SettingsSection = (typeof SECTIONS)[number];

export function loadSettingsSections(): Promise<SettingsSection[]> {
  return Promise.resolve([...SECTIONS]);
}

interface TabbedSettingsViewProps {
  loadSections?: () => Promise<SettingsSection[]>;
}

export function TabbedSettingsView({
  loadSections = loadSettingsSections,
}: TabbedSettingsViewProps = {}) {
  const { isEnabled: memoryEnabled } = useMemory();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sections, setSections] = useState<SettingsSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const refreshSections = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const loadedSections = await loadSections();
      setSections(loadedSections);

      if (loadedSections.length === 0) {
        setSelectedSectionId(null);
      }
    } catch (error) {
      console.error("Failed to load settings sections", error);
      setSections([]);
      setSelectedSectionId(null);
      setLoadError("Einstellungsbereiche konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  }, [loadSections]);

  useEffect(() => {
    void refreshSections();
  }, [refreshSections]);

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
  const selectedSection = sections.find((section) => section.id === selectedSectionId) ?? null;
  const selectedSectionStatus = selectedSection
    ? statusMap[selectedSection.id as keyof typeof statusMap]
    : null;

  return (
    <SettingsLayout
      activeTab="overview"
      title="Einstellungen"
      description="Passe Disa an deine Bedürfnisse an."
    >
      <div className="space-y-3 pb-4xl">
        {isLoading ? (
          <SettingsSkeleton count={6} />
        ) : loadError ? (
          <EmptyState
            title="Einstellungen konnten nicht geladen werden"
            description={loadError}
            className="rounded-2xl border border-status-error/25 bg-status-error/10"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void refreshSections();
                }}
              >
                Erneut versuchen
              </Button>
            }
          />
        ) : sections.length === 0 ? (
          <EmptyState
            title="Keine Einstellungsbereiche verfügbar"
            description="Derzeit sind keine Bereiche für die Einstellungen hinterlegt."
            className="rounded-2xl border border-white/10 bg-surface-1/40"
          />
        ) : (
          sections.map((section) => {
            const Icon = section.icon;
            const status = statusMap[section.id as keyof typeof statusMap];

            return (
              <ListRow
                key={section.id}
                title={section.label}
                subtitle={section.description}
                onPress={() => {
                  void navigate(section.to);
                }}
                pressLabel={`${section.label} öffnen`}
                accentClassName="bg-accent-settings"
                className={cn(
                  "border-white/[0.08]",
                  "hover:border-accent-settings-border/60 hover:bg-surface-2/65",
                )}
                leading={
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-settings-surface text-accent-settings transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                }
                topRight={
                  <Badge className="h-5 border border-accent-settings-border/50 bg-accent-settings-dim/70 px-2 text-[11px] font-semibold text-ink-primary shadow-sm">
                    {status}
                  </Badge>
                }
                trailing={
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedSectionId(section.id);
                    }}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg bg-transparent px-2 text-xs text-ink-tertiary transition-colors hover:bg-surface-2/70 hover:text-ink-primary"
                  >
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                }
              />
            );
          })
        )}
      </div>

      <BottomSheet
        open={!!selectedSection}
        onClose={() => setSelectedSectionId(null)}
        title={selectedSection?.label}
        description={selectedSection?.description}
        footer={
          selectedSection ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedSectionId(null)}
              >
                Schließen
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedSectionId(null);
                  void navigate(selectedSection.to);
                }}
              >
                Öffnen
              </Button>
            </div>
          ) : null
        }
      >
        {selectedSection ? (
          <div className="rounded-xl border border-accent-settings-border/30 bg-accent-settings-dim/30 px-4 py-4">
            <p className="text-sm text-ink-secondary">
              Aktueller Status:{" "}
              <span className="font-semibold text-ink-primary">{selectedSectionStatus}</span>
            </p>
          </div>
        ) : null}
      </BottomSheet>
    </SettingsLayout>
  );
}
