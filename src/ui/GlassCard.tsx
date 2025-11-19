import type { ComponentProps, ReactNode } from "react";

interface GlassCardProps extends ComponentProps<"div"> {
  children: ReactNode;
  variant?: "default" | "primary";
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  const baseStyles = "rounded-2xl border backdrop-blur-lg";
  const variantStyles = variant === "primary"
    ? "border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent-soft)]/20 to-surface-panel/60 p-6 shadow-[var(--shadow-lg)] shadow-[var(--accent)]/10"
    : "border-[var(--glass-border-soft)] bg-surface-panel/80 p-6 shadow-[var(--shadow-md)]";

  return (
    <div
      className={`${baseStyles} ${variantStyles} ${className || ""}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}