import React, { useEffect, useRef } from "react";

import { TouchGestureHandler } from "@/lib/touch/gestures";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  snapPoints?: number[];
  initialSnap?: number;
}

export function BottomSheet({ isOpen, onClose, children, className }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const gestureHandlerRef = useRef<TouchGestureHandler | null>(null);

  useEffect(() => {
    if (!isOpen || !sheetRef.current) {
      return undefined;
    }

    // Add body scroll lock
    document.body.style.overflow = "hidden";

    // Handle backdrop click
    const handleBackdropClick = (e: MouseEvent) => {
      if (backdropRef.current === e.target) {
        onClose();
      }
    };

    const backdropElement = backdropRef.current;
    backdropElement?.addEventListener("click", handleBackdropClick);

    return () => {
      document.body.style.overflow = "";
      backdropElement?.removeEventListener("click", handleBackdropClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!sheetRef.current) {
      return undefined;
    }

    gestureHandlerRef.current = new TouchGestureHandler(sheetRef.current, {
      swipeThreshold: 50,
      preventDefaultSwipe: true,
    }).onSwipeGesture((event) => {
      if (event.direction === "down") {
        onClose();
      }
    });

    return () => {
      gestureHandlerRef.current?.destroy();
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal pointer-events-none">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-surface-1 border-t border-white/10 rounded-t-2xl rounded-b-none",
          "pointer-events-auto",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          className,
        )}
        data-state="open"
      >
        {/* Drag Handle */}
        <div className="w-full py-2 flex justify-center">
          <div className="h-1 w-12 bg-white/30 rounded-full" />
        </div>

        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
