import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useNeko } from "@/hooks/useNeko";
import { useSettings } from "@/hooks/useSettings";

import { NekoSprite } from "./NekoSprite";

export function NekoLayer() {
  const { settings } = useSettings();
  const status = useNeko();

  const [bottomOffset, setBottomOffset] = useState<number>(() => {
    if (typeof window === "undefined") return 32;
    const vw = window.innerWidth;
    if (vw < 640) return 96; // keep clear of mobile composer
    if (vw < 1024) return 56;
    return 32;
  });

  // Update offset on resize/orientation change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const vw = window.innerWidth;
      setBottomOffset(vw < 640 ? 96 : vw < 1024 ? 56 : 32);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Early exit if disabled or hidden
  if (!settings.enableNeko || status.state === "HIDDEN") {
    return null;
  }

  // Render into a portal at the root level to ensure it's above everything but non-blocking
  // Assuming there is a root div or body we can append to, but standard portal is safe.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed left-0 right-0 h-32 pointer-events-none z-toast overflow-hidden select-none"
      style={{
        bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom))`,
      }}
      aria-hidden="true" // Purely decorative
      data-testid="neko-container"
    >
      <div
        className="absolute bottom-0 transition-transform duration-100 ease-linear will-change-transform"
        style={{
          transform: `translate3d(${status.x}vw, 0, 0)`,
          left: 0, // Base position
        }}
      >
        {/* The sprite container */}
        <div className="mb-safe-bottom pb-2 pointer-events-auto">
          {/* Respect safe area */}
          <NekoSprite state={status.state} direction={status.direction} onInteract={status.flee} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
