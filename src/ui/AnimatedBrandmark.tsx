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
      {/* Aurora glow blobs */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {/* Violet blob – top-left */}
        <div
          className="absolute rounded-full blur-2xl motion-safe:animate-aurora-a"
          style={{
            width: "160px",
            height: "80px",
            background: "rgba(139,92,246,0.22)",
            top: "-30%",
            left: "-40%",
          }}
        />
        {/* Cyan blob – right */}
        <div
          className="absolute rounded-full blur-2xl motion-safe:animate-aurora-b"
          style={{
            width: "130px",
            height: "70px",
            background: "rgba(56,189,248,0.18)",
            top: "10%",
            right: "-35%",
          }}
        />
        {/* Fuchsia accent – bottom-center, static */}
        <div
          className="absolute rounded-full blur-3xl opacity-10"
          style={{
            width: "100px",
            height: "50px",
            background: "rgba(244,114,182,0.20)",
            bottom: "-20%",
            left: "20%",
          }}
        />
      </div>
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
