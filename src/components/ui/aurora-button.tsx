import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--ring-outline)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

const variants: Record<Variant, string> = {
  solid: "bg-[color:var(--accent)] text-black hover:opacity-90",
  ghost:
    "bg-transparent text-[color:var(--text-primary)] hover:bg-[color-mix(in_hsl,var(--surface-card)_40%,transparent)]",
  subtle: "bg-[color:var(--surface-card)] text-[color:var(--text-primary)] hover:opacity-95",
  danger: "bg-[hsl(350_84%_56%_/_1)] text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-5 text-lg",
};

export type AuroraButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function AuroraButton({
  className,
  variant = "solid",
  size = "md",
  ...props
}: AuroraButtonProps) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
