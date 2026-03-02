import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { X } from "@/lib/icons";
import { getOverlayRoot, lockActiveScrollOwner } from "@/lib/overlay";
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

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
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
  const sheetRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      const sheetElement = sheetRef.current;
      if (!sheetElement) return;

      const focusableElements = getFocusableElements(sheetElement);
      const target = focusableElements[0] ?? closeButtonRef.current ?? sheetElement;
      target.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const sheetElement = sheetRef.current;
      if (!sheetElement) return;

      const focusableElements = getFocusableElements(sheetElement);
      if (focusableElements.length === 0) {
        event.preventDefault();
        sheetElement.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) return;

      const activeElement = document.activeElement as HTMLElement | null;
      const isOutsideSheet = !activeElement || !sheetElement.contains(activeElement);

      if (event.shiftKey) {
        if (isOutsideSheet || activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus({ preventScroll: true });
        }
      } else if (isOutsideSheet || activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const unlockScroll = lockActiveScrollOwner();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockScroll();

      const previousFocus = previousFocusRef.current;
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocusRef.current = null;
    };
  }, [onClose, open]);

  const overlayRoot = getOverlayRoot();

  if (!open) return null;

  const sheetContent = (
    <>
      <button
        type="button"
        aria-label="Detailansicht schließen"
        className="fixed inset-0 z-bottom-sheet pointer-events-auto bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Details"}
        tabIndex={-1}
        className={cn(
          "fixed inset-x-0 bottom-0 z-bottom-sheet pointer-events-auto animate-slide-up rounded-t-2xl border-t border-white/10 bg-surface-2/95 px-4 pb-[calc(var(--inset-safe-bottom,0px)+12px)] pt-3 shadow-2xl backdrop-blur-xl",
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
              ref={closeButtonRef}
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
    </>
  );

  if (!overlayRoot) return sheetContent;

  return createPortal(sheetContent, overlayRoot);
}
