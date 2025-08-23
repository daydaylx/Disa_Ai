import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "default", size = "md", ...rest }: Props) {
  const base = "btn-base";
  const v =
    variant === "default" ? "btn-default" :
    variant === "outline" ? "btn-outline" :
    "btn-base text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10";
  const s = size === "sm" ? "h-9 px-2" : "h-10 px-3";
  return <button className={cn(base, v, s, className)} {...rest} />;
}
export default Button;
