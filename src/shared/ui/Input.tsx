import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;
export function Input({ className, ...rest }: Props) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl bg-card px-3 text-[15px]",
        "text-[color:var(--fg)] placeholder-[color:var(--muted-fg)] caret-[color:var(--fg)]",
        "border border-black/10 focus-visible:outline-none focus-visible:ring-2 dark:border-white/15",
        className,
      )}
      {...rest}
    />
  );
}
export default Input;
