import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MaterialCardProps extends ComponentProps<"div"> {
  children: ReactNode;
  variant?: "raised" | "inset" | "hero";
  spineSide?: "left" | "right" | "none";
}

/**
 * MaterialCard
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
export function MaterialCard({
  children,
  className,
  variant = "raised",
  spineSide = "left",
  ...props
}: MaterialCardProps) {
  const baseStyles =
    "relative rounded-md p-6 transition-all duration-fast overflow-hidden with-gleam";

  const variantStyles = {
    raised: "bg-surface-2 shadow-raise with-spine",
    inset: "bg-surface-inset shadow-inset",
    hero: "bg-surface-2 shadow-raiseLg with-spine",
  };

  const spineSideClass =
    spineSide === "none" ? "with-spine-none" : spineSide === "right" ? "with-spine-right" : "";

  return (
    <div className={cn(baseStyles, variantStyles[variant], spineSideClass, className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
