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
  primary:
    "text-[#0a0a0a] bg-gradient-to-r from-[#ff00ff] to-[#00ffff] shadow-[0_0_18px_#ff00ff66] hover:shadow-[0_0_26px_#ff00ffaa] active:shadow-[0_0_14px_#ff00ff66]",
  secondary:
    "text-[#0a0a0a] bg-[#facc15] shadow-[0_0_18px_#facc1566] hover:shadow-[0_0_26px_#facc15aa] active:shadow-[0_0_14px_#facc1566]",
  ghost:
    "bg-transparent text-[#e5e7eb] hover:bg-white/10 hover:shadow-[0_0_18px_#00ffff33]",
  destructive:
    "text-white bg-gradient-to-r from-rose-600 to-fuchsia-600 shadow-[0_0_18px_#ff00ff66] hover:shadow-[0_0_26px_#ff00ffaa]",
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
