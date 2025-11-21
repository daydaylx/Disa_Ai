import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * MaterialChip Component
 * Neumorphism/Soft-Depth Chip
 * - NO backdrop-blur, NO borders (except accent ring for success/warning)
 * - Raised shadow for depth
 */
interface ChipProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "free";
  size?: "sm" | "md";
  className?: string;
}

export function Chip({ children, variant = "default", size = "sm", className }: ChipProps) {
  const variantClasses = {
    default: "bg-surface-2 text-text-primary shadow-raise",
    success: "bg-surface-2 text-accent-secondary shadow-raise ring-1 ring-accent-secondary/30",
    warning: "bg-surface-2 text-accent-danger shadow-raise ring-1 ring-accent-danger/30",
    free: "bg-surface-2 text-accent-secondary shadow-raise shadow-accentGlow ring-1 ring-accent-secondary/40",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs min-h-[24px]",
    md: "px-3 py-1.5 text-sm min-h-[var(--touch-target-compact)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm font-medium",
        "transition-all duration-fast",
        "select-none touch-manipulation",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
