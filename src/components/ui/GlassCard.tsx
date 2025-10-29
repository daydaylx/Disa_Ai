import { forwardRef } from "react";

import { cn } from "../../lib/utils";
import { Card, type CardProps } from "./card";

const baseClass =
  "card-glass-performance rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-card)]/85 backdrop-blur-sm shadow-[var(--shadow-surface)] transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-surface-base)] hover:shadow-[var(--shadow-surface-hover)]";

export type GlassCardProps = CardProps;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return <Card ref={ref} className={cn(baseClass, className)} {...props} />;
  },
);

GlassCard.displayName = "GlassCard";
