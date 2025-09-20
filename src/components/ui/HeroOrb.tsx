import * as React from "react";

import { cn } from "../../lib/utils/cn";

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

export const HeroOrb: React.FC<HeroOrbProps> = ({
  state = "idle",
  className = "",
  size = "md",
}) => {
  const animationByState: Record<HeroOrbProps["state"], string> = {
    idle: "motion-safe:animate-pulse",
    focus: "motion-safe:animate-[pulse_1.6s_ease-in-out_infinite]",
    listening: "motion-safe:animate-[pulse_1.1s_ease-in-out_infinite]",
  };

  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto rounded-full border border-border-strong bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.35),rgba(11,17,24,0.1))]",
        "after:absolute after:-inset-[6%] after:rounded-full after:border after:border-[rgba(34,211,238,0.25)]",
        sizeClasses[size],
        animationByState[state],
        className,
      )}
    />
  );
};
