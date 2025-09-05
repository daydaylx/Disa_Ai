import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
};
export function Button({ className, variant = "default", size = "md", ...rest }: Props) {
  const v =
    variant === "outline"
      ? "border border-black/10 dark:border-white/15 bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
      : variant === "ghost"
        ? "bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
        : "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black";
  const s = size === "sm" ? "h-8 px-3 text-sm rounded-lg" : "h-10 px-4 rounded-xl";
  return (
    <button
      className={cn("inline-flex items-center justify-center transition-colors", v, s, className)}
      {...rest}
    />
  );
}
export default Button;
