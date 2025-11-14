import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] font-semibold transition-all duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--layer-bg-1)] disabled:pointer-events-none disabled:opacity-50 backdrop-blur-[var(--backdrop-blur-medium)]",
  {
    variants: {
      variant: {
        "glass-primary":
          "border border-[color:var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] shadow-[var(--shadow-glass-subtle)] hover:bg-[var(--button-secondary-bg-hover)] hover:shadow-[var(--shadow-glass-medium)]",
        "glass-subtle":
          "border border-[color:var(--glass-border-soft)] bg-[var(--layer-glass-inline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--layer-glass-panel)]",
        accent:
          "border border-[color:var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] shadow-[var(--shadow-glow-brand-subtle)] hover:bg-[var(--button-primary-bg-hover)] hover:shadow-[var(--shadow-glow-brand)]",
        destructive:
          "border border-transparent bg-[var(--button-destructive-bg)] text-[var(--button-destructive-fg)] shadow-[var(--shadow-glass-medium)] hover:bg-[var(--button-destructive-hover)] hover:shadow-[var(--shadow-glass-strong)]",
        brand:
          "border border-[color:var(--button-primary-border)] bg-[var(--accent-surface)] text-[var(--accent)] shadow-[var(--shadow-glass-medium)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]",
        "brand-soft":
          "border border-[color:var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)] backdrop-blur-[var(--backdrop-blur-subtle)] hover:bg-[var(--accent-surface)] hover:shadow-[var(--shadow-glow-brand-subtle)]",
        ghost:
          "border border-transparent bg-transparent text-[var(--button-ghost-fg)] hover:bg-[var(--button-ghost-hover)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        outline:
          "border border-[color:var(--glass-border-strong)] bg-transparent text-[var(--button-secondary-fg)] hover:bg-[var(--layer-glass-inline)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        secondary:
          "border border-[color:var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] hover:bg-[var(--button-secondary-bg-hover)]",
        default:
          "border border-[color:var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] shadow-[var(--shadow-glass-subtle)] hover:bg-[var(--button-secondary-bg-hover)] hover:shadow-[var(--shadow-glass-medium)]",
        neumorphic:
          "border border-[color:var(--glass-border-soft)] bg-[var(--layer-glass-panel)] text-[var(--text-primary)] shadow-[var(--shadow-glass-subtle)] hover:shadow-[var(--shadow-glass-medium)]",
        "neo-medium":
          "border border-[color:var(--glass-border-strong)] bg-[var(--layer-glass-panel)] text-[var(--text-primary)] shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)]",
        "neo-subtle":
          "border border-[color:var(--glass-border-soft)] bg-[var(--layer-glass-inline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--layer-glass-panel)]",
      },
      size: {
        sm: "h-9 px-3 py-1.5 text-sm", // 36px height for compact controls
        default: "h-10 px-4 py-2 text-sm", // 40px height default
        lg: "h-12 px-6 py-3 text-base", // 48px height for prominent CTAs
        icon: "h-10 w-10", // 40px square to match default height
      },
      dramatic: {
        false: "",
        true: "will-change-transform hover:-translate-y-[3px] hover:shadow-[var(--shadow-glass-floating)] active:translate-y-0",
      },
    },
    compoundVariants: [
      {
        variant: "brand-soft",
        class: "hover:shadow-[var(--shadow-glow-brand-subtle)]",
      },
      {
        variant: "ghost",
        dramatic: true,
        class: "hover:-translate-y-[2px] hover:shadow-[var(--shadow-glass-subtle)]",
      },
    ],
    defaultVariants: {
      variant: "glass-primary",
      size: "default",
      dramatic: false,
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<ButtonVariantProps, "dramatic"> {
  asChild?: boolean;
  dramatic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, dramatic, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const resolvedDramatic: ButtonVariantProps["dramatic"] = Boolean(dramatic);
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, dramatic: resolvedDramatic }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
