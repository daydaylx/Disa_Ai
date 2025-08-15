import { useEffect } from "react";

type DisabledOpts = { enabled?: false };
type EnabledOpts = {
  enabled?: true;
  edge: "left" | "right";
  threshold?: number;
  onOpen: () => void;
};
type Options = DisabledOpts | EnabledOpts;

/**
 * Edge-Swipe Hook (links/rechts), um z. B. die Chat-Liste zu öffnen.
 * - Typ-Safe Narrowing über Property-Check
 */
export function useEdgeSwipe(opts?: Options): void {
  // Falls deaktiviert oder nicht gesetzt: nichts tun
  if (!opts || (opts as DisabledOpts).enabled === false) return;
  // narrow: nur wenn die interaktive Variante die Keys besitzt
  if (!("onOpen" in opts)) return;

  const { edge, threshold = 64, onOpen } = opts;

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (!t) return;
      const nearLeft = edge === "left" && t.clientX < 16;
      const nearRight = edge === "right" && t.clientX > window.innerWidth - 16;
      if (!nearLeft && !nearRight) return;
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking) return;
      const t = e.touches?.[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dy > 24) {
        tracking = false;
        return;
      }
      if ((edge === "left" && dx > threshold) || (edge === "right" && dx < -threshold)) {
        tracking = false;
        onOpen();
      }
    };

    const onTouchEnd = () => {
      tracking = false;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [edge, threshold, onOpen]);
}
