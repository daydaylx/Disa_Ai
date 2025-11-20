import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentProps<"div"> {
  children: ReactNode;
  variant?: "raised" | "inset" | "hero";
}

/**
 * MaterialCard (formerly GlassCard)
 *
 * Neumorphism/Soft-Depth Card Component
 * - NO backdrop-blur
 * - NO borders
 * - Depth durch Shadows (raised/inset)
 *
 * Variants:
 * - "raised" (default): Standard card with soft raise shadow
 * - "inset": Pressed/inset appearance for contained areas
 * - "hero": Strong raised shadow for focal elements
 */
export function GlassCard({
  children,
  className,
  variant = "raised",
  ...props
}: GlassCardProps) {
  const baseStyles = "rounded-md p-6 transition-all duration-fast";

  const variantStyles = {
    raised: "bg-surface-2 shadow-raise",
    inset: "bg-surface-1 shadow-inset",
    hero: "bg-surface-2 shadow-raiseLg",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
