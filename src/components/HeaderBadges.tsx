import React from "react";
import { getSelectedModelId } from "../config/settings";

export default function HeaderBadges() {
  const modelId = getSelectedModelId() || "auto";
  return (
    <div className="flex items-center gap-2">
      <div className="chip">
        <span className="opacity-70 mr-1">Modell</span>
        <span className="font-mono">{modelId}</span>
      </div>
    </div>
  );
}
