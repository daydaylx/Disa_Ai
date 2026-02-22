import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

import { X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Detailansicht schließen"
        className="fixed inset-0 z-bottom-sheet bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={title || "Details"}
        className={cn(
          "fixed inset-x-0 bottom-0 z-bottom-sheet animate-slide-up rounded-t-2xl border-t border-white/10 bg-surface-2/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 shadow-2xl backdrop-blur-xl",
          className,
        )}
      >
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-base font-semibold text-ink-primary">{title}</h3>
              )}
              {description && <p className="mt-1 text-xs text-ink-secondary">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface-1 text-ink-secondary transition-colors hover:text-ink-primary"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">{children}</div>

          {footer ? <div className="pt-3">{footer}</div> : null}
        </div>
      </section>
    </>,
    document.body,
  );
}
