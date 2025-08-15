import { RefObject, useEffect, useRef, useState } from "react";

export function usePullToRefresh(
  ref: RefObject<HTMLElement>,
  onRefresh: () => Promise<void> | void
): { offset: number; active: boolean } {
  const startY = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [active, setActive] = useState(false);
  const refreshing = useRef(false);
  const MIN_PULL = 70;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (refreshing.current) return;
      if (el.scrollTop !== 0) return;
      const t0 = e.touches?.[0];
      if (!t0) return;
      startY.current = t0.clientY;
      setActive(true);
    };

    const onMove = (e: TouchEvent) => {
      if (refreshing.current) return;
      if (startY.current == null) return;
      const t = e.touches?.[0];
      if (!t) return;
      const dy = t.clientY - startY.current;
      if (dy > 0) {
        e.preventDefault();
        setOffset(Math.min(dy, MIN_PULL * 1.5));
      } else {
        setOffset(0);
      }
    };

    const onEnd = async () => {
      if (refreshing.current) return;
      if (startY.current == null) return;
      if (offset > MIN_PULL) {
        refreshing.current = true;
        await onRefresh();
        setTimeout(() => {
          setOffset(0);
          setActive(false);
          refreshing.current = false;
          startY.current = null;
        }, 150);
      } else {
        setOffset(0);
        setActive(false);
        startY.current = null;
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart as any);
      el.removeEventListener("touchmove", onMove as any);
      el.removeEventListener("touchend", onEnd as any);
    };
  }, [ref, onRefresh, offset]);

  return { offset, active };
}
