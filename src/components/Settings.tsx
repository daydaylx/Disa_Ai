import React, { useState } from "react";

import { SoftDepthSurface } from "./Glass";

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
      <SoftDepthSurface variant="standard" className="rounded-xl p-4">
        <h3 className="mb-3 font-semibold text-[var(--color-text-primary)]">Erscheinungsbild</h3>
        <div className="flex gap-2">
          <button
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              theme === "dark"
                ? "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] shadow-md"
                : "bg-[var(--color-surface-card)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-raised)]"
            }`}
            onClick={() => onThemeChange("dark")}
          >
            Dunkel
          </button>
          <button
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              theme === "light"
                ? "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] shadow-md"
                : "bg-[var(--color-surface-card)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-raised)]"
            }`}
            onClick={() => onThemeChange("light")}
          >
            Hell
          </button>
        </div>
      </SoftDepthSurface>

      <SoftDepthSurface variant="standard" className="rounded-xl p-4">
        <h3 className="mb-3 font-semibold text-[var(--color-text-primary)]">Datenschutz</h3>
        <div className="space-y-2">
          <button
            className="w-full rounded-xl p-3 text-left text-[var(--color-text-primary)] bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-raised)] transition-colors"
            onClick={() => setShowConfirmClear(true)}
          >
            Cache leeren
          </button>
          <button
            className="w-full rounded-xl p-3 text-left text-[var(--color-status-danger-fg)] bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-status-danger-bg)] hover:text-[var(--color-status-danger-fg)] transition-colors"
            onClick={() => setShowConfirmDelete(true)}
          >
            Verlauf löschen
          </button>
        </div>
      </SoftDepthSurface>

      {/* Confirm dialogs */}
      {showConfirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-confirm-title"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirmClear(false)}
            aria-hidden="true"
          />
          <SoftDepthSurface
            variant="strong"
            className="relative mt-6 w-[min(92vw,400px)] max-h-[80dvh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur-md shadow-xl p-5"
          >
            <p id="clear-confirm-title" className="mb-5 text-[var(--color-text-primary)]">
              Dadurch werden temporäre Dateien gelöscht. Die Aktion kann nicht rückgängig gemacht
              werden.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg px-4 py-2 font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                onClick={() => setShowConfirmClear(false)}
              >
                Abbrechen
              </button>
              <button
                className="rounded-lg bg-[var(--color-status-danger-fg)] px-4 py-2 font-medium text-[var(--color-text-on-accent)] hover:bg-[var(--color-status-danger-border)] transition-colors"
                onClick={() => {
                  onClearCache();
                  setShowConfirmClear(false);
                }}
              >
                Löschen
              </button>
            </div>
          </SoftDepthSurface>
        </div>
      )}

      {showConfirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirmDelete(false)}
            aria-hidden="true"
          />
          <SoftDepthSurface
            variant="strong"
            className="relative mt-6 w-[min(92vw,400px)] max-h-[80dvh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur-md shadow-xl p-5"
          >
            <h3
              id="delete-confirm-title"
              className="mb-2 font-bold text-[var(--color-text-primary)]"
            >
              Verlauf löschen?
            </h3>
            <p className="mb-5 text-[var(--color-text-primary)]">
              Dadurch werden alle Chat-Verläufe gelöscht. Die Aktion kann nicht rückgängig gemacht
              werden.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg px-4 py-2 font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                onClick={() => setShowConfirmDelete(false)}
              >
                Abbrechen
              </button>
              <button
                className="rounded-lg bg-[var(--color-status-danger-fg)] px-4 py-2 font-medium text-[var(--color-text-on-accent)] hover:bg-[var(--color-status-danger-border)] transition-colors"
                onClick={() => {
                  onDeleteHistory();
                  setShowConfirmDelete(false);
                }}
              >
                Löschen
              </button>
            </div>
          </SoftDepthSurface>
        </div>
      )}
    </div>
  );
};
