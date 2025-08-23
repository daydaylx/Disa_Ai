import React from "react";
import { cn } from "../lib/cn";

export function Select({
  value,
  onChange,
  children,
  className,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "w-full h-12 rounded-2xl bg-[#12121A]/80 text-foreground border border-border px-4 focus:outline-none focus:shadow-ring",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
}
