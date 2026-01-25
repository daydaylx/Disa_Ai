import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { Brain, Cpu, Palette, RotateCcw, Shield, Sparkles, User, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";
import { Button } from "@/ui/Button";

export type ContextTab = "role" | "style" | "output" | "model";

interface OverflowSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ContextTab;
}

export function OverflowSheet({ isOpen, onClose, initialTab = "role" }: OverflowSheetProps) {
  const [activeTab, setActiveTab] = useState<ContextTab>(initialTab);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Sync initial tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Contexts
  const { activeRole, setActiveRole, roles } = useRoles();
  const { models } = useModelCatalog();
  const {
    settings,
    setCreativity,
    setDiscussionPreset,
    setPreferredModel,
    setMemoryEnabled,
    setSafetyFilter,
  } = useSettings();

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end isolate">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "relative w-full max-h-[85vh] flex flex-col",
          "bg-surface-1 border-t border-white/10 rounded-t-2xl shadow-2xl",
          "animate-in slide-in-from-bottom duration-300 ease-out",
          "pb-safe-bottom",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Kontext Einstellungen"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h2 className="text-sm font-medium text-ink-primary">Einstellungen</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
          <TabButton
            active={activeTab === "role"}
            onClick={() => setActiveTab("role")}
            icon={<User className="h-4 w-4" />}
            label="Rolle"
          />
          <TabButton
            active={activeTab === "style"}
            onClick={() => setActiveTab("style")}
            icon={<Palette className="h-4 w-4" />}
            label="Stil"
          />
          <TabButton
            active={activeTab === "output"}
            onClick={() => setActiveTab("output")}
            icon={<Sparkles className="h-4 w-4" />}
            label="Kreativität"
          />
          <TabButton
            active={activeTab === "model"}
            onClick={() => setActiveTab("model")}
            icon={<Cpu className="h-4 w-4" />}
            label="Modell"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-[300px] p-4">
          {activeTab === "role" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-ink-tertiary uppercase tracking-wider">
                  Verfügbare Rollen
                </p>
                {activeRole && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveRole(null)}
                    className="h-7 text-xs"
                  >
                    Zurücksetzen
                  </Button>
                )}
              </div>
              <ListItem
                active={!activeRole}
                onClick={() => setActiveRole(null)}
                title="Standard"
                description="Keine spezielle Rolle"
              />
              {roles.map((role) => (
                <ListItem
                  key={role.id}
                  active={activeRole?.id === role.id}
                  onClick={() => setActiveRole(role)}
                  title={role.name}
                  description={role.description}
                />
              ))}
            </div>
          )}

          {activeTab === "style" && (
            <div className="space-y-3">
              <p className="text-xs text-ink-tertiary uppercase tracking-wider mb-2">
                Gesprächsstil
              </p>
              {discussionPresetOptions.map((preset) => (
                <ListItem
                  key={preset.key}
                  active={settings.discussionPreset === preset.key}
                  onClick={() => setDiscussionPreset(preset.key)}
                  title={preset.label}
                  description={preset.description}
                />
              ))}
            </div>
          )}

          {activeTab === "output" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs text-ink-tertiary uppercase tracking-wider mb-2">
                  Kreativität & Temperatur
                </p>
                {creativityOptions.map((option) => (
                  <ListItem
                    key={option.value}
                    active={settings.creativity === Number(option.value)}
                    onClick={() => setCreativity(Number(option.value))}
                    title={option.label}
                    description={option.description}
                  />
                ))}
              </div>

              {/* Additional Toggles */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-xs text-ink-tertiary uppercase tracking-wider mb-2">
                  Erweiterte Einstellungen
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={settings.memoryEnabled ? "primary" : "outline"}
                    onClick={() => setMemoryEnabled(!settings.memoryEnabled)}
                    className="justify-start"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Memory {settings.memoryEnabled ? "An" : "Aus"}
                  </Button>
                  <Button
                    variant={settings.safetyFilter ? "primary" : "outline"}
                    onClick={() => setSafetyFilter(!settings.safetyFilter)}
                    className="justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Safety {settings.safetyFilter ? "An" : "Aus"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "model" && (
            <div className="space-y-3">
              <p className="text-xs text-ink-tertiary uppercase tracking-wider mb-2">
                KI-Modell wählen
              </p>
              {models?.map((model) => (
                <ListItem
                  key={model.id}
                  active={settings.preferredModelId === model.id}
                  onClick={() => setPreferredModel(model.id)}
                  title={model.label || model.id}
                  description={model.description || model.id.split("/").pop()}
                />
              ))}
            </div>
          )}
        </div>

        {/* Global Reset (Footer) */}
        <div className="p-4 border-t border-white/10 bg-surface-2/30">
          <Button
            variant="ghost"
            className="w-full text-ink-tertiary hover:text-ink-primary"
            onClick={() => {
              setActiveRole(null);
              setDiscussionPreset("locker_neugierig");
              setCreativity(45);
              setPreferredModel(models?.[0]?.id || "");
              setMemoryEnabled(false);
              setSafetyFilter(true);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Alle Einstellungen zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

// Sub-components
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 min-w-[80px] py-3 px-2 flex flex-col items-center gap-1.5 transition-colors border-b-2",
        active
          ? "border-accent-chat text-accent-chat"
          : "border-transparent text-ink-tertiary hover:text-ink-primary hover:bg-white/5",
      )}
    >
      <div className={cn("p-1 rounded-lg", active && "bg-accent-chat/10")}>{icon}</div>
      <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
    </button>
  );
}

