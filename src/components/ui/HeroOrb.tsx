import * as React from "react";

import { cn } from "../../lib/cn";

export interface HeroOrbProps {
  state?: "idle" | "focus" | "listening";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<HeroOrbProps["size"]>, string> = {
  sm: "h-20 w-20",
  md: "h-32 w-32",
  lg: "h-40 w-40",
};

type OrbState = NonNullable<HeroOrbProps["state"]>;

export const HeroOrb: React.FC<HeroOrbProps> = ({
  state = "idle",
  className = "",
  size = "md",
}) => {
  const animationByState: Record<OrbState, string> = {
    idle: "motion-safe:animate-pulse",
    focus: "motion-safe:animate-[pulse_1.6s_ease-in-out_infinite]",
    listening: "motion-safe:animate-[pulse_1.1s_ease-in-out_infinite]",
  };
  const resolvedState: OrbState = state ?? "idle";
  const resolvedSize: NonNullable<HeroOrbProps["size"]> = size ?? "md";

  return (
    <div
      aria-hidden
      className={cn(
        "to-background/10 border-border-strong relative mx-auto rounded-full border bg-gradient-to-br from-accent/35",
        "after:absolute after:-inset-[6%] after:rounded-full after:border after:border-accent/25",
        sizeClasses[resolvedSize],
        animationByState[resolvedState],
        className,
      )}
    />
  );
};
