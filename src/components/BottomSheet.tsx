import { useState } from "react";

import { BottomSheet as BottomSheetUI } from "./ui/BottomSheet";

type BottomSheetState = "closed" | "open";
type PanelTab = "history" | "roles" | "models" | "settings";

interface BottomSheetProps {
  state: BottomSheetState;
  tab: PanelTab;
  onClose: () => void;
  onTabChange: (tab: PanelTab) => void;
}

const TABS: { key: PanelTab; label: string }[] = [
  { key: "history", label: "Chathistorie" },
  { key: "roles", label: "Rollen" },
  { key: "models", label: "Modelle" },
  { key: "settings", label: "Einstellungen" },
];

export function BottomSheet({ state, tab, onClose, onTabChange }: BottomSheetProps) {
  const [currentTab, setCurrentTab] = useState<PanelTab>(tab);

  const handleTabChange = (newTab: string) => {
    const tabKey = newTab as PanelTab;
    setCurrentTab(tabKey);
    onTabChange(tabKey);
  };

  const currentTabLabel = TABS.find((t) => t.key === currentTab)?.label || currentTab;

  return (
    <BottomSheetUI
      isOpen={state === "open"}
      onClose={onClose}
      title={currentTabLabel}
      enableTabs={true}
      tabs={TABS}
      activeTab={currentTab}
      onTabChange={handleTabChange}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 text-sm text-text-muted">
          {currentTabLabel} Inhalt wird hier angezeigt
        </div>
      </div>
    </BottomSheetUI>
  );
}
