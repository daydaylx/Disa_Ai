import { useEffect, useState } from "react";

import { Book } from "../../lib/icons";

interface BookmarkProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function Bookmark({ onClick, className = "", disabled = false }: BookmarkProps) {
  const [hasWiggled, setHasWiggled] = useState(false);

  // One-time wiggle animation on first mount
  useEffect(() => {
    const hasSeenBefore = localStorage.getItem("disa-bookmark-seen");
    if (!hasSeenBefore && !disabled) {
      const timer = setTimeout(() => {
        setHasWiggled(true);
        localStorage.setItem("disa-bookmark-seen", "true");

        // Reset after animation
        setTimeout(() => setHasWiggled(false), 600);
      }, 1000); // Delay to show after page loads

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [disabled]);

  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative flex items-center justify-center
          w-8 h-12 sm:w-10 sm:h-14
          bg-accent-primary hover:bg-accent-primary/90
          text-white shadow-raise cursor-pointer
          transition-all duration-200
          border-l-4 border-l-accent-primary/50
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-lg active:scale-95"}
          ${className}
        `}
        style={{
          // Bookmark shape with triangle bottom
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
        }}
        aria-label="Lesezeichen - Chat-Verlauf öffnen"
      >
        <Book
          className={`
            w-4 h-4 sm:w-5 sm:h-5
            ${hasWiggled ? "animate-wiggle" : ""}
          `}
        />
      </button>

      {/* Wiggle animation styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            75% { transform: rotate(-3deg); }
          }

          .animate-wiggle {
            animation: wiggle 600ms ease-in-out;
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-wiggle {
              animation: none;
            }
          }
        `,
        }}
      />
    </>
  );
}
