import React from "react";

import { cn } from "../../lib/cn";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "muted" | "accent";
}
export function Badge({ variant = "muted", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn("badge", variant === "muted" ? "badge-muted" : "badge-accent", className)}
      {...props}
    />
  );
}
