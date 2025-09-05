import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { cn } from "../../lib/utils/cn";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  side?: "bottom" | "right" | "left";
  children?: React.ReactNode;
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  title,
  side = "bottom",
  children,
  className
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const position =
    side === "bottom"
      ? "fixed inset-x-0 bottom-0"
      : side === "right"
      ? "fixed inset-y-0 right-0"
      : "fixed inset-y-0 left-0";

  const size =
    side === "bottom" ? "w-full rounded-t-xl" : "h-full w-[min(92vw,420px)]";

  return createPortal(
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className={cn(position, "z-10")}>
        <div
          className={cn(
            "border border-border bg-card text-card-foreground shadow-2xl",
            size,
            side === "bottom" ? "animate-in slide-in-from-bottom" : "animate-in slide-in-from-right",
            className
          )}
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-base font-semibold">{title}</h2>
            <button
              type="button"
              className="btn-ghost"
              aria-label="Schließen"
              onClick={() => onOpenChange(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
