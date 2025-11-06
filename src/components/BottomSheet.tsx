import React from "react";

import { cn } from "../lib/utils";
import { BottomSheet as BaseBottomSheet } from "./ui/BottomSheet";

type BottomSheetState = "closed" | "open";
type PanelTab = "history" | "roles" | "models" | "settings";

interface BottomSheetProps {
  state: BottomSheetState;
  tab: PanelTab;
  onClose: () => void;
  onTabChange: (tab: PanelTab) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ state, tab, onClose, onTabChange }) => {
  const tabs: PanelTab[] = ["history", "roles", "models", "settings"];

  const getTabLabel = (t: PanelTab): string => {
    switch (t) {
      case "history":
        return "Chathistorie";
      case "roles":
        return "Rollen";
      case "models":
        return "Modelle";
      case "settings":
        return "Einstellungen";
      default:
        return t;
    }
  };

  return (
    <BaseBottomSheet isOpen={state === "open"} onClose={onClose} title={getTabLabel(tab)}>
      <div className="p-4">
        {/* Tabs */}
        <nav className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTabChange(t)}
              className={cn(
                "focus-visible:ring-brand touch-target-preferred whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 min-w-[88px] min-h-[40px]",
                t === tab
                  ? "border-brand/50 bg-brand/15 text-brand shadow-glow-brand"
                  : "bg-card/60 hover:bg-hover-bg hover:text-text-strong border-transparent text-text-muted",
              )}
              aria-selected={t === tab}
            >
              {getTabLabel(t)}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 text-sm text-text-muted">
            {getTabLabel(tab)} Inhalt wird hier angezeigt
          </div>
        </div>
      </div>
    </BaseBottomSheet>
  );
};
