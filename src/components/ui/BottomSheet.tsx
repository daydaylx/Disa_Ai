import { X } from "lucide-react";
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
          "border-border bg-surface-card rounded-t-lg border-t",
          "pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-2 pt-3">
          <div className="bg-surface-subtle h-1 w-10 rounded-full" />
        </div>

        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <h2 id="bottom-sheet-title" className="text-text-primary text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="tap-target bg-surface-subtle text-text-secondary hover:bg-surface-subtle hover:text-text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors touch-target"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        {enableTabs && tabs.length > 0 && (
          <nav className="mb-4 flex gap-2 overflow-x-auto border-b border-border bg-surface-subtle/20 px-6 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange?.(tab.key)}
                className={cn(
                  "focus-visible:ring-brand touch-target-preferred whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 min-w-[88px] min-h-[40px]",
                  activeTab === tab.key
                    ? "border-brand/50 bg-brand/15 text-brand shadow-glow-brand"
                    : "bg-card/60 hover:bg-hover-bg hover:text-text-strong border-transparent text-text-muted",
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
