import React, { useState } from "react";

import { Glass } from "./Glass";

interface SettingsProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  onClearCache: () => void;
  onDeleteHistory: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  onThemeChange,
  onClearCache,
  onDeleteHistory,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="space-y-4">
      <Glass variant="subtle" className="rounded-lg p-3">
        <div className="flex gap-2">
          <button
            className={`rounded-full px-3 py-1 text-sm ${
              theme === "dark"
                ? "bg-[var(--acc1)] text-[var(--bg0)]"
                : "bg-[rgba(255,255,255,0.1)] text-[var(--fg)]"
            }`}
            onClick={() => onThemeChange("dark")}
          >
            Dunkel
          </button>
          <button
            className={`rounded-full px-3 py-1 text-sm ${
              theme === "light"
                ? "bg-[var(--acc1)] text-[var(--bg0)]"
                : "bg-[rgba(255,255,255,0.1)] text-[var(--fg)]"
            }`}
            onClick={() => onThemeChange("light")}
          >
            Hell
          </button>
        </div>
      </Glass>

      <Glass variant="subtle" className="rounded-lg p-3">
        <h3 className="mb-2 font-medium text-[var(--fg)]">Datenschutz</h3>
        <div className="space-y-2">
          <button
            className="w-full rounded p-2 text-left text-[var(--fg)] hover:bg-[rgba(255,255,255,0.05)]"
            onClick={() => setShowConfirmClear(true)}
          >
            Cache leeren
          </button>
          <button
            className="w-full rounded p-2 text-left text-[var(--fg)] text-red-500 hover:bg-[rgba(255,255,255,0.05)]"
            onClick={() => setShowConfirmDelete(true)}
          >
            Verlauf löschen
          </button>
        </div>
      </Glass>

      {/* Confirm dialogs */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Glass variant="standard" className="w-full max-w-sm rounded-lg p-4">
            <p className="mb-4 text-sm text-[var(--fg-dim)]">
              Dadurch werden temporäre Dateien gelöscht. Die Aktion kann nicht rückgängig gemacht
              werden.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded px-3 py-1 text-[var(--fg)]"
                onClick={() => setShowConfirmClear(false)}
              >
                Abbrechen
              </button>
              <button
                className="rounded bg-red-500 px-3 py-1 text-white"
                onClick={() => {
                  onClearCache();
                  setShowConfirmClear(false);
                }}
              >
                Löschen
              </button>
            </div>
          </Glass>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Glass variant="standard" className="w-full max-w-sm rounded-lg p-4">
            <h3 className="mb-2 font-bold text-[var(--fg)]">Verlauf löschen?</h3>
            <p className="mb-4 text-sm text-[var(--fg-dim)]">
              Dadurch werden alle Chat-Verläufe gelöscht. Die Aktion kann nicht rückgängig gemacht
              werden.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded px-3 py-1 text-[var(--fg)]"
                onClick={() => setShowConfirmDelete(false)}
              >
                Abbrechen
              </button>
              <button
                className="rounded bg-red-500 px-3 py-1 text-white"
                onClick={() => {
                  onDeleteHistory();
                  setShowConfirmDelete(false);
                }}
              >
                Löschen
              </button>
            </div>
          </Glass>
        </div>
      )}
    </div>
  );
};
