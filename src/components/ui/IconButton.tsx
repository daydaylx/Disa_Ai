import { forwardRef } from "react";

import { cn } from "../../lib/utils";

export type IconButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: "md" | "lg";
}

const baseStyles =
  "inline-flex items-center justify-center rounded-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const sizeMap: Record<NonNullable<IconButtonProps["size"]>, string> = {
  md: "h-11 w-11 min-h-[44px] min-w-[44px]",
  lg: "h-12 w-12 min-h-[48px] min-w-[48px]",
};

const variantMap: Record<IconButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--text-inverted)] shadow-[0_20px_40px_rgba(97,231,255,0.35)] hover:bg-[color-mix(in_srgb,var(--accent)_92%,white)] focus-visible:ring-[var(--accent-border)]",
  secondary:
    "border border-[var(--glass-border-soft)] bg-surface-inline/90 text-text-primary shadow-[0_25px_45px_rgba(0,0,0,0.35)] hover:bg-surface-inline/100 focus-visible:ring-[var(--glass-border-strong)]",
  ghost:
    "text-text-primary hover:bg-surface-inline/60 focus-visible:ring-[var(--glass-border-soft)]",
  danger:
    "bg-[var(--danger)] text-[var(--text-on-accent)] shadow-[0_20px_40px_rgba(255,107,129,0.35)] hover:bg-[color-mix(in_srgb,var(--danger)_85%,black)] focus-visible:ring-[var(--danger)]",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(baseStyles, sizeMap[size], variantMap[variant], className)}
      {...props}
    />
  );
});
