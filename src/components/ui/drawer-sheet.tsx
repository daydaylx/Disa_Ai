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
  const previousBodyOverflowRef = useRef<string | null>(null);
  const previousBodyPositionRef = useRef<string | null>(null);
  const previousScrollYRef = useRef<number>(0);
  const historyMarkerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    if (typeof window === "undefined") return undefined;

    closedViaHistoryRef.current = false;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Enhanced scroll lock for iOS Safari
    previousScrollYRef.current = window.scrollY;
    previousBodyOverflowRef.current = document.body.style.overflow;
    previousBodyPositionRef.current = document.body.style.position;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${previousScrollYRef.current}px`;
    document.body.style.width = "100%";

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

    historyMarkerRef.current = Date.now();
    const existingState = (window.history.state ?? null) as Record<string, unknown> | null;
    const marker = {
      ...(existingState ?? {}),
      [HISTORY_FLAG]: historyMarkerRef.current,
    };
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

      // Restore scroll position and body styles
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
      } else {
        document.body.style.overflow = "";
      }
      if (previousBodyPositionRef.current !== null) {
        document.body.style.position = previousBodyPositionRef.current;
      } else {
        document.body.style.position = "";
      }
      document.body.style.top = "";
      document.body.style.width = "";

      // Restore scroll position
      window.scrollTo(0, previousScrollYRef.current);

      previousBodyOverflowRef.current = null;
      previousBodyPositionRef.current = null;
      previousFocusRef.current?.focus?.();

      const currentState = (window.history.state ?? null) as Record<string, unknown> | null;
      const stateMarker = currentState?.[HISTORY_FLAG];
      if (
        !closedViaHistoryRef.current &&
        historyMarkerRef.current !== null &&
        typeof stateMarker === "number" &&
        stateMarker === historyMarkerRef.current
      ) {
        window.history.back();
      }
      historyMarkerRef.current = null;
      closedViaHistoryRef.current = false;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex bg-[var(--color-overlay-scrim)]/80">
      <button
        aria-label="Overlay schließen"
        className="absolute inset-0 h-full w-full cursor-pointer"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative ml-auto flex h-full w-full max-w-[min(22rem,calc(100vw-3rem))] flex-col",
          "border-l border-[var(--color-border-hairline)]",
          "bg-[var(--color-overlay-dialog-bg)] text-[var(--color-text-primary)]",
          "shadow-[var(--shadow-overlay)]",
          "pb-[max(env(safe-area-inset-bottom),1rem)] pt-[max(env(safe-area-inset-top),1rem)]",
          "animate-in slide-in-from-right duration-medium",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border-hairline)] px-6 pb-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary-focus-ring)]"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm leading-relaxed">{children}</div>
        {footer ? (
          <div className="border-t border-[var(--color-border-hairline)] px-6 pt-3">
            <div className="pb-[env(safe-area-inset-bottom)]">{footer}</div>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
