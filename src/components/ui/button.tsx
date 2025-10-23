import React from "react";

import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "ghost"
    | "outline"
    | "brand"
    | "destructive"
    | "primary"
    | "secondary"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const buttonVariants = (
  variant: ButtonProps["variant"] = "default",
  size: ButtonProps["size"] = "default",
) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default:
      "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-brand-primary-hover)]",
    primary:
      "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-brand-primary-hover)]",
    brand:
      "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-brand-primary-hover)]",
    secondary:
      "bg-[var(--color-action-secondary-bg)] text-[var(--color-action-secondary-fg)] border border-[var(--color-action-secondary-border)] hover:bg-[var(--color-action-secondary-hover)]",
    destructive:
      "bg-[var(--color-action-destructive-bg)] text-[var(--color-action-destructive-fg)] hover:bg-[var(--color-action-destructive-hover)]",
    ghost: "hover:bg-[var(--color-action-ghost-hover)] hover:text-[var(--color-action-ghost-fg)]",
    outline:
      "border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]",
    link: "text-[var(--color-text-link)] underline-offset-4 hover:underline hover:text-[var(--color-text-link-hover)]",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(
        props.children as React.ReactElement,
        {
          className: cn(buttonVariants(variant, size), className),
          ref,
          ...props,
        } as React.Attributes,
      );
    }

    return <button className={cn(buttonVariants(variant, size), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
