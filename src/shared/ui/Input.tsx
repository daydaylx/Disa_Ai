import React from "react";
import { cn } from "@/shared/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;
export function Input({ className, ...rest }: Props) {
  return (
    <input
      className={cn(
        "w-full h-11 px-3 rounded-xl bg-card text-[15px]",
        "text-[color:var(--fg)] placeholder-[color:var(--muted-fg)] caret-[color:var(--fg)]",
        "border border-black/10 dark:border-white/15 focus-visible:outline-none focus-visible:ring-2",
        className,
      )}
      {...rest}
    />
  );
}
export default Input;
