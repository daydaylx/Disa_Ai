import * as React from "react";

export interface HeroOrbProps {
  /** Current state of the orb */
  state?: "idle" | "focus" | "listening";
  /** Optional className for additional styling */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-20 h-20",
  md: "w-32 h-32",
  lg: "w-40 h-40",
};

export const HeroOrb: React.FC<HeroOrbProps> = ({
  state = "idle",
  className = "",
  size = "md",
}) => {
  const baseClasses = `orb ${sizeClasses[size]} mx-auto`;

  const stateClasses = {
    idle: "orb-pulse",
    focus: "orb-focus",
    listening: "orb-listening",
  };

  return (
    <div
      className={`${baseClasses} ${stateClasses[state]} ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
};
