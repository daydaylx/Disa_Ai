import React, { useState } from "react";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { Cpu, MoreHorizontal,Palette, Sparkles, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";

import { ContextAction } from "./ContextAction";
import { type ContextTab,OverflowSheet } from "./OverflowSheet";

export function ContextBar({ className }: { className?: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<ContextTab>("role");

  const { activeRole } = useRoles();
  const { models } = useModelCatalog();
  const { settings } = useSettings();

  const openSheet = (tab: ContextTab) => {
    setInitialTab(tab);
    setSheetOpen(true);
  };

  // derived labels
  const roleLabel = activeRole?.name || "Standard";

  const discussionPresetLabels: Record<DiscussionPresetKey, string> = {
    locker_neugierig: "Locker",
    edgy_provokant: "Edgy",
    nuechtern_pragmatisch: "Nüchtern",
    akademisch_formell: "Akademisch",
    freundlich_offen: "Freundlich",
    analytisch_detailliert: "Analytisch",
    sarkastisch_witzig: "Sarkastisch",
    fachlich_tiefgehend: "Fachlich",
  };
  const presetLabel = discussionPresetLabels[settings.discussionPreset] || "Standard";

  const creativityLabel = `${settings.creativity}%`;

  const selectedModel = models?.find((m) => m.id === settings.preferredModelId);
  const modelLabel = selectedModel?.label?.split("/").pop() || selectedModel?.id?.split("/").pop() || "Modell";

  return (
    <>
      <div
        className={cn(
          "w-full flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade py-1",
          // Ensure touch scrolling works smoothly
          "touch-pan-x",
          className
        )}
        role="toolbar"
        aria-label="Kontext Aktionen"
      >
        <ContextAction
          icon={<User className="h-4 w-4" />}
          label={roleLabel}
          isActive={!!activeRole}
          onClick={() => openSheet("role")}
          aria-label={`Rolle: ${roleLabel}`}
        />

        <ContextAction
          icon={<Palette className="h-4 w-4" />}
          label={presetLabel}
          onClick={() => openSheet("style")}
          aria-label={`Stil: ${presetLabel}`}
        />

        <ContextAction
          icon={<Sparkles className="h-4 w-4" />}
          label={creativityLabel}
          onClick={() => openSheet("output")}
          aria-label={`Kreativität: ${creativityLabel}`}
        />

        <ContextAction
          icon={<Cpu className="h-4 w-4" />}
          label={modelLabel}
          onClick={() => openSheet("model")}
          aria-label={`Modell: ${modelLabel}`}
        />

        <div className="flex-1" /> {/* Spacer if needed, or just let them flow */}

        <ContextAction
          label=""
          icon={<MoreHorizontal className="h-5 w-5" />}
          onClick={() => openSheet("role")} // Default to role or last active?
          className="px-2 min-w-[40px]"
          aria-label="Mehr Einstellungen"
        />
      </div>

      <OverflowSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialTab={initialTab}
      />
    </>
  );
}
