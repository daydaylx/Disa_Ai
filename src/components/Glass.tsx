import React from "react";

import { cn } from "../lib/utils";

type SurfaceVariant = "subtle" | "standard" | "strong";

interface SurfaceProps {
  children: React.ReactNode;
  className?: string;
  variant?: SurfaceVariant;
  asChild?: boolean;
  onClick?: () => void;
}

const baseClasses =
  "relative isolate rounded-[var(--radius-lg)] border transition-[background,box-shadow,border-color] duration-small ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)]";

const variantClasses: Record<SurfaceVariant, string> = {
  subtle: "bg-surface-subtle border-border-hairline shadow-surface",
  standard: "bg-surface-base border-border-subtle shadow-surface",
  strong: "bg-surface-card border-border-strong shadow-raised",
};

export const SoftDepthSurface: React.FC<SurfaceProps> = ({
  children,
  className,
  variant = "standard",
  asChild = false,
  onClick,
}) => {
  const surfaceClass = cn(baseClasses, variantClasses[variant], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(surfaceClass, (children.props as { className?: string }).className),
      onClick: onClick ?? (children.props as { onClick?: () => void }).onClick,
    } as React.Attributes);
  }

  return (
    <div className={surfaceClass} onClick={onClick}>
      {children}
    </div>
  );
};
