import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "bottom",
  className = "",
}: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const sideClasses = {
    top: "top-0 left-0 right-0 translate-y-0",
    bottom: "bottom-0 left-0 right-0 translate-y-0 rounded-t-2xl",
    left: "top-0 left-0 bottom-0 translate-x-0 rounded-r-2xl",
    right: "top-0 right-0 bottom-0 translate-x-0 rounded-l-2xl",
  };

  const animationClasses = {
    top: "animate-in slide-in-from-top duration-300",
    bottom: "animate-in slide-in-from-bottom duration-300",
    left: "animate-in slide-in-from-left duration-300",
    right: "animate-in slide-in-from-right duration-300",
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {/* Sheet */}
      <div
        className={`glass-sheet fixed z-50 ${sideClasses[side]} ${animationClasses[side]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetContent({ children, className = "" }: SheetContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetHeader({ children, className = "" }: SheetHeaderProps) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetTitle({ children, className = "" }: SheetTitleProps) {
  return <h2 className={`text-xl font-semibold text-neutral-100 ${className}`}>{children}</h2>;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetDescription({ children, className = "" }: SheetDescriptionProps) {
  return <p className={`text-neutral-300 ${className}`}>{children}</p>;
}
