import React from "react";

export default function SettingsFAB() {
  return (
    <a
      href="#/settings"
      aria-label="Einstellungen öffnen"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/80 text-neutral-100 shadow-soft backdrop-blur transition active:scale-95"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm8 4l2-2-2-2h-2.1a7 7 0 0 0-1.1-1.9l1.5-1.5-2-2-1.5 1.5A7 7 0 0 0 12.1 2V0H10v2.1A7 7 0 0 0 8.1 3.2L6.6 1.7l-2 2 1.5 1.5A7 7 0 0 0 4 7.9H2v2h2.1a7 7 0 0 0 1.1 1.9L3.7 13.3l2 2 1.5-1.5a7 7 0 0 0 1.9 1.1V18h2v-2.1a7 7 0 0 0 1.9-1.1l1.5 1.5 2-2-1.5-1.5a7 7 0 0 0 1.1-1.9z" fill="currentColor"/>
      </svg>
    </a>
  );
}
