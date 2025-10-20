import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SurfaceVariant = "flat" | "raised";
type SurfacePadding = "sm" | "md" | "lg";

interface StaticSurfaceSectionProps extends ComponentPropsWithoutRef<"div"> {
  padding?: SurfacePadding;
  variant?: SurfaceVariant;
}

const paddingClasses: Record<SurfacePadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function StaticGlassCard({
  padding = "md",
  variant = "flat",
  className,
  children,
  ...props
}: StaticSurfaceSectionProps) {
  return (
    <div
      className={cn(
        "surface-card glass-card",
        variant === "raised" && "surface-card--raised",
        className,
      )}
      {...props}
    >
      <div className={cn("relative", paddingClasses[padding])}>{children}</div>
    </div>
  );
}
