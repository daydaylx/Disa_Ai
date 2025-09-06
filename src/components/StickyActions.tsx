import React from "react";

import Icon from "./Icon";

type Props = {
  nsfw: boolean;
  onToggleNSFW: () => void;
  onClearAll: () => void;
};

export default function StickyActions({ nsfw, onToggleNSFW, onClearAll }: Props) {
  return (
    <div className="sticky top-[48px] z-10 mb-4">
      <div className="rounded-2xl bg-gradient-to-tr from-neutral-500/25 via-neutral-500/10 to-transparent p-[1px]">
        <div className="rounded-2xl border border-white/30 bg-white/65 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/55">
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 md:px-4">
            <a
              href="#/"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 transition hover:bg-neutral-100/60 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
            >
              <Icon name="sparkles" width="16" height="16" />
              <span className="text-sm">Neue Unterhaltung</span>
            </a>
            <button
              type="button"
              onClick={onToggleNSFW}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${
                nsfw
                  ? "border-blue-600 bg-blue-600 text-white hover:brightness-110"
                  : "border-neutral-300 hover:bg-neutral-100/60 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
              }`}
            >
              <Icon name="nsfw" width="16" height="16" />
              <span className="text-sm">{nsfw ? "NSFW an" : "NSFW aus"}</span>
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 transition hover:bg-neutral-100/60 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
            >
              <Icon name="shield" width="16" height="16" />
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
