// src/hooks/useEdgeSwipe.ts
import { useEffect, useRef } from "react";

export type Edge = "left" | "right";

export interface UseEdgeSwipeOptions {
  onOpen: () => void;
  edge?: Edge; // "right" empfohlen wegen Browser-Back-Swipe links
  edgeWidth?: number; // px Breite der Aktivzone am Rand
  minDX?: number; // erforderliche horizontale Strecke
  maxDY?: number; // maximal erlaubte vertikale Abweichung
  active?: boolean; // Toggle für Tests/Desktops
}

export function useEdgeSwipe({
  onOpen,
  edge = "right",
  edgeWidth = 24,
  minDX = 40,
  maxDY = 30,
  active = true,
}: UseEdgeSwipeOptions) {
  const tracking = useRef(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const vw = window.innerWidth;

      const fromRight = edge === "right" && t.clientX >= vw - edgeWidth;
      const fromLeft = edge === "left" && t.clientX <= edgeWidth;
      if (!fromRight && !fromLeft) return;

      tracking.current = true;
      startX.current = t.clientX;
      startY.current = t.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current || startX.current == null || startY.current == null) return;

      const t = e.touches[0];
      const dx = t.clientX - startX.current;
      const dy = Math.abs(t.clientY - startY.current);

      // vertikal? raus.
      if (dy > maxDY) {
        tracking.current = false;
        return;
      }

      const ok = (edge === "right" && dx <= -minDX) || (edge === "left" && dx >= minDX);

      if (ok) {
        // wir übernehmen die Geste, damit kein Scroll/Browserkram dazwischen funkt
        try {
          e.preventDefault();
        } catch {
          // Ignore errors from preventDefault in passive listeners
        }
        tracking.current = false;
        startX.current = null;
        startY.current = null;
        onOpen();
      }
    };

    const onTouchEnd = () => {
      tracking.current = false;
      startX.current = null;
      startY.current = null;
    };

    // Wichtig: touchmove nicht passiv, sonst greift preventDefault nicht.
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("touchcancel", onTouchEnd as any);
    };
  }, [active, edge, edgeWidth, maxDY, minDX, onOpen]);
}
