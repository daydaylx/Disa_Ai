import { forwardRef } from "react";

import { Card, type CardProps } from "./card";

export type GlassCardProps = CardProps;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ tone = "translucent", elevation = "surface", ...props }, ref) => {
    return <Card ref={ref} tone={tone} elevation={elevation} {...props} />;
  },
);

GlassCard.displayName = "GlassCard";
