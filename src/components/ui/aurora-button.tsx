import React from "react";

import { Button, type ButtonProps } from "./button";

// Aurora Button is now a wrapper around the unified Button component
// Provides legacy compatibility while using the new glassmorphism design system

type AuroraVariant = "solid" | "ghost" | "subtle" | "danger" | "destructive" | "accent";
type AuroraSize = "sm" | "md" | "lg" | "icon";

// Map Aurora variants to new Button variants
const variantMap: Record<AuroraVariant, ButtonProps["variant"]> = {
  solid: "glass-primary",
  ghost: "ghost",
  subtle: "glass-subtle",
  danger: "destructive",
  destructive: "destructive",
  accent: "accent",
};

// Map Aurora sizes to new Button sizes
const sizeMap: Record<AuroraSize, ButtonProps["size"]> = {
  sm: "sm",
  md: "default", // Aurora 'md' maps to Button 'default'
  lg: "lg",
  icon: "icon",
};

export type AuroraButtonProps = Omit<ButtonProps, "variant" | "size"> & {
  variant?: AuroraVariant;
  size?: AuroraSize;
};

export function AuroraButton({ variant = "solid", size = "md", ...props }: AuroraButtonProps) {
  return <Button variant={variantMap[variant]} size={sizeMap[size]} {...props} />;
}
