import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface BookmarkProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const BOOKMARK_ANIMATION_KEY = "disa-bookmark-animated";

export function Bookmark({ onClick, className, disabled = false }: BookmarkProps) {
  const [shouldWiggle, setShouldWiggle] = useState(false);

  // Wackel-Animation nur beim allerersten Start
  useEffect(() => {
    const hasAnimated = localStorage.getItem(BOOKMARK_ANIMATION_KEY);
    if (!hasAnimated) {
      setShouldWiggle(true);
      localStorage.setItem(BOOKMARK_ANIMATION_KEY, "true");
      // Animation nach 800ms stoppen
      const timer = setTimeout(() => setShouldWiggle(false), 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={cn(
        "fixed right-3 sm:right-4 z-header",
        // Positioned slightly off the top to look like it hangs
        "top-0",
        "w-7 h-11 sm:w-9 sm:h-14",
        "bg-accent-primary shadow-lg cursor-pointer",
        "flex items-end justify-center pb-2",
        "transition-transform hover:translate-y-1 active:translate-y-2 duration-200",
        // Physical "Hang" Effect
        "origin-top",
        // Wackel-Animation beim ersten Start
        shouldWiggle && "animate-bookmark-wiggle",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      style={{
        // Classic Bookmark Shape with "V" cut at bottom
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
      }}
      aria-label={disabled ? "Keine Verläufe verfügbar" : "Lesezeichen: Verlauf öffnen"}
      aria-disabled={disabled}
    >
      {/* Icon is placed at the bottom */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white opacity-95"
      >
        <path
          fillRule="evenodd"
          d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
