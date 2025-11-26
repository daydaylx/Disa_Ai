import { createPortal } from "react-dom";

import { useNeko } from "@/hooks/useNeko";
import { useSettings } from "@/hooks/useSettings";

import { NekoSprite } from "./NekoSprite";

export function NekoLayer() {
  const { settings } = useSettings();
  const status = useNeko();

  // Early exit if disabled or hidden
  if (!settings.enableNeko || status.state === "HIDDEN") {
    return null;
  }

  // Render into a portal at the root level to ensure it's above everything but non-blocking
  // Assuming there is a root div or body we can append to, but standard portal is safe.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-toast overflow-hidden select-none"
      aria-hidden="true" // Purely decorative
    >
      <div
        className="absolute bottom-0 transition-transform duration-100 ease-linear will-change-transform"
        style={{
          transform: `translate3d(${status.x}vw, 0, 0)`,
          left: 0, // Base position
        }}
      >
        {/* The sprite container */}
        <div className="mb-safe-bottom pb-2">
          {" "}
          {/* Respect safe area */}
          <NekoSprite state={status.state} direction={status.direction} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
