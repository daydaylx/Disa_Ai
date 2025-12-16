import { useMemo } from "react";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { cn } from "@/lib/utils";

interface LivingCoreProps {
  state: LogoState; // "idle" | "typing" | "thinking" | "error"
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LivingCore({ state, size = "lg", className }: LivingCoreProps) {
  // Map states to visual configurations
  const config = useMemo(() => {
    switch (state) {
      case "error":
        return {
          primary: "bg-red-500",
          glow: "shadow-[0_0_30px_rgba(239,68,68,0.6)]",
          border: "border-red-400/50",
          inner: "bg-red-400",
          animation: "animate-orb-shake",
          pupil: "bg-red-100",
          pupilAnim: "scale-75",
        };
      case "thinking":
        return {
          primary: "bg-fuchsia-500",
          glow: "shadow-[0_0_40px_rgba(217,70,239,0.5)]",
          border: "border-fuchsia-400/50",
          inner: "bg-fuchsia-400",
          animation: "animate-orb-rotate-fast",
          pupil: "bg-fuchsia-100",
          pupilAnim: "animate-orb-pupil-thinking",
        };
      case "typing": // equivalent to streaming/active
        return {
          primary: "bg-sky-500",
          glow: "shadow-[0_0_40px_rgba(14,165,233,0.5)]",
          border: "border-sky-400/50",
          inner: "bg-sky-400",
          animation: "animate-orb-breathe",
          pupil: "bg-sky-100",
          pupilAnim: "animate-orb-pupil-streaming",
        };
      case "idle":
      default:
        return {
          primary: "bg-violet-500",
          glow: "shadow-[0_0_30px_rgba(139,92,246,0.4)]",
          border: "border-violet-400/30",
          inner: "bg-violet-400",
          animation: "animate-orb-breathe",
          pupil: "bg-white",
          pupilAnim: "animate-orb-pupil-idle",
        };
    }
  }, [state]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  return (
    <div
      className={cn("relative flex items-center justify-center", sizeClasses[size], className)}
      aria-hidden="true"
      style={{ contain: "layout style paint" }}
    >
      {/* Outer Glow / Atmosphere - Reduced blur for performance */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-20 blur-xl transition-all duration-700",
          config.primary,
        )}
      />

      {/* Orbital Rings - Decorative */}
      <div className="absolute inset-[-10%] rounded-full border border-white/5 animate-orb-rotate-slow opacity-60" />
      <div className="absolute inset-[-20%] rounded-full border border-white/5 animate-orb-rotate-medium opacity-40 animation-delay-1000" />

      {/* Main Core Container */}
      <div
        className={cn(
          "relative w-full h-full rounded-full flex items-center justify-center transition-all duration-700",
          config.glow,
        )}
        style={{ willChange: "transform" }}
      >
        {/* Glass Shell */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 bg-white/5 backdrop-blur-sm transition-colors duration-700",
            config.border,
            config.animation,
          )}
        />

        {/* Inner Iris - Reduced blur */}
        <div
          className={cn(
            "w-[70%] h-[70%] rounded-full opacity-40 blur-sm transition-colors duration-700",
            config.inner,
          )}
        />

        {/* The Pupil (The 'Eye') */}
        <div
          className={cn(
            "absolute w-[25%] h-[25%] rounded-full shadow-lg transition-all duration-500",
            config.pupil,
            config.pupilAnim,
          )}
        />

        {/* Glare/Reflection for realism - Removed blur for performance */}
        <div className="absolute top-[20%] right-[20%] w-[15%] h-[15%] bg-white/60 rounded-full" />
      </div>
    </div>
  );
}
