import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentProps<"div"> {
  children: ReactNode;
  variant?: "raised" | "inset" | "hero";
}

/**
 * MaterialCard (formerly GlassCard)
 *
 * Neumorphism/Soft-Depth Card Component with Signature Bevel Highlight
 * - NO backdrop-blur, NO borders
 * - Depth durch Shadows (raised/inset)
 * - Bevel highlight auf raised variants (Werkzeug-DNA)
 *
 * Variants:
 * - "raised" (default): Standard card with soft raise shadow + bevel
 * - "inset": Pressed/inset appearance for contained areas (NO bevel)
 * - "hero": Strong raised shadow + stronger bevel for focal elements
 */
export function GlassCard({
  children,
  className,
  variant = "raised",
  ...props
}: GlassCardProps) {
  const baseStyles = "relative rounded-md p-6 transition-all duration-fast overflow-hidden";

  const variantStyles = {
    raised: "bg-surface-2 shadow-raise before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:bg-[var(--bevel-highlight)]",
    inset: "bg-surface-inset shadow-inset border border-white/5",
    hero: "bg-surface-2 shadow-raiseLg before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:bg-[var(--bevel-highlight-strong)]",
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
      <div className="relative z-10">{children}</div>
    </div>
  );
}
