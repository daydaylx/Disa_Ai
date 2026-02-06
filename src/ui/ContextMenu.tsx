import { useEffect, useRef } from "react";

import { hapticFeedback } from "@/lib/haptics";
import type { LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ContextMenuItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose: () => void;
  title?: string;
  className?: string;
}

/**
 * Context Menu für Mobile (Bottom-Sheet Style)
 *
 * Verwendet für Long-Press Actions auf Messages, Conversations, etc.
 * Erscheint von unten mit Backdrop-Blur.
 *
 * @example
 * <ContextMenu
 *   title="Nachricht"
 *   items={[
 *     { icon: Copy, label: 'Kopieren', onClick: handleCopy },
 *     { icon: Trash2, label: 'Löschen', onClick: handleDelete, danger: true },
 *   ]}
 *   onClose={() => setShowMenu(false)}
 * />
 */
export function ContextMenu({ items, onClose, title, className }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle item click
  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;

    hapticFeedback(item.danger ? "warning" : "light");
    item.onClick();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 animate-fade-in" onClick={onClose} role="presentation" />

      {/* Menu */}
      <div
        ref={menuRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "glass-3 rounded-t-2xl",
          "border-t border-white/10",
          "shadow-2xl",
          "animate-slide-up",
          "pb-safe-bottom",
          className,
        )}
        style={{
          background: "rgba(18, 18, 21, 0.58)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
        }}
        role="menu"
        aria-label={title || "Kontext-Menü"}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-ink-muted/30 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-4 py-2">
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}

        {/* Items */}
        <div className="px-2 pb-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                  "transition-all duration-200",
                  "min-h-[44px]", // Touch target
                  !item.disabled && "hover:bg-surface-3/50 active:scale-[0.98]",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  item.danger && !item.disabled && "text-status-error hover:bg-status-error/10",
                  !item.danger && !item.disabled && "text-ink-primary",
                )}
                role="menuitem"
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cancel Button */}
        <div className="px-2 pt-2 pb-3">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "w-full px-4 py-3 rounded-xl",
              "bg-surface-3 text-ink-primary",
              "text-sm font-semibold",
              "hover:bg-surface-3/80 active:scale-[0.98]",
              "transition-all duration-200",
              "min-h-[44px]", // Touch target
            )}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </>
  );
}
