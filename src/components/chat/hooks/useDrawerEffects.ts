import { useEffect } from "react";

/**
 * Hook to handle drawer accessibility features and side effects
 * - Closes drawer on Escape key
 * - Locks body scroll when drawer is open
 */
export function useDrawerEffects(isOpen: boolean, onClose: () => void) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return undefined;
    if (typeof document === "undefined") return undefined;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);
}
