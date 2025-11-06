import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";

import { BottomSheet } from "./BottomSheet";
import { Button } from "./ui/button";

type PanelTab = "history" | "roles" | "models" | "settings";

type BottomSheetEvent = CustomEvent<{
  action: "toggle" | "open" | "close";
  tab?: PanelTab;
}>;

export const BottomSheetButton: React.FC = () => {
  const [sheetState, setSheetState] = useState<"closed" | "open">("closed");
  const [activeTab, setActiveTab] = useState<PanelTab>("history");

  const toggleSheet = () => {
    setSheetState((prev) => (prev === "closed" ? "open" : "closed"));
  };

  const closeSheet = () => {
    setSheetState("closed");
  };

  const changeTab = (tab: PanelTab) => {
    setActiveTab(tab);
    // If the sheet is closed, opening it to the selected tab
    setSheetState("open");
  };

  useEffect(() => {
    const handleExternalToggle = (event: Event) => {
      const customEvent = event as BottomSheetEvent;
      if (!customEvent.detail) return;

      const { action, tab } = customEvent.detail;

      if (tab) {
        setActiveTab(tab);
      }

      if (action === "toggle") {
        setSheetState((prev) => (prev === "closed" ? "open" : "closed"));
        return;
      }

      if (action === "open") {
        setSheetState("open");
        return;
      }

      if (action === "close") {
        setSheetState("closed");
      }
    };

    window.addEventListener("disa:bottom-sheet", handleExternalToggle as EventListener);
    return () => {
      window.removeEventListener("disa:bottom-sheet", handleExternalToggle as EventListener);
    };
  }, []);

  return (
    <>
      {/* Floating Button to open the bottom sheet */}
      <Button
        type="button"
        variant="brand"
        size="icon"
        onClick={toggleSheet}
        className="fixed bottom-[var(--space-md)] right-[var(--space-md)] z-30 shadow-neo-md"
        aria-label="Menü öffnen"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Bottom Sheet Component */}
      <BottomSheet
        state={sheetState}
        tab={activeTab}
        onClose={closeSheet}
        onTabChange={changeTab}
      />
    </>
  );
};
