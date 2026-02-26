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
        <span className="relative inline-block pr-2">
          <span className="bg-gradient-to-br from-brand-primary via-purple-500 to-brand-primary/80 bg-clip-text text-transparent">
            Disa
          </span>
        </span>
        {/* "AI" with gradient */}
        <span className="relative inline-block">
          <span className="bg-gradient-to-br from-accent-chat to-cyan-500/80 bg-clip-text text-transparent">
            AI
          </span>
        </span>
      </h1>
    </div>
  );
});

AnimatedBrandmark.displayName = "AnimatedBrandmark";
