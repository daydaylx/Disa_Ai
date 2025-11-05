import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { BottomSheet } from "./ui/BottomSheet";
import { Button } from "./ui/button";

type PanelTab = "history" | "roles" | "models" | "settings";

const TABS: { key: PanelTab; label: string }[] = [
  { key: "history", label: "Chathistorie" },
  { key: "roles", label: "Rollen" },
  { key: "models", label: "Modelle" },
  { key: "settings", label: "Einstellungen" },
];

type BottomSheetEvent = CustomEvent<{
  action: "toggle" | "open" | "close";
  tab?: PanelTab;
}>;

export function BottomSheetButton() {
  const [sheetState, setSheetState] = useState<"closed" | "open">("closed");
  const [activeTab, setActiveTab] = useState<PanelTab>("history");

  const toggleSheet = () => {
    setSheetState((prev) => (prev === "closed" ? "open" : "closed"));
  };

  const closeSheet = () => {
    setSheetState("closed");
  };

  const changeTab = (tab: string) => {
    const tabKey = tab as PanelTab;
    setActiveTab(tabKey);
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

  const currentTabLabel = TABS.find((t) => t.key === activeTab)?.label || activeTab;

  return (
    <>
      {/* Floating Button to open the bottom sheet */}
      <Button
        type="button"
        variant="brand"
        size="icon"
        onClick={toggleSheet}
        className="fixed bottom-[var(--space-md)] right-[var(--space-md)] z-30 shadow-[var(--shadow-neumorphic-md)]"
        aria-label="Menü öffnen"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Bottom Sheet Component */}
      <BottomSheet
        isOpen={sheetState === "open"}
        onClose={closeSheet}
        title={currentTabLabel}
        enableTabs={true}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={changeTab}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 text-sm text-[var(--color-text-muted)]">
            {currentTabLabel} Inhalt wird hier angezeigt
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
