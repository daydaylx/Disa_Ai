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
  "tap-target inline-flex items-center justify-center rounded-md font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-95 active:opacity-90 shadow",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-95 active:opacity-90",
  ghost: "bg-transparent hover:bg-muted text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-95 active:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, leftIcon, rightIcon, className, children, ...props }, ref) => {
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
  }
);

Button.displayName = "Button";
