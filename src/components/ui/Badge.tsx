import * as React from "react";

import { cn } from "../../lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses =
    variant === "default"
      ? "bg-gray-500/10 text-gray-300"
      : variant === "primary"
        ? "bg-primary/10 text-primary"
        : variant === "secondary"
          ? "bg-secondary/10 text-secondary"
          : "bg-red-500/10 text-red-400";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses,
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
