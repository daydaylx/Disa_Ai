import React from "react";

import { Icon } from "./ui/Icon";

type Props = {
  nsfw: boolean;
  onToggleNSFW: () => void;
  onClearAll: () => void;
};

export default function StickyActions({ nsfw, onToggleNSFW, onClearAll }: Props) {
  return (
    <div className="sticky top-[48px] z-10 mb-4">
      <div className="rounded-2xl p-[1px]">
        <div className="glass">
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 md:px-4">
            <a href="#/" className="nav-pill">
              <Icon name="sparkles" width="16" height="16" />
              <span className="text-sm">Neue Unterhaltung</span>
            </a>
            <button
              type="button"
              onClick={onToggleNSFW}
              className={nsfw ? "nav-pill nav-pill--active" : "nav-pill"}
            >
              <Icon name="warning" width="16" height="16" />
              <span className="text-sm">{nsfw ? "NSFW an" : "NSFW aus"}</span>
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="nav-pill"
            >
              <Icon name="close" width="16" height="16" />
              <span className="text-sm">Alle lokalen Daten löschen</span>
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs opacity-70">
              <Icon name="info" width="14" height="14" />
              <span>Tip: Dev-Panel Alt+D</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
