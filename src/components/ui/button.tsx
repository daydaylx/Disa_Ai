import React from "react";

import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "neo-subtle"
    | "neo-medium"
    | "neo-dramatic"
    | "neo-extreme"
    | "brand"
    | "brand-soft"
    | "destructive"
    | "ghost"
    | "outline"
    | "link"
    /** @deprecated Use neo-medium instead */
    | "default"
    /** @deprecated Use neo-medium instead */
    | "secondary"
    /** @deprecated Use neo-medium instead */
    | "neumorphic";
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "icon";
  asChild?: boolean;
  /** Enable dramatic hover lift effect */
  dramatic?: boolean;
}

const buttonVariants = (
  variant: ButtonProps["variant"] = "neo-medium",
  size: ButtonProps["size"] = "default",
  dramatic: boolean = false,
) => {
  const baseClasses = [
    // Core Layout
    "inline-flex items-center justify-center gap-2",
    "font-medium tracking-[-0.01em]",

    // Enhanced Transitions for Dramatic Effects
    "transition-all duration-300 ease-out",

    // Disabled State
    "disabled:pointer-events-none disabled:opacity-50",
    "disabled:shadow-[var(--shadow-neumorphic-sm)]",
    "disabled:transform-none",
  ].join(" ");

  const coreVariantClasses = {
    // === NEOMORPHIC VARIANTS (Primary System) ===
    "neo-subtle": [
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-sm)]",
      "border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-lg)]",

      // Hover State
      "hover:shadow-[var(--shadow-neumorphic-md)]",
      "hover:bg-[var(--surface-neumorphic-floating)]",
      dramatic ? "hover:transform hover:translateY(-2px)" : "",

      // Active State
      "active:shadow-[var(--shadow-inset-subtle)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",
      "active:transform active:translateY(1px)",

      // Focus State
      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
      "focus-visible:border-[var(--acc1)]",
    ]
      .filter(Boolean)
      .join(" "),

    "neo-medium": [
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-lg)]",

      // Hover State
      "hover:shadow-[var(--shadow-neumorphic-lg)]",
      "hover:bg-[var(--surface-neumorphic-floating)]",
      dramatic ? "hover:transform hover:translateY(-3px)" : "",

      // Active State
      "active:shadow-[var(--shadow-inset-medium)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",
      "active:transform active:translateY(1.5px)",

      // Focus State
      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
      "focus-visible:border-[var(--acc1)]",
    ]
      .filter(Boolean)
      .join(" "),

    "neo-dramatic": [
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-xl)]",

      // Gradient Overlay for Enhanced Depth
      "bg-gradient-to-br from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",

      // Hover State
      "hover:shadow-[var(--shadow-neumorphic-xl)]",
      "hover:bg-gradient-to-br hover:from-white hover:to-[var(--surface-neumorphic-floating)]",
      dramatic ? "hover:transform hover:translateY(-4px)" : "",

      // Active State
      "active:shadow-[var(--shadow-inset-strong)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",
      "active:transform active:translateY(2px)",

      // Focus State
      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
      "focus-visible:border-[var(--acc1)]",
    ]
      .filter(Boolean)
      .join(" "),

    "neo-extreme": [
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-dramatic)]",
      "border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-xl)]",

      // Extreme Gradient and Effects
      "bg-gradient-to-br from-white via-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
      "before:absolute before:inset-0 before:rounded-[var(--radius-xl)] before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
      "relative",

      // Hover State
      "hover:shadow-[var(--shadow-neumorphic-extreme)]",
      "hover:bg-gradient-to-br hover:from-white hover:via-[var(--surface-neumorphic-floating)] hover:to-[var(--acc1)]",
      dramatic ? "hover:transform hover:translateY(-6px) hover:scale-105" : "",

      // Active State
      "active:shadow-[var(--shadow-inset-extreme)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",
      "active:transform active:translateY(3px) active:scale-95",

      // Focus State
      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
      "focus-visible:border-[var(--acc1)]",
    ]
      .filter(Boolean)
      .join(" "),

    // === LEGACY VARIANTS (Converted to Neomorphic) ===
    brand: [
      "bg-gradient-to-br from-[var(--acc1)] to-[var(--acc2)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-[var(--border-neumorphic-light)]",
      "text-white font-semibold",
      "rounded-[var(--radius-lg)]",

      "hover:shadow-[var(--shadow-neumorphic-xl)]",
      "hover:bg-gradient-to-br hover:from-[var(--acc1)] hover:via-[var(--acc2)] hover:to-[var(--acc1)]",
      dramatic ? "hover:transform hover:translateY(-3px)" : "",

      "active:shadow-[var(--shadow-inset-medium)]",
      "active:transform active:translateY(1px)",

      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
    ]
      .filter(Boolean)
      .join(" "),

    "brand-soft": [
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border-2 border-[var(--acc1)]",
      "text-[var(--acc1)] font-semibold",
      "rounded-[var(--radius-lg)]",

      "hover:shadow-[var(--shadow-neumorphic-lg)]",
      "hover:bg-gradient-to-br hover:from-[var(--acc1)]/10 hover:to-[var(--acc2)]/10",
      dramatic ? "hover:transform hover:translateY(-2px)" : "",

      "active:shadow-[var(--shadow-inset-subtle)]",
      "active:transform active:translateY(1px)",

      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
    ]
      .filter(Boolean)
      .join(" "),

    destructive: [
      "bg-gradient-to-br from-[var(--err)] to-[var(--err-hover)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-[var(--border-neumorphic-light)]",
      "text-white font-semibold",
      "rounded-[var(--radius-lg)]",

      "hover:shadow-[var(--shadow-neumorphic-xl)]",
      "hover:bg-gradient-to-br hover:from-[var(--err-hover)] hover:to-[var(--err)]",
      dramatic ? "hover:transform hover:translateY(-3px)" : "",

      "active:shadow-[var(--shadow-inset-medium)]",
      "active:transform active:translateY(1px)",

      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
    ]
      .filter(Boolean)
      .join(" "),

    ghost: [
      "bg-transparent",
      "shadow-none",
      "border-transparent",
      "text-[var(--color-text-secondary)]",
      "rounded-[var(--radius-lg)]",

      "hover:bg-[var(--surface-neumorphic-raised)]",
      "hover:shadow-[var(--shadow-neumorphic-sm)]",
      "hover:text-[var(--color-text-primary)]",
      dramatic ? "hover:transform hover:translateY(-1px)" : "",

      "active:shadow-[var(--shadow-inset-subtle)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",

      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
      "focus-visible:bg-[var(--surface-neumorphic-raised)]",
    ]
      .filter(Boolean)
      .join(" "),

    outline: [
      "bg-transparent",
      "shadow-[var(--shadow-inset-subtle)]",
      "border-2 border-[var(--border-neumorphic-subtle)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-lg)]",

      "hover:bg-[var(--surface-neumorphic-raised)]",
      "hover:shadow-[var(--shadow-neumorphic-sm)]",
      "hover:border-[var(--border-neumorphic-light)]",
      dramatic ? "hover:transform hover:translateY(-2px)" : "",

      "active:shadow-[var(--shadow-inset-medium)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",

      "focus-visible:outline-none",
      "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
    ]
      .filter(Boolean)
      .join(" "),

    link: [
      "bg-transparent shadow-none border-transparent",
      "text-[var(--acc1)] underline-offset-4",
      "rounded-[var(--radius-md)]",

      "hover:underline hover:text-[var(--acc2)]",
      "hover:bg-[var(--surface-neumorphic-base)]",
      "hover:shadow-[var(--shadow-inset-subtle)]",

      "focus-visible:outline-none",
      "focus-visible:bg-[var(--surface-neumorphic-raised)]",
      "focus-visible:shadow-[var(--shadow-neumorphic-sm)]",
    ].join(" "),
  } as const satisfies Record<
    Exclude<ButtonProps["variant"], "default" | "secondary" | "neumorphic">,
    string
  >;

  const deprecatedVariantClasses = {
    default: coreVariantClasses["neo-medium"],
    secondary: coreVariantClasses["neo-subtle"],
    neumorphic: coreVariantClasses["neo-medium"],
  } as const;

  const variantClasses: Record<ButtonProps["variant"], string> = {
    ...coreVariantClasses,
    ...deprecatedVariantClasses,
  };

  const sizeClasses = {
    xs: "h-7 px-2 py-1 text-xs rounded-[var(--radius-md)]",
    sm: "h-8 px-3 py-1.5 text-xs rounded-[var(--radius-md)]",
    default: "h-10 px-4 py-2 text-sm rounded-[var(--radius-lg)]",
    lg: "h-12 px-6 py-3 text-base rounded-[var(--radius-lg)]",
    xl: "h-14 px-8 py-4 text-lg rounded-[var(--radius-xl)]",
    icon: "h-10 w-10 rounded-[var(--radius-lg)]",
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, dramatic = false, asChild = false, ...props }, ref) => {
    const buttonClasses = buttonVariants(variant, size, dramatic);

    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(
        props.children as React.ReactElement,
        {
          className: cn(buttonClasses, className),
          ref,
          ...props,
        } as React.Attributes,
      );
    }

    return <button className={cn(buttonClasses, className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
