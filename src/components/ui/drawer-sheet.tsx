import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/utils";

interface DrawerSheetProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

const HISTORY_FLAG = "disa-drawer";

export function DrawerSheet({ title, isOpen, onClose, children, footer }: DrawerSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closedViaHistoryRef = useRef(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    closedViaHistoryRef.current = false;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const sheet = sheetRef.current;
        if (!sheet) return;
        const focusable = sheet.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handlePopState = () => {
      closedViaHistoryRef.current = true;
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    const marker = { ...window.history.state, [HISTORY_FLAG]: Date.now() };
    window.history.pushState(marker, "");

    const focusTimeout = window.setTimeout(() => {
      const focusable = sheetRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 40);

    return () => {
      window.clearTimeout(focusTimeout);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
      if (!closedViaHistoryRef.current) {
        window.history.back();
      }
      closedViaHistoryRef.current = false;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[var(--color-overlay-scrim)]/80">
      <button
        aria-label="Overlay schließen"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative rounded-t-[var(--radius-card)] border border-[var(--color-border-hairline)]",
          "bg-[var(--color-overlay-dialog-bg)] text-[var(--color-text-primary)]",
          "shadow-[var(--shadow-overlay)]",
          "pb-[calc(env(safe-area-inset-bottom)+1rem)]",
          "animate-in slide-in-from-bottom duration-medium",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border-hairline)] px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)]"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[65dvh] overflow-y-auto px-5 py-4 text-sm leading-relaxed">
          {children}
        </div>
        {footer ? (
          <div className="border-t border-[var(--color-border-hairline)] px-5 py-3">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
