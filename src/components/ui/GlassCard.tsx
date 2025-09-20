import * as React from "react";

import { cn } from "../../lib/utils/cn";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses: Record<NonNullable<GlassCardProps["padding"]>, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  padding = "md",
  hover = false,
}) => {
  return (
    <div
      className={cn(
        "card-elev1 relative",
        paddingClasses[padding],
        hover && "transition-transform duration-fast hover:-translate-y-[1px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
