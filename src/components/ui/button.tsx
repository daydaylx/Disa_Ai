import React from "react";

import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "neo-subtle"
    | "neo-medium"
    | "neo-dramatic"
    | "neo-extreme"
    | "brand"
    | "accent"
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
    "inline-flex items-center justify-center gap-2",
    "font-medium tracking-[-0.01em]",
    "transition-[background,box-shadow,transform] duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "disabled:shadow-neo-sm disabled:translate-y-0",
  ].join(" ");

  // Map deprecated variants to their new equivalents
  const coreVariantClasses = {
    "neo-subtle": [
      "bg-[var(--color-surface-muted)]",
      "shadow-neo-sm",
      "border border-[var(--acc2)]",
      "text-[var(--color-text-primary)]",
      dramatic ? "hover:-translate-y-[2px]" : "hover:translate-y-[-1px]",
      "hover:shadow-neo-md",
      "hover:bg-[var(--surface-neumorphic-floating)]",
      "active:translate-y-[1px]",
      "active:shadow-[var(--shadow-inset-subtle)]",
      "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
    ].join(" "),
    "neo-medium": [
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-neo-md",
      "border border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      dramatic ? "hover:-translate-y-[3px]" : "hover:-translate-y-[2px]",
      "hover:shadow-neo-lg",
      "hover:bg-[var(--surface-neumorphic-floating)]",
      "active:translate-y-[1px]",
      "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
    ].join(" "),
    "neo-dramatic": [
      "relative",
      "bg-gradient-to-br from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
      "border border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-xl)]",
      "shadow-neo-lg",
      dramatic ? "hover:-translate-y-[4px]" : "hover:-translate-y-[3px]",
      "hover:shadow-neo-xl",
      "hover:bg-gradient-to-br hover:from-white hover:to-[var(--surface-neumorphic-floating)]",
      "active:translate-y-[2px]",
      "active:shadow-[var(--shadow-inset-strong)]",
      "focus-visible:outline-none focus-visible:shadow-focus-neo focus-visible:border-[var(--color-border-focus)]",
    ].join(" "),
    "neo-extreme": [
      "relative",
      "bg-gradient-to-br from-white via-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
      "border border-[var(--border-neumorphic-light)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-xl)]",
      "before:pointer-events-none before:absolute before:inset-0 before:rounded-[var(--radius-xl)] before:bg-gradient-to-br before:from-white/18 before:to-transparent",
      "shadow-[var(--shadow-neumorphic-dramatic)]",
      dramatic ? "hover:-translate-y-[6px] hover:scale-[1.03]" : "hover:-translate-y-[4px]",
      "hover:shadow-[var(--shadow-neumorphic-extreme)]",
      "hover:bg-gradient-to-br hover:from-white hover:via-[var(--surface-neumorphic-floating)] hover:to-[var(--acc1)]/15",
      "active:translate-y-[2px]",
      "active:shadow-[var(--shadow-inset-extreme)]",
      "focus-visible:outline-none focus-visible:shadow-focus-neo focus-visible:border-[var(--color-border-focus)]",
    ].join(" "),
    brand: [
      "bg-[var(--acc2)]",
      "border border-[color:rgba(var(--acc2-rgb, 244, 93, 105),0.45)]",
      "text-[var(--color-text-on-accent)] font-semibold",
      "rounded-[var(--radius-lg)]",
      "shadow-neo-md",
      dramatic ? "hover:-translate-y-[3px]" : "hover:-translate-y-[2px]",
      "hover:shadow-[var(--shadow-glow-accent-subtle)]",
      "hover:bg-[var(--acc2-strong)]",
      "focus-visible:outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:shadow-[var(--shadow-glow-accent-subtle)]",
      "active:translate-y-[1px]",
      "active:bg-[var(--acc2-strong)]",
      "active:shadow-[var(--shadow-inset-medium)]",
    ].join(" "),
    accent: [
      "bg-[var(--color-accent-surface)]",
      "border border-[var(--color-accent-border)]",
      "text-[var(--color-text-on-accent)] font-semibold",
      "rounded-[var(--radius-lg)]",
      "shadow-neo-md",
      dramatic ? "hover:-translate-y-[3px]" : "hover:-translate-y-[2px]",
      "hover:shadow-[var(--shadow-glow-accent)]",
      "hover:bg-[var(--color-accent-surface-strong)]",
      "focus-visible:outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:shadow-[var(--shadow-glow-accent)]",
      "active:translate-y-[1px]",
      "active:shadow-[var(--shadow-inset-medium)]",
    ].join(" "),
    "brand-soft": [
      "bg-[var(--surface-neumorphic-raised)]",
      "border border-[var(--acc1)]/45",
      "text-[var(--acc1)] font-semibold",
      "rounded-[var(--radius-lg)]",
      "shadow-neo-md",
      "hover:shadow-neo-lg",
      "hover:bg-gradient-to-br hover:from-[var(--acc1)]/12 hover:to-[var(--acc2)]/12",
      "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
      "active:translate-y-[1px]",
      "active:shadow-[var(--shadow-inset-subtle)]",
    ].join(" "),
    destructive: [
      "bg-gradient-to-br from-[var(--err)] to-[var(--err-hover)]",
      "border border-[var(--border-neumorphic-light)]",
      "text-white font-semibold",
      "rounded-[var(--radius-lg)]",
      "shadow-neo-md",
      "hover:shadow-neo-lg",
      dramatic ? "hover:-translate-y-[3px]" : "hover:-translate-y-[2px]",
      "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
      "active:translate-y-[1px]",
      "active:shadow-[var(--shadow-inset-medium)]",
    ].join(" "),
    ghost: [
      "bg-transparent",
      "border border-transparent",
      "text-[var(--color-text-secondary)]",
      "rounded-[var(--radius-lg)]",
      "shadow-none",
      "hover:bg-[var(--surface-neumorphic-raised)]",
      "hover:shadow-neo-sm",
      "hover:text-[var(--color-text-primary)]",
      dramatic ? "hover:-translate-y-[1px]" : "",
      "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
    ].join(" "),
    outline: [
      "bg-transparent",
      "border-2 border-[var(--border-neumorphic-subtle)]",
      "text-[var(--color-text-primary)]",
      "rounded-[var(--radius-lg)]",
      "shadow-[var(--shadow-inset-subtle)]",
      "hover:border-[var(--border-neumorphic-light)]",
      "hover:bg-[var(--surface-neumorphic-raised)]",
      "hover:shadow-neo-sm",
      dramatic ? "hover:-translate-y-[1px]" : "",
      "active:shadow-[var(--shadow-inset-medium)]",
      "active:bg-[var(--surface-neumorphic-pressed)]",
      "focus-visible:outline-none focus-visible:shadow-focus-neo",
    ].join(" "),
    link: [
      "bg-transparent",
      "border border-transparent",
      "text-[var(--acc1)]",
      "rounded-[var(--radius-md)]",
      "shadow-none",
      "hover:underline",
      "hover:text-[var(--acc2)]",
      "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
    ].join(" "),
  } as const satisfies Record<
    Exclude<NonNullable<ButtonProps["variant"]>, "default" | "secondary" | "neumorphic">,
    string
  >;

  const deprecatedVariantClasses = {
    default: coreVariantClasses["neo-medium"],
    secondary: coreVariantClasses["neo-subtle"], // Actually map secondary to neo-subtle to maintain similar appearance
    neumorphic: coreVariantClasses["neo-medium"],
  } as const;

  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
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
