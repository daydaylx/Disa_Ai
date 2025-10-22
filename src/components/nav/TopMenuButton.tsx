import { useState } from "react";

import AdvancedSettingsModal from "./AdvancedSettingsModal";
import TopMenuDropdown from "./TopMenuDropdown";

export default function TopMenuButton() {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleOpenAdvancedSettings = () => {
    setShowAdvancedSettings(true);
  };

  const handleCloseAdvancedSettings = () => {
    setShowAdvancedSettings(false);
  };

  return (
    <>
      <TopMenuDropdown onOpenAdvancedSettings={handleOpenAdvancedSettings} />
      <AdvancedSettingsModal isOpen={showAdvancedSettings} onClose={handleCloseAdvancedSettings} />
    </>
  );
}
