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
  "tap-target inline-flex items-center justify-center rounded-md font-medium select-none transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgba(91,140,255,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-[2px]";

const variants: Record<Variant, string> = {
  // nur Hauptbuttons mit Verlauf (Cyan→Violett), Glas + Glow
  primary:
    "text-white shadow-soft border border-transparent [background-image:linear-gradient(135deg,#7C4DFF_0%,#5B8CFF_100%)] hover:brightness-105 active:brightness-95",
  // glassy secondary
  secondary: "text-foreground bg-white/60 backdrop-blur-md border border-white/30 hover:bg-white/70",
  ghost: "bg-transparent text-foreground hover:bg-black/5",
  destructive:
    "text-white shadow-soft border border-transparent bg-[hsl(var(--destructive))] hover:brightness-105",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-[14px]",
  md: "h-11 px-5 text-base rounded-[14px]",
  lg: "h-12 px-6 text-base rounded-[14px]",
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
