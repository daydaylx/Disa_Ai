import { Menu } from "lucide-react";
import React, { useState } from "react";

import { BottomSheet } from "./BottomSheet";

type PanelTab = "history" | "roles" | "models" | "settings";

export const BottomSheetButton: React.FC = () => {
  const [sheetState, setSheetState] = useState<"closed" | "open">("closed");
  const [activeTab, setActiveTab] = useState<PanelTab>("history");

  const toggleSheet = () => {
    setSheetState(sheetState === "closed" ? "open" : "closed");
  };

  const closeSheet = () => {
    setSheetState("closed");
  };

  const changeTab = (tab: PanelTab) => {
    setActiveTab(tab);
    // If the sheet is closed, opening it to the selected tab
    if (sheetState === "closed") {
      setSheetState("open");
    }
  };

  return (
    <>
      {/* Floating Button to open the bottom sheet */}
      <button
        onClick={toggleSheet}
        className="glass glass--subtle fixed bottom-4 right-4 z-30 rounded-full border border-border/60 p-3 shadow-lg"
        aria-label="Menü öffnen"
      >
        <Menu size={20} />
      </button>

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
