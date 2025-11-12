import { Card, type CardProps } from "./card";

// Aurora Card is now a wrapper around the unified Card component
// Provides legacy compatibility while using the new glassmorphism design system

type AuroraCardPadding = "none" | "sm" | "md" | "lg";

// Map Aurora padding to new Card padding
const paddingMap: Record<AuroraCardPadding, CardProps["padding"]> = {
  none: "none",
  sm: "sm",
  md: "md",
  lg: "lg",
};

export type AuroraCardProps = Omit<CardProps, "padding"> & {
  padding?: AuroraCardPadding;
};

export function AuroraCard({ padding = "md", ...props }: AuroraCardProps) {
  return <Card tone="glass-primary" elevation="medium" padding={paddingMap[padding]} {...props} />;
}
