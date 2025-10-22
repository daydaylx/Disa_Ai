import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
  const [sheetHeight, setSheetHeight] = useState("25vh"); // Start with 25% of viewport height

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

  // Refs for touch handling
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartHeight = useRef<number>(0);

  // Touch event handlers for expanding/collapsing
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartY.current = e.touches[0].clientY;
      if (sheetRef.current) {
        touchStartHeight.current = sheetRef.current.clientHeight;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !sheetRef.current || !e.touches[0]) return;

    const touchY = e.touches[0].clientY;
    const diffY = touchY - touchStartY.current;

    // Only expand/squeeze if swiping up/down
    if (Math.abs(diffY) > 10) {
      const newHeight = Math.min(
        window.innerHeight * 0.9,
        Math.max(100, touchStartHeight.current - diffY),
      );
      setSheetHeight(`${newHeight}px`);
    }
  };

  const onTouchEnd = () => {
    touchStartY.current = null;
    // Reset to default heights after user interaction
    setTimeout(() => {
      setSheetHeight(state === "open" ? "25vh" : "0vh");
    }, 100);
  };

  // Reset height when state changes
  useEffect(() => {
    setSheetHeight(state === "open" ? "25vh" : "0vh");
  }, [state]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity ${
          state === "open" ? "opacity-40" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`bottom-sheet-container bottom-sheet-transition bottom-sheet-gpu-accel rounded-t-2xl shadow-2xl ${state === "open" ? "translate-y-0" : "translate-y-full"} `}
        style={{
          height: sheetHeight,
          maxHeight: "70vh", // Maximum 70% of viewport height
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="bottom-sheet-safe-area border-border h-full w-full border bg-surface-popover p-4 shadow-popover">
          {/* Drag handle for better UX */}
          <div className="mb-3 flex w-full justify-center">
            <div className="bottom-sheet-drag-handle" />
          </div>

          {/* Header with close button */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-text-strong text-lg font-semibold">{getTabLabel(tab)}</h2>
            <button
              onClick={onClose}
              className="focus-visible:ring-brand rounded-full bg-surface-raised p-1 focus-visible:outline-none focus-visible:ring-2"
              aria-label="Panel schließen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <nav className="mb-4 flex gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTabChange(t)}
                className={cn(
                  "focus-visible:ring-brand whitespace-nowrap rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2",
                  t === tab
                    ? "border-brand/50 bg-brand/15 text-brand shadow-neon"
                    : "bg-surface-glass-card/60 hover:bg-hover-bg hover:text-text-strong border-transparent text-text-muted",
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
