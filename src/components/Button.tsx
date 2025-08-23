import React from "react";

import { cn } from "../lib/cn";
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";
const base = "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold focus-ring transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
const map: Record<Variant,string> = {
  primary: "bg-gradient-to-r from-primary to-indigo-500 text-white shadow-glow hover:opacity-95",
  secondary: "bg-secondary/60 text-secondary-foreground border border-white/10 hover:bg-secondary",
  ghost: "bg-transparent text-foreground hover:bg-white/5 border border-white/10",
  danger: "bg-danger text-danger-foreground hover:opacity-95 shadow-card",
};
const sizes: Record<Size,string> = { sm:"h-9 px-4 text-sm", md:"h-11 px-5", lg:"h-12 px-6 text-lg" };
export function Button({ children, variant="primary", size="md", className, ...rest }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?:Variant; size?:Size}) {
  return <button className={cn(base, map[variant], sizes[size], className)} {...rest}>{children}</button>;
}
