import { memo } from "react";

import { cn } from "@/lib/utils";

interface AnimatedBrandmarkProps {
  className?: string;
}

/**
 * Animated "Disa AI" brandmark with premium staggered word-reveal entrance,
 * continuous shimmer sweeps, neon-glow pulse, and drifting aurora blobs.
 *
 * Features:
 * - "Disa" slides up with blur-clear entrance (0ms), "AI" follows (200ms delay)
 * - Turquoise/violet shimmer overlay sweeps continuously across each word
 * - Neon radial glow pulsing behind the text
 * - Intensified aurora blobs drifting around the logo
 * - Breathing animation on the container (subtle scale + float)
 * - Respects prefers-reduced-motion (static gradient, no motion)
 * - GPU-optimized (transform, opacity, filter only)
 */
export const AnimatedBrandmark = memo(({ className }: AnimatedBrandmarkProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Aurora glow blobs – intensified */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {/* Violet blob – top-left */}
        <div
          className="absolute rounded-full blur-2xl motion-safe:animate-aurora-a"
          style={{
            width: "160px",
            height: "80px",
            background: "rgba(139,92,246,0.30)",
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
            background: "rgba(56,189,248,0.25)",
            top: "10%",
            right: "-35%",
          }}
        />
        {/* Fuchsia accent – bottom-center */}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: "100px",
            height: "50px",
            background: "rgba(244,114,182,0.20)",
            bottom: "-20%",
            left: "20%",
            opacity: 0.16,
          }}
        />
      </div>

      {/* Neon-glow backdrop – pulses violet/cyan behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl motion-safe:animate-logo-neon-pulse"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.25), rgba(56,189,248,0.15), transparent)",
          filter: "blur(16px)",
        }}
      />

      {/* Main text with staggered word-reveal entrance */}
      <h1
        className={cn(
          "relative z-10 text-5xl sm:text-6xl tracking-tight",
          "motion-safe:animate-brand-breathe",
        )}
        style={{ fontWeight: 750 }}
      >
        {/* "Disa" – reveals first, shimmer sweeps violet */}
        <span className="relative inline-block pr-2 motion-safe:animate-word-reveal">
          <span className="logo-text-shimmer-disa">Disa</span>
        </span>
        {/* "AI" – reveals 200ms later, shimmer sweeps violet→cyan */}
        <span className="relative inline-block motion-safe:animate-word-reveal-delayed">
          <span className="logo-text-shimmer-ai">AI</span>
        </span>
      </h1>

      <p
        className="mt-3 text-center text-sm tracking-wide text-ink-secondary/70 animate-wordmark-intro"
        style={{ animationDelay: "0.45s" }}
      >
        Was möchtest du wissen?
      </p>
    </div>
  );
});

AnimatedBrandmark.displayName = "AnimatedBrandmark";
