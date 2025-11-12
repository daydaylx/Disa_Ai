import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] font-semibold transition-all duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-[var(--backdrop-blur-medium)]",
  {
    variants: {
      variant: {
        // Primary Glassmorphism variants
        "glass-primary":
          "border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--color-text-primary)] shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)] hover:border-[var(--border-glass-strong)]",
        "glass-subtle":
          "border border-[var(--border-glass)] bg-[var(--surface-glass-panel)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface-glass-card)]",
        destructive:
          "border border-transparent bg-[var(--danger)] text-[var(--accent-contrast)] shadow-[var(--shadow-glass-medium)] hover:bg-[color-mix(in_srgb,var(--danger)_90%,black)] hover:shadow-[var(--shadow-glass-strong)]",
        accent:
          "border border-transparent bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[var(--shadow-glow-brand-subtle)] hover:bg-[var(--accent-strong)] hover:shadow-[var(--shadow-glow-brand)]",
        brand:
          "border border-[var(--border-glass-accent)] bg-[var(--acc2)] text-white shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)] hover:bg-[var(--accent-strong)]",
        "brand-soft":
          "border border-[var(--acc2)]/30 bg-[var(--acc2)]/10 text-[var(--acc2)] backdrop-blur-[var(--backdrop-blur-subtle)] hover:bg-[var(--acc2)]/20 hover:shadow-[var(--shadow-glow-brand-subtle)]",
        ghost:
          "border border-transparent bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--surface-glass-panel)] backdrop-blur-[var(--backdrop-blur-subtle)]",
        outline:
          "border border-[var(--border-glass)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--surface-glass-panel)] backdrop-blur-[var(--backdrop-blur-subtle)]",

        // Legacy aliases (using new glassmorphism styles)
        "neo-medium":
          "border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--color-text-primary)] shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)]",
        "neo-subtle":
          "border border-[var(--border-glass)] bg-[var(--surface-glass-panel)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface-glass-card)]",
        secondary:
          "border border-[var(--border-glass)] bg-[var(--surface-glass-panel)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface-glass-card)]",
        default:
          "border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--color-text-primary)] shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)]",
        neumorphic:
          "border border-[var(--border-glass)] bg-[var(--surface-glass-card)] text-[var(--color-text-primary)] shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)]",
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
