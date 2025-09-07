import React from "react";

import { cn } from "../../lib/utils/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

const base =
  "tap-target inline-flex items-center justify-center rounded-md font-medium transition-colors select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // nur Hauptbuttons mit Verlauf (Cyan→Violett), moderater Glow
  primary:
    "text-[#0a0a0a] bg-gradient-to-r from-[#4FC3F7] to-[#A78BFA] shadow-[0_0_14px_rgba(79,195,247,0.35)] hover:shadow-[0_0_18px_rgba(79,195,247,0.45)]",
  // flach, dezente Fläche
  secondary: "text-[#F0F2F5] bg-[#232832] border border-white/10 hover:border-[#4FC3F7]/40",
  ghost: "bg-transparent text-[#F0F2F5] hover:bg-white/5",
  destructive: "text-[#F0F2F5] bg-transparent border border-[#EF5350]/50 hover:bg-[#EF5350]/15",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-xl",
  md: "h-11 px-5 text-base rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {leftIcon ? <Icon name={leftIcon} className="mr-2" /> : null}
        <span className="inline-flex items-center">{children}</span>
        {rightIcon ? <Icon name={rightIcon} className="ml-2" /> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
