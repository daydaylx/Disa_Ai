import { X } from "../../lib/icons";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { cn } from "../../lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  enableTabs?: boolean;
  tabs?: { key: string; label: string }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  enableTabs = false,
  tabs = [],
  activeTab,
  onTabChange,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const sheet = sheetRef.current;
      if (!sheet) return;

      const focusableElements = sheet.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleFocusTrap);

    setTimeout(() => {
      const firstFocusable = sheetRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as HTMLElement;
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="mobile-scrim-overlay fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bottom-sheet-title"
    >
      <div
        ref={sheetRef}
        className={cn(
          "mobile-chat-history-sidebar animate-in slide-in-from-bottom fixed inset-x-0 bottom-0 max-h-[90vh] duration-300",
          // Android-optimized: Better contrast and shadows
          "bg-[var(--surface-neumorphic-floating)] rounded-t-[var(--radius-2xl)] border-t-[var(--border-neumorphic-light)]",
          "shadow-[var(--shadow-neumorphic-xl)]",
          // Safe areas
          "pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "android-scroll touch-target-preferred",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-3 pt-4">
          <div className="bg-[var(--color-border-subtle)] h-1.5 w-12 rounded-full" />
        </div>

        <div className="flex items-center justify-between border-b border-[var(--border-neumorphic-subtle)] px-6 py-4">
          <h2
            id="bottom-sheet-title"
            className="text-[var(--color-text-primary)] text-lg font-semibold"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-200",
              "min-h-[44px] min-w-[44px]", // Android touch target
              "bg-[var(--surface-neumorphic-raised)]",
              "text-[var(--color-text-secondary)] hover:bg-[var(--surface-neumorphic-pressed)] hover:text-[var(--color-text-primary)]",
              "shadow-[var(--shadow-neumorphic-sm)] hover:shadow-[var(--shadow-neumorphic-md)]",
              "active:translate-y-px touch-target",
            )}
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs Navigation - Android optimized */}
        {enableTabs && tabs.length > 0 && (
          <nav className="mb-4 flex gap-3 overflow-x-auto border-b border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)]/50 px-6 pb-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange?.(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200",
                  "min-h-[44px] min-w-[88px] touch-target-preferred", // Android touch target
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2",
                  activeTab === tab.key
                    ? [
                        "border-[var(--color-brand-primary)]/60 bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]",
                        "shadow-[var(--shadow-neumorphic-sm)]",
                      ].join(" ")
                    : [
                        "border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)]/80",
                        "text-[var(--color-text-secondary)] hover:bg-[var(--surface-neumorphic-raised)] hover:text-[var(--color-text-primary)]",
                        "hover:border-[var(--border-neumorphic-light)] active:translate-y-px",
                      ].join(" "),
                )}
                aria-selected={activeTab === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
