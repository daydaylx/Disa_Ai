import { useState } from "react";

import BottomSheetSettings from "../BottomSheetSettings";
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
      <BottomSheetSettings isOpen={showAdvancedSettings} onClose={handleCloseAdvancedSettings} />
    </>
  );
}