function ListItem({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl border cursor-pointer transition-all active:scale-[0.98]",
        active
          ? "border-accent-chat bg-accent-chat/10"
          : "border-transparent bg-surface-2/50 hover:bg-surface-2 hover:border-white/10",
      )}
    >
      <div className={cn("font-medium text-sm", active ? "text-accent-chat" : "text-ink-primary")}>
        {title}
      </div>
      {description && (
        <div className="text-xs text-ink-secondary mt-0.5 line-clamp-2">{description}</div>
      )}
    </div>
  );
}

// Data Options
const creativityOptions = [
  { value: "10", label: "Präzise (10%)", description: "Sehr präzise, fokussierte Antworten" },
  { value: "30", label: "Klar (30%)", description: "Klar und strukturiert" },
  { value: "45", label: "Ausgewogen (45%)", description: "Standard-Einstellung" },
  { value: "70", label: "Kreativ (70%)", description: "Ideenreich und vielseitig" },
  { value: "90", label: "Verspielt (90%)", description: "Maximale Kreativität" },
];

const discussionPresetOptions: { key: DiscussionPresetKey; label: string; description: string }[] =
  [
    {
      key: "locker_neugierig",
      label: "Locker & Neugierig",
      description: "Entspannt, humorvoll, neugierig",
    },
    {
      key: "edgy_provokant",
      label: "Edgy & Provokant",
      description: "Direkt, herausfordernd, pointiert",
    },
    {
      key: "nuechtern_pragmatisch",
      label: "Nüchtern & Pragmatisch",
      description: "Sachlich, effizient, auf den Punkt",
    },
    {
      key: "akademisch_formell",
      label: "Akademisch & Formell",
      description: "Strukturiert, fundiert, wissenschaftlich",
    },
    {
      key: "freundlich_offen",
      label: "Freundlich & Offen",
      description: "Warm, einladend, verständnisvoll",
    },
    {
      key: "analytisch_detailliert",
      label: "Analytisch & Detailliert",
      description: "Gründlich, tiefgehend, präzise",
    },
    {
      key: "sarkastisch_witzig",
      label: "Sarkastisch & Witzig",
      description: "Ironisch, unterhaltsam",
    },
    {
      key: "fachlich_tiefgehend",
      label: "Fachlich & Tiefgehend",
      description: "Technisch exakt, expertenorientiert",
    },
  ];
