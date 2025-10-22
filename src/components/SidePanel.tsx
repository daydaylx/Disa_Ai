import { X } from "lucide-react";
import React, { type RefObject, useRef } from "react";

import { useFocusTrap } from "../hooks/useFocusTrap";
import { useSwipe } from "../hooks/useSwipe";
import { Glass } from "./Glass";

type PanelTab = "history" | "roles" | "models" | "settings";
type SidePanelState = "closed" | "peek" | "open";

interface SidePanelProps {
  state: SidePanelState;
  tab: PanelTab;
  onClose: () => void;
  onTabChange: (tab: PanelTab) => void;
  onSwipeRightToOpen?: () => void;
  onSwipeLeftToClose?: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  state,
  tab,
  onClose,
  onTabChange,
  onSwipeRightToOpen,
  onSwipeLeftToClose,
}) => {
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

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft: onSwipeLeftToClose,
    onSwipeRight: onSwipeRightToOpen,
  });

  // Focus trap setup
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef as RefObject<HTMLElement>, state === "open");

  return (
    <>
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        aria-hidden={state === "closed"}
        className={[
          "fixed inset-y-0 right-0 z-40 transition-transform",
          state === "closed" && "translate-x-full",
          state === "peek" && "translate-x-[calc(100%-24px)]",
          state === "open" && "translate-x-0",
        ]
          .filter(Boolean)
          .join(" ")}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Glass
          variant="strong"
          className="border-border/50 shadow-level2 h-full w-[88vw] max-w-[380px] border p-4"
        >
          {/* Close button */}
          <div className="mb-3 flex items-center justify-between">
            <h2 id="panel-title" className="text-lg font-semibold text-[var(--fg)]">
              Einstellungen
            </h2>
            <button
              onClick={onClose}
              className="focus:ring-brand rounded-full bg-surface-raised p-1 focus:outline-none focus:ring-2"
              aria-label="Panel schließen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <nav role="tablist" className="mb-4 flex gap-2">
            {tabs.map((t) => (
              <button
                role="tab"
                key={t}
                onClick={() => onTabChange(t)}
                aria-selected={t === tab}
                className={`relative px-3 py-2 text-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:content-[''] ${
                  t === tab
                    ? "text-[var(--acc1)] after:bg-[var(--acc1)] after:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--acc1)]"
                    : "text-[var(--fg-dim)] after:bg-[var(--acc1)] after:opacity-0 hover:after:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--acc1)]"
                }`}
              >
                {getTabLabel(t)}
              </button>
            ))}
          </nav>

          {/* Tab Content Placeholder */}
          <div className="flex-1 overflow-y-auto" role="tabpanel" aria-labelledby={`${tab}-tab`}>
            <div className="p-2 text-sm text-[var(--fg-dim)]">
              {getTabLabel(tab)} Inhalt wird hier angezeigt
            </div>
          </div>
        </Glass>
        {/* Scrim */}
        {state === "open" && (
          <div onClick={onClose} className="fixed inset-0 z-30 bg-black/40" aria-hidden="true" />
        )}
      </aside>
    </>
  );
};
