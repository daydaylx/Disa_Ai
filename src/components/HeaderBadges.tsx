import React from "react";

import { getSelectedModelId } from "../config/settings";

export default function HeaderBadges() {
  const modelId = getSelectedModelId() || "auto";
  return (
    <div className="header-sticky flex items-center gap-2">
      <div className="header-sticky rounded-full border border-white/30 bg-white/60 px-2.5 py-1 text-xs text-foreground backdrop-blur-md">
        <span className="header-sticky mr-1 opacity-70">Modell</span>
        <span className="header-sticky font-mono">{modelId}</span>
      </div>
    </div>
  );
}
