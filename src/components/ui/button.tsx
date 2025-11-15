import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] font-semibold transition-all duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-[var(--glass-backdrop-blur-sm)] motion-reduce:transition-none motion-reduce:transform-none",
  {
    variants: {
      variant: {
        "glass-primary":
          "border border-[color:var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] shadow-[var(--shadow-glass-subtle)] hover:bg-[var(--button-secondary-bg-hover)] hover:shadow-[var(--shadow-glass-medium)]",
        "glass-subtle":
          "border border-[color:var(--glass-border-soft)] bg-[var(--layer-glass-inline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--layer-glass-panel)]",
        "glass-accent":
          "border border-[color:var(--accent)] bg-[color-mix(in_srgb,var(--accent)_85%,black_15%)] text-[var(--accent-contrast)] shadow-[0_4px_12px_rgba(139,92,246,0.25)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.35)] hover:bg-[color-mix(in_srgb,var(--accent)_90%,white_10%)]",
        "glass-secondary":
          "border border-[color:var(--glass-border-strong)] bg-[var(--layer-glass-panel)] text-[var(--text-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
        "glass-ghost":
          "border border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--surface-base)_90%,var(--accent)_10%)]",
        "modern-primary":
          "border border-[var(--color-primary-500)] bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-light)] hover:bg-[var(--color-primary-600)] hover:shadow-[var(--shadow-heavy)] hover:-translate-y-0.5",
        "modern-secondary":
          "border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] shadow-[var(--shadow-light)] hover:bg-[var(--color-neutral-50)] hover:border-[var(--color-neutral-400)] hover:shadow-[var(--shadow-heavy)]",
        "modern-outline":
          "border-2 border-[var(--color-primary-500)] bg-transparent text-[var(--color-primary-600)] hover:bg-[var(--color-primary-500)] hover:text-white",
        "modern-ghost":
          "border border-transparent bg-transparent text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]",
        "modern-success":
          "border border-[var(--color-success-500)] bg-[var(--color-success-500)] text-white shadow-[var(--shadow-light)] hover:bg-[var(--color-success-600)] hover:shadow-[var(--shadow-heavy)]",
        "modern-warning":
          "border border-[var(--color-warning-500)] bg-[var(--color-warning-500)] text-white shadow-[var(--shadow-light)] hover:bg-[var(--color-warning-600)] hover:shadow-[var(--shadow-heavy)]",
        "modern-destructive":
          "border border-[var(--color-error-500)] bg-[var(--color-error-500)] text-white shadow-[var(--shadow-light)] hover:bg-[var(--color-error-600)] hover:shadow-[var(--shadow-heavy)]",
        neumorphic:
          "border border-[color:var(--glass-border-soft)] bg-[var(--layer-glass-panel)] text-[var(--text-primary)] shadow-[var(--shadow-glass-subtle)] hover:shadow-[var(--shadow-glass-medium)]",
        "neo-medium":
          "border border-[color:var(--glass-border-strong)] bg-[var(--layer-glass-panel)] text-[var(--text-primary)] shadow-[var(--shadow-glass-medium)] hover:shadow-[var(--shadow-glass-strong)]",
        "neo-subtle":
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
      },
      size: {
        xs: "h-11 px-3 py-1.5 text-xs font-medium", // 44px height - touch-safe minimum (was 32px)
        sm: "h-11 px-4 py-2 text-sm font-medium", // 44px height - touch-safe (was 36px)
        default: "h-11 px-6 py-2.5 text-sm font-medium", // 44px height - touch-safe (was 40px)
        md: "h-11 px-7 py-2.5 text-sm font-medium", // 44px height - medium
        lg: "h-12 px-8 py-3 text-base font-semibold", // 48px height - large
        xl: "h-14 px-10 py-3.5 text-base font-semibold", // 56px height - extra large
        "2xl": "h-16 px-12 py-4 text-lg font-semibold", // 64px height - massive
        icon: "h-11 w-11", // 44px square - touch-safe (was 40px)
        "icon-xs": "h-11 w-11", // 44px square - touch-safe (was 32px)
        "icon-sm": "h-11 w-11", // 44px square - touch-safe (was 36px)
        "icon-md": "h-11 w-11", // 44px square for medium icons
        "icon-lg": "h-12 w-12", // 48px square for large icons
        "icon-xl": "h-14 w-14", // 56px square for extra large icons
        "icon-2xl": "h-16 w-16", // 64px square for massive icons
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
      // Neue Compound-Varianten
      {
        variant: "glass-accent",
        size: "xl",
        class: "rounded-[var(--radius-lg)] font-bold",
      },
      {
        variant: "glass-secondary",
        size: "lg",
        class: "rounded-[var(--radius-md)]",
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
  ({ className, variant, size, dramatic, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const resolvedDramatic: ButtonVariantProps["dramatic"] = Boolean(dramatic);
    const baseClasses = cn(
      buttonVariants({ variant, size, dramatic: resolvedDramatic }),
      className,
    );

    if (asChild) {
      return <Comp className={baseClasses} ref={ref} {...props} />;
    }

    return <Comp className={baseClasses} ref={ref} type={type ?? "button"} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
