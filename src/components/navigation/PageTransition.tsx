import React, { useEffect, useState } from "react";

import { useBookNavigation } from "../../hooks/useBookNavigation";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

type TransitionDirection = "forward" | "backward" | "none";

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const { isTransitioning } = useBookNavigation();
  const [direction, setDirection] = useState<TransitionDirection>("none");
  const [prevChatId, setPrevChatId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Track chat ID changes to determine direction
  useEffect(() => {
    // This is a simplified version - in a real implementation,
    // we'd track the actual chat IDs from useBookNavigation
    if (currentChatId !== prevChatId && prevChatId !== null) {
      // For now, assume forward motion on new chat
      // In a full implementation, we'd compare stack positions
      setDirection("forward");
    }
  }, [currentChatId, prevChatId]);

  const transitionClasses = () => {
    if (!isTransitioning) return "";

    switch (direction) {
      case "forward":
        return "animate-slide-in-right";
      case "backward":
        return "animate-slide-in-left";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className={`
          relative w-full h-full overflow-hidden
          ${transitionClasses()}
          ${className}
        `}
      >
        {/* Page container with book-like styling */}
        <div className="absolute inset-0 bg-surface-bg border border-ink/20 shadow-raise">
          {/* Subtle page stack effect */}
          <div className="absolute inset-0 border border-ink/10">
            {/* Main content */}
            <div className="relative z-10 h-full">{children}</div>
          </div>

          {/* Page stack indicators (visual book metaphor) */}
          {isTransitioning && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Previous page shadow */}
              <div
                className={`
                  absolute inset-0 bg-surface-bg/30 border border-ink/10
                  transform transition-transform duration-300 ease-out
                  ${direction === "backward" ? "-translate-x-1" : "-translate-x-2"}
                  ${direction === "forward" ? "translate-x-1" : "translate-x-2"}
                `}
                style={{ zIndex: 5 }}
              />
              {/* Next page hint */}
              <div
                className={`
                  absolute inset-0 bg-surface-bg/20 border border-ink/5
                  transform transition-transform duration-300 ease-out
                  ${direction === "forward" ? "translate-x-2" : "-translate-x-2"}
                `}
                style={{ zIndex: 1 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideInLeft {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in-right {
            animation: slideInRight 250ms ease-out;
          }

          .animate-slide-in-left {
            animation: slideInLeft 250ms ease-out;
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-slide-in-right,
            .animate-slide-in-left {
              animation: fadeIn 200ms ease-in-out;
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `,
        }}
      />
    </>
  );
}
