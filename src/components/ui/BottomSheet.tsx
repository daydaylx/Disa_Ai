import * as React from "react";

import { cn } from "../../lib/utils/cn";

export interface BottomSheetProps {
  /** Sheet title */
  title?: string;
  /** Sheet content */
  children: React.ReactNode;
  /** Open state */
  open: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Optional className for additional styling */
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  title,
  children,
  open,
  onClose,
  className = "",
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="bg-background-deep/50 absolute inset-0 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        className={cn(
          "relative max-h-[80vh] w-full rounded-t-[28px] border border-border-strong bg-surface-200",
          className,
        )}
      >
        <div className="safe-top p-4">
          {/* Handle */}
          <div className="bg-text-muted/40 mx-auto mb-4 h-1 w-12 rounded-full" />

          {/* Header */}
          {(title || onClose) && (
            <div className="mb-4 flex items-center justify-between">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-text-muted/12 hover:bg-text-muted/20 tap-target flex items-center justify-center rounded-full"
                  aria-label="Schließen"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="safe-bottom">{children}</div>
        </div>
      </div>
    </div>
  );
};
