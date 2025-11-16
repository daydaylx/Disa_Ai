import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Chip/Pill Component
interface ChipProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "free";
  size?: "sm" | "md";
  className?: string;
}

export function Chip({ children, variant = "default", size = "sm", className }: ChipProps) {
  // Aurora Palette Integration
  const variantClasses = {
    default:
      "bg-[var(--glass-surface-subtle)] text-[var(--text-primary)] border border-[var(--glass-border-subtle)]",
    success:
      "bg-[var(--aurora-green-500)]/20 text-[var(--aurora-green-600)] border border-[var(--aurora-green-500)]/30",
    warning:
      "bg-[var(--aurora-orange-500)]/20 text-[var(--aurora-orange-600)] border border-[var(--aurora-orange-500)]/30",
    free: "bg-[var(--aurora-green-500)]/10 text-[var(--aurora-green-600)] border border-[var(--aurora-green-500)]/40 shadow-[var(--shadow-glow-green)]",
  };

  // Aurora Touch-Optimized Sizing
  const sizeClasses = {
    sm: "px-[var(--space-xs)] py-[var(--space-xs)] text-[var(--text-xs)] min-h-[24px]",
    md: "px-[var(--space-sm)] py-[var(--space-xs)] text-[var(--text-sm)] min-h-[var(--touch-target-compact)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] font-medium",
        "backdrop-blur-[var(--backdrop-blur-subtle)] transition-all duration-[var(--motion-medium)]",
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
