import { forwardRef } from "react";

import { cn } from "../../lib/utils";
import { Card, type CardProps } from "./card";

const baseClass =
  "card-glass-performance rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-card)]/85 backdrop-blur-sm shadow-[var(--shadow-surface)]";

export type GlassCardProps = CardProps;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return <Card ref={ref} className={cn(baseClass, className)} {...props} />;
  },
);

GlassCard.displayName = "GlassCard";
