import React from "react";

import { cn } from "@/lib/utils";

interface BookmarkProps {
  onClick: () => void;
  className?: string;
}

export function Bookmark({ onClick, className }: BookmarkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-[var(--spacing-4)] top-0 z-header",
        "w-8 h-12 sm:w-10 sm:h-14",
        "bg-accent shadow-md cursor-pointer",
        "flex items-center justify-center",
        "transition-transform hover:translate-y-1 active:translate-y-2",
        "clip-path-bookmark", // We need to define this or use SVG
        className
      )}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
      }}
      aria-label="Lesezeichen öffnen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 sm:w-5 sm:h-5 text-white/90"
      >
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
