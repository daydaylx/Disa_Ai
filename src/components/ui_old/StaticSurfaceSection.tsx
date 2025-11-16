import { cn } from "@/lib/utils";

import { Card, type CardProps } from "./card";

type SurfaceVariant = "flat" | "raised";
type SurfacePadding = "sm" | "md" | "lg";

interface StaticSurfaceSectionProps
  extends Omit<CardProps, "padding" | "elevation" | "tone" | "variant"> {
  padding?: SurfacePadding;
  variant?: SurfaceVariant;
}

export function StaticSurfaceSection({
  padding = "md",
  variant = "flat",
  className,
  children,
  ...props
}: StaticSurfaceSectionProps) {
  const elevation = variant === "raised" ? "raised" : "subtle";

  return (
    <Card elevation={elevation} padding={padding} className={cn("relative", className)} {...props}>
      {children}
    </Card>
  );
}
