import { memo } from "react";

import { cn } from "@/lib/utils";

interface AnimatedBrandmarkProps {
  className?: string;
}

/**
 * Animated "Disa AI" brandmark with subtle turquoise shimmer and breathing effect.
 *
 * Features:
 * - Turquoise shimmer overlay that slowly moves across the text
 * - Very subtle breathing animation (scale + translateY)
 * - Respects prefers-reduced-motion (disables animations)
 * - GPU-optimized (transform, opacity only)
 * - No layout shift
 */
export const AnimatedBrandmark = memo(({ className }: AnimatedBrandmarkProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Main text with gradient */}
      <h1
        className={cn(
          "text-5xl sm:text-6xl tracking-tight",
          "animate-wordmark-intro",
          // Breathing animation - only when motion is allowed
          "motion-safe:animate-brand-breathe",
        )}
        style={{ fontWeight: 750 }}
      >
        {/* "Disa" with gradient */}
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-brand-primary bg-clip-text text-transparent">
            Disa
          </span>
          {/* Turquoise shimmer overlay for "Disa" */}
          <span
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent",
              "bg-clip-text text-transparent",
              "motion-safe:animate-brand-shimmer",
              "pointer-events-none",
            )}
            aria-hidden="true"
            style={{
              backgroundSize: "200% 100%",
              backgroundPosition: "-100% 0",
            }}
          >
            Disa
          </span>
        </span>{" "}
        {/* "AI" with gradient */}
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-accent-chat to-purple-400 bg-clip-text text-transparent">
            AI
          </span>
          {/* Turquoise shimmer overlay for "AI" */}
          <span
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent",
              "bg-clip-text text-transparent",
              "motion-safe:animate-brand-shimmer-delayed",
              "pointer-events-none",
            )}
            aria-hidden="true"
            style={{
              backgroundSize: "200% 100%",
              backgroundPosition: "-100% 0",
            }}
          >
            AI
          </span>
        </span>
      </h1>

      {/* Optional subtle glow - very minimal */}
      <div
        className={cn(
          "absolute inset-0 blur-xl opacity-0",
          "motion-safe:animate-brand-glow",
          "pointer-events-none -z-10",
        )}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-cyan-400/10" />
      </div>
    </div>
  );
});

AnimatedBrandmark.displayName = "AnimatedBrandmark";
