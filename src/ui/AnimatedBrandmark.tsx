import { memo, useEffect, useRef } from "react";

import type { LogoState } from "@/app/components/AnimatedLogo";
import { cn } from "@/lib/utils";

interface AnimatedBrandmarkProps {
  className?: string;
  mode?: "header" | "hero";
  intensity?: "subtle" | "premium" | "accent";
  playIntro?: boolean;
  state?: LogoState;
}

let heroIntroPlayed = false;

export const AnimatedBrandmark = memo(
  ({
    className,
    mode = "hero",
    intensity = "premium",
    playIntro = true,
    state = "idle",
  }: AnimatedBrandmarkProps) => {
    const shouldRunIntroRef = useRef(Boolean(playIntro && mode === "hero" && !heroIntroPlayed));

    useEffect(() => {
      if (shouldRunIntroRef.current && mode === "hero") {
        heroIntroPlayed = true;
      }
    }, [mode]);

    const shouldRunIntro = shouldRunIntroRef.current;

    return (
      <div
        className={cn("brandmark-motion relative inline-block", className)}
        data-intensity={intensity}
        data-intro={shouldRunIntro ? "on" : "off"}
        data-mode={mode}
        data-state={state}
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div
            className="absolute rounded-full aurora-blur motion-safe:animate-aurora-a"
            data-layer="aurora-a"
            style={{
              width: "clamp(110px, 28vw, 168px)",
              height: "clamp(54px, 14vw, 86px)",
              background: "rgba(139,92,246,0.30)",
              top: "-30%",
              left: "-40%",
            }}
          />
          <div
            className="absolute rounded-full aurora-blur motion-safe:animate-aurora-b"
            data-layer="aurora-b"
            style={{
              width: "clamp(96px, 24vw, 140px)",
              height: "clamp(48px, 12vw, 74px)",
              background: "rgba(56,189,248,0.25)",
              top: "10%",
              right: "-35%",
            }}
          />
          <div
            className="absolute rounded-full aurora-blur-heavy"
            data-layer="aurora-accent"
            style={{
              width: "clamp(78px, 20vw, 106px)",
              height: "clamp(36px, 10vw, 56px)",
              background: "rgba(244,114,182,0.20)",
              bottom: "-20%",
              left: "20%",
              opacity: 0.16,
            }}
          />
        </div>

        {/* Halo ring – conic-gradient ellipse that slowly rotates behind the logo */}
        <div
          aria-hidden="true"
          className="halo-ring motion-safe:animate-halo-ring-spin"
          data-layer="halo-ring"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl neon-blur motion-safe:animate-logo-neon-pulse"
          data-layer="neon"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.25), rgba(56,189,248,0.15), transparent)",
          }}
        />

        <h1
          className={cn(
            "relative z-10 text-5xl sm:text-6xl tracking-tight",
            "motion-safe:animate-brand-breathe",
          )}
          style={{ fontWeight: 750 }}
        >
          <span
            className={cn(
              "relative inline-block pr-2",
              shouldRunIntro ? "motion-safe:animate-word-reveal" : "opacity-100",
            )}
          >
            <span className="logo-text-shimmer-disa">Disa</span>
          </span>
          <span
            className={cn(
              "relative inline-block",
              shouldRunIntro ? "motion-safe:animate-word-reveal-delayed" : "opacity-100",
            )}
          >
            <span className="logo-text-shimmer-ai">AI</span>
          </span>
        </h1>

        <p
          className={cn(
            "mt-3 text-center text-sm tracking-wide text-ink-secondary/70",
            shouldRunIntro ? "animate-wordmark-intro" : "opacity-100",
          )}
          style={shouldRunIntro ? { animationDelay: "0.45s" } : undefined}
        >
          Was möchtest du wissen?
        </p>
      </div>
    );
  },
);

AnimatedBrandmark.displayName = "AnimatedBrandmark";
