import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MaterialCardProps extends ComponentProps<"div"> {
  children: ReactNode;
  variant?: "raised" | "inset" | "hero";
  /**
   * Optional decorative spine to visually align the card to one side.
   */
  spineSide?: "left" | "right";
}

/**
 * MaterialCard - Clean & Minimal
 *
 * Simple card component with clear elevation system
 * - NO borders, NO complex effects
 * - Clean shadows for depth
 * - Mobile-optimized spacing
 *
 * Variants:
 * - "raised" (default): Standard card with subtle shadow
 * - "inset": Inset appearance for input areas
 * - "hero": Elevated shadow for focal elements
 */
export function MaterialCard({
  children,
  className,
  variant = "raised",
  spineSide,
  ...props
}: MaterialCardProps) {
  const baseStyles = "relative rounded-md p-6 transition-shadow duration-fast";

  const variantStyles = {
    raised: "bg-surface-2 shadow-sm",
    inset: "bg-surface-inset shadow-inset",
    hero: "bg-surface-2 shadow-md",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        spineSide === "left" && "border-l-4 border-surface-3 pl-5",
        spineSide === "right" && "border-r-4 border-surface-3 pr-5",
        // Ensure scrollability when interactive
        props.onClick && "[touch-action:pan-y] cursor-pointer",
        className,
      )}
      data-spine-side={spineSide}
      {...props}
    >
      {children}
    </div>
  );
}
