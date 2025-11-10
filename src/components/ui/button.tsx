import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        "neo-medium":
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-[var(--color-text-primary)] shadow-neo-sm hover:shadow-neo-md",
        "neo-subtle":
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-none hover:shadow-neo-sm",
        destructive:
          "border border-transparent bg-[var(--danger)] text-[var(--accent-contrast)] shadow-neo-md hover:bg-[color-mix(in_srgb,var(--danger)_90%,black)]",
        accent:
          "border border-transparent bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[var(--shadow-glow-accent-subtle)] hover:bg-[var(--accent-strong, var(--accent))]/90",
        brand:
          "border border-transparent bg-[var(--acc2)] text-white shadow-neo-md hover:shadow-neo-lg",
        "brand-soft":
          "border border-[var(--acc2)]/30 bg-[var(--acc2)]/10 text-[var(--acc2)] shadow-none hover:bg-[var(--acc2)]/20",
        ghost:
          "border border-transparent bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--surface-neumorphic-base)]/60",
        outline:
          "border border-[var(--border-neumorphic-subtle)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--surface-neumorphic-base)]/60",
        secondary:
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        default:
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-[var(--color-text-primary)] shadow-neo-sm hover:shadow-neo-md",
        neumorphic:
          "border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-raised)] text-[var(--color-text-primary)] shadow-neo-sm hover:shadow-neo-md",
      },
      size: {
        sm: "h-9 px-3 py-1.5 text-sm", // 36px height for compact controls
        default: "h-10 px-4 py-2 text-sm", // 40px height default
        lg: "h-12 px-6 py-3 text-base", // 48px height for prominent CTAs
        icon: "h-10 w-10", // 40px square to match default height
      },
      dramatic: {
        false: "",
        true: "will-change-transform hover:-translate-y-[3px] hover:shadow-neo-lg active:translate-y-0",
      },
    },
    compoundVariants: [
      {
        variant: "brand-soft",
        class: "hover:shadow-[var(--shadow-glow-accent-subtle)]",
      },
      {
        variant: "ghost",
        dramatic: true,
        class: "hover:-translate-y-[2px]",
      },
    ],
    defaultVariants: {
      variant: "neo-medium",
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
