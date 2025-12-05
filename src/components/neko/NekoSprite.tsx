import React from "react";

import { cn } from "@/lib/utils";

interface NekoSpriteProps {
  state: "WALKING" | "FLEEING" | "IDLE" | "HIDDEN" | "SPAWNING";
  direction: "left" | "right";
  onInteract?: () => void;
}

export function NekoSprite({ state, direction, onInteract }: NekoSpriteProps) {
  // Simple pixel-art style black cat using SVG
  // This avoids external assets and keeps it lightweight
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onInteract?.();
    }
  };

  return (
    <div
      className={cn(
        "w-12 h-12 md:w-16 md:h-16 transition-transform duration-100 relative",
        direction === "left" && "scale-x-[-1]", // Mirror for left direction
      )}
      role={onInteract ? "button" : undefined}
      aria-label={onInteract ? "Kleine Neko-Katze – tippen um sie zu verscheuchen" : undefined}
      tabIndex={onInteract ? 0 : -1}
      onPointerDown={onInteract}
      onKeyDown={onInteract ? handleKeyDown : undefined}
    >
      <svg
        viewBox="0 0 32 32"
        className={cn(
          "w-full h-full drop-shadow-md",
          state === "WALKING" && "animate-neko-walk", // CSS step animation
          state === "FLEEING" && "animate-neko-run", // Faster animation
        )}
        style={{ imageRendering: "pixelated" }}
      >
        {/* Body */}
        <path
          d="M4 24 h24 v4 h-24 z" // Shadow/Ground
          fill="rgba(0,0,0,0.1)"
        />

        {/* Cat Body Main */}
        <path className="fill-neutral-900 dark:fill-neutral-100" d="M11 13 h10 v11 h-10 z" />

        {/* Head */}
        <path className="fill-neutral-900 dark:fill-neutral-100" d="M20 10 h9 v10 h-9 z" />

        {/* Ears */}
        <path
          className="fill-neutral-900 dark:fill-neutral-100"
          d="M20 6 h3 v4 h-3 z M26 6 h3 v4 h-3 z"
        />

        {/* Tail */}
        <path
          className="fill-neutral-900 dark:fill-neutral-100"
          d="M8 16 h3 v3 h-3 z M5 13 h3 v3 h-3 z M2 10 h3 v3 h-3 z"
        />

        {/* Eyes (Yellow) */}
        <rect x="22" y="13" width="2" height="2" className="fill-amber-400" />
        <rect x="26" y="13" width="2" height="2" className="fill-amber-400" />

        {/* Legs (Animated via CSS classes by toggling visibility or simpler transforms, 
           but for a simple SVG, we assume the whole SVG bobs or uses step animation on a larger sprite.
           Here we simulate a static frame that 'bobs' via CSS translation) 
        */}
      </svg>
    </div>
  );
}
