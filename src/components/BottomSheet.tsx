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
  const [isDragging, setIsDragging] = useState(false);

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
      setIsDragging(true);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !sheetRef.current || !e.touches[0]) return;

    const touchY = e.touches[0].clientY;
    const diffY = touchY - touchStartY.current;

    // Only expand/squeeze if swiping up/down
    if (Math.abs(diffY) > 10) {
      // Swipe down gesture - if swiping down significantly, prepare to close
      if (diffY > 30) {
        const newHeight = Math.max(window.innerHeight * 0.1, touchStartHeight.current - diffY);
        setSheetHeight(`${newHeight}px`);
      } else if (diffY < -10) {
        // Swipe up - expand the sheet
        const newHeight = Math.min(
          window.innerHeight * 0.9, // 90% max height as requested
          touchStartHeight.current - diffY,
        );
        setSheetHeight(`${newHeight}px`);
      }
    }
  };

  const onTouchEnd = () => {
    if (touchStartY.current !== null) {
      const currentY = touchStartY.current;
      touchStartY.current = null;

      // Calculate if the swipe was significant enough to close
      if (currentY && sheetRef.current) {
        const currentHeight = sheetRef.current.clientHeight;
        const minThreshold = window.innerHeight * 0.2; // If less than 20% of screen height, close

        if (currentHeight < minThreshold) {
          onClose(); // Close if swiped down enough
        } else {
          // Reset to preferred height
          setSheetHeight(state === "open" ? "85vh" : "0vh"); // Changed to 85vh as requested (between 80-90%)
        }
      }
    }
    setIsDragging(false);
  };

  // Reset height when state changes
  useEffect(() => {
    setSheetHeight(state === "open" ? "85vh" : "0vh"); // Changed to 85vh as requested (between 80-90%)
  }, [state]);

  // Handle hardware back button for Android
  useEffect(() => {
    if (state !== "open") return;

    const handleBackButton = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    // Add the event listener for the back button
    const handler = (e: Event) => handleBackButton(e);
    window.addEventListener("popstate", handler);

    // Push a history state to handle the back button
    window.history.pushState({}, "");

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, [state, onClose]);

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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
                    : "bg-surface-card/60 hover:bg-hover-bg hover:text-text-strong border-transparent text-text-muted",
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
