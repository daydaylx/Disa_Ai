import { X } from "lucide-react";
import React from "react";

import { useSwipeablePanel } from "../hooks/useSwipeablePanel";
import { cn } from "../lib/utils";

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

  // Use the swipeable panel hook for all touch handling
  const { sheetRef, sheetHeight, isDragging, touchHandlers } = useSwipeablePanel({
    isOpen: state === "open",
    onClose,
    initialHeight: "85vh",
    minHeightThreshold: 0.2,
    maxHeightPercentage: 0.9,
  });

  return (
    <>
      {/* Backdrop overlay - scrim */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          state === "open" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`bottom-sheet-container bottom-sheet-transition bottom-sheet-gpu-accel rounded-t-2xl shadow-2xl ${
          state === "open" && !isDragging
            ? "translate-y-0"
            : state === "closed"
              ? "translate-y-full"
              : ""
        }`}
        style={{
          height: sheetHeight,
          maxHeight: "90vh", // Maximum 90vh as requested
        }}
        {...touchHandlers}
        // Add aria attributes for accessibility
        role="dialog"
        aria-modal="true"
        aria-label={getTabLabel(tab)}
        aria-hidden={state !== "open"}
      >
        <div className="bottom-sheet-safe-area border-border h-full w-full border bg-surface-popover p-4 shadow-popover">
          {/* Drag handle for better UX - more prominent */}
          <div className="mb-3 flex w-full justify-center touch-none">
            <div className="bottom-sheet-drag-handle h-[3px] w-[36px] rounded-full bg-[var(--color-text-secondary)]" />
          </div>

          {/* Header with close button */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-text-strong text-lg font-semibold">{getTabLabel(tab)}</h2>
            <button
              onClick={onClose}
              className="focus-visible:ring-brand rounded-full bg-surface-raised p-2 focus-visible:outline-none focus-visible:ring-2 touch-target-preferred"
              aria-label="Panel schließen"
            >
              <X size={20} />
            </button>
          </div>

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
                    ? "border-brand/50 bg-brand/15 text-brand shadow-neon"
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
      </div>
    </>
  );
};
